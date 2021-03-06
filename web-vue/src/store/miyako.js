import {
	Position,
	Size,
	GameEntity
} from '@/assets/js/constructors.js';

/**
 * 角色（宫子）构造对象，继承GameEntity
 * @param {Number} speed 移速
 * @param {Position} position 角色位置 
 * @param {Size} size 角色尺寸
 */
function Character(speed, position, size) {
	GameEntity.call(this, position, size);
	/**
	 * 移动速度
	 */
	this.speed = speed;
}

// vuex-宫子
export default {
	namespaced: true,
	state: {
		/**
		 * 表示宫子对象
		 */
		miyako: new Character(10, new Position(0, 0), new Size(110, 108)),
	},
	mutations: {
		/**
		 * 改变宫子的位置，payload为整数表示宫子的位置（宫子只能上下移动）
		 */
		setMiyakoPosition(state, payload) {
			state.miyako.style.top = payload + 'px';
		},
		/**
		 * 改变宫子的大小，payload为Size对象
		 */
		setMiyakoSize(state, payload) {
			state.miyako.style.width = payload.width + 'px';
			state.miyako.style.height = payload.height + 'px';
		},
		/**
		 * 改变宫子移速，payload为整数表示改变后宫子移速
		 */
		setMiyakoSpeed(state, payload) {
			state.miyako.speed = payload;
		}
	},
	actions: {
		/**
		 * 移动一次宫子，payload是一个布尔值，true表示向上移动，否则向下
		 */
		moveMiyako(context, payload) {
			const miyako = context.state.miyako;
			const position = miyako.getPosition();
			const size = miyako.getSize();
			if (payload) {
				if (position.y - miyako.speed < 0) {
					position.y = 0;
				} else {
					position.y = position.y - miyako.speed;
				}
			} else {
				if (position.y + size.height + miyako.speed > context.rootState.gamingcontrol.gameArea.height) {
					position.y = context.rootState.gamingcontrol.gameArea.height - size.height;
				} else {
					position.y = position.y + miyako.speed;
				}
			}
			context.commit('setMiyakoPosition', position.y);
		},
	}
}