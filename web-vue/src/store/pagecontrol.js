import random from '@/assets/js/random.js';

// vuex-页面显隐控制模块
export default {
	namespaced: true,
	state: {
		/**
		 * 显示加载页
		 */
		loading: true,
		/**
		 * 显示主菜单
		 */
		mainMenu: true,
		/**
		 * 显示帮助页
		 */
		help: false,
		/**
		 * 成功页面
		 */
		success: false,
		/**
		 * 失败页面
		 */
		failed: false
	},
	mutations: {
		/**
		 * 设置加载页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setLoadingPage(state, payload) {
			state.loading = payload;
		},
		/**
		 * 设置主菜单页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setMainMenuPage(state, payload) {
			state.mainMenu = payload;
		},
		/**
		 * 设置帮助页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setHelpPage(state, payload) {
			state.help = payload;
		},
		/**
		 * 设置成功页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setSuccessPage(state, payload) {
			state.success = payload;
		},
		/**
		 * 设置失败页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setFailedPage(state, payload) {
			state.failed = payload;
		}
	},
	actions: {
		/**
		 * 设置加载页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setLoadingPage(context, payload) {
			context.commit('setLoadingPage', payload);
		},
		/**
		 * 设置主菜单页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setMainMenuPage(context, payload) {
			context.commit('setMainMenuPage', payload);
			// 显示主菜单页面，则同时设定已经位于游戏外
			if (payload) {
				context.commit('gamingcontrol/setOutOfGame', true, {
					root: true
				});
				// 与此同时，再次读取游戏数据，更新按钮状态
				context.dispatch('userdata/readGameData', null, {
					root: true
				});
				// 设置游戏进程为停止状态
				context.dispatch('gamingcontrol/stopGameProcess', null, {
					root: true
				});
			} else {
				context.commit('gamingcontrol/setOutOfGame', false, {
					root: true
				});
				// 开启游戏进程
				context.dispatch('gamingcontrol/startGameProcess', null, {
					root: true
				});
				// 重置布丁、清除屏幕上子弹
				context.commit('weapon/clearBullets', null, {
					root: true
				});
				context.dispatch('pudding/resetPuddings', null, {
					root: true
				});
			}
		},
		/**
		 * 设置帮助页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setHelpPage(context, payload) {
			context.commit('setHelpPage', payload);
		},
		/**
		 * 设置成功页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setSuccessPage(context, payload) {
			context.commit('setSuccessPage', payload);
			// 显示成功页面，则同时进行一些关联操作
			if (payload) {
				new Audio(require('@/assets/audio/succeed/s' + random.generateRandom(1, 2) + '.mp3')).play();
				context.commit('gamingcontrol/setOutOfGame', true, {
					root: true
				});
				// 停止游戏进程
				context.dispatch('gamingcontrol/stopGameProcess', null, {
					root: true
				});
				// 执行关卡数增加
				context.dispatch('userdata/levelAdd', null, {
					root: true
				});
			} else {
				context.commit('gamingcontrol/setOutOfGame', false, {
					root: true
				});
				// 开启游戏进程
				context.dispatch('gamingcontrol/startGameProcess', null, {
					root: true
				});
				// 重置布丁、清除屏幕上子弹
				context.commit('weapon/clearBullets', null, {
					root: true
				});
				context.dispatch('pudding/resetPuddings', null, {
					root: true
				});
			}
		},
		/**
		 * 设置失败页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setFailedPage(context, payload) {
			context.commit('setFailedPage', payload);
			// 显示失败页面，则同时执行一些关联操作
			if (payload) {
				context.commit('gamingcontrol/setOutOfGame', true, {
					root: true
				});
				// 停止游戏进程
				context.dispatch('gamingcontrol/stopGameProcess', null, {
					root: true
				});
				// 重置数据
				context.dispatch('userdata/resetAllData', null, {
					root: true
				});
			} else {
				context.commit('gamingcontrol/setOutOfGame', false, {
					root: true
				});
				// 开启游戏进程
				context.dispatch('gamingcontrol/startGameProcess', null, {
					root: true
				});
				// 重置布丁、清除屏幕上子弹
				context.commit('weapon/clearBullets', null, {
					root: true
				});
				context.dispatch('pudding/resetPuddings', null, {
					root: true
				});
			}
		}
	}
}