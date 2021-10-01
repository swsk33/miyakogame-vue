package fun.swsk33site.miyakogame.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * 排名信息
 *
 * @author swsk33
 */
@Getter
@Setter
@NoArgsConstructor
public class RankInfo implements Serializable {

	/**
	 * 用户名id
	 */
	private int userId;

	/**
	 * 昵称
	 */
	private String nickname;

	/**
	 * 头像
	 */
	private String avatar;

	/**
	 * 最高分
	 */
	private int highScore;

	/**
	 * 排名
	 */
	private Long sequence;

}