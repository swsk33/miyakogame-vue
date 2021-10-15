<template>
	<div v-if="isMenuShow" :class="{ mainMenu: true, menuFadeOut: isMenuOut }">
		<div class="title">
			<img class="avatar" src="@/assets/image/avatar/excepted.png" />
			<div class="main"></div>
		</div>
		<ul class="menu">
			<li :class="{ newGameStyle: isNewGame }" @click="continueGame">继续游戏</li>
			<li @click="newGame">新游戏</li>
			<li>魔法商店</li>
			<li>排行榜</li>
			<li @click="$emit('showSubPage', 'help')">帮助</li>
		</ul>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { showDialog } from '@/components/util/mydialog.js';
import random from '@/assets/js/random.js';

const { mapState, mapMutations, mapActions } = createNamespacedHelpers('gamingcontrol');

export default {
	computed: {
		...mapState(['isNewGame']),
	},
	data() {
		return {
			isMenuOut: false,
			isMenuShow: true,
		};
	},
	methods: {
		...mapMutations(['setOutOfGame']),
		...mapActions(['startGameProcess', 'resetAllData']),
		/**
		 * 主菜单淡出
		 */
		menuFadeOut() {
			this.isMenuOut = true;
			setTimeout(() => {
				this.isMenuShow = false;
			}, 800);
		},
		/**
		 * 继续游戏按钮
		 */
		continueGame() {
			if (!this.isNewGame) {
				this.menuFadeOut();
			}
			this.startGameProcess();
			this.setOutOfGame(false);
		},
		/**
		 * 新游戏按钮
		 */
		newGame() {
			showDialog(
				'开始新游戏将清除所有游戏进度和武器道具（最高分不会清除），是否继续？',
				require('@/assets/image/tipicon/warn/w' + random.generateRandom(1, 5) + '.png'),
				() => {
					this.resetAllData();
					this.menuFadeOut();
					this.startGameProcess();
					this.setOutOfGame(false);
				},
				() => {}
			);
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
			background: url(../assets/image/title/normal.png) no-repeat center/cover;
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