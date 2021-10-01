package fun.swsk33site.miyakogame.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import fun.swsk33site.miyakogame.model.Result;

@Service
public interface AvatarService {

	/**
	 * 上传头像
	 */
	Result<String> upload(MultipartFile file);

}