package fun.swsk33site.miyakogame.service;

import fun.swsk33site.miyakogame.dataobject.RankInfo;
import fun.swsk33site.miyakogame.model.Result;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RankInfoService {

	/**
	 * 查询全服前十
	 */
	Result<List<RankInfo>> getTotalRank();

	/**
	 * 查询某用户排名信息
	 */
	Result<RankInfo> getPlayerRank(int id);

}