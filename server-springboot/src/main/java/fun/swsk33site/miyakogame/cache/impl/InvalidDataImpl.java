package fun.swsk33site.miyakogame.cache.impl;

import fun.swsk33site.miyakogame.annotation.RedisCache;
import fun.swsk33site.miyakogame.cache.InvalidData;
import fun.swsk33site.miyakogame.param.CommonValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.concurrent.TimeUnit;

@RedisCache
public class InvalidDataImpl implements InvalidData {

	@Autowired
	private RedisTemplate redisTemplate;

	@Override
	public void addInvalidCredential(String credential) {
		redisTemplate.opsForSet().add(CommonValue.REDIS_INVALID_LOGIN_CREDENTIALS_SET, credential);
		redisTemplate.expire(CommonValue.REDIS_INVALID_LOGIN_CREDENTIALS_SET, 10, TimeUnit.MINUTES);
	}

	@Override
	public void deleteInvalidCredential(String credential) {
		redisTemplate.opsForSet().remove(CommonValue.REDIS_INVALID_LOGIN_CREDENTIALS_SET, credential);
	}

	@Override
	public boolean isCredentialInvalid(String credential) {
		return redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_LOGIN_CREDENTIALS_SET, credential);
	}

}