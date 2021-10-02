import {
	createApp
} from 'vue';

import MyDialog from './MyDialog.vue';

/**
 * 显示自定义对话框
 * @param {String} text 对话框提示内容 
 * @param {NodeRequire} image 对话框图标（需要require图片路径）
 * @param {Function} ok 自定义确定事件
 * @param {Function} cancel 自定义取消事件
 */
export function showDialog(text, image, ok, cancel) {
	// 创建一个div元素放到body下面，供该vue组件挂载
	let mountDom = document.createElement('div');
	mountDom.style.position = 'absolute';
	mountDom.style.left = 0;
	mountDom.style.top = 0;
	document.body.appendChild(mountDom);
	// 挂载组件以显示，mount函数返回vue组件实例
	let dialog = createApp(MyDialog).mount(mountDom);
	// 调用vue实例中函数，将一些数据传入vue，传入挂载的dom是为了vue组件关闭时可以销毁自己和挂载的dom
	dialog.setData(text, image, ok, cancel, mountDom);
}