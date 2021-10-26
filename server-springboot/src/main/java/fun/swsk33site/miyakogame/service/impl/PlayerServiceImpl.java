package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.dao.PlayerDAO;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.CommonValue;
import fun.swsk33site.miyakogame.service.AvatarService;
import fun.swsk33site.miyakogame.service.PlayerService;
import io.lettuce.core.dynamic.annotation.CommandNaming;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@CommandNaming
public class PlayerServiceImpl implements PlayerService {

	@Autowired
	private PlayerDAO playerDAO;

	@Autowired
	private RedisTemplate redisTemplate;

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private AvatarService avatarService;

	@Override
	public Result register(Player player) {
		Result result = new Result();
		// 先看看数据库中是否已经存在该用户名的用户
		Player getPlayer = null;
		try {
			getPlayer = playerDAO.findByUsername(player.getUsername());
		} catch (Exception e) {
			e.printStackTrace();
		}
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
		playerDAO.add(player);
		// 加入Redis排名表
		redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, player.getId(), player.getHighScore());
		// 如果这个新注册的名字在无效用户名集合中则去掉
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_USER_TABLE_NAME, player.getUsername())) {
			redisTemplate.opsForSet().remove(CommonValue.REDIS_INVALID_USER_TABLE_NAME, player.getUsername());
		}
		// 如果这个新注册的账户邮箱在无效邮箱集合中则去掉
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, player.getEmail())) {
			redisTemplate.opsForSet().remove(CommonValue.REDIS_INVALID_EMAIL_TABLE_NAME, player.getEmail());
		}
		result.setResultSuccess("注册用户成功！");
		return result;
	}

	@Override
	public Result delete(int id) {
		return null;
	}

	@Override
	public Result update(Player player) {
		Result result = new Result();
		Player getPlayer = null;
		try {
			getPlayer = playerDAO.findById(player.getId());
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (getPlayer == null) {
			result.setResultFailed("找不到该用户！");
			return result;
		}
		// 互补信息

		return result;
	}

	@Override
	public Result resetPassword(Player player, Integer code) {
		return null;
	}

	@Override
	public Result<Player> findById(int id) {
		return null;
	}

	@Override
	public Result<List<Player>> findByEmail(String email) {
		return null;
	}

}