package fun.swsk33site.miyakogame.api;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import fun.swsk33site.miyakogame.param.CommonValue;
import fun.swsk33site.miyakogame.util.PwdUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.RankInfo;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.service.PlayerService;

@RestController
@RequestMapping(CommonValue.API_PREFIX + "player")
public class PlayerAPI {

	@Autowired
	private PlayerService playerService;

	@PostMapping("/reg")
	public Result<Player> register(@RequestBody Player player, HttpServletRequest request) {
		Result<Player> result = playerService.register(player);
		if (result.isSuccess()) {
			HttpSession session = request.getSession();
			session.setAttribute(CommonValue.SESSION_NAME, result.getData());
		}
		return result;
	}

	@PostMapping("/login")
	public Result<Player> login(@RequestBody Player player, HttpServletRequest request) {
		Result<Player> result = playerService.login(player);
		if (result.isSuccess()) {
			HttpSession session = request.getSession();
			session.setAttribute(CommonValue.SESSION_NAME, result.getData());
		}
		return result;
	}

	@GetMapping("/logout")
	public void logout(HttpServletRequest request) {
		HttpSession session = request.getSession();
		session.setAttribute(CommonValue.SESSION_NAME, null);
	}

	@PostMapping("/delete")
	public Result<Player> del(@RequestBody Player player, HttpServletRequest request) {
		Result<Player> result = null;
		HttpSession session = request.getSession();
		String sessionPwd = ((Player) session.getAttribute(CommonValue.SESSION_NAME)).getPwd();
		if (!PwdUtils.encodePwd(player.getPwd()).equals(sessionPwd)) {
			result = new Result<>();
			result.setResultFailed("密码不正确！");
			return result;
		}
		result = playerService.delete(player.getId());
		request.getSession().setAttribute(CommonValue.SESSION_NAME, null);
		return result;
	}

	@PostMapping("/update")
	public Result<Player> update(@RequestBody Player player, HttpServletRequest request) {
		Result<Player> result = null;
		HttpSession session = request.getSession();
		Player sessionPlayer = (Player) session.getAttribute(CommonValue.SESSION_NAME);
		if (sessionPlayer.getId() != player.getId()) {
			result = new Result<>();
			result.setResultFailed("当前登录用户和被修改用户不一致，终止！");
			return result;
		}
		result = playerService.update(player);
		if (result.isSuccess()) {
			session.setAttribute(CommonValue.SESSION_NAME, result.getData());
		}
		return result;
	}

	@GetMapping("/findbyemail")
	public Result<List<Player>> findByEmail(@RequestParam("email") String email) {
		return playerService.findByEmail(email);
	}

	@RequestMapping("/resetpwd")
	public Result<Player> resetPwd(@RequestBody Player player, @RequestParam("code") Integer code) {
		return playerService.resetPwd(player, code);
	}

	@GetMapping("/rankten")
	public Result<List<RankInfo>> getRankTen() {
		return playerService.getTotalRank();
	}

	@GetMapping("/playerank")
	public Result<RankInfo> getPlayerRank(@RequestParam("id") int playerId) {
		return playerService.getPlayerRank(playerId);
	}

}