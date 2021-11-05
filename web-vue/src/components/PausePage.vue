<!-- 暂停蒙层 -->
<template>
	<div v-if="pause" :class="styleValue">
		<div class="banner">
			<img :src="imageList.gif.pause" />
			<div class="text">游戏暂停，按P继续...</div>
		</div>
		<div class="backToMenu" @click="backToMenu">退出游戏</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapActions: gameActions } = createNamespacedHelpers('gamingcontrol');
const { mapState: imageState } = createNamespacedHelpers('image');

export default {
	data() {
		return {
			/**
			 * 样式变量
			 */
			styleValue: {
				pause: true,
				pageOut: false,
			},
		};
	},
	computed: {
		...pageState(['pause']),
		...imageState(['imageList']),
	},
	methods: {
		...pageMutations(['setPausePage', 'setMainMenuPage']),
		...gameActions(['exitGame']),
		/**
		 * 暂停页面消失
		 */
		pausePageOut() {
			this.styleValue.pageOut = true;
			setTimeout(() => {
				this.setPausePage(false);
				// 还原样式
				this.styleValue.pageOut = false;
			}, 800);
		},
		/**
		 * 退出游戏按钮方法
		 */
		backToMenu() {
			this.exitGame();
			this.pausePageOut();
			this.setMainMenuPage(true);
		},
	},
};
</script>

<style lang="scss" scoped>
.pause {
	position: absolute;
	width: 100%;
	height: 100vh;
	display: flex;
	background-color: rgba(255, 255, 255, 0.8);
	flex-direction: column;
	justify-content: center;
	align-items: center;
	user-select: none;
	transition-property: transform, left, top;
	transition-duration: 0.8s;
	transition-timing-function: ease-out;

	.banner {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		img {
			position: relative;
			height: 75px;
			border-radius: 25%;
		}

		.text {
			position: relative;
			font-size: 36px;
			margin-left: 18px;
		}
	}

	.backToMenu {
		position: relative;
		font-size: 28px;
		top: 10vh;
		width: 145px;
		height: 36px;
		line-height: 36px;
		text-align: center;
		cursor: pointer;

		&:hover {
			color: white;
			background-color: blue;
			border-radius: 6px;
		}
	}
}

// 暂停页面关闭样式
.pageOut {
	left: -25vw;
	top: -25vh;
	transform: scale(0) rotateX(180deg);
}
</style>