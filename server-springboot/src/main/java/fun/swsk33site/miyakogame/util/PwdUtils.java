package fun.swsk33site.miyakogame.util;

import org.apache.commons.codec.digest.DigestUtils;

public class PwdUtils {

	public static final String SALT = "miyako_game_ajww23m";

	public static String encodePwd(String origin) {
		return DigestUtils.md5Hex(origin + SALT).toLowerCase();
	}

}