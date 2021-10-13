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
		checkTotalProcess(context) {
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
				if (imageLoaded == context.state.imageCount && audioLoaded == context.state.audioCount) {
					context.commit('setComplete', true);
					context.commit('audio/releaseAll', null, {
						root: true
					});
					context.commit('image/releaseAll', null, {
						root: true
					});
					clearInterval(checkInterval);
				}
			}, 100);
		},
		async loadAll(context) {
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