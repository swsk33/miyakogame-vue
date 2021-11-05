<!-- 重置密码模态窗 -->
<template>
	<div class="resetPassword" v-if="resetPassword">
		<div class="frame">
			<div class="title">找回用户</div>
			<input type="text" class="email" placeholder="您的邮箱" v-model="email" />
			<div class="code">
				<input type="text" placeholder="收到的验证码" v-model="code" />
				<div :class="{ sendCode: true, sendCodeDisable: !sendCodeEnable }" @click="sendCodeButton">{{ sendCodeButtonText }}</div>
			</div>
			<input type="password" class="resetInput" placeholder="请输入新密码" v-model="newPassword" />
			<div class="ok" @click="resetButton">确认重置</div>
			<div class="cancel" @click="setResetPasswordPage(false)">关闭</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { showTip, tipType } from '@/components/util/tip.js';
import { showLoading } from '@/components/util/loading.js';
import mouseffect from '@/assets/js/mouseffect.js';
import axios from 'axios';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');

export default {
	data() {
		return {
			/**
			 * 是否可以发送验证码
			 */
			sendCodeEnable: true,
			/**
			 * 发送验证码按钮上的文字
			 */
			sendCodeButtonText: '发送验证码',
			/**
			 * 输入邮箱
			 */
			email: '',
			/**
			 * 输入验证码
			 */
			code: '',
			/**
			 * 输入新密码
			 */
			newPassword: '',
			/**
			 * 当前被重置的用户id
			 */
			currentUserId: undefined,
		};
	},
	computed: {
		...pageState(['resetPassword']),
	},
	watch: {
		/**
		 * 监听重置密码窗口是否显示，显示则关掉鼠标效果
		 */
		resetPassword() {
			if (this.resetPassword) {
				mouseffect.disableAll();
			} else {
				mouseffect.enableAll();
				// 清空输入内容
				this.email = '';
				this.code = '';
				this.newPassword = '';
				this.currentUserId = undefined;
			}
		},
	},
	methods: {
		...pageMutations(['setResetPasswordPage']),
		/**
		 * 发送验证码按钮
		 */
		async sendCodeButton() {
			if (this.sendCodeEnable) {
				if (this.email === '') {
					showTip('请先填写邮箱！', tipType.error);
					return;
				}
				let loading = showLoading('45vw', '12vh', '请求发送验证码...');
				try {
					// 先根据邮箱找到用户
					const userResponse = await axios.get('/api/player/getbyemail/' + this.email);
					if (!userResponse.data.success) {
						showTip('发送失败！' + userResponse.data.message, tipType.error);
						loading.destory();
						return;
					}
					this.currentUserId = userResponse.data.data.id;
					// 然后发送验证码
					const sendCodeResponse = await axios.get('/api/email/reset/' + this.currentUserId);
					if (!sendCodeResponse.data.success) {
						showTip('发送失败！' + userResponse.data.message, tipType.error);
						loading.destory();
						return;
					}
					showTip('发送验证码成功！', tipType.info);
					loading.destory();
					this.sendCodeButtonText = '发送成功！';
					// 60s内发送验证码按钮不可用
					this.sendCodeEnable = false;
					let time = 60;
					let enableSendInterval = setInterval(() => {
						this.sendCodeButtonText = time + 's';
						time--;
						if (time <= 0) {
							this.sendCodeEnable = true;
							this.sendCodeButtonText = '发送验证码';
							clearInterval(enableSendInterval);
						}
					}, 1000);
				} catch (error) {
					showTip('发送验证码失败！', tipType.error);
					loading.destory();
				}
			}
		},
		/**
		 * 确认重置密码按钮
		 */
		async resetButton() {
			if (this.currentUserId == undefined) {
				showTip('请先填写邮箱并点击发送验证码按钮！', tipType.error);
				return;
			}
			if (this.code === '') {
				showTip('请填写验证码！', tipType.error);
				return;
			}
			if (this.newPassword === '') {
				showTip('请填写新密码！', tipType.error);
				return;
			}
			// 组装用户信息
			const playerInfo = {
				id: this.currentUserId,
				password: this.newPassword,
			};
			let loading = showLoading('45vw', '12vh', '请求密码重置...');
			try {
				const response = await axios({
					method: 'PATCH',
					url: '/api/player/reset/code/' + this.code,
					data: playerInfo,
				});
				if (!response.data.success) {
					showTip('重置密码失败！' + response.data.message, tipType.error);
					loading.destory();
					return;
				}
				showTip('重置密码成功！请用新密码登录！', tipType.info);
				this.setResetPasswordPage(false);
				loading.destory();
			} catch (error) {
				showTip('重置密码失败！', tipType.error);
				loading.destory();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.resetPassword {
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
		height: 325px;
		background-color: rgb(122, 255, 255);
		border-radius: 10px;

		.title {
			font-size: 24px;
			margin-top: 18px;
		}

		input {
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

		.code {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: 75%;
			margin-top: 18px;

			input {
				width: 143px;
				margin-top: 0;
			}

			.sendCode {
				position: relative;
				left: 20px;
				width: 100px;
				height: 32px;
				line-height: 32px;
				text-align: center;
				cursor: pointer;
				border-radius: 6px;
				color: black;

				&:hover {
					color: white;
					background-color: blue;
				}
			}

			// 发送按钮的不可用样式
			.sendCodeDisable {
				color: gray;
				cursor: not-allowed;
			}
		}

		.ok,
		.cancel {
			margin-top: 24px;
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

		.cancel {
			margin-top: 8px;
		}
	}
}
</style>