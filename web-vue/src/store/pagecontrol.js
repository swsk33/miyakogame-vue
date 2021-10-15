// vuex-页面显隐控制模块
export default {
	namespaced: true,
	state: {
		/**
		 * 显示加载页
		 */
		loading: true,
		/**
		 * 显示主菜单
		 */
		mainMenu: true,
		/**
		 * 显示帮助页
		 */
		help: false,
		/**
		 * 成功页面
		 */
		success: false,
		/**
		 * 失败页面
		 */
		failed: false
	},
	mutations: {
		/**
		 * 设置加载页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setLoadingPage(state, payload) {
			state.loading = payload;
		},
		/**
		 * 设置主菜单页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setMainMenuPage(state, payload) {
			state.mainMenu = payload;
		},
		/**
		 * 设置帮助页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setHelpPage(state, payload) {
			state.help = payload;
		},
		/**
		 * 设置成功页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setSuccessPage(state, payload) {
			state.success = payload;
		},
		/**
		 * 设置失败页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setFailedPage(state, payload) {
			state.failed = payload;
		}
	},
}