package fun.swsk33site.miyakogame.dataobject;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * 排名信息
 */
@Getter
@Setter
@NoArgsConstructor
public class RankInfo implements Serializable {

	/**
	 * 用户id
	 */
	private int id;

	/**
	 * 用户昵称
	 */
	private String nickname;

	/**
	 * 用户头像
	 */
	private String avatar;

	/**
	 * 用户最高分
	 */
	private int highScore;

	/**
	 * 用户游戏数据
	 */
	private String gameData;

	/**
	 * 排名
	 */
	private Long sequence;

	/**
	 * 排名信息的有参构造器
	 *
	 * @param player   玩家对象
	 * @param sequence 名次
	 */
	public RankInfo(Player player, long sequence) {
		id = player.getId();
		nickname = player.getNickname();
		avatar = player.getAvatar();
		highScore = player.getHighScore();
		gameData = player.getGameData();
		this.sequence = sequence;
	}

}