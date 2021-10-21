<template>
	<div class="shop">
		<div class="frame">
			<div class="text">消耗积分购买更多强力的魔法吧！</div>
			<div class="total">共消耗0积分</div>
			<div class="current">当前有0积分</div>
			<div class="item">
				<div class="itemtext">道具</div>
				<ul>
					<li v-for="(prop, index) in propList" :key="index">
						<div class="imageBox">
							<img :src="prop.image" />
						</div>
						<div class="itemNameAndPrice">{{ prop.name + ' ' + prop.price }}</div>
						<div class="count">0</div>
						<div class="countButtonBox">
							<div class="addOne">+1</div>
							<div class="addTen">+10</div>
							<div class="minOne">-1</div>
							<div class="minTen">-10</div>
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
						<div class="weaponNameAndPrice">{{ weapon.name + ' ' + weapon.price }}</div>
						<div class="count">0</div>
						<div class="countButtonBox">
							<div class="addOne">+1</div>
							<div class="addTen">+10</div>
							<div class="minOne">-1</div>
							<div class="minTen">-10</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="buttonBox">
				<div class="ok div-btn">购买</div>
				<div class="cancel div-btn">取消</div>
			</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState: weaponState } = createNamespacedHelpers('weapon');
const { mapState: propState } = createNamespacedHelpers('prop');
const { mapState: dataState } = createNamespacedHelpers('userdata');

export default {
	data() {
		return {};
	},
	computed: {
		...weaponState(['weaponList']),
		...propState(['propList']),
		...dataState(['userdata']),
		showWeaponItem() {
			return (index) => {
				if (index == -1) {
					return false;
				} else {
					return true;
				}
			};
		},
	},
};
</script>

<style lang="scss" scoped>
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
						width: 35%;
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
					}

					.countButtonBox {
						display: flex;
						width: 40%;
						justify-content: center;
						align-items: center;
						font-size: 16px;

						* {
							width: 18%;
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
						width: 35%;
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
					}

					.countButtonBox {
						display: flex;
						width: 40%;
						justify-content: center;
						align-items: center;
						font-size: 16px;

						* {
							width: 18%;
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
</style>