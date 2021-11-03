package fun.swsk33site.miyakogame.api;

import fun.swsk33site.miyakogame.dataobject.RankInfo;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.service.RankInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rank")
public class RankInfoAPI {

	@Autowired
	private RankInfoService rankInfoService;

	@GetMapping("/total")
	public Result<List<RankInfo>> getTotalRank() {
		return rankInfoService.getTotalRank();
	}

	@GetMapping("/getmine/{id}")
	public Result<Long> getById(@PathVariable("id") int id) {
		return rankInfoService.getPlayerRank(id);
	}

}