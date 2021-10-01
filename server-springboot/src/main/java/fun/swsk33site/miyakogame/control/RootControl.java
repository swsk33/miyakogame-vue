package fun.swsk33site.miyakogame.control;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletResponse;

@Controller
public class RootControl {

	/**
	 * 根路径访问跳转至主路径
	 */
	@GetMapping("/")
	public void redirectToMain(HttpServletResponse response) throws Exception {
		response.sendRedirect("/miyakogame");
	}

}