/**
 * 根据一个音频列表对象递归加载音频文件
 * @param {String} pathPrefix 音频所在路径（需要以/结尾，根目录传入空字符串''）
 * @param {Object} audioList 音频列表对象，音频列表对象中属性和音频文件夹目录结构一致，每个表示音频文件的属性先要留空为undefined
 */
function loadAudioByObject(pathPrefix, audioList) {
	for (let key in audioList) {
		if (audioList[key] == undefined) {
			let audio = new Audio();
			audio.src = require('@/assets/audio/' + pathPrefix + key + '.mp3');
			audio.preload = 'auto';
			audioList[key] = audio;
		} else {
			let prefix = pathPrefix + key + '/';
			loadAudioByObject(prefix, audioList[key]);
		}
	}
}

/**
 * 递归获取音频总数
 * @param {Object} audioList 音频列表对象，音频列表对象中属性和音频文件夹目录结构一致
 * @returns 全部音频资源数量
 */
function getAudioCount(audioList) {
	let total = 0;
	for (let key in audioList) {
		if (Object.prototype.toString.call(audioList[key]) === '[object Object]') {
			total = total + getAudioCount(audioList[key]);
		} else {
			total++;
		}
	}
	return total;
}

/**
 * 递归检查音频列表中已加载的音频数量
 * @param {Object} audioList 音频列表对象，音频列表对象中属性和音频文件夹目录结构一致
 * @returns 已加载音频数量
 */
function checkAudioLoaded(audioList) {
	let loaded = 0;
	for (let key in audioList) {
		if (Object.prototype.toString.call(audioList[key]) === '[object Object]') {
			loaded = loaded + checkAudioLoaded(audioList[key]);
		} else {
			if (Object.prototype.toString.call(audioList[key]) === '[object HTMLAudioElement]' && audioList[key].readyState == 4) {
				loaded++;
			}
		}
	}
	return loaded;
}

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
				boom: undefined
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
		}
	},
	actions: {
		loadAllAudio(context) {
			context.commit('loadAll');
		},
		/**
		 * 获取音频资源总数
		 * @returns 音频资源总数
		 */
		getTotal(context) {
			return getAudioCount(context.state.audioList);
		},
		/**
		 * 获取已加载音频数
		 * @returns 已加载音频数
		 */
		getLoaded(context) {
			return checkAudioLoaded(context.state.audioList);
		}
	}
}