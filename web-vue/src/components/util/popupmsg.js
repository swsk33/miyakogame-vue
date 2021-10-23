import {
	createApp
} from 'vue';
import store from '@/store';


import PopUpMsg from './PopUpMessage.vue';

/**
 * 显示弹出消息
 * @param {String} text 内容
 * @param {Position} position 显示位置
 */
export function popUpMsg(text, position) {
	// 创建一个div元素放到body下面，供该vue组件挂载
	let mountDom = document.createElement('div');
	mountDom.style.position = 'absolute';
	mountDom.style.left = position.x + 'px';
	mountDom.style.top = position.y + 'px';
	document.body.appendChild(mountDom);
	// 挂载组件以显示，mount函数返回vue组件实例
	let msg = createApp(PopUpMsg).use(store).mount(mountDom);
	msg.text = text;
	setTimeout(() => {
		mountDom.remove();
	}, 850);
}