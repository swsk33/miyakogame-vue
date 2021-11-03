package fun.swsk33site.miyakogame.cache.impl;

import fun.swsk33site.miyakogame.annotation.RedisCache;
import fun.swsk33site.miyakogame.cache.MailCodeCache;
import fun.swsk33site.miyakogame.param.MailServiceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.concurrent.TimeUnit;

@RedisCache
public class MailCodeCacheImpl implements MailCodeCache {

	@Autowired
	private RedisTemplate redisTemplate;

	/**
	 * 生成随机6位数验证码
	 *
	 * @return 验证码
	 */
	private int generateCode() {
		return (int) ((Math.random() * 9 + 1) * 100000);
	}

	@Override
	public int generateCodeToCache(int id, MailServiceType type) {
		// 生成验证码
		int code = generateCode();
		// 把验证码存入Redis缓存，并设置5分钟后过期
		redisTemplate.opsForValue().set(type.toString() + "_" + id, code, 5, TimeUnit.MINUTES);
		return code;
	}

	@Override
	public boolean checkCodeInCache(int id, MailServiceType type, int code) {
		if (code == (Integer) redisTemplate.opsForValue().get(type.toString() + "_" + id)) {
			redisTemplate.delete(type + "_" + id);
			return true;
		}
		return false;
	}

}