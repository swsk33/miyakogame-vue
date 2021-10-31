package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.dao.RankInfoDAO;
import fun.swsk33site.miyakogame.dataobject.RankInfo;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.service.RankInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RankInfoServiceImpl implements RankInfoService {

	@Autowired
	private RankInfoDAO rankInfoDAO;

	@Autowired
	private RedisTemplate redisTemplate;

	@Override
	public Result<List<RankInfo>> getTotalRank() {
		Result<List<RankInfo>> result = new Result<>();
		List<RankInfo> rankInfos = new ArrayList<>();
		// 先读取redis排名表

		return result;
	}

	@Override
	public Result<RankInfo> getPlayerRank(int id) {
		return null;
	}

}