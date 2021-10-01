package fun.swsk33site.miyakogame.api;

import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.CommonValue;
import fun.swsk33site.miyakogame.param.MailServiceType;
import fun.swsk33site.miyakogame.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(CommonValue.API_PREFIX + "mail")
public class EmailAPI {

	@Autowired
	private MailService mailService;

	@GetMapping("/sendcode")
	public Result sendCode(@RequestParam("id") int id, @RequestParam("email") String email, @RequestParam("type") String type) {
		return mailService.sendCode(email, id, MailServiceType.valueOf(type));
	}

}