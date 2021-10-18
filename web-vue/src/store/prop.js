import {
	tipType,
	showTip
} from '@/components/util/tip.js';

/**
 * 道具构造函数
 * @param {String} name 道具名
 * @param {String} description 道具描述
 * @param {Number} price 道具价格
 * @param {NodeRequire} image 道具贴图
 * @param {Audio} sound 道具音效
 * @param {Number} interval 道具使用间隔（ms）
 * @param {Function} effect 道具效果（回调函数，需要传入两个形参：character，enemies，表示角色对象和全部敌人数组）
 */
function Prop(name, description, price, image, sound, interval, effect) {
	this.name = name;
	this.description = description;
	this.price = price;
	this.image = image;
	this.sound = sound;
	this.interval = interval;
	/**
	 * 道具效果函数
	 * @param {Character} character 宫子对象
	 * @param {Array} 敌人数组
	 */
	this.effect = effect;
	/**
	 * 道具是否就绪
	 */
	this.isReady = true;
	/**
	 * 就绪状态，为百分比
	 */
	this.readyState = 100;
}

// vuex-道具
export default {
	namespaced: true,
	state: {
		/**
		 * 道具列表
		 */
		propList: [new Prop('', '', 0, undefined, undefined, 0, undefined)],
		/**
		 * 当前道具索引
		 */
		currentProp: 0,
	},
	mutations: {
		/**
		 * 设定整个道具列表，payload表示整个道具列表数组
		 */
		setProps(state, payload) {
			state.propList = payload;
		},
		/**
		 * 设定当前道具是否装载完成，payload为布尔值表示当前道具是否就绪
		 */
		setPropReady(state, payload) {
			state.propList[state.currentProp].isReady = payload;
		},
		/**
		 * 设定当前道具就绪状态，payload为一个0-1之间的浮点数
		 */
		setPropReadyState(state, payload) {
			state.propList[state.currentProp].readyState = payload;
		},
		/**
		 * 切换道具，payload为布尔值，true表示切换到下一个道具，否则切换到上一个
		 */
		alterProp(state, payload) {
			if (payload) {
				if (state.currentProp == state.propList.length - 1) {
					state.currentProp = 0;
				} else {
					state.currentProp++;
				}
			} else {
				if (state.currentProp == 0) {
					state.currentProp = state.propList.length - 1;
				} else {
					state.currentProp--;
				}
			}
		}
	},
	actions: {
		/**
		 * 初始化全部道具，需要在组件挂载时调用
		 */
		initializeProps(context) {
			// 图片和音频资源对象
			const imageState = context.rootState.image.imageList;
			const audioState = context.rootState.audio.audioList;
			// 生命值+1
			let healthAdd = new Prop('生命值+1', '生命值增加1', '80', imageState.png.prop.addHealth, audioState.prop.healthAdd, 6000, function (character, enemies) {
				let health = context.rootState.userdata.gameData.health;
				context.commit('userdata/setGameData', {
					name: 'health',
					value: health + 1
				}, {
					root: true
				});
			});
			// 移速提升
			let moveAdd = new Prop('移速提升', '在60s之内提升宫子的移速', 10, imageState.png.prop.moveFaster, audioState.prop.moveAdd, 6500, function (character, enemies) {
				context.commit('miyako/setMiyakoSpeed', 20, {
					root: true
				});
				let time = 60;
				let invalidInterval = setInterval(() => {
					if (context.rootState.gamingcontrol.isProcessing) {
						time--;
					}
					if (time <= 0) {
						context.commit('miyako/setMiyakoSpeed', 10, {
							root: true
						});
						clearInterval(invalidInterval);
					}
				}, 1000);
			});
			// 冻结吧
			let freeze = new Prop('冻结吧', '使全部敌人不再移动15s', 50, imageState.png.prop.freezePuddings, audioState.prop.stopPuddings, 6000, function (character, enemies) {
				const originRate = context.rootState.pudding.rate;
				context.commit('pudding/setPuddingsRate', 0, {
					root: true
				});
				let time = 15;
				let invalidInterval = setInterval(() => {
					if (context.rootState.gamingcontrol.isProcessing) {
						time--;
					}
					if (time <= 0) {
						context.commit('pudding/setPuddingsRate', originRate, {
							root: true
						});
						clearInterval(invalidInterval);
					}
				}, 1000);
			});
			// 设定道具
			const props = [healthAdd, moveAdd, freeze];
			context.commit('setProps', props);
		},
		/**
		 * 使用当前道具
		 */
		useCurrentProp(context) {
			const currentIndex = context.state.currentProp;
			const getProp = context.state.propList[currentIndex];
			const propCounts = context.rootState.userdata.gameData.propsCount;
			if (propCounts[currentIndex] <= 0) {
				showTip('当前道具数量不足！', tipType.error);
				return;
			}
			// 使用道具
			if (getProp.isReady) {
				propCounts[currentIndex]--;
				context.commit('userdata/setGameData', {
					name: 'propCounts',
					value: propCounts
				}, {
					root: true
				});
				getProp.sound.play();
				// 执行道具
				getProp.effect(context.rootState.miyako.miyako, context.rootState.pudding.puddings);
				context.commit('setPropReady', false);
				const time = getProp.interval;
				let elapseTime = 0;
				let loadInterval = setInterval(() => {
					if (context.rootState.gamingcontrol.isProcessing) {
						elapseTime++;
						context.commit('setPropReadyState', elapseTime / time);
					}
					if (elapseTime >= time) {
						context.commit('setPropReady', true);
						clearInterval(loadInterval);
					}
				}, 1);
			}
		}
	}
}