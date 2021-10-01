package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.service.MailService;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.MailServiceType;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class MailServiceImpl implements MailService {

	@Value("${spring.mail.username}")
	private String sender;

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private RedisTemplate<Object, Object> redisTemplate;

	@Override
	public void sendNotifyMail(String email, String title, String text) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(sender);
		message.setTo(email);
		message.setSubject(title);
		message.setText(text);
		new Thread(() -> {
			try {
				mailSender.send(message);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}).start();
	}

	@Override
	public Result sendCode(String email, Integer userId, MailServiceType type) {
		Result result = new Result();
		if (userId == null || StringUtils.isEmpty(email)) {
			result.setResultFailed("用户id或者邮箱不能为空！");
			return result;
		}
		int genCode = (int) ((Math.random() * 9 + 1) * 100000);
		redisTemplate.opsForValue().set(type.toString() + "_" + userId, genCode, 300, TimeUnit.SECONDS);
		String serviceName;
		String serviceDes;
		switch (type) {
			case PASSWORD_RESET:
				serviceName = "密码重置";
				serviceDes = "您的密码重置验证码为：";
				break;
			default:
				serviceName = "";
				serviceDes = "";
		}
		sendNotifyMail(email, "宫子恰布丁-" + serviceName, serviceDes + genCode + "，请在5分钟内完成验证。");
		result.setResultSuccess("发送验证码成功！", null);
		return result;
	}

}