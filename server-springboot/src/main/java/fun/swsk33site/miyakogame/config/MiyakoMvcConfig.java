package fun.swsk33site.miyakogame.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 自定义MVC配置
 */
@Configuration
public class MiyakoMvcConfig implements WebMvcConfigurer {

	/**
	 * 重写资源路径配置
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/**").addResourceLocations("file:resource/", "file:resource/web/");
	}

}