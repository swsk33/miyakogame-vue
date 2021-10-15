import {
	Position
} from '@/assets/js/constructors.js';

import {
	popUpMsg
} from '@/components/util/popupmsg.js';

import {
	showTip,
	tipType
} from '@/components/util/tip.js';

// vuex-游戏主控模块，包含游戏主控制和数据
export default {
	namespaced: true,
	state: {
		/**
		 * 当前游戏动态数据
		 */
		gameData: {
			level: 1,
			health: 3,
			highScore: 0,
			currentScore: 0,
			propsCount: [1],
			weaponCount: [-1]
		},
		/**
		 * 是否是新游戏
		 */
		isNewGame: false,
		/**
		 * 游戏域大小，需要在游戏组件挂载时设定
		 */
		gameArea: {
			width: 0,
			height: 0
		},
		/**
		 * 游戏控制计时器
		 */
		controls: {
			/**
			 * 布丁移动计时器
			 */
			puddingMove: undefined,
			/**
			 * 子弹飞行计时器
			 */
			bulletFly: undefined
		},
		/**
		 * 游戏是否处于暂停状态，true表示游戏正在运行没有暂停
		 */
		isProcessing: false,
		/**
		 * 是否在游戏外面（例如在主菜单、登录注册页而非正在游戏界面时，这个值为true）
		 */
		isOutOfGame: true
	},
	mutations: {
		/**
		 * 设定游戏主控，payload为一个对象，其中pudding、bullet属性都是计时器，分别表示循环调用所有布丁和子弹移动方法的计时器
		 */
		setControls(state, payload) {
			state.controls.puddingMove = payload.pudding;
			state.controls.bulletFly = payload.bullet;
		},
		/**
		 * 清除游戏主控计时器
		 */
		clearControls(state) {
			clearInterval(state.controls.puddingMove);
			clearInterval(state.controls.bulletFly);
		},
		/**
		 * 设定游戏域大小，payload中要有width属性表示游戏域宽度，height属性表示游戏域高度
		 */
		setGameArea(state, payload) {
			state.gameArea = payload;
		},
		/**
		 * 设定游戏动态数据，payload中有两个属性：name表示要设定的gameData对象中的属性名，value表示要设定的值
		 */
		setGameData(state, payload) {
			state.gameData[payload.name] = payload.value;
		},
		/**
		 * 设定整体游戏数据，payload表示游戏数据gameData对象
		 */
		setTotalData(state, payload) {
			state.gameData = payload;
		},
		/**
		 * 设定是否是新游戏，payload为布尔值，true表示设定为新游戏
		 */
		setNewGame(state, payload) {
			state.isNewGame = payload;
		},
		/**
		 * 设定游戏是否处于暂停状态，payload为布尔值，true表示游戏正在运行没有暂停
		 */
		setGameProcessing(state, payload) {
			state.isProcessing = payload;
		},
		/**
		 * 设定是否在游戏外面，payload为一个布尔值，true表示在游戏外
		 */
		setOutOfGame(state, payload) {
			state.isOutOfGame = payload;
		}
	},
	actions: {
		/**
		 * 启动游戏进程
		 */
		startGameProcess(context) {
			let args = {
				pudding: setInterval(() => {
					context.dispatch('pudding/moveAllPuddings', null, {
						root: true
					});
				}, 100),
				bullet: setInterval(() => {
					context.dispatch('weapon/flyAllBullet', null, {
						root: true
					});
				}, 16)
			}
			context.commit('setControls', args);
			context.commit('setGameProcessing', true);
			new Audio(require('@/assets/audio/start.mp3')).play();
		},
		/**
		 * 停止游戏进程
		 */
		stopGameProcess(context) {
			context.commit('clearControls', args);
			context.commit('setGameProcessing', false);
		},
		/**
		 * 读取游戏数据，如果用户登录，则获取云端数据，否则获取本地数据，需要在组件挂载时调用一次
		 */
		readGameData(context) {
			let getData = localStorage.getItem('gameData');
			if (getData == null) {
				context.commit('setNewGame', true);
				// 初始化基本数据
				getData = {
					level: 1,
					health: 3,
					highScore: 0,
					currentScore: 0,
					propsCount: [],
					weaponCount: [-1]
				}
				// 初始化武器道具数量
				const getWeapons = context.rootState.weapon.weaponList;
				for (let i = 1; i < getWeapons.length; i++) {
					getData.weaponCount.push(10);
				}
				// 初始化道具数量
				const getProps = null;
			} else {
				getData = JSON.parse(getData);
				context.commit('setNewGame', false);
			}
			// 执行提交数据
			context.commit('setTotalData', getData);
			if (context.state.isNewGame) {
				// 保存数据
				context.dispatch('saveData');
			}
		},
		/**
		 * 保存游戏数据，如果用户登录，则同时保存一份到云端
		 */
		saveData(context) {
			localStorage.setItem('gameData', JSON.stringify(context.state.gameData));
			showTip('游戏数据已保存！', tipType.info, true);
		},
		/**
		 * 重置全部游戏数据（但不清除最高分）
		 */
		resetAllData(context) {
			let highScore = context.state.gameData.highScore;
			localStorage.clear();
			context.dispatch('readGameData');
			context.commit('setGameData', {
				name: 'highScore',
				value: highScore
			});
		},
		/**
		 * 加分，payload为一个整数表示要加的分的值
		 */
		addScore(context, payload) {
			const currentScore = context.state.gameData.currentScore;
			const highScore = context.state.gameData.highScore;
			let currentModify = {
				name: 'currentScore',
				value: currentScore + payload
			}
			context.commit('setGameData', currentModify);
			if (currentModify.value > highScore) {
				let highModify = {
					name: 'highScore',
					value: currentModify.value
				};
				context.commit('setGameData', highModify);
			}
		},
		/**
		 * 生命值-1
		 */
		healthDown(context) {
			let health = context.state.gameData.health;
			new Audio(require('@/assets/audio/score/healthdown.mp3')).play();
			const miyakoPosition = context.rootState.miyako.miyako.getPosition();
			const miyakoSize = context.rootState.miyako.miyako.getSize();
			popUpMsg('生命值 -1', new Position(miyakoPosition.x + miyakoSize.width, miyakoPosition.y + 65));
			if (health > 0) {
				context.commit('setGameData', {
					name: 'health',
					value: health - 1
				});
			} else {
				// 显示失败页，重设游戏进度
			}
		}
	}
}