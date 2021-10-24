<template>
	<div :class="styleValue" v-if="shop">
		<div class="frame">
			<div class="text">消耗积分购买更多强力的魔法吧！</div>
			<div class="total">共需消耗{{ totalPrice }}积分</div>
			<div class="current">当前有{{ gameData.currentScore }}积分</div>
			<div class="item">
				<div class="itemtext">道具</div>
				<ul>
					<li v-for="(prop, index) in propList" :key="index">
						<div class="imageBox">
							<img :src="prop.image" />
						</div>
						<div class="itemNameAndPrice" @mousemove="showPropTip(index, $event)" @mouseout="closeTip">{{ prop.name + ' 价格：' + prop.price }}</div>
						<div class="count">{{ buyPropCount[index] }}</div>
						<div class="countButtonBox">
							<div class="addOne" @click="managePropInCart(index, 1, true)">+1</div>
							<div class="addTen" @click="managePropInCart(index, 10, true)">+10</div>
							<div class="minOne" @click="managePropInCart(index, 1, false)">-1</div>
							<div class="minTen" @click="managePropInCart(index, 10, false)">-10</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="weapon">
				<div class="weapontext">魔法</div>
				<ul>
					<li v-for="(weapon, index) in weaponList" :key="index">
						<div class="imageBox">
							<img :src="weapon.texture" />
						</div>
						<div class="weaponNameAndPrice" @mousemove="showWeaponTip(index, $event)" @mouseout="closeTip">{{ weapon.name + ' 价格：' + weapon.price }}</div>
						<div class="count">{{ buyWeaponCount[index] }}</div>
						<div class="countButtonBox">
							<div class="addOne" @click="manageWeaponInCart(index, 1, true)">+1</div>
							<div class="addTen" @click="manageWeaponInCart(index, 10, true)">+10</div>
							<div class="minOne" @click="manageWeaponInCart(index, 1, false)">-1</div>
							<div class="minTen" @click="manageWeaponInCart(index, 10, false)">-10</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="buttonBox">
				<div class="ok" @click="buy">购买</div>
				<div class="cancel" @click="closeShop">取消</div>
			</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { showToolTip } from '@/components/util/tooltip.js';
import mouseffect from '@/assets/js/mouseffect.js';
import { showTip, tipType } from '@/components/util/tip.js';

const { mapState: weaponState } = createNamespacedHelpers('weapon');
const { mapState: propState } = createNamespacedHelpers('prop');
const { mapState: dataState, mapMutations: dataMutations, mapActions: dataActions } = createNamespacedHelpers('userdata');
const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');

