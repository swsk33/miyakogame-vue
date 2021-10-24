import {
	Size
} from '@/assets/js/constructors.js';

// vuex-时间和节日模块
export default {
	namespaced: true,
	state: {
		/**
		 * 时间常量（中间只能有一个值为true）
		 */
		time: {
			/**
			 * 是否夜晚
			 */
			night: false
		},
		/**
		 * 节日常量（优先级大于时间，中间只能有一个值为true）
		 */
		festival: {
			/**
			 * 是否万圣节
			 */
			halloween: false
		}
	},
	mutations: {
		/**
		 * 设定时间常量，payload中有两个属性：name表示要设定的事件常量名，enable为布尔值表示是否启用该常量
		 */
		setTime(state, payload) {
			state.time[payload.name] = payload.enable;
		},
		/**
		 * 设定节日常量，payload中有两个属性：name表示要设定的事件常量名，enable为布尔值表示是否启用该常量
		 */
		setFestival(state, payload) {
			state.festival[payload.name] = payload.enable;
		}
	},
	actions: {
		/**
		 * 修改一些需要在加载前改写的资源
		 */
		modifyResourcesBeforeLoad(context) {
			// 万圣节
			if (context.state.festival.halloween) {
				// 标题图
				let titleImage = new Image();
				titleImage.src = require('@/assets/image/festival/halloween/title.png');
				context.commit('image/modifyImage', {
					path: 'png/title',
					image: titleImage
				}, {
					root: true
				});
				// 宫子
				let miyakoImage = new Image();
				miyakoImage.src = require('@/assets/image/festival/halloween/miyako.png');
				context.commit('image/modifyImage', {
					path: 'png/miyako',
					image: miyakoImage
				}, {
					root: true
				});
				context.commit('miyako/setMiyakoSize', new Size(120, 142), {
					root: true
				});
				// 修改武器
				let normalWeaponImage = new Image();
				normalWeaponImage.src = require('@/assets/image/festival/halloween/bullet.png');
				context.commit('image/modifyImage', {
					path: 'png/bullet/normal',
					image: normalWeaponImage
				}, {
					root: true
				});
			}
		},
		/**
		 * 修改一些需要在加载后改写的资源
		 */
		modifyResourcesAfterLoad(context) {

		},
		/**
		 * 检查时间
		 */
		checkTime(context) {
			// 现在
			const nowTime = new Date();
			// 检测节日
			// 万圣节（设定为每年10月31日18点开始到11月3日结束）
			if ((nowTime.getMonth() == 9 && nowTime.getDate() == 31 && nowTime.getHours() >= 18) || (nowTime.getMonth() == 10 && nowTime.getDate() <= 3)) {
				context.commit('setFestival', {
					name: 'halloween',
					enable: true
				});
				context.dispatch('modifyResourcesBeforeLoad');
				return;
			}
			// 检测时间
			// 晚上
			if ((nowTime.getHours() >= 20 && nowTime.getHours() <= 23) || (nowTime.getHours() >= 0 && nowTime.getHours() <= 6)) {
				context.commit('setTime', {
					name: 'night',
					enable: true
				});
				return;
			}
		}
	}
}