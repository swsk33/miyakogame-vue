package fun.swsk33site.miyakogame.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * 自定义的认证过滤器，实现前后端分离的json格式登录请求解析
 */
public class MiyakoUsernameAndPasswordFilter extends UsernamePasswordAuthenticationFilter {

	/**
	 * 请求体中的用户名字段名
	 */
	private String usernameParameter = "username";

	/**
	 * 请求体中的密码字段名
	 */
	private String passwordParameter = "password";

	/**
	 * 创建自定义认证过滤器
	 */
	public MiyakoUsernameAndPasswordFilter() {

	}

	/**
	 * 创建自定义认证过滤器，并自定义用户名、密码字段名
	 *
	 * @param usernameParameter 自定义用户名字段名
	 * @param passwordParameter 自定义密码字段名
	 */
	public MiyakoUsernameAndPasswordFilter(String usernameParameter, String passwordParameter) {
		this.usernameParameter = usernameParameter;
		this.passwordParameter = passwordParameter;
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
		// 判断是否为JSON类型数据
		if (request.getContentType().equals(MediaType.APPLICATION_JSON_VALUE)) {
			// 获取请求体
			Map<String, String> requestBody = null;
			try {
				// 解析json为Map对象
				requestBody = new ObjectMapper().readValue(request.getInputStream(), Map.class);
			} catch (Exception e) {
				e.printStackTrace();
			}
			// 获取请求体中的用户名/密码字段值，并执行认证
			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(requestBody.get(usernameParameter), requestBody.get(passwordParameter));
			// 返回认证结果
			return this.getAuthenticationManager().authenticate(auth);
		} else {
			// 否则，使用默认表单登录方式
			return super.attemptAuthentication(request, response);
		}
	}

}