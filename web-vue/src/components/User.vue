<!-- 主菜单右上角用户组件 -->
<template>
	<div :class="styleValue">
		<div class="loginButton" v-if="!isLogin">
			<div class="login" @click="setLoginPage(true)">登录</div>
			<div class="register" @click="setRegisterPage(true)">注册</div>
		</div>
		<div class="userInfo" v-if="isLogin" @mouseenter="menuShow = true">
			<img class="avatar" :src="onlineUserData.avatar" />
			<div class="nickname">{{ onlineUserData.nickname }}</div>
			<div class="arrow" ref="arrow">▲</div>
		</div>
		<ul class="dropDownMenu" v-if="menuShow" @mouseleave="menuShow = false">
			<li @click="setInfoEditPage(true)">个人中心</li>
			<li @click="logoutButton">退出登录</li>
		</ul>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import mouseffect from '@/assets/js/mouseffect.js';

const { mapState: dataState, mapActions: dataActions } = createNamespacedHelpers('userdata');
const { mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapState: timeState } = createNamespacedHelpers('timecontrol');

export default {
	data() {
		return {
			menuShow: false,
			/**
			 * 样式变量
			 */
			styleValue: {
				userComponent: true,
				userComponentNight: false,
			},
		};
	},
	watch: {
		/**
		 * 监听下拉菜单是否显示，显示则关掉鼠标效果
		 */
		menuShow() {
			if (this.menuShow) {
				this.$refs.arrow.innerText = '▼';
				mouseffect.disableAll();
			} else {
				this.$refs.arrow.innerText = '▲';
				mouseffect.enableAll();
			}
		},
		/**
		 * 监听时间
		 */
		time: {
			handler() {
				this.styleValue.userComponentNight = this.time.night;
			},
			immediate: true,
			deep: true,
		},
		/**
		 * 监听节日
		 */
		festival: {
			handler() {
				this.styleValue.userComponentNight = this.festival.halloween;
			},
			immediate: true,
			deep: true,
		},
	},
	computed: {
		...dataState(['isLogin', 'onlineUserData']),
		...timeState(['time', 'festival']),
	},
	methods: {
		...dataActions(['userLogout']),
		...pageMutations(['setLoginPage', 'setRegisterPage', 'setInfoEditPage']),
		/**
		 * 退出登录按钮事件
		 */
		logoutButton() {
			this.userLogout();
			this.menuShow = false;
			mouseffect.enableAll();
		},
	},
};
</script>

<style lang="scss" scoped>
.userComponent {
	font-size: 20px;
	user-select: none;

	.loginButton {
		display: flex;

		.login,
		.register {
			width: 48px;
			height: 28px;
			line-height: 28px;
			text-align: center;
			cursor: pointer;
		}

		.login {
			margin-right: 8px;
			&:hover {
				color: white;
				background-color: blue;
				border-radius: 6px;
			}
		}

		.register {
			&:hover {
				color: white;
				background-color: purple;
				border-radius: 6px;
			}
		}
	}

	.userInfo {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 320px;

		.avatar {
			width: 36px;
			height: 36px;
			border: 2px blue solid;
			border-radius: 50%;
			margin-right: 10px;
		}

		.nickname {
			margin-right: 2px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		.arrow {
			font-size: 18px;
		}
	}

	@keyframes menuLayout {
		from {
			top: 24px;
			transform: scaleY(0);
		}

		to {
			top: 48px;
			transform: scaleY(1);
		}
	}

	.dropDownMenu {
		position: absolute;
		right: 1px;
		top: 48px;
		width: 88px;
		list-style: none;
		font-size: 18px;
		border-bottom: 1px blue solid;
		background-color: rgba(255, 255, 255, 0.65);
		animation-name: menuLayout;
		animation-duration: 0.3s;
		animation-timing-function: ease-out;

		li {
			height: 32px;
			line-height: 32px;
			text-align: center;
			border: 1px blue solid;
			border-bottom: none;
			cursor: pointer;

			&:hover {
				color: white;
				background-color: blue;
			}
		}
	}
}

// 用户组件-夜晚或者万圣节
.userComponentNight {
	.loginButton {
		.login,
		.register {
			color: white;
			text-shadow: 0px 0px 1px white;
		}

		.login {
			&:hover {
				color: black;
				background-color: rgb(0, 238, 255);
			}
		}

		.register {
			&:hover {
				color: black;
				background-color: rgb(255, 157, 255);
			}
		}
	}

	.userInfo {
		.avatar {
			border: 2px rgb(72, 234, 255) solid;
		}

		.nickname,
		.arrow {
			color: white;
			text-shadow: 0px 0px 1px white;
		}
	}
}
</style>