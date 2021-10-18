<template>
	<div class="gameBody">
		<div class="topBar">
			<div class="props">
				<div class="name">{{ propList[currentProp].name }}</div>
				<img :src="propList[currentProp].image" />
				<div class="count">x{{ gameData.propsCount[currentProp] }}</div>
			</div>
			<div class="weapon">
				<div class="name">{{ weaponList[currentWeapon].name }}</div>
				<img :src="weaponList[currentWeapon].texture" />
				<div class="count">x{{ bulletCount }}</div>
			</div>
			<div class="level">第{{ gameData.level }}关</div>
			<div class="health">
				<img :src="imageList.png.youlStatic" />
				<div class="t">x{{ gameData.health }}</div>
			</div>
			<div class="scorePanel">
				<div class="currentScore">积分：{{ gameData.currentScore }}</div>
				<div class="highScore">最高分数：{{ gameData.highScore }}</div>
			</div>
		</div>
		<div class="gameBackground">
			<!--宫子-->
			<img :src="imageList.png.miyako" class="miyako" :style="miyako.style" />
			<!--所有布丁，类名为：pudding-列-行，从0计数-->
			<img v-for="n in 32" :key="n" :class="'pudding-' + getPuddingColumn(n) + '-' + getPuddingLine(n)" :src="getPuddingImage(n)" :style="puddings[getPuddingColumn(n)][getPuddingLine(n)].style" />
			<!-- 所有子弹，使用v-for实现动态生成子弹dom -->
			<div v-for="bullet in bullets" :key="bullet" :style="bullet.style"></div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapState: gameState, mapMutations: gameMutations, mapActions: gameActions } = createNamespacedHelpers('gamingcontrol');
const { mapState: dataState } = createNamespacedHelpers('userdata');
const { mapState: puddingState, mapActions: puddingActions } = createNamespacedHelpers('pudding');
const { mapState: miyakoState, mapActions: miyakoActions } = createNamespacedHelpers('miyako');
const { mapState: weaponState, mapMutations: weaponMutations, mapActions: weaponActions } = createNamespacedHelpers('weapon');
const { mapState: propState, mapMutations: propMutations, mapActions: propActions } = createNamespacedHelpers('prop');
const { mapState: imageState } = createNamespacedHelpers('image');

export default {
	methods: {
		...gameMutations(['setGameArea']),
		...gameActions(['startGameProcess', 'stopGameProcess']),
		...miyakoActions(['moveMiyako']),
		...puddingActions(['resetPuddings', 'moveAllPuddings']),
		...propMutations(['alterProp']),
		...propActions(['useCurrentProp']),
		...weaponActions(['shooting']),
		...weaponMutations(['alterWeapon']),
		getPuddingImage(n) {
			if (n >= 1 && n <= 16) {
				return this.imageList.png.pudding.p1;
			} else if (n >= 17 && n <= 24) {
				return this.imageList.png.pudding.p2;
			} else {
				return this.imageList.png.pudding.p3;
			}
		},
		getPuddingColumn(n) {
			let columnNumber = parseInt(n / 8);
			if (n % 8 == 0) {
				columnNumber--;
			}
			return columnNumber;
		},
		getPuddingLine(n) {
			let lineNumber = (n % 8) - 1;
			if (lineNumber == -1) {
				lineNumber = 7;
			}
			return lineNumber;
		},
		/**
		 * 全局键盘监听主控
		 */
		listenerHandle(e) {
			if (this.isProcessing) {
				// 移动宫子
				if (e.keyCode == 87 || e.keyCode == 38) {
					this.moveMiyako(true);
				}
				if (e.keyCode == 83 || e.keyCode == 40) {
					this.moveMiyako(false);
				}
				// 空格射击
				if (e.keyCode == 32) {
					let position = this.miyako.getPosition();
					let size = this.miyako.getSize();
					position.x = position.x + size.width;
					position.y = position.y + size.height / 3;
					this.shooting({ position });
				}
				// 道具切换和使用
				if (e.keyCode == 90) {
					this.alterProp(false);
				}
				if (e.keyCode == 67) {
					this.alterProp(true);
				}
				if (e.keyCode == 86) {
					this.useCurrentProp();
				}
			}
		},
	},
	computed: {
		...gameState(['isProcessing', 'isOutOfGame']),
		...dataState(['gameData']),
		...puddingState(['puddings']),
		...miyakoState(['miyako']),
		...propState(['propList', 'currentProp']),
		...weaponState(['bullets', 'currentWeapon', 'weaponList']),
		...imageState(['imageList']),
		/**
		 * 显示武器子弹数量
		 */
		bulletCount() {
			if (this.gameData.weaponCount[this.currentWeapon] == -1) {
				return '无限';
			} else {
				return this.gameData.weaponCount[this.currentWeapon];
			}
		},
	},
	mounted() {
		let gameBackground = document.querySelector('.gameBackground');
		let area = {
			width: gameBackground.offsetWidth,
			height: gameBackground.offsetHeight,
		};
		this.setGameArea(area);
		this.resetPuddings();
		// 全局添加键盘事件
		document.body.addEventListener('keydown', this.listenerHandle);
	},
};
</script>

<style lang="scss" scoped>
.gameBody {
	position: absolute;
	width: 100%;
	height: 100%;
	user-select: none;

	.topBar {
		position: relative;
		display: flex;
		height: 55px;
		width: 100%;
		align-items: center;
		justify-content: space-around;
		background-color: #52ff9a;

		.props,
		.weapon,
		.health,
		.scorePanel {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.props {
			.name {
				position: relative;
			}

			img {
				position: relative;
				height: 36px;
				margin-left: 7px;
			}

			.count {
				position: relative;
				margin-left: 3px;
			}
		}

		.weapon {
			.name {
				position: relative;
			}

			img {
				position: relative;
				margin-left: 7px;
			}

			.count {
				position: relative;
				margin-left: 3px;
			}
		}

		.level {
			position: relative;
			font-size: 24px;
		}

		.health {
			img {
				width: 45px;
				height: 46px;
			}

			.t {
				font-size: 30px;
				margin-left: 10px;
			}
		}

		.scorePanel {
			.currentScore {
				position: relative;
				right: 20px;
				font-size: 26px;
				color: #ff00c4;
			}

			.highScore {
				position: relative;
				left: 20px;
				font-size: 26px;
				color: #001ddb;
			}
		}
	}

	.gameBackground {
		position: relative;
		width: 100%;
		height: calc(100vh - 55px);
		background-color: #77ffff;

		@for $i from 0 through 3 {
			@for $j from 0 through 7 {
				.pudding-#{$i}-#{$j} {
					transition: transform 0.5s linear;
				}
			}
		}
	}
}
</style>