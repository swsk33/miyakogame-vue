package fun.swsk33site.miyakogame.param;

/**
 * 常用值存放
 */
public class CommonValue {

	/**
	 * API前缀
	 */
	public static final String API_PREFIX = "/miyakogame/api/";

	/**
	 * session用户信息字段名
	 */
	public static final String SESSION_NAME = "player";

	/**
	 * 玩家自定义头像存放路径
	 */
	public static String AVATAR_PATH;

	/**
	 * Redis排名表zSet的名称
	 */
	public static final String REDIS_RANK_TABLE_NAME = "rankInfo";

	/**
	 * Redis玩家username -> id的映射Map名称
	 */
	public static final String REDIS_USERNAME_ID_TABLE_NAME = "username_id";

	/**
	 * Redis无效用户名（一般是不存在的用户名）的Set名称
	 */
	public static final String REDIS_INVALID_USER_TABLE_NAME = "invalid_username";

	/**
	 * Redis无效邮箱（一般是不存在的邮箱）的Set名称
	 */
	public static final String REDIS_INVALID_EMAIL_TABLE_NAME = "invalid_email";

}