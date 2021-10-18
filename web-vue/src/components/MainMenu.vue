<template>
	<div v-if="mainMenu" :class="{ mainMenu: true, menuFadeOut: isMenuOut }">
		<div class="title">
			<img class="avatar" :src="imageList.png.avatar.excepted" />
			<img class="main" :src="imageList.png.title" />
		</div>
		<ul class="menu">
			<li :class="{ newGameStyle: isNewGame }" @click="continueGame">继续游戏</li>
			<li @click="newGame">新游戏</li>
			<li>魔法商店</li>
			<li>排行榜</li>
			<li @click="setHelpPage(true)">帮助</li>
		</ul>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { showDialog } from '@/components/util/mydialog.js';
import random from '@/assets/js/random.js';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapState: dataState, mapActions: dataActions } = createNamespacedHelpers('userdata');
const { mapActions: gameActions } = createNamespacedHelpers('gamingcontrol');
const { mapState: imageState } = createNamespacedHelpers('image');
const { mapState: audioState } = createNamespacedHelpers('audio');

export default {
	computed: {
		...pageState(['mainMenu', 'help']),
		...dataState(['isNewGame']),
		...imageState(['imageList']),
		...audioState(['audioList']),
	},
	data() {
		return {
			isMenuOut: false,
		};
	},
	methods: {
		...pageMutations(['setMainMenuPage', 'setHelpPage']),
		...dataActions(['resetAllData']),
		...gameActions(['enterGame']),
		/**
		 * 主菜单移出
		 */
		menuFadeOut() {
			this.isMenuOut = true;
			setTimeout(() => {
				this.setMainMenuPage(false);
				// 还原主菜单样式防止下次调用出问题
				this.isMenuOut = false;
			}, 800);
		},
		/**
		 * 继续游戏按钮
		 */
		continueGame() {
			if (!this.isNewGame) {
				this.audioList.start.play();
				this.menuFadeOut();
				// 开始游戏进程
				this.enterGame();
			}
		},
		/**
		 * 新游戏按钮
		 */
		newGame() {
			if (!this.isNewGame) {
				showDialog(
					'开始新游戏将清除所有游戏进度和武器道具（最高分不会清除），是否继续？',
					this.imageList.png.tipicon.warn['w' + random.generateRandom(1, 5)],
					() => {
						this.audioList.start.play();
						this.resetAllData();
						this.menuFadeOut();
						// 开始游戏进程
						this.enterGame();
					},
					() => {}
				);
			} else {
				this.audioList.start.play();
				this.menuFadeOut();
				// 开始游戏进程
				this.enterGame();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
//开始界面
.mainMenu {
	position: absolute;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	left: 0;
	top: 0;
	width: 100%;
	height: 100vh;
	background-color: #88ffff;
	transition: left 0.8s cubic-bezier(0, 0, 0, 1);

	.title {
		display: flex;
		justify-content: center;
		margin-top: 10vh;

		.main {
			position: relative;
			width: 600px;
			height: 150px;
			bottom: 24px;
		}

		.avatar {
			width: 95px;
			height: 95px;
			margin-right: 20px;
			border-radius: 50%;
			border-color: #ff02bc;
			border-width: 3px;
			border-style: solid;
		}
	}

	.menu {
		position: relative;
		top: -10px;
		list-style: none;
		user-select: none;
		width: 35%;

		li {
			margin-top: 35px;
			text-align: center;
			font-size: 38px;
			color: #ff5500;

			&:hover {
				cursor: pointer;
				color: #00a6ff;
				background-color: #dfdeff;
			}
		}

		.newGameStyle {
			color: gray;
		}
	}
}

// 开始界面移出
.menuFadeOut {
	left: -100vw;
}

//开始界面-傍晚样式
.mainMenu-evening {
	background-color: #1a008b;
	background-image: linear-gradient(180deg, #1a008b 28%, #ffc03a 100%);

	.menu {
		li {
			margin-top: 35px;
			text-align: center;
			font-size: 38px;
			color: #ff0037;
			text-shadow: 1px 1px 3px lightcoral;
		}
	}
}

//开始界面-夜晚样式
.mainMenu-night {
	background-color: rgb(0, 0, 56);

	.menu {
		li {
			margin-top: 35px;
			text-align: center;
			font-size: 38px;
			color: #00ff95;
			text-shadow: 1px 1px 3px rgb(173, 240, 128);
		}
	}
}
</style>