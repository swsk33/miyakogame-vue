package fun.swsk33site.miyakogame.api;

import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.param.ValidationGroup;
import fun.swsk33site.miyakogame.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.security.Principal;

@RestController
@RequestMapping("/api/player")
public class PlayerAPI {

	@Autowired
	private PlayerService playerService;

	@PostMapping("/register")
	public Result register(@RequestBody @Validated(ValidationGroup.PlayerRegister.class) Player player, BindingResult errors) {
		Result result;
		if (errors.hasErrors()) {
			result = new Result();
			result.setResultFailed(errors.getFieldError().getDefaultMessage());
			return result;
		}
		result = playerService.register(player);
		return result;
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/delete/id/{id}/code/{code}")
	public Result delete(@PathVariable("id") Integer id, @PathVariable("code") Integer code) throws MessagingException {
		return playerService.delete(id, code);
	}

	@RequestMapping(method = RequestMethod.PATCH, value = "/update")
	public Result update(@RequestBody @Validated(ValidationGroup.PlayerUpdate.class) Player player, BindingResult errors, Principal principal) throws Exception {
		Result result;
		if (errors.hasErrors()) {
			result = new Result();
			result.setResultFailed(errors.getFieldError().getDefaultMessage());
			return result;
		}
		// 校验登录用户和当前被修改用户是否一致
		if (principal.getName().equals(player.getUsername())) {
			result = new Result();
			result.setResultFailed("被修改用户和当前登录用户不一致！终止！");
			return result;
		}
		result = playerService.update(player);
		return result;
	}

	@RequestMapping(method = RequestMethod.PATCH, value = "/reset/code/{code}")
	public Result resetPassword(@RequestBody @Validated(ValidationGroup.PlayerPasswordReset.class) Player player, @PathVariable("code") Integer code, BindingResult errors) throws MessagingException {
		return playerService.resetPassword(player, code);
	}

}