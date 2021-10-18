<template>
	<div v-if="help" class="help">
		<div class="frame">
			<div class="introduce">&ensp;&ensp;&ensp;&ensp;宫子是一个喜欢吃布丁的幽灵。现在帮助（操控）她吃（淦）掉所有布丁吧！</div>
			<div class="t1">
				<img :src="imageList.png.youlStatic" />
				<p>表示生命值。</p>
			</div>
			<div class="t2">按W或者↑向上移动，S或者↓向下移动，空格开火</div>
			<div class="t3">按P可以暂停/继续游戏</div>
			<div class="t4">按E和Q切换至上一个/下一个武器（魔法）</div>
			<div class="t5">按Z和C切换至上一个/下一个道具，V使用道具</div>
			<div class="ok" @click="setHelpPage(false)">知道了</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapState: imageState } = createNamespacedHelpers('image');

export default {
	computed: {
		...pageState(['help']),
		...imageState(['imageList']),
	},
	methods: {
		...pageMutations(['setHelpPage']),
	},
};
</script>

<style lang="scss" scoped>
@keyframes show {
	from {
		transform: scale(0);
	}
	to {
		transform: scale(1);
	}
}

.help {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(255, 255, 255, 0.9);

	div {
		position: relative;
		width: 80%;
		margin-top: 24px;
	}

	.frame {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		user-select: none;
		width: 600px;
		height: 450px;
		background-color: #aaffff;
		border-radius: 10px;
		box-shadow: 2px 2px 2px 1px rgba(2, 2, 2, 0.3);
		animation-name: show;
		animation-duration: 0.3s;
		animation-timing-function: ease-out;

		.introduce {
			font-size: 24px;
			margin-top: 28px;
		}

		.t1 {
			img {
				height: 48px;
			}

			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size: 20px;
			box-sizing: border-box;
		}

		.ok {
			position: absolute;
			width: 100px;
			bottom: 28px;
			font-size: 24px;
			height: 28px;
			line-height: 28px;
			text-align: center;
			cursor: pointer;
			user-select: none;

			&:hover {
				color: white;
				background-color: blue;
				border-radius: 6px;
			}
		}
	}
}
</style>