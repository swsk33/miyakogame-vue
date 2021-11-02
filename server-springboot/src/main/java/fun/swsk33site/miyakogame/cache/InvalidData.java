package fun.swsk33site.miyakogame.cache;

import fun.swsk33site.miyakogame.annotation.RedisCache;

/**
 * Redis无效信息缓存操作类
 */
@RedisCache
public interface InvalidData {

	/**
	 * 添加无效的用户名到缓存
	 *
	 * @param username 无效的用户名
	 */
	void addInvalidUsername(String username);

	/**
	 * 添加无效有效到缓存
	 *
	 * @param email 无效的邮箱
	 */
	void addInvalidEmail(String email);

	/**
	 * 从缓存移除无效用户名
	 *
	 * @param username 用户名
	 */
	void deleteInvalidUsername(String username);

	/**
	 * 从缓存中移除无效邮箱
	 *
	 * @param email 邮箱
	 */
	void deleteInvalidEmail(String email);

	/**
	 * 检测该用户名是否在无效用户名列表中
	 *
	 * @param username 检测用户名
	 * @return 邮箱是否是无效的
	 */
	boolean isUsernameInvalid(String username);

	/**
	 * 检测邮箱是否在无效邮箱列表中
	 *
	 * @param email 检测邮箱
	 * @return 邮箱是否是无效的
	 */
	boolean isEmailInvalid(String email);

}