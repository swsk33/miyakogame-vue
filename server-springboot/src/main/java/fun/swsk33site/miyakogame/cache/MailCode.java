package fun.swsk33site.miyakogame.cache;

import fun.swsk33site.miyakogame.annotation.RedisCache;
import fun.swsk33site.miyakogame.param.MailServiceType;

@RedisCache
public interface MailCode {

	/**
	 * 生成邮件验证码，并存入Redis缓存
	 *
	 * @param id   发送给的用户id
	 * @param type 发送的验证码服务类型
	 * @return 生成的验证码
	 */
	int generateCodeToCache(int id, MailServiceType type);

	/**
	 * 从缓存移除邮件验证码
	 *
	 * @param id   发送给的用户id
	 * @param type 验证码的服务类型
	 */
	void removeCodeInCache(int id, MailServiceType type);

}