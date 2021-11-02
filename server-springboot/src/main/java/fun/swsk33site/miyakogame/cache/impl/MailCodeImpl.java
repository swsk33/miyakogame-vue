package fun.swsk33site.miyakogame.cache.impl;

import fun.swsk33site.miyakogame.annotation.RedisCache;
import fun.swsk33site.miyakogame.cache.MailCode;
import fun.swsk33site.miyakogame.param.MailServiceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.concurrent.TimeUnit;

@RedisCache
public class MailCodeImpl implements MailCode {

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
	public void removeCodeInCache(int id, MailServiceType type) {
		redisTemplate.delete(type.toString() + "_" + id);
	}

}