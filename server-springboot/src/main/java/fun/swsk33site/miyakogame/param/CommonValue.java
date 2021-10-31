package fun.swsk33site.miyakogame.param;

/**
 * 常用值存放
 */
public class CommonValue {

	/**
	 * 玩家自定义头像存放路径
	 */
	public static String AVATAR_USER_PATH;

	/**
	 * 用户头像请求路径
	 */
	public static String AVATAR_REQUEST_PATH;

	/**
	 * Redis排名表zSet的名称，表中的key为用户名，值为最高分
	 */
	public static final String REDIS_RANK_TABLE_NAME = "rank_info";

	/**
	 * Redis无效用户名（一般是不存在的用户名）的Set名称
	 */
	public static final String REDIS_INVALID_USER_TABLE_NAME = "invalid_username";

	/**
	 * Redis无效邮箱（一般是不存在的邮箱）的Set名称
	 */
	public static final String REDIS_INVALID_EMAIL_TABLE_NAME = "invalid_email";

}