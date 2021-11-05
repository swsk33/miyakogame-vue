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
		failed: false,
		/**
		 * 暂停页面
		 */
		pause: false,
		/**
		 * 商店页面
		 */
		shop: false,
		/**
		 * 用户登录页面
		 */
		login: false,
		/**
		 * 重置密码页面
		 */
		resetPassword: false,
		/**
		 * 注册页面
		 */
		register: false,
		/**
		 * 信息修改页面
		 */
		infoEdit: false,
		/**
		 * 用户注销验证页面
		 */
		userDeleteVerify: false
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
		},
		/**
		 * 设置暂停页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setPausePage(state, payload) {
			state.pause = payload;
		},
		/**
		 * 设置商店页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setShopPage(state, payload) {
			state.shop = payload;
		},
		/**
		 * 设置登录页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setLoginPage(state, payload) {
			state.login = payload;
		},
		/**
		 * 设置重置密码页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setResetPasswordPage(state, payload) {
			state.resetPassword = payload;
		},
		/**
		 * 设置用户注册页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setRegisterPage(state, payload) {
			state.register = payload;
		},
		/**
		 * 设置用户信息修改页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setInfoEditPage(state, payload) {
			state.infoEdit = payload;
		},
		/**
		 * 设置用户注销验证码页面显示还是隐藏，payload为一个布尔值，true表示显示，false表示隐藏
		 */
		setUserDeleteVerifyPage(state, payload) {
			state.userDeleteVerify = payload;
		}
	}
}