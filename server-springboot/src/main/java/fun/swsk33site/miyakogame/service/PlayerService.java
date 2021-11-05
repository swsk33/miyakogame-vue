package fun.swsk33site.miyakogame.service;

import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.Result;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;

@Service
public interface PlayerService {

	/**
	 * 用户注册
	 */
	Result<Player> register(Player player) throws MessagingException;

	/**
	 * 用户销号
	 */
	Result delete(Integer id, Integer code) throws MessagingException;

	/**
	 * 用户信息更新
	 */
	Result<Player> update(Player player) throws Exception;

	/**
	 * 重置用户密码，提供用户id和新的密码即可
	 */
	Result resetPassword(Player player, Integer code) throws MessagingException;

	/**
	 * 根据用户名获取用户
	 */
	Result<Player> findByUsername(String username);

	/**
	 * 获取一个邮箱下的所有账户
	 */
	Result<Player> findByEmail(String email);

}