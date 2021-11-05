<!-- 用户登录模态窗 -->
<template>
	<div class="loginPage" v-if="login">
		<div class="frame">
			<div class="title">玩家登录</div>
			<input class="credential" type="text" placeholder="用户名或邮箱" v-model="loginData.credential" />
			<input class="password" type="password" placeholder="密码" v-model="loginData.password" />
			<div class="forget" @click="forgetPasswordButton">忘记密码？</div>
			<div class="login" @click="loginButton">登录</div>
			<div class="close" @click="setLoginPage(false)">关闭</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import mouseffect from '@/assets/js/mouseffect.js';
import { showLoading } from '@/components/util/loading.js';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapActions: dataActions } = createNamespacedHelpers('userdata');

export default {
	data() {
		return {
			loginData: {
				credential: '',
				password: '',
			},
		};
	},
	computed: {
		...pageState(['login']),
	},
	watch: {
		/**
		 * 监听登录页面是否显示，若显示则关闭鼠标效果
		 */
		login() {
			if (this.login) {
				mouseffect.disableAll();
			} else {
				mouseffect.enableAll();
				// 清空输入框
				this.loginData.credential = '';
				this.loginData.password = '';
			}
		},
	},
	methods: {
		...pageMutations(['setLoginPage', 'setResetPasswordPage']),
		...dataActions(['userLogin']),
		/**
		 * 登录按钮
		 */
		async loginButton() {
			let loading = showLoading('45vw', '12vh', '发起登录请求...');
			if (await this.userLogin(this.loginData)) {
				this.setLoginPage(false);
			}
			loading.destory();
		},
		/**
		 * 忘记密码按钮
		 */
		forgetPasswordButton() {
			this.setLoginPage(false);
			this.setResetPasswordPage(true);
		},
	},
};
</script>

<style lang="scss" scoped>
.loginPage {
	position: absolute;
	width: 100%;
	height: 100vh;
	display: flex;
	background-color: rgba(255, 255, 255, 0.7);
	flex-direction: column;
	justify-content: center;
	align-items: center;
	user-select: none;

	.frame {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 350px;
		height: 335px;
		background-color: rgb(122, 255, 255);
		border-radius: 10px;

		.title {
			font-size: 28px;
			margin-top: 24px;
		}

		.credential,
		.password {
			width: 75%;
			height: 32px;
			margin-top: 18px;
			outline: none;
			font-size: 18px;
			box-sizing: border-box;
			opacity: 0.85;
			border: 2px blue solid;
			border-radius: 5px;

			&:focus {
				opacity: 1;
				border: 2px rgb(247, 0, 255) solid;
				box-shadow: 0px 0px 3px 1.5px rgb(247, 0, 255);
			}
		}

		.credential {
			margin-top: 36px;
		}

		.forget {
			position: relative;
			margin-top: 8px;
			left: 29%;
			cursor: pointer;

			&:hover {
				color: rgb(206, 0, 206);
			}
		}

		.login,
		.close {
			margin-top: 16px;
			width: 75%;
			font-size: 20px;
			text-align: center;
			height: 32px;
			line-height: 32px;
			color: white;
			background-color: rgb(174, 0, 255);
			cursor: pointer;

			&:hover {
				background: blue;
			}
		}

		.close {
			margin-top: 8px;
		}
	}
}
</style>