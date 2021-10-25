package fun.swsk33site.miyakogame.handler;

import com.alibaba.fastjson.JSON;
import fun.swsk33site.miyakogame.model.Result;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * 自定义退出成功逻辑
 */
public class MiyakoLogoutSuccessHandler implements LogoutSuccessHandler {

	@Override
	public void onLogoutSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
		// 设定响应状态码为200
		httpServletResponse.setStatus(HttpServletResponse.SC_OK);
		// 设定响应内容是utf-8编码的json类型
		httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
		httpServletResponse.setCharacterEncoding("utf-8");
		// 组装结果
		Result result = new Result();
		result.setResultSuccess("退出成功！", null);
		// 序列化结果对象为JSON
		String resultJSON = JSON.toJSONString(result);
		// 写入响应体
		PrintWriter writer = httpServletResponse.getWriter();
		writer.write(resultJSON);
		writer.flush();
		writer.close();
	}

}