package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.param.CommonValue;
import fun.swsk33site.miyakogame.service.MailService;
import fun.swsk33site.miyakogame.dao.PlayerDAO;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.RankInfo;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.MailServiceType;
import fun.swsk33site.miyakogame.service.PlayerService;
import fun.swsk33site.miyakogame.util.PwdUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public class PlayerServiceImpl implements PlayerService {

	@Autowired
	private PlayerDAO playerDAO;

	@Autowired
	private RedisTemplate<Object, Object> redisTemplate;

	@Autowired
	private MailService mailService;

	@Override
	public Result<Player> register(Player player) {
		Result<Player> result = new Result<>();
		if (player == null) {
			result.setResultFailed("数据体不能为空！");
			return result;
		}
		if (StringUtils.isEmpty(player.getUserName())) {
			result.setResultFailed("用户名不能为空！");
			return result;
		}
		if (StringUtils.isEmpty(player.getPwd())) {
			result.setResultFailed("密码不能为空！");
			return result;
		}
		if (player.getPwd().length() < 8) {
			result.setResultFailed("密码长度不能小于8！");
			return result;
		}
		if (StringUtils.isEmpty(player.getEmail())) {
			result.setResultFailed("邮箱不能为空！");
			return result;
		}
		if (!player.getEmail().contains("@")) {
			result.setResultFailed("邮箱格式不正确！");
			return result;
		}
		// 先从Redis找这个用户
		Integer getId = (Integer) redisTemplate.opsForHash().get(CommonValue.REDIS_USERNAME_ID_TABLE_NAME, player.getUserName());
		if (getId == null) {
			Player getPlayer = null;
			// Redis找不着，再去MySQL中找
			try {
				getPlayer = playerDAO.findByUserName(player.getUserName());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer != null) {
				result.setResultFailed("该用户名已存在！");
				redisTemplate.opsForValue().set(getPlayer.getId(), getPlayer);
				redisTemplate.opsForHash().put(CommonValue.REDIS_USERNAME_ID_TABLE_NAME, getPlayer.getUserName(), getPlayer.getId());
				return result;
			}
		} else {
			result.setResultFailed("该用户名已存在！");
			return result;
		}
		if (StringUtils.isEmpty(player.getAvatar())) {
			player.setAvatar("/avatars/default-" + (new Random().nextInt(5) + 1) + ".jpg");
		}
		if (StringUtils.isEmpty(player.getNickname())) {
			player.setNickname(player.getUserName());
		}
		player.setPwd(PwdUtils.encodePwd(player.getPwd()));
		player.setHighScore(0);
		player.setGameData("null");
		player.setGmtCreated(LocalDateTime.now());
		player.setGmtModified(LocalDateTime.now());
		playerDAO.add(player);
		redisTemplate.opsForValue().set(player.getId(), player);
		redisTemplate.opsForHash().put(CommonValue.REDIS_USERNAME_ID_TABLE_NAME, player.getUserName(), player.getId());
		redisTemplate.opsForList().rightPush(player.getEmail(), player);
		// 加入Redis排名表
		redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, player.getId(), player.getHighScore());
		// 如果这个新注册的名字在无效用户名集合中则去掉
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_USER_TABLE_NAME, player.getUserName())) {
			redisTemplate.opsForSet().remove(CommonValue.REDIS_INVALID_USER_TABLE_NAME, player.getUserName());
		}
		// 如果这个新注册的账户邮箱在无效邮箱集合中则去掉
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, player.getEmail())) {
			redisTemplate.opsForSet().remove(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, player.getEmail());
		}
		result.setResultSuccess("注册用户成功！", player);
		return result;
	}

	@Override
	public Result<Player> login(Player player) {
		Result<Player> result = new Result<>();
		if (player == null) {
			result.setResultFailed("数据体不能为空！");
			return result;
		}
		if (StringUtils.isEmpty(player.getUserName())) {
			result.setResultFailed("用户名不能为空！");
			return result;
		}
		if (StringUtils.isEmpty(player.getPwd())) {
			result.setResultFailed("密码不能为空！");
			return result;
		}
		// 检测无效用户名防止缓存穿透
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_USER_TABLE_NAME, player.getUserName())) {
			result.setResultFailed("请勿重复登录无效账户！");
			return result;
		}
		// 先去Redis查询，没有再去数据库
		Integer getId = (Integer) redisTemplate.opsForHash().get(CommonValue.REDIS_USERNAME_ID_TABLE_NAME, player.getUserName());
		Player getPlayer = null;
		if (getId != null) {
			getPlayer = (Player) redisTemplate.opsForValue().get(getId);
		} else {
			try {
				getPlayer = playerDAO.findByUserName(player.getUserName());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				result.setResultFailed("用户不存在！");
				// 无效的用户名存入Redis的无效用户名集合中，防止缓存穿透
				redisTemplate.opsForSet().add(CommonValue.REDIS_INVALID_USER_TABLE_NAME, player.getUserName());
				redisTemplate.expire(CommonValue.REDIS_INVALID_USER_TABLE_NAME, 120, TimeUnit.SECONDS);
				return result;
			} else {
				redisTemplate.opsForValue().set(player.getId(), getPlayer);
				redisTemplate.opsForHash().put(CommonValue.REDIS_USERNAME_ID_TABLE_NAME, getPlayer.getUserName(), getPlayer.getId());
			}
		}
		if (!PwdUtils.encodePwd(player.getPwd()).equals(getPlayer.getPwd())) {
			result.setResultFailed("用户名或者密码错误！");
			return result;
		}
		result.setResultSuccess("登录成功", getPlayer);
		return result;
	}

	@Override
	public Result<Player> delete(int id) {
		Result<Player> result = new Result<>();
		Player getPlayer = (Player) redisTemplate.opsForValue().get(id);
		if (getPlayer == null) {
			try {
				getPlayer = playerDAO.findById(id);
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				result.setResultFailed("找不到指定用户，无法注销！");
				return result;
			}
		}
		String getUsername = getPlayer.getUserName();
		//移除redis玩家缓存、排名表、用户名对id表、邮箱对用户信息
		redisTemplate.delete(id);
		redisTemplate.opsForHash().delete(CommonValue.REDIS_USERNAME_ID_TABLE_NAME, getUsername);
		redisTemplate.opsForZSet().remove(CommonValue.REDIS_RANK_TABLE_NAME, id);
		redisTemplate.delete(getPlayer.getEmail());
		playerDAO.delete(id);
		//删除玩家头像文件
		String originImgFile = getPlayer.getAvatar();
		if (!originImgFile.contains("default")) {
			originImgFile = originImgFile.substring(originImgFile.lastIndexOf("/") + 1);
			new File(CommonValue.AVATAR_PATH + File.separator + originImgFile).delete();
		}
		result.setResultSuccess("注销用户完成！", null);
		mailService.sendNotifyMail(getPlayer.getEmail(), "宫子恰布丁-用户注销", "您的用户：" + getPlayer.getNickname() + " 已经成功注销！");
		return result;
	}

	@Override
	public Result<Player> update(Player player) {
		Result<Player> result = new Result<>();
		if (player == null) {
			result.setResultFailed("数据体不能为空！");
			return result;
		}
		Player getPlayer = (Player) redisTemplate.opsForValue().get(player.getId());
		if (getPlayer == null) {
			try {
				getPlayer = playerDAO.findById(player.getId());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				result.setResultFailed("找不到玩家！");
				return result;
			}
		}
		player.setUserName(getPlayer.getUserName());
		if (StringUtils.isEmpty(player.getNickname())) {
			player.setNickname(getPlayer.getNickname());
		}
		if (StringUtils.isEmpty(player.getAvatar())) {
			player.setAvatar(getPlayer.getAvatar());
		} else if (!player.getAvatar().equals(getPlayer.getAvatar())) {
			String originAvatarFileName = getPlayer.getAvatar();
			if (!originAvatarFileName.contains("default")) {
				originAvatarFileName = originAvatarFileName.substring(originAvatarFileName.lastIndexOf("/") + 1);
				new File(CommonValue.AVATAR_PATH + File.separator + originAvatarFileName).delete();
			}
		}
		if (player.getHighScore() == null) {
			player.setHighScore(getPlayer.getHighScore());
		} else {
			// 重新写入Redis排名表信息
			redisTemplate.opsForZSet().remove(CommonValue.REDIS_RANK_TABLE_NAME, player.getId());
			redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, player.getId(), player.getHighScore());
		}
		if (StringUtils.isEmpty(player.getPwd())) {
			player.setPwd(getPlayer.getPwd());
		} else if (player.getPwd().length() < 8) {
			result.setResultFailed("修改密码长度不能小于8！");
			return result;
		} else {
			player.setPwd(PwdUtils.encodePwd(player.getPwd()));
		}
		//刷新缓存邮箱对用户列表信息
		redisTemplate.delete(player.getEmail());
		if (StringUtils.isEmpty(player.getEmail())) {
			player.setEmail(getPlayer.getEmail());
		} else if (!player.getEmail().contains("@")) {
			result.setResultFailed("邮箱格式不正确！");
			return result;
		}
		if (StringUtils.isEmpty(player.getGameData())) {
			player.setGameData(getPlayer.getGameData());
		}
		player.setGmtCreated(getPlayer.getGmtCreated());
		player.setGmtModified(LocalDateTime.now());
		redisTemplate.opsForValue().set(player.getId(), player);
		playerDAO.update(player);
		result.setResultSuccess("修改信息成功！", player);
		return result;
	}

	@Override
	public Result<List<Player>> findByEmail(String email) {
		Result<List<Player>> result = new Result<>();
		if (StringUtils.isEmpty(email)) {
			result.setResultFailed("邮箱不能为空！");
			return result;
		}
		//验证无效邮箱防止缓存穿透
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, email)) {
			result.setResultFailed("请勿重复输入无效邮箱！");
			return result;
		}
		//先去redis查找
		List playerList = redisTemplate.opsForList().range(email, 0, -1);
		if (playerList == null || playerList.size() == 0) {
			try {
				playerList = playerDAO.findByEmail(email);
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (playerList == null || playerList.size() == 0) {
				result.setResultFailed("该邮箱下没有任何账户！");
				//把这个邮箱存入无效邮箱防止缓存穿透
				redisTemplate.opsForSet().add(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, email);
				redisTemplate.expire(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, 120, TimeUnit.SECONDS);
				return result;
			} else {
				for (Object player : playerList) {
					redisTemplate.opsForList().rightPush(email, (Player) player);
				}
			}
		}
		result.setResultSuccess("查询完成！", playerList);
		return result;
	}

	@Override
	public Result<Player> resetPwd(Player player, Integer code) {
		Result<Player> result = new Result<>();
		if (code == null) {
			result.setResultFailed("验证码不能为空！");
			return result;
		}
		if (StringUtils.isEmpty(player.getPwd())) {
			result.setResultFailed("新密码不能为空！");
			return result;
		}
		//校验验证码是否正确
		if (code != (int) (redisTemplate.opsForValue().get(MailServiceType.PASSWORD_RESET.toString() + "_" + player.getId()))) {
			result.setResultFailed("验证码错误！");
			return result;
		}
		redisTemplate.delete(MailServiceType.PASSWORD_RESET.toString() + "_" + player.getId());
		mailService.sendNotifyMail(player.getEmail(), "宫子恰布丁-密码重置", "您的账户（用户名：" + player.getUserName() + " ; 昵称：" + player.getNickname() + "）已完成密码重置！请牢记您的新密码！");
		return update(player);
	}

	@Override
	public Result<List<RankInfo>> getTotalRank() {
		Result<List<RankInfo>> result = new Result<>();
		List<RankInfo> rankResult = new ArrayList<>();
		Set<Object> userIds = redisTemplate.opsForZSet().reverseRange(CommonValue.REDIS_RANK_TABLE_NAME, 0, 9);
		if (userIds.size() == 0) {
			List<RankInfo> getRank = null;
			try {
				getRank = playerDAO.findByHighScoreInTen();
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getRank == null) {
				result.setResultFailed("查询失败！");
				return result;
			} else {
				for (RankInfo rank : getRank) {
					rankResult.add(rank);
					redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, rank.getUserId(), rank.getHighScore());
				}
			}
		} else {
			long order = 1;
			for (Object eachUserIdObject : userIds) {
				int eachUserId = (int) eachUserIdObject;
				//判断缓存排名表每个用户是否有效
				Player getPlayer = (Player) redisTemplate.opsForValue().get(eachUserId);
				if (getPlayer == null) {
					try {
						getPlayer = playerDAO.findById(eachUserId);
					} catch (Exception e) {
						e.printStackTrace();
					}
					if (getPlayer == null) {
						redisTemplate.opsForZSet().remove(CommonValue.REDIS_RANK_TABLE_NAME, eachUserId);
						continue;
					}
				}
				RankInfo info = new RankInfo();
				info.setUserId(getPlayer.getId());
				info.setNickname(getPlayer.getNickname());
				info.setAvatar(getPlayer.getAvatar());
				info.setHighScore(getPlayer.getHighScore());
				info.setSequence(order);
				rankResult.add(info);
				order++;
			}
		}
		result.setResultSuccess("获取排名成功！", rankResult);
		return result;
	}

	@Override
	public Result<RankInfo> getPlayerRank(int id) {
		Result<RankInfo> result = new Result<>();
		Long rank = redisTemplate.opsForZSet().reverseRank(CommonValue.REDIS_RANK_TABLE_NAME, id);
		if (rank == null) {
			RankInfo info = null;
			try {
				info = playerDAO.findUserRankByUserId(id);
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (info == null) {
				result.setResultFailed("查询失败！");
				return result;
			} else {
				redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, info.getUserId(), info.getHighScore());
				result.setResultSuccess("查询成功！", info);
				return result;
			}
		} else {
			rank++;
		}
		double score = redisTemplate.opsForZSet().score(CommonValue.REDIS_RANK_TABLE_NAME, id);
		RankInfo rankInfo = new RankInfo();
		rankInfo.setUserId(id);
		rankInfo.setHighScore((int) score);
		rankInfo.setSequence(rank);
		result.setResultSuccess("查询成功！", rankInfo);
		return result;
	}

}