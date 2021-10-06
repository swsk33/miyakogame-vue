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

// vuex-布丁
export default {
	namespaced: true,
	state: {
		/**
		 * 位于边界的布丁对象
		 */
		puddingAtBorder: {
			top: undefined,
			bottom: undefined
		},
		/**
		 * 表示所有布丁对象，二维数组，第一个参数为列数，第二个参数为行数，从0开始算
		 */
		puddings: initializePuddings(),
	},
	mutations: {
		/**
		 * 改变布丁的位置，payload指定要改变的布丁位于第几行第几列以及要设置的位置，要有三个属性，其中column表示列数，line表示行数，position表示改变后该布丁位置
		 */
		setPuddingPosition(state, payload) {
			let getPudding = state.puddings[payload.column][payload.line];
			getPudding.style.left = payload.position.x + 'px';
			getPudding.style.top = payload.position.y + 'px';
		},
		/**
		 * 设置布丁是否被吃，payload指定要改变的布丁位于第几行第几列以及是否被吃掉，要有三个属性，其中column表示列数，line表示行数，eaten是个布尔值，true是该布丁被吃了，并隐藏该布丁，否则标记其没有被吃，显示该布丁
		 */
		setPuddingEaten(state, payload) {
			let getPudding = state.puddings[payload.column][payload.line];
			getPudding.isEaten = payload.eaten;
			if (!getPudding.isEaten) {
				getPudding.style.display = 'block';
			} else {
				getPudding.style.display = 'none';
			}
		},
		/**
		 * 设定位于上下边界的布丁，payload中必须要有top和bottom属性，分别表示位于上、下边界的布丁对象
		 */
		setPuddingAtBorder(state, payload) {
			state.puddingAtBorder.top = payload.top;
			state.puddingAtBorder.bottom = payload.bottom;
		},
	},
	actions: {
		/**
		 * 扫描布丁矩阵，获取位于上边界和下边界的布丁
		 */
		scanPuddingsAtBorder(context) {
			let puddingsAtBorder = {
				top: undefined,
				bottom: undefined
			};
			let isBorderSet = false;
			// 上判定
			for (let line = 0; line < 8; line++) {
				for (let column = 0; column < 4; column++) {
					if (!context.state.puddings[column][line].isEaten) {
						puddingsAtBorder.top = context.state.puddings[column][line];
						isBorderSet = true;
						break;
					}
				}
				if (isBorderSet) {
					break;
				}
			}
			// 下判定
			isBorderSet = false;
			for (let line = 7; line >= 0; line--) {
				for (let column = 0; column < 4; column++) {
					if (!context.state.puddings[column][line].isEaten) {
						puddingsAtBorder.bottom = context.state.puddings[column][line];
						isBorderSet = true;
						break;
					}
				}
				if (isBorderSet) {
					break;
				}
			}
			context.commit('setPuddingAtBorder', puddingsAtBorder);
		},
		/**
		 * 移动一次所有的布丁，多次移动时，移动方向是：下->左->上->左->下...
		 */
		moveAllPuddings(context) {},
		/**
		 * 重置布丁，第一次需要在在组件挂载时调用
		 */
		resetPuddings(context) {
			let arg = {
				column: undefined,
				line: undefined,
				position: undefined,
				eaten: false
			}
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 8; j++) {
					let x = context.rootState.gamingcontrol.gameArea.width - 270 + i * 70;
					let y = j * 65;
					arg.position = new Position(x, y);
					arg.column = i;
					arg.line = j;
					context.commit('setPuddingPosition', arg);
					context.commit('setPuddingEaten', arg);
				}
			}
			context.dispatch('scanPuddingsAtBorder');
		},
	}
}