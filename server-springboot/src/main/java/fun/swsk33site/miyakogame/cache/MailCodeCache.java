package fun.swsk33site.miyakogame.cache;

import fun.swsk33site.miyakogame.annotation.RedisCache;
import fun.swsk33site.miyakogame.param.MailServiceType;

/**
 * 封装的邮箱验证码缓存操作
 */
@RedisCache
public interface MailCodeCache {

	/**
	 * 生成邮件验证码，并存入Redis缓存
	 *
	 * @param id   发送给的用户id
	 * @param type 发送的验证码服务类型
	 * @return 生成的验证码
	 */
	int generateCodeToCache(int id, MailServiceType type);

	/**
	 * 校验验证码
	 *
	 * @param id   发送给的用户id
	 * @param type 验证码的服务类型
	 * @param code 用户提交的验证码
	 * @return 是否正确，若校验通过，则会删除该验证码缓存
	 */
	boolean checkCodeInCache(int id, MailServiceType type, int code);

}