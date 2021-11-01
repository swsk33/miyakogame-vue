package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.dao.PlayerDAO;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.CommonValue;
import fun.swsk33site.miyakogame.param.MailServiceType;
import fun.swsk33site.miyakogame.service.AvatarService;
import fun.swsk33site.miyakogame.service.MailService;
import fun.swsk33site.miyakogame.service.PlayerService;
import fun.swsk33site.miyakogame.util.ClassExamine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import java.io.File;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class PlayerServiceImpl implements PlayerService {

	@Autowired
	private PlayerDAO playerDAO;

	/**
	 * Redis中储存用户信息，key为用户名，value为用户对象
	 */
	@Autowired
	private RedisTemplate redisTemplate;

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private AvatarService avatarService;

	@Autowired
	private MailService mailService;

	@Override
	public Result register(Player player) throws MessagingException {
		Result result = new Result();
		// 先看看Redis中有没有用户
		Player getPlayer = (Player) redisTemplate.opsForValue().get(player.getUsername());
		if (getPlayer == null) {
			// 没有则去数据库查找
			try {
				getPlayer = playerDAO.findByUsername(player.getUsername());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer != null) {
				redisTemplate.opsForValue().set(getPlayer.getUsername(), getPlayer);
			}
		}
		// 如果不为空说明已经注册了
		if (getPlayer != null) {
			result.setResultFailed("用户名已存在！");
			return result;
		}
		// 设定基本信息
		// 加密储存密码
		player.setPassword(encoder.encode(player.getPassword()));
		player.setNickname(player.getUsername());
		player.setAvatar(avatarService.getRandomAvatar().getData());
		player.setHighScore(0);
		player.setGameData("null");
		// 加入到数据库和Redis
		// 先是存到数据库，在Mapper XML中已经配置了主键回填，因为需要先插入到数据库得到自增主键的值（id），在这里存入数据库之后就会回填到player对象中，再写入Redis，保证数据一致和正确
		playerDAO.add(player);
		redisTemplate.opsForValue().set(player.getUsername(), player);
		// 加入Redis排名表
		redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, player.getUsername(), player.getHighScore());
		// 如果这个新注册的名字在无效用户名集合中则去掉
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_USER_TABLE_NAME, player.getUsername())) {
			redisTemplate.opsForSet().remove(CommonValue.REDIS_INVALID_USER_TABLE_NAME, player.getUsername());
		}
		// 如果这个新注册的账户邮箱在无效邮箱集合中则去掉
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, player.getEmail())) {
			redisTemplate.opsForSet().remove(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, player.getEmail());
		}
		mailService.sendHtmlNotifyMail(player.getEmail(), "宫子恰布丁-账户注册", "感谢您注册宫子恰布丁小游戏！");
		result.setResultSuccess("注册用户成功！");
		return result;
	}

	@Override
	public Result delete(Integer id, Integer code) throws MessagingException {
		Result result = new Result();
		if (id == null || code == null) {
			result.setResultFailed("验证码不能为空！");
			return result;
		}
		Player getPlayer = null;
		try {
			getPlayer = playerDAO.findById(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (getPlayer == null) {
			result.setResultFailed("待注销用户不存在！");
			return result;
		}
		// 校验验证码
		int getCode = (Integer) redisTemplate.opsForValue().get(MailServiceType.USER_DELETE + "_" + id);
		if (getCode != code) {
			result.setResultFailed("验证码错误！");
			return result;
		}
		// 删除验证码缓存
		redisTemplate.delete(MailServiceType.USER_DELETE + "_" + id);
		// 从数据库移除
		playerDAO.delete(id);
		// 从Redis排名表、缓存用户信息移除
		redisTemplate.delete(getPlayer.getUsername());
		redisTemplate.opsForZSet().remove(CommonValue.REDIS_RANK_TABLE_NAME, getPlayer.getUsername());
		result.setResultSuccess("用户注销成功！");
		mailService.sendHtmlNotifyMail(getPlayer.getEmail(), "宫子恰布丁-用户注销", "您的用户：" + getPlayer.getUsername() + "已经成功注销！");
		return result;
	}

	@Override
	public Result update(Player player) throws Exception {
		Result result = new Result();
		// 先去Redis中获取用户信息
		Player getPlayer = (Player) redisTemplate.opsForValue().get(player.getUsername());
		if (getPlayer == null) {
			// Redis中找不到，就去数据库找
			try {
				getPlayer = playerDAO.findById(player.getId());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				result.setResultFailed("找不到该用户！");
				return result;
			}
			// 在Redis中补上
			redisTemplate.opsForValue().set(getPlayer.getUsername(), getPlayer);
			redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, getPlayer.getUsername(), getPlayer.getHighScore());
		}
		// 互补信息
		ClassExamine.objectOverlap(player, getPlayer);
		// 如果用户更换了头像且上个头像非默认头像，则删除原头像
		if (!player.getAvatar().equals(getPlayer.getAvatar()) && !getPlayer.getAvatar().contains("default")) {
			String originAvatarName = getPlayer.getAvatar().substring(getPlayer.getAvatar().lastIndexOf("/") + 1);
			new File(CommonValue.AVATAR_USER_PATH + File.separator + originAvatarName).delete();
		}
		// 如果用户修改了密码，则加密储存
		if (!player.getPassword().equals(getPlayer.getPassword())) {
			player.setPassword(encoder.encode(player.getPassword()));
		}
		// 写入数据库、Redis
		playerDAO.update(player);
		redisTemplate.opsForValue().set(player.getUsername(), player);
		// 更新Redis排名表
		// add方法，如果key和value存在则会执行修改操作
		redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, player.getUsername(), player.getHighScore());
		result.setResultSuccess("更新用户信息成功！");
		return result;
	}

	@Override
	public Result resetPassword(Player player, Integer code) throws MessagingException {
		Result result = new Result();
		if (code == null) {
			result.setResultFailed("验证码不能为空！");
			return result;
		}
		Player getPlayer = (Player) redisTemplate.opsForValue().get(player.getUsername());
		if (getPlayer == null) {
			try {
				getPlayer = playerDAO.findById(player.getId());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				result.setResultFailed("找不到相应用户！");
				return result;
			}
			redisTemplate.opsForValue().set(getPlayer.getUsername(), getPlayer);
			redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, getPlayer.getUsername(), getPlayer.getHighScore());
		}
		// 校验验证码
		int getCode = (Integer) redisTemplate.opsForValue().get(MailServiceType.PASSWORD_RESET + "_" + player.getId());
		if (getCode != code) {
			result.setResultFailed("验证码错误！");
			return result;
		}
		// 删除验证码缓存
		redisTemplate.delete(MailServiceType.PASSWORD_RESET + "_" + player.getId());
		// 仅仅修改密码，将传入密码加密并覆盖到原用户信息上进行储存
		getPlayer.setPassword(encoder.encode(player.getPassword()));
		// 写入数据库和Redis
		playerDAO.update(getPlayer);
		redisTemplate.opsForValue().set(getPlayer.getUsername(), getPlayer);
		mailService.sendHtmlNotifyMail(getPlayer.getEmail(), "宫子恰布丁-密码已重置", "您的用户：" + getPlayer.getUsername() + "的密码已经完成重置！请牢记您的新密码！");
		result.setResultSuccess("重置密码成功！");
		return result;
	}

	@Override
	public Result<Player> findByUsername(String username) {
		Result<Player> result = new Result<>();
		// 先去Redis里面查找
		Player getPlayer = (Player) redisTemplate.opsForValue().get(username);
		if (getPlayer == null) {
			// 否则，再去数据库查找
			try {
				getPlayer = playerDAO.findByUsername(username);
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				result.setResultFailed("找不到指定用户！");
				return result;
			}
			// 加入到Redis和排名表
			redisTemplate.opsForValue().set(username, getPlayer);
			redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, getPlayer.getUsername(), getPlayer.getHighScore());
		}
		result.setResultSuccess("查找用户成功！", getPlayer);
		return result;
	}

	@Override
	public Result<List<Player>> findByEmail(String email) {
		Result<List<Player>> result = new Result<>();
		// 检测是否在无效邮箱列表中
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, email)) {
			result.setResultFailed("请勿重复输入无效邮箱！");
			return result;
		}
		List<Player> getPlayers = null;
		try {
			getPlayers = playerDAO.findByEmail(email);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (getPlayers.size() == 0 || getPlayers == null) {
			result.setResultFailed("找不到相关邮件下的用户！");
			// 存入无效邮箱列表防止穿透
			redisTemplate.opsForSet().add(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, email);
			redisTemplate.expire(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, 10, TimeUnit.MINUTES);
			return result;
		}
		result.setResultSuccess("查询用户成功！", getPlayers);
		return result;
	}

}