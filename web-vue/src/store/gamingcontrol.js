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
		}
	},
	mutations: {
		/**
		 * 设定游戏域大小，payload中要有width属性表示游戏域宽度，height属性表示游戏域高度
		 */
		setGameArea(state, payload) {
			state.gameArea = payload;
		},
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
		},
		/**
		 * 停止游戏进程
		 */
		stopGameProcess(context) {
			context.commit('clearControls', args);
		}
	}
}