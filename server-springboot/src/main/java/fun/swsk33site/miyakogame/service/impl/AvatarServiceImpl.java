package fun.swsk33site.miyakogame.service.impl;

import java.io.File;
import java.util.Random;
import javax.annotation.PostConstruct;

import fun.swsk33site.miyakogame.param.CommonValue;
import fun.swsk33site.miyakogame.util.UUIDUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import fun.swsk33site.miyakogame.model.Result;
import fun.swsk33site.miyakogame.service.AvatarService;

@Component
public class AvatarServiceImpl implements AvatarService {

	/**
	 * 用户自定义头像存放位置
	 */
	private File imageDirectory = new File("resource" + File.separator + "avatar" + File.separator + "user").getAbsoluteFile();

	/**
	 * 静态资源路径
	 */
	@Value("${spring.mvc.static-path-pattern}")
	private String staticResourcePath;

	@PostConstruct
	public void fileInitialize() {
		// 获取头像的存放绝对路径
		CommonValue.AVATAR_PATH = imageDirectory.getPath();
		// 获取头像资源请求路径
		CommonValue.AVATAR_REQUEST_PATH = staticResourcePath.substring(0, staticResourcePath.indexOf("*")) + "avatar";
		if (!imageDirectory.exists()) {
			imageDirectory.mkdirs();
		}
	}

	@Override
	public Result<String> upload(MultipartFile file) {
		Result<String> result = new Result<>();
		if (file == null) {
			result.setResultFailed("请上传图片！");
			return result;
		}
		if (file.getSize() > 5242880) {
			result.setResultFailed("图片大小不能大于5MB！");
			return result;
		}
		String fileFormat = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
		if (!fileFormat.equals(".jpg") && !fileFormat.equals(".jpeg") && !fileFormat.equals(".png") && !fileFormat.equals(".bmp") && !fileFormat.equals(".gif")) {
			result.setResultFailed("图片格式必须是jpg、jpeg、png、bmp或者gif格式！");
			return result;
		}
		String fileName = UUIDUtils.generateTimeId() + fileFormat;
		try {
			file.transferTo(new File(imageDirectory.getPath() + File.separator + fileName));
		} catch (Exception e) {
			e.printStackTrace();
			result.setResultFailed("图片转存失败！请联系开发者！");
			return result;
		}
		String imageRequestPath = CommonValue.AVATAR_REQUEST_PATH + "/user/" + fileName;
		result.setResultSuccess("上传头像成功！", imageRequestPath);
		return result;
	}

	@Override
	public Result<String> getRandomAvatar() {
		// 获取默认文件夹中的头像名
		String[] imageFileNames = new File("resource" + File.separator + "avatar" + File.separator + "default").getAbsoluteFile().list();
		// 随机对象
		Random random = new Random();
		String getAvatar = CommonValue.AVATAR_REQUEST_PATH + "/default/" + imageFileNames[random.nextInt(imageFileNames.length)];
		Result<String> result = new Result<>();
		result.setResultSuccess("获取随机头像成功！", getAvatar);
		return result;
	}

}