package fun.swsk33site.miyakogame.service;

import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.MailServiceType;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;

@Service
public interface MailService {

	/**
	 * 发送Html格式的富文本通知邮件，为异步发送
	 *
	 * @param email   收件人
	 * @param title   邮件标题
	 * @param content 邮件内容
	 */
	void sendHtmlNotifyMail(String email, String title, String content) throws MessagingException;

	/**
	 * 发送验证码
	 *
	 * @param userId 待操作用户id
	 * @param type   服务类型
	 */
	Result sendCode(Integer userId, MailServiceType type) throws MessagingException;

}