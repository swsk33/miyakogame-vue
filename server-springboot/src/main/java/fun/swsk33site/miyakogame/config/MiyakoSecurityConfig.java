package fun.swsk33site.miyakogame.config;

import fun.swsk33site.miyakogame.filter.MiyakoUsernameAndPasswordFilter;
import fun.swsk33site.miyakogame.handler.MiyakoAccessDeniedHandler;
import fun.swsk33site.miyakogame.handler.MiyakoAuthFailureHandler;
import fun.swsk33site.miyakogame.handler.MiyakoAuthSuccessHandler;
import fun.swsk33site.miyakogame.handler.MiyakoLogoutSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * 自定义Spring Security安全策略配置
 */
@Configuration
public class MiyakoSecurityConfig extends WebSecurityConfigurerAdapter {

	/**
	 * 配置密码加密器
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	/**
	 * 配置自定义用户名密码拦截器为Bean
	 */
	@Bean
	public UsernamePasswordAuthenticationFilter createMiyakoAuthFilter() throws Exception {
		// 创建自己的用户名密码拦截器实例
		UsernamePasswordAuthenticationFilter myAuthFilter = new MiyakoUsernameAndPasswordFilter();
		// 注意，因为是自定义登录拦截器，所以登录接口地址要在此配置！
		myAuthFilter.setFilterProcessesUrl("/api/login");
		// 设定为自定义的登录成功/失败处理器
		myAuthFilter.setAuthenticationSuccessHandler(new MiyakoAuthSuccessHandler());
		myAuthFilter.setAuthenticationFailureHandler(new MiyakoAuthFailureHandler());
		myAuthFilter.setAuthenticationManager(authenticationManagerBean());
		return myAuthFilter;
	}

	/**
	 * 配置安全拦截策略
	 */
	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		// 设定认证拦截器
		httpSecurity.authorizeRequests()
				// 需要登录后才能获取用户信息
				.antMatchers("/api/islogin").authenticated()
				// 放行头像等等静态资源url
				.antMatchers("/static-resources/**").permitAll();
		// 自定义退出登录url和配置自定义的登出成功处理器
		httpSecurity.logout().logoutUrl("/api/logout").logoutSuccessHandler(new MiyakoLogoutSuccessHandler());
		// 关闭csrf
		httpSecurity.csrf().disable();
		// 设定自己的登录认证拦截器
		httpSecurity.addFilterAt(createMiyakoAuthFilter(), UsernamePasswordAuthenticationFilter.class);
		// 设定为自定义的权限不足处理器
		httpSecurity.exceptionHandling().accessDeniedHandler(new MiyakoAccessDeniedHandler());
	}

}