<template>
	<div v-if="failed" :class="{ failed: true, failedFade: isPageOut }">
		<div class="t1">failed!</div>
		<div class="say">
			<img class="avatar" :src="imageList.png.avatar.angry" />
			<div class="t2">不要nano!宫子现在就要吃完nano!</div>
		</div>
		<ul class="menu">
			<li @click="restart">重新开始</li>
			<li @click="backToMenu">返回主菜单</li>
		</ul>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapActions: gameActions } = createNamespacedHelpers('gamingcontrol');
const { mapActions: dataActions } = createNamespacedHelpers('userdata');
const { mapState: imageState } = createNamespacedHelpers('image');

export default {
	data() {
		return {
			isPageOut: false,
		};
	},
	computed: {
		...pageState(['failed']),
		...imageState(['imageList']),
	},
	methods: {
		...pageMutations(['setFailedPage', 'setMainMenuPage']),
		...gameActions(['enterGame']),
		...dataActions(['readGameData']),
		/**
		 * 隐藏失败页面
		 */
		closeFailedPage() {
			this.isPageOut = true;
			setTimeout(() => {
				this.setFailedPage(false);
				// 还原页面状态防止下次再次调用页面时出现问题
				this.isPageOut = false;
			}, 500);
		},
		/**
		 * 重新开始按钮
		 */
		restart() {
			this.closeFailedPage();
			// 进入游戏进程
			this.enterGame();
		},
		/**
		 * 返回主菜单按钮
		 */
		backToMenu() {
			this.closeFailedPage();
			// 显示主菜单
			this.setMainMenuPage(true);
			// 重新读取数据，刷新主菜单按钮
			this.readGameData();
		},
	},
};
</script>

<style lang="scss" scoped>
.failed {
	position: absolute;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;
	background-color: rgba(255, 255, 255, 0.8);
	transition-property: transform, left, top;
	transition-duration: 0.5s;
	transition-timing-function: ease-out;

	.t1 {
		display: inline-block;
		margin-top: 12vh;
		width: 100%;
		font-size: 68px;
		color: orangered;
		text-align: center;
	}

	.say {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80px;
		margin-top: 20px;
		margin-right: 25px;

		.t2 {
			font-size: 24px;
			color: #014dff;
		}

		.avatar {
			width: 80px;
			height: 80px;
			margin-right: 20px;
			border-radius: 50%;
			border-color: #19fff8;
			border-width: 3px;
			border-style: solid;
		}
	}

	ul {
		list-style: none;
		margin-top: 90px;
		user-select: none;

		li {
			margin-top: 45px;
			text-align: center;
			font-size: 38px;
			color: #ff007f;

			&:hover {
				cursor: pointer;
				color: #00a6ff;
				background-color: #dfdeff;
			}
		}
	}
}

// 失败页面消失
.failedFade {
	left: -25vw;
	top: -25vh;
	transform: scale(0) rotateX(3600deg);
}
</style>