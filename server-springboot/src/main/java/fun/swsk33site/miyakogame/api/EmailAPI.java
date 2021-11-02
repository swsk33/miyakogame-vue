package fun.swsk33site.miyakogame.api;

import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.MailServiceType;
import fun.swsk33site.miyakogame.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;

@RestController
@RequestMapping("/api/email")
public class EmailAPI {

	@Autowired
	private MailService mailService;

	@GetMapping("/reset/{id}")
	public Result sendPasswordResetCode(@PathVariable("id") Integer id) throws MessagingException {
		return mailService.sendCode(id, MailServiceType.PASSWORD_RESET);
	}

	@GetMapping("/delete/{id}")
	public Result sendUserDeleteCode(@PathVariable("id") Integer id) throws MessagingException {
		return mailService.sendCode(id, MailServiceType.USER_DELETE);
	}

}