<template>
	<div class="gameBody">
		<div class="topBar">
			<div class="props">
				<div class="name">生命值+1</div>
				<img src="@/assets/image/prop/addHealth.png" />
				<div class="count">x0</div>
			</div>
			<div class="weapon">
				<div class="name">常规鬼火</div>
				<img src="@/assets/image/bullet/normal.png" />
				<div class="count">x无限</div>
			</div>
			<div class="level">第1关</div>
			<div class="health">
				<img src="@/assets/image/youlStatic.png" />
				<div class="t">x3</div>
			</div>
			<div class="scorePanel">
				<div class="currentScore">积分：0</div>
				<div class="highScore">最高分数：0</div>
			</div>
		</div>
		<div class="gameBackground">
			<!--宫子-->
			<img src="@/assets/image/miyako/normal.png" class="miyako" :style="miyako.style" />
			<!--所有布丁，类名为：pudding-列-行，从0计数-->
			<img v-for="n in 32" :key="n" :class="'pudding-' + getPuddingColumn(n) + '-' + getPuddingLine(n)" :src="getPuddingImage(n)" :style="puddings[getPuddingColumn(n)][getPuddingLine(n)].style" />
			<!-- 所有子弹，使用v-for实现动态生成子弹dom -->
			<div v-for="bullet in bullets" :key="bullet" :style="bullet.style"></div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapMutations: gameMutations, mapActions: gameActions } = createNamespacedHelpers('gamingcontrol');
const { mapState: puddingState, mapActions: puddingActions } = createNamespacedHelpers('pudding');
const { mapState: miyakoState, mapActions: miyakoActions } = createNamespacedHelpers('miyako');
const { mapState: weaponState, mapActions: weaponActions } = createNamespacedHelpers('weapon');

export default {
	methods: {
		...gameMutations(['setGameArea']),
		...gameActions(['startGameProcess', 'stopGameProcess']),
		...miyakoActions(['moveMiyako']),
		...puddingActions(['resetPuddings', 'moveAllPuddings']),
		...weaponActions(['initializeWeapon', 'shooting']),
		getPuddingImage(n) {
			if (n >= 1 && n <= 16) {
				return require('@/assets/image/pudding/p1.png');
			} else if (n >= 17 && n <= 24) {
				return require('@/assets/image/pudding/p2.png');
			} else {
				return require('@/assets/image/pudding/p3.png');
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
		listenerHandle(e) {
			if (e.keyCode == 87 || e.keyCode == 38) {
				this.moveMiyako(true);
			}
			if (e.keyCode == 83 || e.keyCode == 40) {
				this.moveMiyako(false);
			}
			if (e.keyCode == 32) {
				let position = this.miyako.getPosition();
				let size = this.miyako.getSize();
				position.x = position.x + size.width;
				position.y = position.y + size.height / 3;
				this.shooting({ position });
			}
		},
	},
	computed: {
		...puddingState(['puddings']),
		...miyakoState(['miyako']),
		...weaponState(['bullets']),
	},
	mounted() {
		let gameBackground = document.querySelector('.gameBackground');
		let area = {
			width: gameBackground.offsetWidth,
			height: gameBackground.offsetHeight,
		};
		this.setGameArea(area);
		this.resetPuddings();
		this.initializeWeapon();
		// 全局添加键盘事件
		document.body.addEventListener('keydown', this.listenerHandle);
		this.startGameProcess();
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