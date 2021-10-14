import {
	Position,
	Size,
	GameEntity
} from '@/assets/js/constructors.js';

import {
	popUpMsg
} from '../components/util/popupmsg.js';

/**
 * 布丁（敌人）对象构造函数，继承GameEntity
 * @param {Number} score 分值
 * @param {Number} column 这个布丁位于第几列
 * @param {Number} line 这个布丁位于第几行
 */
function Pudding(score, column, line) {
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
	/**
	 * 这个布丁所在列数
	 */
	this.column = column;
	/**
	 * 这个布丁所在行数
	 */
	this.line = line;
}

/**
 * 初始化布丁
 * @returns 已初始化完成的布丁对象二维数组
 */
function initializePuddings() {
	let puddings = [];
	for (let column = 0; column < 4; column++) {
		let puddingColumn = [];
		for (let line = 0; line < 8; line++) {
			let score;
			if (column <= 1) {
				score = 1;
			} else if (column == 2) {
				score = 2;
			} else {
				score = 3;
			}
			let pudding = new Pudding(score, column, line);
			puddingColumn.push(pudding);
		}
		puddings.push(puddingColumn);
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
		/**
		 * 布丁移动方向，true表示向上移动
		 */
		isUp: false
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
				getPudding.style.transform = 'scale(1) rotate(0deg)';
			} else {
				getPudding.style.transform = 'scale(0) rotate(90deg)';
				setTimeout(() => {
					getPudding.style.display = 'none';
				}, 500);
			}
		},
		/**
		 * 设定位于上下边界的布丁，payload中必须要有top和bottom属性，分别表示位于上、下边界的布丁对象
		 */
		setPuddingAtBorder(state, payload) {
			state.puddingAtBorder.top = payload.top;
			state.puddingAtBorder.bottom = payload.bottom;
		},
		/**
		 * 改变布丁的移动方向
		 */
		alterPuddingMove(state) {
			state.isUp = !state.isUp;
		}
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
			const puddings = context.state.puddings;
			// 上判定
			for (let line = 0; line < puddings[0].length; line++) {
				for (let column = 0; column < puddings.length; column++) {
					if (!puddings[column][line].isEaten) {
						puddingsAtBorder.top = puddings[column][line];
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
			for (let line = puddings[0].length - 1; line >= 0; line--) {
				for (let column = 0; column < puddings.length; column++) {
					if (!puddings[column][line].isEaten) {
						puddingsAtBorder.bottom = puddings[column][line];
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
		 * 检测布丁存活情况，如果全部布丁被吃掉则返回true
		 */
		checkPuddingLive(context) {
			const getPuddings = context.state.puddings;
			let isAllEaten = true;
			for (let i = 0; i < getPuddings.length; i++) {
				for (let j = 0; j < getPuddings[i].length; j++) {
					if (!getPuddings[i][j].isEaten) {
						isAllEaten = false;
						return isAllEaten;
					}
				}
			}
			return isAllEaten;
		},
		/**
		 * 移动一次所有的布丁，多次移动时，移动方向是：下->左->上->左->下...
		 */
		async moveAllPuddings(context) {
			/**
			 * 如果所有布丁被吃光了，进入下一关
			 */
			if (await context.dispatch('checkPuddingLive')) {
				return;
			}
			const rate = context.rootState.gamingcontrol.gameData.level * 2 + 1;
			const puddings = context.state.puddings;
			let eachPuddingPosition;
			const arg = {
				column: undefined,
				line: undefined,
				position: undefined
			}
			// 布丁正在上移时
			if (context.state.isUp) {
				// 获取上边界布丁位置
				const topPosition = context.state.puddingAtBorder.top.getPosition().y;
				// 快到上边界时，直接移动到上边界，并左移50px
				if (topPosition - rate < 0) {
					for (let column = 0; column < puddings.length; column++) {
						for (let line = 0; line < puddings[column].length; line++) {
							if (!puddings[column][line].isEaten) {
								eachPuddingPosition = puddings[column][line].getPosition();
								eachPuddingPosition.y = eachPuddingPosition.y - topPosition;
								eachPuddingPosition.x = eachPuddingPosition.x - 50;
								arg.column = column;
								arg.line = line;
								arg.position = eachPuddingPosition;
								context.commit('setPuddingPosition', arg);
							}
						}
					}
					// 改变方向
					context.commit('alterPuddingMove');
				} else { // 否则，正常向上移动
					for (let column = 0; column < puddings.length; column++) {
						for (let line = 0; line < puddings[column].length; line++) {
							if (!puddings[column][line].isEaten) {
								eachPuddingPosition = puddings[column][line].getPosition();
								eachPuddingPosition.y = eachPuddingPosition.y - rate;
								arg.column = column;
								arg.line = line;
								arg.position = eachPuddingPosition;
								context.commit('setPuddingPosition', arg);
							}
						}
					}
				}
			} else { // 正在下移时
				// 获取下边界布丁位置和大小
				const bottomPosition = context.state.puddingAtBorder.bottom.getPosition().y;
				const bottomPuddingHeight = context.state.puddingAtBorder.bottom.getSize().height;
				// 快到下边界时，直接移动到下边界，并左移50px
				if (bottomPosition + bottomPuddingHeight + rate > context.rootState.gamingcontrol.gameArea.height) {
					for (let column = 0; column < puddings.length; column++) {
						for (let line = 0; line < puddings[column].length; line++) {
							if (!puddings[column][line].isEaten) {
								const distance = context.rootState.gamingcontrol.gameArea.height - bottomPosition - bottomPuddingHeight;
								eachPuddingPosition = puddings[column][line].getPosition();
								eachPuddingPosition.y = eachPuddingPosition.y + distance;
								eachPuddingPosition.x = eachPuddingPosition.x - 50;
								arg.column = column;
								arg.line = line;
								arg.position = eachPuddingPosition;
								context.commit('setPuddingPosition', arg);
							}
						}
					}
					// 改变方向
					context.commit('alterPuddingMove');
				} else { // 否则，正常向下移动
					for (let column = 0; column < puddings.length; column++) {
						for (let line = 0; line < puddings[column].length; line++) {
							if (!puddings[column][line].isEaten) {
								eachPuddingPosition = puddings[column][line].getPosition();
								eachPuddingPosition.y = eachPuddingPosition.y + rate;
								arg.column = column;
								arg.line = line;
								arg.position = eachPuddingPosition;
								context.commit('setPuddingPosition', arg);
							}
						}
					}
				}
			}
			// 每移动一次，检测是否有布丁越界或者碰到了宫子
			context.dispatch('isPuddingOut');
		},
		/**
		 * 判断是否有布丁越界或者碰到了宫子
		 */
		isPuddingOut(context) {
			const puddings = context.state.puddings;
			let eachPudding;
			for (let column = 0; column < puddings.length; column++) {
				for (let line = 0; line < puddings[column].length; line++) {
					eachPudding = puddings[column][line];
					if (!eachPudding.isEaten) {
						if (eachPudding.getPosition().x <= 0 || eachPudding.isCollision(context.rootState.miyako.miyako)) {
							context.dispatch('resetPuddings');
							return;
						}
					}
				}
			}
		},
		/**
		 * 设定布丁被吃掉了，payload指定要改变的布丁位于第几行第几列以及是否被吃掉，要有两个属性，其中column表示列数，line表示行数
		 */
		setPuddingEaten(context, payload) {
			payload.eaten = true;
			context.commit('setPuddingEaten', payload);
			new Audio(require('@/assets/audio/score/score.mp3')).play();
			const getPudding = context.state.puddings[payload.column][payload.line];
			context.dispatch('gamingcontrol/addScore', getPudding.score, {
				root: true
			});
			popUpMsg('+' + getPudding.score, getPudding.getPosition());
		},
		/**
		 * 重置布丁，第一次需要在在组件挂载时调用
		 */
		resetPuddings(context) {
			const puddings = context.state.puddings;
			let arg = {
				column: undefined,
				line: undefined,
				position: undefined,
				eaten: false
			}
			for (let column = 0; column < puddings.length; column++) {
				for (let line = 0; line < puddings[column].length; line++) {
					let x = context.rootState.gamingcontrol.gameArea.width - 270 + column * 70;
					let y = line * 65;
					arg.position = new Position(x, y);
					arg.column = column;
					arg.line = line;
					context.commit('setPuddingPosition', arg);
					context.commit('setPuddingEaten', arg);
				}
			}
			context.dispatch('scanPuddingsAtBorder');
		},
	}
}