// vuex-游戏主控模块，包含游戏主控制和数据
export default {
	namespaced: true,
	state: {
		/**
		 * 游戏域大小，需要在游戏组件挂载时设定
		 */
		gameArea: {
			width: 0,
			height: 0
		},
		/**
		 * 游戏控制计时器
		 */
		controls: {
			/**
			 * 布丁移动计时器
			 */
			puddingMove: undefined,
			/**
			 * 子弹飞行计时器
			 */
			bulletFly: undefined
		},
		/**
		 * 游戏是否处于暂停状态，true表示游戏正在运行没有暂停
		 */
		isProcessing: false,
		/**
		 * 是否在游戏外面（例如在主菜单、登录注册页而非正在游戏界面时，这个值为true）
		 */
		isOutOfGame: true
	},
	mutations: {
		/**
		 * 设定游戏主控，payload为一个对象，其中pudding、bullet属性都是计时器，分别表示循环调用所有布丁和子弹移动方法的计时器
		 */
		setControls(state, payload) {
			state.controls.puddingMove = payload.pudding;
			state.controls.bulletFly = payload.bullet;
		},
		/**
		 * 清除游戏主控计时器
		 */
		clearControls(state) {
			clearInterval(state.controls.puddingMove);
			clearInterval(state.controls.bulletFly);
		},
		/**
		 * 设定游戏域大小，payload中要有width属性表示游戏域宽度，height属性表示游戏域高度
		 */
		setGameArea(state, payload) {
			state.gameArea = payload;
		},
		/**
		 * 设定游戏是否处于暂停状态，payload为布尔值，true表示游戏正在运行没有暂停
		 */
		setGameProcessing(state, payload) {
			state.isProcessing = payload;
		},
		/**
		 * 设定是否在游戏外面，payload为一个布尔值，true表示在游戏外
		 */
		setOutOfGame(state, payload) {
			state.isOutOfGame = payload;
		}
	},
	actions: {
		/**
		 * 启动游戏进程
		 */
		startGameProcess(context) {
			let args = {
				pudding: setInterval(() => {
					context.dispatch('pudding/moveAllPuddings', null, {
						root: true
					});
				}, 100),
				bullet: setInterval(() => {
					context.dispatch('weapon/flyAllBullet', null, {
						root: true
					});
				}, 16)
			}
			context.commit('setControls', args);
			context.commit('setGameProcessing', true);
		},
		/**
		 * 停止游戏进程
		 */
		stopGameProcess(context) {
			context.commit('clearControls');
			context.commit('setGameProcessing', false);
		},
	}
}