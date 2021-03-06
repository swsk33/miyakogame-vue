// vuex-加载主控制
export default {
	namespaced: true,
	state: {
		process: 0,
		imageCount: 0,
		audioCount: 0,
		complete: false
	},
	mutations: {
		setProcess(state, payload) {
			state.process = payload;
		},
		setMessage(state, payload) {
			state.message = payload;
		},
		setImageCount(state, payload) {
			state.imageCount = payload;
		},
		setAudioCount(state, payload) {
			state.audioCount = payload;
		},
		setComplete(state, payload) {
			state.complete = payload;
		}
	},
	actions: {
		/**
		 * 检查总进度，一些加载完成后需要初始化的函数需要在这里加载完成后执行
		 */
		async checkTotalProcess(context) {
			let imageLoaded = 0;
			let audioLoaded = 0;
			let checkInterval = setInterval(async () => {
				imageLoaded = await context.dispatch('image/getLoaded', null, {
					root: true
				});
				audioLoaded = await context.dispatch('audio/getLoaded', null, {
					root: true
				});
				// 进行计算显示进度
				let process = (imageLoaded / context.state.imageCount) * 50 + (audioLoaded / context.state.audioCount) * 50;
				context.commit('setProcess', process.toFixed(2));
				// 加载完成之后
				if (imageLoaded == context.state.imageCount && audioLoaded == context.state.audioCount) {
					// 设置加载完成
					context.commit('setComplete', true);
					// 替换图片资源为require形式
					await context.commit('image/setImageResource', 'imageList', {
						root: true
					});
					// 装载武器和道具
					await context.dispatch('weapon/initializeWeapon', null, {
						root: true
					});
					await context.dispatch('prop/initializeProps', null, {
						root: true
					});
					// 先判断用户是否登录
					await context.dispatch('userdata/checkUserLogin', null, {
						root: true
					});
					// 再读取本地数据
					await context.dispatch('userdata/readGameData', null, {
						root: true
					});
					clearInterval(checkInterval);
				}
			}, 100);
		},
		async loadAll(context) {
			// 加载之前先检测UA
			const userBrowserUA = window.navigator.userAgent;
			// 若为移动端，则显示不支持页面
			if (userBrowserUA.indexOf('Android') != -1 || userBrowserUA.indexOf('iPhone') != -1 || userBrowserUA.indexOf('iPad') != -1) {
				// 关闭所有页面
				context.commit('pagecontrol/setLoadingPage', false, {
					root: true
				});
				context.commit('pagecontrol/setMainMenuPage', false, {
					root: true
				});
				context.commit('pagecontrol/setNotSupportPage', true, {
					root: true
				});
				return;
			}
			// 否则，执行全部资源加载
			context.commit('setImageCount', await context.dispatch('image/getTotal', null, {
				root: true
			}));
			context.commit('setAudioCount', await context.dispatch('audio/getTotal', null, {
				root: true
			}));
			context.dispatch('audio/loadAllAudio', null, {
				root: true
			});
			context.dispatch('image/loadAllImage', null, {
				root: true
			});
			context.dispatch('checkTotalProcess');
		}
	}
}