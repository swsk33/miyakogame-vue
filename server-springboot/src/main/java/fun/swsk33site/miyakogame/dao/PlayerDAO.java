package fun.swsk33site.miyakogame.dao;

import fun.swsk33site.miyakogame.dataobject.Player;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PlayerDAO {

	/**
	 * 新增用户
	 */
	int add(Player player);

	/**
	 * 删除用户
	 */
	int delete(int id);

	/**
	 * 修改用户
	 **/
	int update(Player player);

	/**
	 * 根据id查找用户
	 */
	Player findById(int id);

	/**
	 * 根据用户名查找用户
	 */
	Player findByUsername(String username);

	/**
	 * 根据邮箱查找用户
	 */
	Player findByEmail(String email);

	/**
	 * 根据用户名或者邮箱查找用户
	 */
	Player findByUsernameOrEmail(String usernameOrEmail);

}