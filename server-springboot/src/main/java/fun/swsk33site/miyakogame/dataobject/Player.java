package fun.swsk33site.miyakogame.dataobject;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(value = {"pwd"}, allowSetters = true)
public class Player implements Serializable {

	/**
	 * 主键id
	 */
	private int id;

	/**
	 * 用户名
	 */
	private String userName;

	/**
	 * 昵称
	 */
	private String nickname;

	/**
	 * 头像地址
	 */
	private String avatar;

	/**
	 * 最高分
	 */
	private Integer highScore;

	/**
	 * 密码
	 */
	private String pwd;

	/**
	 * 邮箱
	 */
	private String email;

	/**
	 * 游戏数据
	 */
	private String gameData;

	/**
	 * 创建时间
	 */
	private LocalDateTime gmtCreated;

	/**
	 * 修改时间
	 */
	private LocalDateTime gmtModified;

}