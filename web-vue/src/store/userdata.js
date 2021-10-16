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

import random from '@/assets/js/random.js';

// vuex-游戏本地数据和云端数据管理模块
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
	},
	mutations: {
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
	},
	actions: {
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
				// 退出游戏进程
				context.dispatch('gamingcontrol/exitGame', null, {
					root: true
				});
				// 播放失败音频
				new Audio(require('@/assets/audio/failed/f' + random.generateRandom(1, 3) + '.mp3')).play();
				// 重置游戏数据
				context.dispatch('resetAllData');
				// 显示失败页面
				context.commit('pagecontrol/setFailedPage', true, {
					root: true
				});
			}
		},
		/**
		 * 关卡数增加，每过一关，会奖励一定分数，值为当前关卡*10
		 */
		levelAdd(context) {
			const level = context.state.gameData.level;
			context.commit('setGameData', {
				name: 'level',
				value: level + 1
			});
			// 分数奖励
			context.dispatch('addScore', level * 10);
			// 每次过关保存数据
			context.dispatch('saveData');
		}
	}
}