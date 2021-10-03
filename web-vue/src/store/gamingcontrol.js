import {
	Position,
	Size,
	GameEntity
} from '@/assets/js/constructors.js';

/**
 * 布丁（敌人）对象构造函数，继承GameEntity
 * @param {Number} score 分值
 */
function Pudding(score) {
	let position = new Position(0, 0);
	let size = new Size(60, 60);
	GameEntity.call(this, position, size);
	/**
	 * 布丁的分值
	 */
	this.score = score;
	/**
	 * 是否被吃掉
	 */
	this.isEaten = false;
}

/**
 * 角色（宫子）构造对象，继承GameEntity
 * @param {Number} health 生命值
 * @param {Number} speed 移速
 * @param {Position} position 角色位置 
 * @param {Size} size 角色尺寸
 */
function Character(health, speed, position, size) {
	GameEntity.call(this, position, size);
	/**
	 * 生命值
	 */
	this.health = health;
	/**
	 * 移动速度
	 */
	this.speed = speed;
}

/**
 * 初始化布丁
 * @returns 已初始化完成的布丁对象二维数组
 */
function initializePuddings() {
	let puddings = [];
	for (let i = 0; i < 4; i++) {
		let column = [];
		for (let j = 0; j < 8; j++) {
			let score;
			if (i <= 1) {
				score = 1;
			} else if (i == 2) {
				score = 2;
			} else {
				score = 3;
			}
			let pudding = new Pudding(score);
			column.push(pudding);
		}
		puddings.push(column);
	}
	return puddings;
}

// 游戏主控制
export default {
	namespaced: true,
	state: {
		/**
		 * 表示宫子对象
		 */
		miyako: undefined,
		/**
		 * 表示所有布丁对象，二维数组，第一个参数为列数，第二个参数为行数，从0开始算
		 */
		puddings: initializePuddings(),
		/**
		 * 游戏域大小，需要在游戏组件挂载时设定
		 */
		gameArea: {
			width: 0,
			height: 0
		}
	},
	mutations: {
		/**
		 * 设定游戏域大小
		 */
		setGameArea(state, payload) {
			state.gameArea = payload;
		},
		/**
		 * 重置布丁的位置，第一次需要在在组件挂载时调用
		 */
		resetPuddingsPosition(state) {
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 8; j++) {
					let x = state.gameArea.width - 270 + i * 70;
					let y = j * 65;
					let position = new Position(x, y);
					state.puddings[i][j].changePosition(position);
				}
			}
		},
	},
	actions: {
		/**
		 * 设定游戏域大小，payload中要有width属性表示游戏域宽度，height属性表示游戏域高度
		 */
		setGameArea(context, payload) {
			context.commit('setGameArea', payload);
		},
		/**
		 * 重置布丁的位置，第一次需要在在组件挂载时调用
		 */
		resetPuddingsPosition(context) {
			context.commit('resetPuddingsPosition');
		}
	}
}