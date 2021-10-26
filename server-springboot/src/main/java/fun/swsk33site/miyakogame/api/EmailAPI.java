package fun.swsk33site.miyakogame.api;

import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.MailServiceType;
import fun.swsk33site.miyakogame.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;

@RestController
@RequestMapping("/api/email")
public class EmailAPI {

	@Autowired
	private MailService mailService;

	@GetMapping("/sendcode/id/{id}/email/{email}/type/{type}")
	public Result sendCode(@PathVariable("id") int id, @PathVariable("email") String email, @PathVariable("type") String type) throws MessagingException {
		return mailService.sendCode(email, id, MailServiceType.valueOf(type));
	}

}