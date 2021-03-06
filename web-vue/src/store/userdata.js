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
import axios from 'axios';

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
		 * 在线用户信息
		 */
		onlineUserData: {
			id: undefined,
			username: undefined,
			nickname: undefined,
			avatar: undefined,
			highScore: undefined,
			email: undefined,
			gameData: undefined
		},
		/**
		 * 是否是新游戏
		 */
		isNewGame: false,
		/**
		 * 用户是否登录
		 */
		isLogin: false
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
		/**
		 * 设定用户是否登录，payload为布尔值表示用户是否登录
		 */
		setUserLogin(state, payload) {
			state.isLogin = payload;
		},
		/**
		 * 设定在线用户数据，payload为获取的在线用户对象
		 */
		setOnlineUserData(state, payload) {
			state.onlineUserData = payload;
		}
	},
	actions: {
		/**
		 * 用户登录，payload为一个对象，里面要有credential属性表示登录凭据（用户名或者邮箱），password为密码
		 * @returns 是否登录成功
		 */
		async userLogin(context, payload) {
			try {
				const response = await axios({
					method: 'POST',
					url: '/api/player/login',
					data: payload
				});
				if (!response.data.success) {
					showTip('登录失败！' + response.data.message, tipType.error);
					return false;
				} else {
					showTip('登录成功！', tipType.info);
					// 获取用户信息
					await context.dispatch('checkUserLogin');
					// 重读数据
					await context.dispatch('readGameData');
					return true;
				}
			} catch (error) {
				showTip('登录失败！请检查网络！', tipType.error);
				return false;
			}
		},
		/**
		 * 检测用户是否登录
		 */
		async checkUserLogin(context) {
			try {
				const response = await axios.get('/api/player/islogin');
				if (!response.data.success) {
					context.commit('setUserLogin', false);
				} else {
					// 设定为已登录
					context.commit('setUserLogin', true);
					// 把在线的用户信息设定为游戏数据
					context.commit('setOnlineUserData', response.data.data);
				}
			} catch (error) {
				context.commit('setUserLogin', false);
			}
		},
		/**
		 * 用户退出登录
		 */
		async userLogout(context) {
			try {
				const response = await axios.get('/api/player/logout');
				if (!response.data.success) {
					showTip('退出登录失败！', tipType.error);
				} else {
					showTip('退出登录成功！', tipType.info);
					// 设定用户未登录
					context.commit('setUserLogin', false);
					context.commit('setOnlineUserData', undefined);
				}
			} catch (error) {
				showTip('退出登录失败！', tipType.error);
			}
		},
		/**
		 * 读取游戏数据，如果用户登录，则获取云端数据，否则获取本地数据，需要在组件挂载时调用一次
		 */
		readGameData(context) {
			let getData;
			// 如果用户已登录则获取云端数据，否则获取本地数据
			if (context.state.isLogin) {
				getData = context.state.onlineUserData.gameData;
			} else {
				getData = localStorage.getItem('gameData');
			}
			if (getData == null || getData === 'null') {
				context.commit('setNewGame', true);
				// 初始化基本数据
				getData = {
					level: 1,
					health: 3,
					highScore: 0,
					currentScore: 0,
					propsCount: [],
					weaponCount: []
				}
				// 初始化武器道具数量，价格为0的武器子弹无限（用-1表示）
				const getWeapons = context.rootState.weapon.weaponList;
				for (let i = 0; i < getWeapons.length; i++) {
					if (getWeapons[i].price == 0) {
						getData.weaponCount.push(-1);
					} else {
						getData.weaponCount.push(10);
					}
				}
				// 初始化道具数量
				const getProps = context.rootState.prop.propList;
				for (let i = 0; i < getProps.length; i++) {
					getData.propsCount.push(1);
				}
			} else {
				getData = JSON.parse(getData);
				// 检查本地储存和游戏道具数量是否有差异
				let weaponDiff = context.rootState.weapon.weaponList.length - getData.weaponCount.length;
				let propDiff = context.rootState.prop.propList.length - getData.propsCount.length;
				// 游戏中武器多于本地储存武器则补全，少于则删除
				if (weaponDiff > 0) {
					for (let i = 0; i < weaponDiff; i++) {
						if (context.rootState.weapon.weaponList[context.rootState.weapon.weaponList.length - weaponDiff + i].price == 0) {
							getData.weaponCount.push(-1);
						} else {
							getData.weaponCount.push(10);
						}
					}
				} else if (weaponDiff < 0) {
					const diff = -weaponDiff;
					getData.weaponCount.splice(context.rootState.weapon.weaponList.length, diff);
				}
				// 游戏中道具多于本地数量则补全，少于则删除
				if (propDiff > 0) {
					for (let i = 0; i < propDiff; i++) {
						getData.propsCount.push(1);
					}
				} else if (propDiff < 0) {
					const diff = -propDiff;
					getData.propsCount.splice(context.rootState.prop.propList.length, diff);
				}
				context.commit('setNewGame', false);
			}
			// 执行提交数据
			context.commit('setTotalData', getData);
			// 保存数据
			context.dispatch('saveData', false);
		},
		/**
		 * 保存游戏数据，如果用户登录，则同时保存一份到云端，payload为布尔值表示是否显示保存提示，默认true
		 */
		async saveData(context, payload = true) {
			localStorage.setItem('gameData', JSON.stringify(context.state.gameData));
			// 如果用户登录，则同时保存至云端
			if (context.state.isLogin) {
				// 组装数据
				const userData = {
					id: context.state.onlineUserData.id,
					username: context.state.onlineUserData.username,
					highScore: context.state.gameData.highScore,
					gameData: JSON.stringify(context.state.gameData)
				};
				try {
					const response = await axios({
						method: 'PATCH',
						url: '/api/player/update',
						data: userData
					});
					if (!response.data.success) {
						showTip('保存数据至云端失败！请检查网络或者是否登录！', tipType.error);
						return;
					}
					// 刷新在线用户信息缓存
					context.state.onlineUserData = response.data.data;
				} catch (error) {
					showTip('保存数据至云端失败！请检查网络或者是否登录！', tipType.error);
				}
			}
			if (payload) {
				showTip('游戏数据已保存！', tipType.info, true);
			}
		},
		/**
		 * 重置全部游戏数据（但不清除最高分）
		 */
		resetAllData(context) {
			let highScore = context.state.gameData.highScore;
			// 清空本地
			localStorage.clear();
			context.commit('setNewGame', true);
			// 初始化基本数据
			const newGameData = {
				level: 1,
				health: 3,
				highScore: highScore,
				currentScore: 0,
				propsCount: [],
				weaponCount: []
			}
			// 初始化武器道具数量，价格为0的武器子弹无限（用-1表示）
			const getWeapons = context.rootState.weapon.weaponList;
			for (let i = 0; i < getWeapons.length; i++) {
				if (getWeapons[i].price == 0) {
					newGameData.weaponCount.push(-1);
				} else {
					newGameData.weaponCount.push(10);
				}
			}
			// 初始化道具数量
			const getProps = context.rootState.prop.propList;
			for (let i = 0; i < getProps.length; i++) {
				newGameData.propsCount.push(1);
			}
			// 执行提交数据
			context.commit('setTotalData', newGameData);
			// 保存数据
			context.dispatch('saveData', false);
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
			context.rootState.audio.audioList.score.healthdown.play();
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
				context.rootState.audio.audioList.failed['f' + random.generateRandom(1, 3)].play();
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