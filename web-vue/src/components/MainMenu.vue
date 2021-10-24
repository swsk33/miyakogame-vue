<template>
	<div v-if="mainMenu" :class="styleValue" ref="mainMenuDom">
		<div class="title">
			<img class="avatar" :src="imageList.png.avatar.excepted" />
			<img class="main" :src="imageList.png.title" />
		</div>
		<ul class="menu">
			<li :class="{ newGameStyle: isNewGame }" @click="continueGame">继续游戏</li>
			<li @click="newGame">新游戏</li>
			<li @click="showShop">魔法商店</li>
			<li>排行榜</li>
			<li @click="setHelpPage(true)">帮助</li>
		</ul>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { showDialog } from '@/components/util/mydialog.js';
import random from '@/assets/js/random.js';
import mouseffect from '@/assets/js/mouseffect.js';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapState: dataState, mapActions: dataActions } = createNamespacedHelpers('userdata');
const { mapActions: gameActions } = createNamespacedHelpers('gamingcontrol');
const { mapState: imageState } = createNamespacedHelpers('image');
const { mapState: audioState } = createNamespacedHelpers('audio');

export default {
	computed: {
		...pageState(['mainMenu']),
		...dataState(['isNewGame']),
		...imageState(['imageList']),
		...audioState(['audioList']),
	},
	data() {
		return {
			/**
			 * 样式变量
			 */
			styleValue: {
				mainMenu: true,
				menuOut: false,
				menuNight: false,
				menuHalloween: false,
			},
		};
	},
	methods: {
		...pageMutations(['setMainMenuPage', 'setHelpPage', 'setShopPage']),
		...dataActions(['resetAllData']),
		...gameActions(['enterGame']),
		/**
		 * 主菜单移出
		 */
		menuFadeOut() {
			this.styleValue.menuOut = true;
			setTimeout(() => {
				this.setMainMenuPage(false);
				// 还原主菜单样式防止下次调用出问题
				this.styleValue.menuOut = false;
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
		/**
		 * 显示商店
		 */
		showShop() {
			mouseffect.disableAll();
			this.setShopPage(true);
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
.menuOut {
	left: -100vw;
}

// 开始界面-夜晚样式
.menuNight {
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

// 开始界面-万圣节
.menuHalloween {
	background: url('../assets/image/festival/halloween/backgroundMenu.png') no-repeat center/cover;

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