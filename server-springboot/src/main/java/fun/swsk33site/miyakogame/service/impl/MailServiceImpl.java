package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.cache.MailCodeCache;
import fun.swsk33site.miyakogame.cache.PlayerCache;
import fun.swsk33site.miyakogame.dao.PlayerDAO;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.MailServiceType;
import fun.swsk33site.miyakogame.service.MailService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.annotation.PostConstruct;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.concurrent.TimeUnit;

@Component
public class MailServiceImpl implements MailService {

	@Value("${spring.mail.username}")
	private String sender;

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private TemplateEngine templateEngine;

	@Autowired
	private PlayerCache playerCache;

	@Autowired
	private MailCodeCache mailCodeCache;

	@Autowired
	private PlayerDAO playerDAO;

	@Override
	public void sendHtmlNotifyMail(String email, String title, String content) throws MessagingException {
		// 通过Context对象构建模板中变量需要的值
		Context context = new Context();
		context.setVariable("title", title);
		context.setVariable("content", content);
		// 传入变量渲染模板
		String mimeString = templateEngine.process("miyakomailtemplate.html", context);
		// 创建富文本信息对象
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		helper.setFrom(sender);
		helper.setTo(email);
		helper.setSubject(title);
		// 给helper设置内容为我们渲染的模板内容，第二个参数为true表示内容是html格式
		helper.setText(mimeString, true);
		new Thread(() -> {
			try {
				mailSender.send(message);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}).start();
	}

	@Override
	public Result sendCode(Integer userId, MailServiceType type) throws MessagingException {
		Result result = new Result();
		if (userId == null) {
			result.setResultFailed("用户id不能为空！");
			return result;
		}
		// 先去查找用户得到用户邮箱
		Player getPlayer = playerCache.getById(userId);
		if (getPlayer == null) {
			try {
				getPlayer = playerDAO.findById(userId);
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				result.setResultFailed("找不到指定用户以发送邮件验证码！");
				return result;
			}
			playerCache.addOrSet(getPlayer);
		}
		// 找到用户，生成验证码
		int generateCode = mailCodeCache.generateCodeToCache(getPlayer.getId(), type);
		// 设置消息内容
		String serviceName;
		String serviceDescription;
		switch (type) {
			case PASSWORD_RESET:
				serviceName = "密码重置";
				serviceDescription = "您的密码重置验证码为：";
				break;
			case USER_DELETE:
				serviceName = "用户注销";
				serviceDescription = "您的用户注销验证码为：";
				break;
			default:
				serviceName = "";
				serviceDescription = "";
				break;
		}
		sendHtmlNotifyMail(getPlayer.getEmail(), "宫子恰布丁-" + serviceName, serviceDescription + generateCode + "，请在5分钟内完成验证。");
		result.setResultSuccess("发送验证码成功！");
		return result;
	}

}