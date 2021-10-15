import {
	createApp
} from 'vue';

import Tip from './Tip.vue';

import random from '@/assets/js/random.js';

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
	let image = require('@/assets/image/tipicon/info/i1.png');
	let audio = require('@/assets/audio/tip/info.mp3');
	let content = '[info]' + text;
	let color = 'rgb(0, 128, 0)';
	switch (type) {
		case tipType.info:
			image = require('@/assets/image/tipicon/info/i' + random.generateRandom(1, 5) + '.png');
			break;
		case tipType.warn:
			image = require('@/assets/image/tipicon/warn/w' + random.generateRandom(1, 5) + '.png');
			audio = require('@/assets/audio/tip/warn.mp3');
			color = 'rgb(251, 106, 39)';
			content = '[warn]' + text;
			break;
		case tipType.error:
			image = require('@/assets/image/tipicon/error/e' + random.generateRandom(1, 5) + '.png');
			audio = require('@/assets/audio/tip/error.mp3');
			color = 'rgb(217, 0, 19)';
			content = '[error]' + text;
			break;
	}
	showCustomTip(content, image, audio, color, mute);
}