package fun.swsk33site.miyakogame.control;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import fun.swsk33site.miyakogame.param.CommonValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import fun.swsk33site.miyakogame.dao.PlayerDAO;
import fun.swsk33site.miyakogame.dataobject.Player;
import org.springframework.web.bind.annotation.RequestMapping;

@SuppressWarnings({"rawtypes", "unchecked"})
@Controller
@RequestMapping("/miyakogame")
public class MainPageControl {

	@Autowired
	private PlayerDAO playerDAO;

	@Autowired
	private RedisTemplate redisTemplate;

	@GetMapping
	public String getIndex(HttpServletRequest request, Model model) {
		boolean isLogin = false;
		// 验证session是否正确
		HttpSession session = request.getSession();
		Player sessionPlayer = (Player) session.getAttribute(CommonValue.SESSION_NAME);
		if (sessionPlayer != null) {
			// 根据session中信息去Redis中查找，没有就去数据库
			Player getPlayer = (Player) redisTemplate.opsForValue().get(sessionPlayer.getId());
			if (getPlayer == null) {
				try {
					getPlayer = playerDAO.findById(sessionPlayer.getId());
				} catch (Exception e) {
					e.printStackTrace();
				}
				if (getPlayer != null) {
					redisTemplate.opsForValue().set(getPlayer.getId(), getPlayer);
				}
			}
			if (sessionPlayer.getPwd().equals(getPlayer.getPwd())) {
				isLogin = true;
				model.addAttribute("player", sessionPlayer);
			} else {
				session.setAttribute(CommonValue.SESSION_NAME, null);
			}
		}
		model.addAttribute("islogin", isLogin);
		return "index";
	}

	@GetMapping("/player/register")
	public String register() {
		return "register";
	}

	@GetMapping("/player/login")
	public String login() {
		return "login";
	}

}