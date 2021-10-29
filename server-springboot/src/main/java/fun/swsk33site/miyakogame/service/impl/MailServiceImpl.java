package fun.swsk33site.miyakogame.service.impl;

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
	private RedisTemplate redisTemplate;

	@PostConstruct
	public void send() throws Exception {
		sendHtmlNotifyMail("yanhanhui2001a@163.com", "宫子恰布丁", "少时诵诗书所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所");
	}

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
	public Result sendCode(String email, Integer userId, MailServiceType type) throws MessagingException {
		Result result = new Result();
		if (userId == null || StringUtils.isEmpty(email)) {
			result.setResultFailed("用户id或者邮箱不能为空！");
			return result;
		}
		int generateCode = (int) ((Math.random() * 9 + 1) * 100000);
		redisTemplate.opsForValue().set(type.toString() + "_" + userId, generateCode, 5, TimeUnit.MINUTES);
		String serviceName;
		String serviceDes;
		switch (type) {
			case PASSWORD_RESET:
				serviceName = "密码重置";
				serviceDes = "您的密码重置验证码为：";
				break;
			case USER_DELETE:
				serviceName = "用户注销";
				serviceDes = "您的用户注销验证码为：";
				break;
			default:
				serviceName = "";
				serviceDes = "";
				break;
		}
		sendHtmlNotifyMail(email, "宫子恰布丁-" + serviceName, serviceDes + generateCode + "，请在5分钟内完成验证。");
		result.setResultSuccess("发送验证码成功！", null);
		return result;
	}

}