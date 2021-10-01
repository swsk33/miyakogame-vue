package fun.swsk33site.miyakogame.service;

import java.util.List;

import org.springframework.stereotype.Service;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.RankInfo;
import fun.swsk33site.miyakogame.model.Result;

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
	Result<Player> resetPwd(Player player, Integer code);

	/**
	 * 查询全服前十
	 */
	Result<List<RankInfo>> getTotalRank();

	/**
	 * 查询某用户排名信息
	 */
	Result<RankInfo> getPlayerRank(int id);

}