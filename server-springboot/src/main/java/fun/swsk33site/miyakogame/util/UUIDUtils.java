package fun.swsk33site.miyakogame.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * UUID实用类
 */
public class UUIDUtils {

	/**
	 * 获取当前时间作为id
	 *
	 * @return 时间id
	 */
	public static String generateTimeId() {
		LocalDateTime time = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
		return formatter.format(time);
	}

}