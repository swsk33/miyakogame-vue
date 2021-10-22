<template>
	<div v-if="success" :class="styleValue">
		<div class="t1">succeed!</div>
		<div class="say">
			<img class="avatar" :src="imageList.png.avatar.happy" />
			<div class="t2">臭鼬布丁nano，好吃nano！</div>
		</div>
		<ul class="menu">
			<li @click="nextLevel">下一关</li>
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
			/**
			 * 样式变量
			 */
			styleValue: {
				succeed: true,
				pageOut: false,
			},
		};
	},
	computed: {
		...pageState(['success']),
		...imageState(['imageList']),
	},
	methods: {
		...pageMutations(['setSuccessPage', 'setMainMenuPage']),
		...gameActions(['enterGame']),
		...dataActions(['readGameData']),
		/**
		 * 隐藏成功页面
		 */
		closeSuccessPage() {
			this.styleValue.pageOut = true;
			setTimeout(() => {
				this.setSuccessPage(false);
				// 还原页面状态防止下次再次调用页面时出现问题
				this.styleValue.pageOut = false;
			}, 800);
		},
		/**
		 * 下一关按钮
		 */
		nextLevel() {
			this.closeSuccessPage();
			// 进入游戏进程
			this.enterGame();
		},
		/**
		 * 返回主菜单按钮
		 */
		backToMenu() {
			this.closeSuccessPage();
			// 显示主菜单
			this.setMainMenuPage(true);
			// 重新读取数据，刷新主菜单按钮
			this.readGameData();
		},
	},
};
</script>

<style lang="scss" scoped>
.succeed {
	position: absolute;
	display: flex;
	flex-direction: column;
	left: 0;
	top: 0;
	width: 100%;
	height: 100vh;
	background-color: rgba(255, 255, 255, 0.8);
	transition-property: transform, left, top;
	transition-duration: 0.8s;
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
		margin-top: 45px;
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

// 成功页面消失
.pageOut {
	left: -25vw;
	top: -25vh;
	transform: scale(0) rotateX(180deg);
}
</style>