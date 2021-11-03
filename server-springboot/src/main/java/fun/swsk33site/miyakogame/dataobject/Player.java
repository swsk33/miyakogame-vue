package fun.swsk33site.miyakogame.dataobject;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fun.swsk33site.miyakogame.param.ValidationGroup;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.*;
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
	@NotNull(groups = {ValidationGroup.PlayerUpdate.class, ValidationGroup.PlayerPasswordReset.class}, message = "id不能为空！")
	private int id;

	/**
	 * 用户名
	 */
	@NotEmpty(groups = {ValidationGroup.PlayerRegister.class, ValidationGroup.PlayerUpdate.class}, message = "用户名不能为空！")
	@Size(groups = ValidationGroup.PlayerRegister.class, max = 32, message = "用户名长度不能大于32！")
	@Pattern(regexp = "^[\\u4E00-\\u9FA5A-Za-z0-9_]+$", message = "用户名只能是由中文、英文、数字或者下划线组成！", groups = {ValidationGroup.PlayerRegister.class, ValidationGroup.PlayerUpdate.class})
	private String username;

	/**
	 * 密码
	 */
	@NotEmpty(groups = {ValidationGroup.PlayerRegister.class, ValidationGroup.PlayerPasswordReset.class}, message = "密码不能为空！")
	private String password;

	/**
	 * 昵称
	 */
	@Size(groups = ValidationGroup.PlayerUpdate.class, max = 32, message = "昵称长度不能大于32！")
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
	 * 邮箱
	 */
	@NotEmpty(groups = ValidationGroup.PlayerRegister.class, message = "邮箱不能为空！")
	@Email(groups = {ValidationGroup.PlayerRegister.class, ValidationGroup.PlayerUpdate.class}, message = "邮箱格式不正确！")
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