package fun.swsk33site.miyakogame.control;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

	/**
	 * 主页面
	 */
	@GetMapping("/")
	public String index() {
		return "index";
	}

}