package fun.swsk33site.miyakogame.dataobject;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(value = {"password"}, allowSetters = true)
public class Player implements Serializable {

	/**
	 * 主键id
	 */
	private int id;

	/**
	 * 用户名
	 */
	@NotEmpty(message = "用户名不能为空！")
	@Size(max = 32, message = "用户名长度不能大于32！")
	private String username;

	/**
	 * 密码
	 */
	@NotEmpty(message = "密码不能为空！")
	@Size(min = 8, message = "密码至少要有8位长度！")
	private String password;

	/**
	 * 昵称
	 */
	@NotEmpty(message = "昵称不能为空！")
	@Size(max = 32, message = "昵称长度不能大于32！")
	private String nickname;

	/**
	 * 头像地址
	 */
	@NotEmpty(message = "头像地址不能为空！")
	private String avatar;

	/**
	 * 最高分
	 */
	private Integer highScore;


	/**
	 * 邮箱
	 */
	@NotEmpty(message = "邮箱不能为空！")
	@Email(message = "邮箱格式不正确！")
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