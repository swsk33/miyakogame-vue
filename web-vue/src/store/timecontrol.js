// vuex-时间和节日模块
export default {
	namespaced: true,
	state: {
		/**
		 * 时间常量
		 */
		time: {
			/**
			 * 是否夜晚
			 */
			night: false
		},
		/**
		 * 节日常量（优先级大于时间）
		 */
		festival: {
			/**
			 * 是否万圣节
			 */
			helloween: false
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

	}
}