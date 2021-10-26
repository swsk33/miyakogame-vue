package fun.swsk33site.miyakogame.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * 请求结果类型
 */
@Getter
@Setter
@NoArgsConstructor
public class Result<T> implements Serializable {

	/**
	 * 是否成功
	 */
	private boolean success;

	/**
	 * 消息
	 */
	private String message;

	/**
	 * 数据体
	 */
	private T data;

	/**
	 * 设定成功结果
	 *
	 * @param msg 消息
	 */
	public void setResultSuccess(String msg) {
		this.success = true;
		this.message = msg;
		this.data = null;
	}

	/**
	 * 设定成功结果
	 *
	 * @param msg  消息
	 * @param data 数据体
	 */
	public void setResultSuccess(String msg, T data) {
		this.success = true;
		this.message = msg;
		this.data = data;
	}

	/**
	 * 设定失败结果
	 *
	 * @param msg 消息
	 */
	public void setResultFailed(String msg) {
		this.success = false;
		this.message = msg;
	}

}