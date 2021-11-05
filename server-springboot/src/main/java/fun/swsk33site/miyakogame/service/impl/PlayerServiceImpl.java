package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.cache.InvalidData;
import fun.swsk33site.miyakogame.cache.MailCodeCache;
import fun.swsk33site.miyakogame.cache.PlayerCache;
import fun.swsk33site.miyakogame.dao.PlayerDAO;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.CommonValue;
import fun.swsk33site.miyakogame.param.MailServiceType;
import fun.swsk33site.miyakogame.service.AvatarService;
import fun.swsk33site.miyakogame.service.MailService;
import fun.swsk33site.miyakogame.service.PlayerService;
import fun.swsk33site.miyakogame.util.ClassExamine;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import java.io.File;

@Component
public class PlayerServiceImpl implements PlayerService {

	@Autowired
	private PlayerDAO playerDAO;

	@Autowired
	private PlayerCache playerCache;

	@Autowired
	private InvalidData invalidData;

	@Autowired
	private MailCodeCache mailCodeCache;

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private RedissonClient redissonClient;

	@Autowired
	private AvatarService avatarService;

	@Autowired
	private MailService mailService;

	@Override
	public Result register(Player player) throws MessagingException {
		Result result = new Result();
		// 用户名校验
		// 先看看Redis中有没有用户
		Player getPlayer = playerCache.getByUsername(player.getUsername());
		if (getPlayer == null) {
			// 没有则去数据库查找
			try {
				getPlayer = playerDAO.findByUsername(player.getUsername());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer != null) {
				playerCache.addOrSet(getPlayer);
			}
		}
		// 如果不为空说明用户名已经注册了
		if (getPlayer != null) {
			result.setResultFailed("用户名已存在！");
			return result;
		}
		// 邮箱校验
		getPlayer = playerCache.getByEmail(player.getEmail());
		if (getPlayer == null) {
			// 没有则去数据库查找
			try {
				getPlayer = playerDAO.findByEmail(player.getEmail());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer != null) {
				playerCache.addOrSet(getPlayer);
			}
		}
		// 不为空说明用户邮箱已被注册
		if (getPlayer != null) {
			result.setResultFailed("该邮箱已被注册！");
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
		// 存到Redis
		playerCache.addOrSet(player);
		// 若新注册用户名在无效用户名列表中则移除
		if (invalidData.isCredentialInvalid(player.getUsername())) {
			invalidData.deleteInvalidCredential(player.getUsername());
		}
		// 若新注册用户邮箱在无效邮箱中则移除
		if (invalidData.isCredentialInvalid(player.getEmail())) {
			invalidData.deleteInvalidCredential(player.getEmail());
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
		// 先去Redis查找用户
		Player getPlayer = playerCache.getById(id);
		if (getPlayer == null) {
			// 找不到就去数据库
			try {
				getPlayer = playerDAO.findById(id);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		if (getPlayer == null) {
			result.setResultFailed("待注销用户不存在！");
			return result;
		}
		// 校验验证码
		if (!mailCodeCache.checkCodeInCache(id, MailServiceType.USER_DELETE, code)) {
			result.setResultFailed("验证码错误！");
			return result;
		}
		// 从数据库移除
		playerDAO.delete(id);
		// 从Redis用户信息中移除
		playerCache.delete(getPlayer);
		result.setResultSuccess("用户注销成功！");
		mailService.sendHtmlNotifyMail(getPlayer.getEmail(), "宫子恰布丁-用户注销", "您的用户：" + getPlayer.getUsername() + "已经成功注销！");
		return result;
	}

	@Override
	public Result<Player> update(Player player) throws Exception {
		Result<Player> result = new Result<>();
		// 先去Redis中获取用户信息
		Player getPlayer = playerCache.getById(player.getId());
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
		// 上锁
		RLock lock = redissonClient.getLock("player_update");
		lock.tryLock();
		try {
			playerDAO.update(player);
			playerCache.addOrSet(player);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
		result.setResultSuccess("更新用户信息成功！", player);
		return result;
	}

	@Override
	public Result resetPassword(Player player, Integer code) throws MessagingException {
		Result result = new Result();
		if (code == null) {
			result.setResultFailed("验证码不能为空！");
			return result;
		}
		// 先去Redis查找用户
		Player getPlayer = playerCache.getById(player.getId());
		if (getPlayer == null) {
			// 找不到再去数据库
			try {
				getPlayer = playerDAO.findById(player.getId());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				result.setResultFailed("找不到相应用户！");
				return result;
			}
		}
		// 校验验证码
		if (!mailCodeCache.checkCodeInCache(player.getId(), MailServiceType.PASSWORD_RESET, code)) {
			result.setResultFailed("验证码错误！");
			return result;
		}
		// 仅仅修改密码，将传入密码加密并覆盖到原用户信息上进行储存
		getPlayer.setPassword(encoder.encode(player.getPassword()));
		// 写入数据库和Redis
		playerDAO.update(getPlayer);
		playerCache.addOrSet(getPlayer);
		mailService.sendHtmlNotifyMail(getPlayer.getEmail(), "宫子恰布丁-密码已重置", "您的用户：" + getPlayer.getUsername() + "的密码已经完成重置！请牢记您的新密码！");
		result.setResultSuccess("重置密码成功！");
		return result;
	}

	@Override
	public Result<Player> findByUsername(String username) {
		Result<Player> result = new Result<>();
		// 先去Redis里面查找
		Player getPlayer = playerCache.getByUsername(username);
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
			// 加入到Redis
			playerCache.addOrSet(getPlayer);
		}
		result.setResultSuccess("查找用户成功！", getPlayer);
		return result;
	}

	@Override
	public Result<Player> findByEmail(String email) {
		Result<Player> result = new Result<>();
		// 先判断邮箱是否无效
		if (invalidData.isCredentialInvalid(email)) {
			result.setResultFailed("请勿重复输入无效邮箱！");
			return result;
		}
		// 先去Redis查找
		Player getPlayer = playerCache.getByEmail(email);
		if (getPlayer == null) {
			// 找不到就去数据库
			try {
				getPlayer = playerDAO.findByEmail(email);
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				result.setResultFailed("找不到相关邮件下的用户！");
				// 存入无效邮箱列表防止穿透
				invalidData.addInvalidCredential(email);
				return result;
			}
			// 在Redis补上
			playerCache.addOrSet(getPlayer);
		}
		result.setResultSuccess("查询用户成功！", getPlayer);
		return result;
	}

}