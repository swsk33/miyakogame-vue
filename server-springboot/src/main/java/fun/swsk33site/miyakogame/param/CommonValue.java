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
	 * Redis中储存玩家对象实体的Hash名称，用于储存玩家信息
	 */
	public static final String REDIS_ID_TO_PLAYER_HASH = "id_player";

	/**
	 * Redis的用户名对id的Hash名称，用于辅助在Redis中利用用户名索引到用户对象
	 */
	public static final String REDIS_PLAYER_USERNAME_TO_ID_HASH = "username_id";

	/**
	 * Redis中邮箱对id的Hash名称，用于辅助Redis中利用邮箱索引到用户对象
	 */
	public static final String REDIS_PLAYER_EMAIL_TO_ID_HASH = "email_id";

	/**
	 * Redis排名表zSet的名称，表中的key为id，值为最高分
	 */
	public static final String REDIS_RANK_TABLE_NAME = "rank_info";

	/**
	 * Redis无效用户名（一般是不存在的用户名）的Set名称
	 */
	public static final String REDIS_INVALID_USERNAME_SET = "invalid_username";

	/**
	 * Redis无效邮箱（一般是不存在的邮箱）的Set名称
	 */
	public static final String REDIS_INVALID_EMAIL_SET = "invalid_email";

}