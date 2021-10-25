package fun.swsk33site.miyakogame.api;

import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.service.AvatarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/avatar")
public class AvatarAPI {

	@Autowired
	private AvatarService avatarService;

	@RequestMapping(value = "/upload", method = RequestMethod.PUT)
	public Result<String> upload(@RequestParam("image") MultipartFile file) {
		return avatarService.upload(file);
	}

	@GetMapping("/random")
	public Result<String> getRandom() {
		return avatarService.getRandomAvatar();
	}

}