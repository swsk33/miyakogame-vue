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
	Result<Player> register(Player player);

	/**
	 * 用户登录
	 */
	Result<Player> login(Player player);

	/**
	 * 用户销号
	 */
	Result<Player> delete(int id);

	/**
	 * 用户信息更新
	 */
	Result<Player> update(Player player);

	/**
	 * 获取一个邮箱下的所有账户
	 */
	Result<List<Player>> findByEmail(String email);

	/**
	 * 重置用户密码
	 */
	Result<Player> resetPassword(Player player, Integer code);

}