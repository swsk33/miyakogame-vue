import {
	createApp
} from 'vue';

import Tip from './Tip.vue';

import random from '@/assets/js/random.js';
import store from '@/store/index.js';

/**
 * 提示框类型常量
 */
export const tipType = {
	info: 'info',
	warn: 'warn',
	error: 'error'
};

/**
 * 显示自定义提示
 * @param {String} text 提示文字 
 * @param {NodeRequire} image 提示图标（需要require）
 * @param {NodeRequire} audio 提示音（需要require）
 * @param {String} color 提示文字颜色
 * @param {Boolean} mute 是否静音，此项为true时，audio参数将不起作用
 */
export function showCustomTip(text, image, audio, color, mute) {
	let mountDom = document.createElement('div');
	mountDom.style.position = 'absolute';
	mountDom.style.left = 0;
	mountDom.style.top = 0;
	document.body.appendChild(mountDom);
	if (!mute) {
		new Audio(audio).play();
	}
	let tipVue = createApp(Tip).mount(mountDom);
	tipVue.setData(image, text, color);
	setTimeout(() => {
		mountDom.remove();
	}, 4000);
}

/**
 * 显示提示
 * @param {String} text 提示文字
 * @param {String} type 类型，有info、warn、error分别为告示、警告和错误，可以使用tipType对象中的值
 * @param {Boolean} mute 是否静音
 */
export function showTip(text, type, mute = false) {
	const imageState = store.state.image.imageList.png.tipicon;
	const audioState = store.state.audio.audioList.tip;
	let image = imageState.info.i1;
	let audio = audioState.info;
	let content = '[info]' + text;
	let color = 'rgb(0, 128, 0)';
	switch (type) {
		case tipType.info:
			image = imageState.info['i' + random.generateRandom(1, 5)];
			break;
		case tipType.warn:
			image = imageState.warn['w' + random.generateRandom(1, 5)];
			audio = audioState.warn;
			color = 'rgb(251, 106, 39)';
			content = '[warn]' + text;
			break;
		case tipType.error:
			image = imageState.error['e' + random.generateRandom(1, 5)];
			audio = audioState.error;
			color = 'rgb(217, 0, 19)';
			content = '[error]' + text;
			break;
	}
	showCustomTip(content, image, audio, color, mute);
}