package fun.swsk33site.miyakogame.param;

/**
 * 邮件服务类型，作为redis中储存的键，键名一般为：类型枚举_用户id，值为验证码
 */
public enum MailServiceType {
	/**
	 * 密码重置
	 */
	PASSWORD_RESET,
	/**
	 * 用户注销
	 */
	USER_DELETE
}