package fun.swsk33site.miyakogame.cache.impl;

import fun.swsk33site.miyakogame.annotation.RedisCache;
import fun.swsk33site.miyakogame.cache.InvalidData;
import fun.swsk33site.miyakogame.param.CommonValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

@RedisCache
public class InvalidDataImpl implements InvalidData {

	@Autowired
	private RedisTemplate redisTemplate;

	@Override
	public void addInvalidUsername(String username) {
		redisTemplate.opsForSet().add(CommonValue.REDIS_INVALID_USERNAME_SET, username);
	}

	@Override
	public void addInvalidEmail(String email) {
		redisTemplate.opsForSet().add(CommonValue.REDIS_INVALID_EMAIL_SET, email);
	}

	@Override
	public void deleteInvalidUsername(String username) {
		redisTemplate.opsForSet().remove(CommonValue.REDIS_INVALID_USERNAME_SET, username);
	}

	@Override
	public void deleteInvalidEmail(String email) {
		redisTemplate.opsForSet().remove(CommonValue.REDIS_INVALID_EMAIL_SET, email);
	}

	@Override
	public boolean isUsernameInvalid(String username) {
		return redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_USERNAME_SET, username);
	}

	@Override
	public boolean isEmailInvalid(String email) {
		return redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_EMAIL_SET, email);
	}

}