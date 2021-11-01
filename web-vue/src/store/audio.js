// vuex-音频资源模块
export default {
	namespaced: true,
	state: {
		audioList: {
			succeed: {
				s1: undefined,
				s2: undefined
			},
			failed: {
				f1: undefined,
				f2: undefined,
				f3: undefined
			},
			prop: {
				healthAdd: undefined,
				moveAdd: undefined,
				stopPuddings: undefined
			},
			score: {
				score: undefined,
				boom: undefined,
				healthdown: undefined
			},
			tip: {
				info: undefined,
				warn: undefined,
				error: undefined
			},
			weapon: {
				normal: undefined,
				penetrate: undefined,
				boom: undefined,
				scatter: undefined,
				bounceShoot: undefined,
				bounceReflect: undefined,
				trace: undefined
			},
			start: undefined
		}
	},
	mutations: {
		/**
		 * 加载音频
		 */
		loadAll(state) {
			loadAudioByObject('', state.audioList);
		},
		/**
		 * 递归加载音频，payload表示要加载的音频列表对象路径，加载根路径传入空字符串('')即可（例如要加载上述state中succeed中的s1，那么payload为：succeed/s1）。音频列表对象中属性和音频文件夹目录结构一致，每个表示音频文件的属性先要留空为undefined
		 */
		loadAudioList(state, payload) {
			// 处理路径字符串
			if (payload.indexOf('/') == 0) {
				payload = payload.substring(1, payload.length);
			}
			// 检索至音频列表对象中的指定属性
			let pathes;
			if (payload === '') {
				pathes = ['audioList'];
			} else {
				pathes = payload.split('/');
				pathes.unshift('audioList');
			}
			let audioObject = state;
			// 只索引到第n - 1个，也就是目标属性的的前一个，这样就可以引用到对象并修改其中的属性（否则会发生单类型复制导致无法赋值到对象中）
			for (let i = 0; i < pathes.length - 1; i++) {
				audioObject = audioObject[pathes[i]];
			}
			// 如果说当前索引到路径是undefined，这个属性代表音频，执行加载
			if (audioObject[pathes[pathes.length - 1]] === undefined) {
				let audio = new Audio();
				audio.src = require('@/assets/audio/' + payload + '.mp3');
				audio.preload = 'auto';
				audioObject[pathes[pathes.length - 1]] = audio;
			} else if (Object.prototype.toString.call(audioObject[pathes[pathes.length - 1]]) === '[object Object]') { // 否则，说明这个属性还有子属性，遍历子属性并进入递归流程加载其中的音频
				let list = audioObject[pathes[pathes.length - 1]];
				for (let key in list) {
					this.commit('audio/loadAudioList', payload + '/' + key);
				}
			}
		},
		/**
		 * 修改音频资源，建议在加载之前调用，payload中有两个属性：path表示修改路径，例如修改上述audioList.succeed.s1，表示为succeed/s1，audio属性则为Audio对象，路径不存在会添加
		 */
		modifyAudio(state, payload) {
			// 处理路径字符串
			if (payload.path.indexOf('/') == 0) {
				payload.path = payload.path.substring(1, payload.path.length);
			}
			if (payload.path === '') {
				return;
			}
			const pathes = payload.path.split('/');
			let audioObject = state.audioList;
			// 只索引到第n - 1个，也就是目标属性的的前一个，这样就可以引用到对象并修改其中的属性（否则会发生单类型复制导致无法赋值到对象中）
			for (let i = 0; i < pathes.length - 1; i++) {
				audioObject = audioObject[pathes[i]];
			}
			audioObject[pathes[pathes.length - 1]] = payload.audio;
		}
	},
	actions: {
		loadAllAudio(context) {
			context.commit('loadAudioList', '');
		},
		/**
		 * 获取全部音频资源数量，payload为待获取的音频列表对象，音频列表对象中属性和音频文件夹目录结构一致
		 * @returns 全部音频资源数
		 */
		async getTotal(context, payload) {
			if (payload === null) {
				payload = context.state;
			}
			let total = 0;
			for (let key in payload) {
				if (Object.prototype.toString.call(payload[key]) === '[object Object]') {
					total = total + await context.dispatch('getTotal', payload[key]);
				} else {
					total++;
				}
			}
			return total;
		},
		/**
		 * 检查已加载音频资源数量，payload为待检查的音频列表对象，音频列表对象中属性和音频文件夹目录结构一致
		 * @returns 已加载音频资源数
		 */
		async getLoaded(context, payload) {
			if (payload === null) {
				payload = context.state;
			}
			let loaded = 0;
			for (let key in payload) {
				if (Object.prototype.toString.call(payload[key]) === '[object Object]') {
					loaded = loaded + await context.dispatch('getLoaded', payload[key]);
				} else if (Object.prototype.toString.call(payload[key]) === '[object HTMLAudioElement]' && payload[key].readyState == 4) {
					loaded++;
				}
			}
			return loaded;
		}
	}
}