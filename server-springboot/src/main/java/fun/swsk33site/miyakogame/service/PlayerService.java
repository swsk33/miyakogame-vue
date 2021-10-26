package fun.swsk33site.miyakogame.service;

import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.Result;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PlayerService {

	/**
	 * 用户注册
	 */
	Result register(Player player);

	/**
	 * 用户销号
	 */
	Result delete(int id);

	/**
	 * 用户信息更新
	 */
	Result update(Player player) throws Exception;

	/**
	 * 重置用户密码，提供用户id和新的密码即可
	 */
	Result resetPassword(Player player, Integer code);

	/**
	 * 根据用户id获取用户
	 */
	Result<Player> findById(int id);

	/**
	 * 获取一个邮箱下的所有账户
	 */
	Result<List<Player>> findByEmail(String email);

}