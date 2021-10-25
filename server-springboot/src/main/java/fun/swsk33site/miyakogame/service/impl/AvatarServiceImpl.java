package fun.swsk33site.miyakogame.service.impl;

import java.io.File;
import javax.annotation.PostConstruct;

import fun.swsk33site.miyakogame.param.CommonValue;
import fun.swsk33site.miyakogame.util.UUIDUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.service.AvatarService;

@Component
public class AvatarServiceImpl implements AvatarService {

	private File imagePath = new File("resources" + File.separator + "avatars" + File.separator + "user");

	@PostConstruct
	public void fileInitialize() {
		CommonValue.AVATAR_PATH = imagePath.getAbsolutePath();
		if (!imagePath.exists()) {
			imagePath.mkdirs();
		}
	}

	@Override
	public Result<String> upload(MultipartFile file) {
		Result<String> result = new Result<>();
		if (file == null) {
			result.setResultFailed("请上传图片！");
			return result;
		}
		String fileFormat = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
		String fileName = UUIDUtils.generateTimeId() + fileFormat;
		try {
			file.transferTo(new File(imagePath.getAbsolutePath() + File.separator + fileName));
		} catch (Exception e) {
			e.printStackTrace();
			result.setResultFailed("图片转存失败！");
			return result;
		}
		String imgRequestPath = "/avatars/users/" + fileName;
		result.setResultSuccess("上传头像成功！", imgRequestPath);
		return result;
	}

}