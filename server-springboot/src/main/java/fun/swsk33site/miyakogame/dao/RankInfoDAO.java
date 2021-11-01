package fun.swsk33site.miyakogame.dao;

import fun.swsk33site.miyakogame.dataobject.RankInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RankInfoDAO {

	/**
	 * 查询最高分前十用户
	 */
	List<RankInfo> findByHighScoreInTen();

	/**
	 * 通过用户名查询用户排名
	 */
	RankInfo findUserRankByUsername(String username);

}