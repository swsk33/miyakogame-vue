package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.cache.PlayerCache;
import fun.swsk33site.miyakogame.dao.PlayerDAO;
import fun.swsk33site.miyakogame.dao.RankInfoDAO;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.dataobject.RankInfo;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.CommonValue;
import fun.swsk33site.miyakogame.service.RankInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class RankInfoServiceImpl implements RankInfoService {

	@Autowired
	private RankInfoDAO rankInfoDAO;

	@Autowired
	private PlayerDAO playerDAO;

	@Autowired
	private PlayerCache playerCache;

	@Autowired
	private RedisTemplate redisTemplate;

	@Override
	public Result<List<RankInfo>> getTotalRank() {
		Result<List<RankInfo>> result = new Result<>();
		List<RankInfo> rankInfos = null;
		// 先读取Redis排名表
		Set<Object> userIds = redisTemplate.opsForZSet().reverseRange(CommonValue.REDIS_RANK_TABLE_NAME, 0, 9);
		if (userIds.size() == 0 || userIds == null) {
			// Redis里面没有，就去数据库获取
			try {
				rankInfos = rankInfoDAO.findByHighScoreInTen();
			} catch (Exception e) {
				e.printStackTrace();
			}
			// 在此补上Redis中缓存排名数据
			if (rankInfos.size() != 0) {
				for (RankInfo rankInfo : rankInfos) {
					redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, rankInfo.getId(), rankInfo.getHighScore());
				}
			}
		} else {
			// 否则，将从Redis中取出的用户名拿去获取用户信息组装为排名表
			rankInfos = new ArrayList<>();
			// 名次
			long rank = 1;
			for (Object userId : userIds) {
				int id = (Integer) userId;
				// 先去Redis里面查找用户
				Player getPlayer = playerCache.getById(id);
				if (getPlayer == null) {
					// 否则就去数据库查找
					try {
						getPlayer = playerDAO.findById(id);
					} catch (Exception e) {
						e.printStackTrace();
					}
					// 如果这个用户在数据库也不存在，那么就从排名表移除
					if (getPlayer == null) {
						redisTemplate.opsForZSet().remove(CommonValue.REDIS_RANK_TABLE_NAME, id);
						continue;
					}
					// 存在补上
					playerCache.addOrSet(getPlayer);
				}
				// 组装
				RankInfo rankInfo = new RankInfo(getPlayer, rank);
				rankInfos.add(rankInfo);
				rank++;
			}
		}
		result.setResultSuccess("获取排名信息成功！", rankInfos);
		return result;
	}

	@Override
	public Result<Long> getPlayerRank(int id) {
		Result<Long> result = new Result<>();
		// 先去Redis查询排名
		Long rank = redisTemplate.opsForZSet().reverseRank(CommonValue.REDIS_RANK_TABLE_NAME, id);
		if (rank == null) {
			// Redis没有则去数据库查询
			RankInfo rankInfo = null;
			try {
				rankInfo = rankInfoDAO.findUserRankById(id);
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (rankInfo == null) {
				result.setResultFailed("查询排名信息失败！");
				return result;
			}
			// 若数据库查到则存入Redis
			redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, rankInfo.getId(), rankInfo.getHighScore());
			result.setResultSuccess("查询排名成功！", rankInfo.getSequence());
			return result;
		}
		// 若在Redis里面查到排名，则返回
		// Redis的ZSet获取的次序从0开始，则这里加1
		rank++;
		result.setResultSuccess("查询排名成功！", rank);
		return result;
	}

}