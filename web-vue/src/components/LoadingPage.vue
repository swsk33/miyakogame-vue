<template>
	<div v-if="loading" :class="{ loading: true, 'loading-out': complete }">
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
const { mapState: loadingState, mapActions: loadingActions } = createNamespacedHelpers('loading');
const { mapState: pageState, mapActions: pageActions } = createNamespacedHelpers('pagecontrol');

export default {
	methods: {
		...loadingActions(['loadAll']),
		...pageActions(['setLoadingPage']),
	},
	computed: {
		...loadingState(['process', 'complete']),
		...pageState(['loading']),
	},
	async mounted() {
		this.loadAll();
		let checkComplete = setInterval(() => {
			if (this.complete) {
				setTimeout(() => {
					this.setLoadingPage(false);
				}, 800);
				clearInterval(checkComplete);
			}
		}, 100);
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
		transition: width 0.8s cubic-bezier(0, 0, 0, 1);

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
.loading-out {
	top: -100vh;
}

//傍晚样式
.loading-evening {
	background-color: #1a008b;
	background-image: linear-gradient(180deg, #1a008b 28%, #ffc03a 100%);

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

//夜晚样式
.loading-night {
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
</style>