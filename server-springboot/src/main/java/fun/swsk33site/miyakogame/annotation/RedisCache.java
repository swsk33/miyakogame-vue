package fun.swsk33site.miyakogame.annotation;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * 用于Redis缓存操作层的自定义注解，为Component的派生
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface RedisCache {
	@AliasFor(annotation = Component.class)
	String value() default "";
}