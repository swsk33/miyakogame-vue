<!-- 游戏加载模态窗 -->
<template>
	<div v-if="loading" :class="styleValue" ref="loadingPageDom">
		<div class="loadingComponent">
			<img class="loadingImage" src="@/assets/image/youlDynamic.gif" />
			<div class="loadingText">游戏加载中...</div>
		</div>
		<div class="processBar">
			<div class="processValue" :style="{ width: `${process}%` }"></div>
		</div>
		<div class="processNum">process {{ process }}%</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapState: loadingState } = createNamespacedHelpers('loading');
const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');

export default {
	data() {
		return {
			/**
			 * 样式控制变量
			 */
			styleValue: {
				loading: true,
				loadingOut: false,
				loadingNight: false,
				loadingHalloween: false,
			},
		};
	},
	methods: {
		...pageMutations(['setLoadingPage']),
	},
	computed: {
		...loadingState(['process', 'complete']),
		...pageState(['loading']),
	},
	watch: {
		// 样式变量监听
		complete: {
			handler() {
				this.styleValue.loadingOut = this.complete;
				if (this.complete) {
					setTimeout(() => {
						this.setLoadingPage(false);
					}, 800);
				}
			},
			immdeiate: true,
		},
	},
};
</script>

<style lang="scss" scoped>
@keyframes showGif {
	from {
		transform: scale(0);
	}
	to {
		transform: scale(1);
	}
}

@keyframes showBar {
	from {
		width: 0px;
	}
	to {
		width: 350px;
	}
}

.loading {
	position: absolute;
	display: flex;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	background-color: #88ffff;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	transition: top 0.8s ease-out;

	.loadingComponent {
		position: relative;
		display: flex;
		align-items: center;

		.loadingImage {
			position: relative;
			right: 9px;
			width: 58px;
			animation-name: showGif;
			animation-duration: 0.8s;
			animation-timing-function: ease-out;
		}

		.loadingText {
			position: relative;
			left: 8px;
			font-size: 32px;
		}
	}

	.processBar {
		position: relative;
		width: 350px;
		height: 18px;
		margin-top: 16px;
		border: 3px blue solid;
		border-radius: 18px;
		animation-name: showBar;
		animation-duration: 0.8s;
		animation-timing-function: ease-out;

		.processValue {
			position: absolute;
			box-sizing: border-box;
			width: 0;
			height: 18px;
			border-radius: 18px;
			background-color: greenyellow;
			transition: width 0.8s cubic-bezier(0, 0, 0, 1);
		}
	}

	.processNum {
		position: relative;
		margin-top: 5px;
		font-size: 18px;
	}
}

// 加载页面滑出
.loadingOut {
	top: -100vh;
}

//夜晚样式
.loadingNight {
	background-color: rgb(0, 0, 56);

	.loadingText {
		color: white;
		text-shadow: 1px 1px 3px white;
	}

	.processBar {
		border-color: rgb(144, 214, 255);
		box-shadow: 0 0 8px 1px #19fff8;

		.processValue {
			background-color: greenyellow;
			box-shadow: 0 0 10px 2px rgb(90, 255, 25);
		}
	}

	.processNum {
		color: white;
		text-shadow: 1px 1px 3px white;
	}
}

// 万圣节样式
.loadingHalloween {
	background: url('../assets/image/festival/halloween/background/backgroundLoad.png') no-repeat center/cover;

	.loadingText {
		color: white;
		text-shadow: 1px 1px 3px white;
	}

	.processBar {
		border-color: rgb(144, 214, 255);
		box-shadow: 0 0 9px 1px #19fff8;

		.processValue {
			background-color: greenyellow;
			box-shadow: 0 0 10px 2px rgb(90, 255, 25);
		}
	}

	.processNum {
		color: white;
		text-shadow: 1px 1px 3px white;
	}
}
</style>