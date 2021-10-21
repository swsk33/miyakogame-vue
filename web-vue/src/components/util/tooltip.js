import {
	createApp
} from 'vue';

import ToolTip from './ToolTip.vue';

/**
 * 显示悬浮消息
 * @param {String} text 消息内容
 * @param {String} x 在屏幕上显示的x坐标，需要带单位
 * @param {String} y 在屏幕上显示的y坐标，需要带单位
 * @returns {Object} 返回一个对象，表示这这个悬浮消息实例，其中有一个destroy方法用于销毁该悬浮消息
 */
export function showToolTip(text, x, y) {
	let mountDom = document.createElement('div');
	mountDom.style.position = 'absolute';
	mountDom.style.width = 0;
	mountDom.style.height = 0;
	mountDom.style.left = x;
	mountDom.style.top = y;
	mountDom.style.border = 'none';
	document.body.appendChild(mountDom);
	let tip = createApp(ToolTip).mount(mountDom);
	tip.text = text;
	return {
		destroy: () => {
			mountDom.remove();
		}
	}
}