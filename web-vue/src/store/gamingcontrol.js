// vuex-游戏主控模块
export default {
	namespaced: true,
	state: {
		/**
		 * 当前关卡值
		 */
		level: 1,
		/**
		 * 游戏域大小，需要在游戏组件挂载时设定
		 */
		gameArea: {
			width: 0,
			height: 0
		}
	},
	mutations: {
		/**
		 * 设定游戏域大小，payload中要有width属性表示游戏域宽度，height属性表示游戏域高度
		 */
		setGameArea(state, payload) {
			state.gameArea = payload;
		},
	},
	actions: {}
}