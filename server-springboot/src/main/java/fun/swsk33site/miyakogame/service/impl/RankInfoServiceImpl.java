package fun.swsk33site.miyakogame.service.impl;

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
	private RedisTemplate redisTemplate;

	@Override
	public Result<List<RankInfo>> getTotalRank() {
		Result<List<RankInfo>> result = new Result<>();
		List<RankInfo> rankInfos = null;
		// 先读取redis排名表
		Set<Object> usernames = redisTemplate.opsForZSet().reverseRange(CommonValue.REDIS_RANK_TABLE_NAME, 0, 9);
		if (usernames.size() == 0 || usernames == null) {
			// Redis里面没有，就去数据库获取
			try {
				rankInfos = rankInfoDAO.findByHighScoreInTen();
			} catch (Exception e) {
				e.printStackTrace();
			}
			// 在此补上Redis中缓存排名数据
			if (rankInfos.size() != 0) {
				for (RankInfo rankInfo : rankInfos) {
					redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, rankInfo.getUsername(), rankInfo.getHighScore());
				}
			}
		} else {
			// 否则，将从Redis中取出的用户名拿去获取用户信息组装为排名表
			rankInfos = new ArrayList<>();
			// 名次
			long rank = 1;
			for (Object username : usernames) {
				String usernameString = (String) username;
				// 先去Redis里面查找用户
				Player getPlayer = (Player) redisTemplate.opsForValue().get(usernameString);
				if (getPlayer == null) {
					// 否则就去数据库查找
					try {
						getPlayer = playerDAO.findByUsername(usernameString);
					} catch (Exception e) {
						e.printStackTrace();
					}
					// 如果这个用户在数据库也不存在，那么就从排名表移除
					if (getPlayer == null) {
						redisTemplate.opsForZSet().remove(CommonValue.REDIS_RANK_TABLE_NAME, usernameString);
						continue;
					}
					redisTemplate.opsForValue().set(getPlayer.getUsername(), getPlayer);
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
	public Result<RankInfo> getPlayerRank(int id) {
		Result<RankInfo> result = new Result<>();
		
		return result;
	}

}