export default {
	data() {
		return {
			/**
			 * 暂存悬浮提示对象
			 */
			tipObject: undefined,
			/**
			 * 武器购物车（记录武器索引对应的购买数量）
			 */
			buyWeaponCount: [],
			/**
			 * 道具购物车（记录道具索引对应的购买数量）
			 */
			buyPropCount: [],
			/**
			 * 样式变量
			 */
			styleValue: {
				shop: true,
				shopNight: false,
				shopHalloween: false,
			},
		};
	},
	computed: {
		...weaponState(['weaponList']),
		...propState(['propList']),
		...dataState(['gameData']),
		...pageState(['shop']),
		totalPrice() {
			let weaponPrice = 0;
			for (let i = 0; i < this.buyWeaponCount.length; i++) {
				weaponPrice = weaponPrice + this.buyWeaponCount[i] * this.weaponList[i].price;
			}
			let propPrice = 0;
			for (let i = 0; i < this.buyPropCount.length; i++) {
				propPrice = propPrice + this.buyPropCount[i] * this.propList[i].price;
			}
			return weaponPrice + propPrice;
		},
	},
	watch: {
		'weaponList.length': {
			handler: function () {
				let weaponCart = [];
				for (let i = 0; i < this.weaponList.length; i++) {
					weaponCart.push(0);
				}
				this.buyWeaponCount = weaponCart;
			},
			immediate: true,
		},
		'propList.length': {
			handler: function () {
				let propCart = [];
				for (let i = 0; i < this.propList.length; i++) {
					propCart.push(0);
				}
				this.buyPropCount = propCart;
			},
			immediate: true,
		},
	},
	methods: {
		...pageMutations(['setShopPage']),
		...dataMutations(['setGameData']),
		...dataActions(['saveData']),
		/**
		 * 显示某个道具的悬浮提示
		 * @param {Number} index 道具索引
		 * @param {*} e 事件参数，vue传入组件传入$event
		 */
		showPropTip(index, e) {
			this.closeTip();
			this.tipObject = showToolTip(this.propList[index].description + ' 冷却时间：' + this.propList[index].interval / 1000 + 's', e.clientX + 5 + 'px', e.clientY - 30 + 'px');
		},
		/**
		 * 显示某个武器的悬浮提示
		 * @param {Number} index 道具索引
		 * @param {*} e 事件参数，vue传入组件传入$event
		 */
		showWeaponTip(index, e) {
			this.closeTip();
			this.tipObject = showToolTip(this.weaponList[index].description + ' 装弹时间：' + this.weaponList[index].interval / 1000 + 's', e.clientX + 5 + 'px', e.clientY - 30 + 'px');
		},
		/**
		 * 销毁悬浮提示
		 */
		closeTip() {
			if (this.tipObject != undefined) {
				this.tipObject.destroy();
			}
		},
		/**
		 * 关闭商店
		 */
		closeShop() {
			mouseffect.enableAll();
			this.setShopPage(false);
			// 清空购物车
			for (let i = 0; i < this.buyPropCount.length; i++) {
				this.buyPropCount[i] = 0;
			}
			for (let i = 0; i < this.buyWeaponCount.length; i++) {
				this.buyWeaponCount[i] = 0;
			}
		},
		/**
		 * 添加/删除购物车的道具
		 * @param {Number} index 道具索引
		 * @param {Number} count 加/减的数量
		 * @param {Boolean} isAdd true为加，false为减
		 */
		managePropInCart(index, count, isAdd) {
			if (isAdd) {
				this.buyPropCount[index] = this.buyPropCount[index] + count;
			} else {
				if (this.buyPropCount[index] < count) {
					this.buyPropCount[index] = 0;
				} else {
					this.buyPropCount[index] = this.buyPropCount[index] - count;
				}
			}
		},
		/**
		 * 添加/删除购物车的武器
		 * @param {Number} index 武器索引
		 * @param {Number} count 加/减的数量
		 * @param {Boolean} isAdd true为加，false为减
		 */
		manageWeaponInCart(index, count, isAdd) {
			if (isAdd) {
				if (this.gameData.weaponCount[index] == -1) {
					showTip('该武器的数量是无限，不需要购买！', tipType.warn);
				} else {
					this.buyWeaponCount[index] = this.buyWeaponCount[index] + count;
				}
			} else {
				if (this.buyWeaponCount[index] < count) {
					this.buyWeaponCount[index] = 0;
				} else {
					this.buyWeaponCount[index] = this.buyWeaponCount[index] - count;
				}
			}
		},
		/**
		 * 购买当前所有购物车的物品
		 */
		buy() {
			if (this.totalPrice == 0) {
				showTip('请至少购买一个物品！', tipType.error);
				return;
			}
			let currentScore = this.gameData.currentScore;
			if (this.totalPrice > currentScore) {
				showTip('积分不足！', tipType.error);
				return;
			}
			let currentPropCount = this.gameData.propsCount;
			let currentWeaponCount = this.gameData.weaponCount;
			for (let i = 0; i < currentPropCount.length; i++) {
				currentPropCount[i] = currentPropCount[i] + this.buyPropCount[i];
			}
			for (let i = 0; i < currentWeaponCount.length; i++) {
				currentWeaponCount[i] = currentWeaponCount[i] + this.buyWeaponCount[i];
			}
			this.setGameData({ name: 'propsCount', value: currentPropCount });
			this.setGameData({ name: 'weaponCount', value: currentWeaponCount });
			this.setGameData({ name: 'currentScore', value: currentScore - this.totalPrice });
			this.saveData(false);
			showTip('购买物品完成！', tipType.info);
		},
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

.shop {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(255, 255, 255, 0.9);

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

		.text {
			position: absolute;
			top: 25px;
			font-size: 24px;
		}

		.total {
			position: absolute;
			left: 7px;
			top: 2px;
			font-size: 16px;
			color: #ff007f;
		}

		.current {
			position: absolute;
			left: 250px;
			top: 2px;
			font-size: 16px;
			color: #0004d4;
		}

		.item {
			position: absolute;
			top: 75px;
			left: 6.5px;
			width: 580px;
			height: 135px;
			display: flex;
			flex-direction: column;
			align-items: center;
			border: #ff02bc 3px solid;
			border-radius: 5px;
			user-select: none;

			ul {
				position: absolute;
				width: 100%;
				height: 90px;
				top: 35px;
				overflow: auto;

				li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-top: 2px;
					width: 100%;
					border-bottom: green 1px dashed;

					.imageBox {
						position: relative;
						width: 20%;
						height: 30px;
						line-height: 30px;
						text-align: center;

						img {
							height: 28px;
						}
					}

					.itemNameAndPrice {
						width: 40%;
						position: relative;
						font-size: 18px;
						text-align: center;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.count {
						color: purple;
						width: 5%;
						text-align: center;
					}

					.countButtonBox {
						display: flex;
						width: 35%;
						justify-content: space-evenly;
						align-items: center;
						font-size: 16px;

						* {
							width: 20%;
							text-align: center;

							&:hover {
								cursor: pointer;
								color: white;
								background-color: blue;
								border-radius: 3px;
							}
						}
					}
				}
			}
		}

		.weapon {
			position: absolute;
			top: 225px;
			left: 6.5px;
			width: 580px;
			height: 165px;
			display: flex;
			flex-direction: column;
			align-items: center;
			border: #ff5500 3px solid;
			border-radius: 5px;
			user-select: none;

			ul {
				overflow: auto;
				width: 100%;
				height: 125px;
				top: 35px;

				li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-top: 2px;
					width: 100%;
					border-bottom: green 1px dashed;

					.imageBox {
						position: relative;
						width: 20%;
						height: 20px;
						line-height: 20px;
						text-align: center;

						img {
							height: 18px;
						}
					}

					.weaponNameAndPrice {
						width: 40%;
						position: relative;
						font-size: 18px;
						text-align: center;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.count {
						color: rgb(255, 81, 0);
						width: 5%;
						text-align: center;
					}

					.countButtonBox {
						display: flex;
						width: 35%;
						justify-content: space-evenly;
						align-items: center;
						font-size: 16px;

						* {
							width: 20%;
							text-align: center;

							&:hover {
								cursor: pointer;
								color: white;
								background-color: blue;
								border-radius: 3px;
							}
						}
					}
				}
			}
		}

		.buttonBox {
			position: absolute;
			top: 408px;
			left: 6.5px;
			width: 580px;
			display: flex;
			justify-content: space-evenly;
			align-items: center;

			.ok,
			.cancel {
				font-size: 18px;
				position: relative;
				width: 48px;
				height: 28px;
				line-height: 28px;
				text-align: center;
				border-radius: 6px;
				cursor: pointer;
				user-select: none;
			}

			.ok {
				&:hover {
					color: white;
					background-color: #9900ff;
				}
			}

			.cancel {
				&:hover {
					color: white;
					background-color: #ff4800;
				}
			}
		}
	}
}

.shopNight {
	background-color: rgba(255, 255, 255, 0.3);

	.frame {
		background-color: #000038;
		box-shadow: 2px 2px 10px 0.5px rgb(255, 255, 255);

		div {
			color: white;
			text-shadow: 0.2px 0.2px 2px white;
		}

		.total {
			color: #ffbee6;
			text-shadow: 0.2px 0.2px 2px #ffbee6;
		}

		.current {
			color: #8cffec;
			text-shadow: 0.2px 0.2px 2px #8cffec;
		}

		.item {
			border-color: #ff7dc9;

			ul {
				li {
					border-bottom: rgb(155, 255, 155) 1px dashed;

					.count {
						color: rgb(255, 151, 238);
					}

					.countButtonBox {
						* {
							&:hover {
								color: black;
								background-color: rgb(113, 255, 243);
							}
						}
					}
				}
			}
		}

		.weapon {
			border: #ffbc9b 3px solid;

			ul {
				li {
					border-bottom: rgb(155, 255, 155) 1px dashed;

					.count {
						color: rgb(255, 205, 182);
					}

					.countButtonBox {
						* {
							&:hover {
								color: black;
								background-color: rgb(152, 255, 212);
							}
						}
					}
				}
			}
		}

		.buttonBox {
			.ok {
				&:hover {
					color: black;
					background-color: #dfafff;
				}
			}

			.cancel {
				&:hover {
					color: black;
					background-color: #ffac8b;
				}
			}
		}
	}
}

// 商店-万圣节
.shopHalloween {
	background-color: rgba(255, 255, 255, 0.3);

	.frame {
		background-color: #4e3c8f;
		box-shadow: 2px 2px 10px 0.3px rgb(0, 255, 242);

		div {
			color: white;
			text-shadow: 0.2px 0.2px 2px white;
		}

		.total {
			color: #ffbee6;
			text-shadow: 0.2px 0.2px 2px #ffbee6;
		}

		.current {
			color: #8cffec;
			text-shadow: 0.2px 0.2px 2px #8cffec;
		}

		.item {
			border-color: #ff7dc9;

			ul {
				li {
					border-bottom: rgb(155, 255, 155) 1px dashed;

					.count {
						color: rgb(255, 151, 238);
					}

					.countButtonBox {
						* {
							&:hover {
								color: black;
								background-color: rgb(113, 255, 243);
							}
						}
					}
				}
			}
		}

		.weapon {
			border: #ffbc9b 3px solid;

			ul {
				li {
					border-bottom: rgb(155, 255, 155) 1px dashed;

					.count {
						color: rgb(255, 205, 182);
					}

					.countButtonBox {
						* {
							&:hover {
								color: black;
								background-color: rgb(152, 255, 212);
							}
						}
					}
				}
			}
		}

		.buttonBox {
			.ok {
				&:hover {
					color: black;
					background-color: #dfafff;
				}
			}

			.cancel {
				&:hover {
					color: black;
					background-color: #ffac8b;
				}
			}
		}
	}
}
</style>