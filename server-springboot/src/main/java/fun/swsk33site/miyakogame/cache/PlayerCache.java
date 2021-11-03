package fun.swsk33site.miyakogame.cache;

import fun.swsk33site.miyakogame.annotation.RedisCache;
import fun.swsk33site.miyakogame.dataobject.Player;

/**
 * 封装一些Redis中对用户的常用操作
 */
@RedisCache
public interface PlayerCache {

	/**
	 * 向Redis中增加或者修改一个玩家
	 *
	 * @param player 玩家对象
	 */
	void addOrSet(Player player);

	/**
	 * 从Redis删除一个玩家
	 *
	 * @param player 玩家对象
	 */
	void delete(Player player);

	/**
	 * 通过id获取到一个玩家
	 *
	 * @param id 玩家id
	 * @return 玩家对象
	 */
	Player getById(int id);

	/**
	 * 通过用户名获取玩家
	 *
	 * @param username 用户名
	 * @return 玩家对象
	 */
	Player getByUsername(String username);

	/**
	 * 通过邮箱获取玩家
	 *
	 * @param email 邮箱
	 * @return 玩家对象
	 */
	Player getByEmail(String email);

	/**
	 * 通过用户名或者邮箱获取玩家
	 *
	 * @param usernameOrEmail 用户名或者邮箱
	 * @return 玩家对象
	 */
	Player getByUsernameOrEmail(String usernameOrEmail);

}