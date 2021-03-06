package fun.swsk33site.miyakogame.cache.impl;

import fun.swsk33site.miyakogame.annotation.RedisCache;
import fun.swsk33site.miyakogame.cache.PlayerCache;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.param.CommonValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

@RedisCache
public class PlayerCacheImpl implements PlayerCache {

	@Autowired
	private RedisTemplate redisTemplate;

	@Override
	public void addOrSet(Player player) {
		// 存入或者修改玩家实体
		redisTemplate.opsForHash().put(CommonValue.REDIS_ID_TO_PLAYER_HASH, player.getId(), player);
		// 存入或者修改玩家用户名对id表
		redisTemplate.opsForHash().put(CommonValue.REDIS_PLAYER_USERNAME_TO_ID_HASH, player.getUsername(), player.getId());
		// 存入或者修改玩家邮箱对id表
		redisTemplate.opsForHash().put(CommonValue.REDIS_PLAYER_EMAIL_TO_ID_HASH, player.getEmail(), player.getId());
		// 存入或者修改Redis排行榜
		// add方法，如果key和value存在则会执行修改操作
		redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, player.getId(), player.getHighScore());
	}

	@Override
	public void delete(Player player) {
		// 删除所有用户信息
		redisTemplate.opsForHash().delete(CommonValue.REDIS_ID_TO_PLAYER_HASH, player.getId());
		redisTemplate.opsForHash().delete(CommonValue.REDIS_PLAYER_USERNAME_TO_ID_HASH, player.getUsername());
		redisTemplate.opsForHash().delete(CommonValue.REDIS_PLAYER_EMAIL_TO_ID_HASH, player.getEmail());
		// 从排行榜移除
		redisTemplate.opsForZSet().remove(CommonValue.REDIS_RANK_TABLE_NAME, player.getId());
	}

	@Override
	public Player getById(int id) {
		return (Player) redisTemplate.opsForHash().get(CommonValue.REDIS_ID_TO_PLAYER_HASH, id);
	}

	@Override
	public Player getByUsername(String username) {
		// 先利用用户名获取用户id
		Integer id = (Integer) redisTemplate.opsForHash().get(CommonValue.REDIS_PLAYER_USERNAME_TO_ID_HASH, username);
		if (id == null) {
			return null;
		}
		// 再获取到用户
		return (Player) redisTemplate.opsForHash().get(CommonValue.REDIS_ID_TO_PLAYER_HASH, id);
	}

	@Override
	public Player getByEmail(String email) {
		// 先利用用户邮箱获取到用户id
		Integer id = (Integer) redisTemplate.opsForHash().get(CommonValue.REDIS_PLAYER_EMAIL_TO_ID_HASH, email);
		if (id == null) {
			return null;
		}
		// 再获取到用户
		return (Player) redisTemplate.opsForHash().get(CommonValue.REDIS_ID_TO_PLAYER_HASH, id);
	}

	@Override
	public Player getByUsernameOrEmail(String usernameOrEmail) {
		// 先根据用户名获取到用户id
		Integer id = (Integer) redisTemplate.opsForHash().get(CommonValue.REDIS_PLAYER_USERNAME_TO_ID_HASH, usernameOrEmail);
		// 如果获取不到，说明很可能是邮箱
		if (id == null) {
			id = (Integer) redisTemplate.opsForHash().get(CommonValue.REDIS_PLAYER_EMAIL_TO_ID_HASH, usernameOrEmail);
		}
		if (id == null) {
			return null;
		}
		// 再获取用户
		return (Player) redisTemplate.opsForHash().get(CommonValue.REDIS_ID_TO_PLAYER_HASH, id);
	}

}