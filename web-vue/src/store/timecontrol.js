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
				// 执行资源修改
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
				// 修改默认武器贴图
				let normalWeaponImage = new Image();
				normalWeaponImage.src = require('@/assets/image/festival/halloween/bullet/normal.png');
				context.commit('image/modifyImage', {
					path: 'png/bullet/normal',
					image: normalWeaponImage
				}, {
					root: true
				});
				// 执行资源添加，仅仅指定资源地址插入到image和audio模块，模块中会自行根据对象属性名寻找资源路径加载
				// 添加背景图资源
				const backgroundImage = {
					backgroundGame: undefined,
					backgroundMenu: undefined
				}
				context.commit('image/modifyImage', {
					path: 'png/festival/halloween/background',
					image: backgroundImage
				}, {
					root: true
				});
				// 添加万圣节武器资源
				const halloweenFirework = {
					halloweenFirework: undefined,
					fireworkParticle: {
						p1: undefined,
						p2: undefined,
						p3: undefined,
						p4: undefined,
						p5: undefined,
						p6: undefined
					}
				}
				context.commit('image/modifyImage', {
					path: 'png/festival/halloween/bullet/firework',
					image: halloweenFirework
				}, {
					root: true
				});
				context.commit('image/modifyImage', {
					path: 'gif/festival/halloween/bullet/firework/fireworkBoom',
					image: undefined
				}, {
					root: true
				});
				// 万圣节武器音频资源
				context.commit('audio/modifyAudio', {
					path: 'festival/halloween/weapon',
					audio: {
						fireworkBoom: undefined,
						fireworkShoot: undefined
					}
				}, {
					root: true
				});
			}
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
				return;
			}
			// 检测时间
			// 晚上
			if ((nowTime.getHours() >= 19 && nowTime.getHours() <= 23) || (nowTime.getHours() >= 0 && nowTime.getHours() <= 6)) {
				context.commit('setTime', {
					name: 'night',
					enable: true
				});
				return;
			}
		}
	}
}