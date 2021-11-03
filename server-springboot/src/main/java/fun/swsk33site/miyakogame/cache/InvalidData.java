package fun.swsk33site.miyakogame.cache;

import fun.swsk33site.miyakogame.annotation.RedisCache;

/**
 * Redis无效信息缓存操作类
 */
@RedisCache
public interface InvalidData {

	/**
	 * 添加无效的登录凭证到缓存
	 *
	 * @param credential 无效的用户名或者邮箱
	 */
	void addInvalidCredential(String credential);

	/**
	 * 从缓存移除无效登录凭证
	 *
	 * @param credential 用户名或者邮箱
	 */
	void deleteInvalidCredential(String credential);

	/**
	 * 检测该登录凭证是否在无效登录凭证列表中
	 *
	 * @param credential 检测用户名或者邮箱
	 * @return 用户名或者邮箱是否是无效的
	 */
	boolean isCredentialInvalid(String credential);
	
}