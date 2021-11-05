import {
	createApp
} from 'vue';

import store from '@/store';
import Loading from './Loading.vue';

/**
 * 显示一个加载动画
 * @param {*} x 加载动画x坐标，传入字符串并带单位（px、vw、vh等等）
 * @param {*} y 加载动画y坐标，传入字符串并带单位（px、vw、vh等等）
 * @param {*} text 加载提示内容
 * @returns 一个对象，调用该对象的destory方法可以关掉该加载动画
 */
export function showLoading(x, y, text) {
	let mountDom = document.createElement('div');
	mountDom.style.position = 'absolute';
	mountDom.style.width = 0;
	mountDom.style.height = 0;
	mountDom.style.left = 0;
	mountDom.style.top = 0;
	document.body.appendChild(mountDom);
	let loading = createApp(Loading).use(store).mount(mountDom);
	loading.setData(x, y, text);
	let loadingObject = {
		destory: () => {
			mountDom.remove();
		}
	};
	return loadingObject;
}