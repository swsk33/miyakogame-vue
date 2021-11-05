<!-- 用户注销邮箱验证码验证界面 -->
<template>
	<div class="userDeleteVerify" v-if="userDeleteVerify">
		<div class="frame">
			<div class="text">一封包含验证码的邮件已经发送到您当前账户的邮箱，请将邮件中的验证码输入到下面输入框中以完成用户注销流程。</div>
			<input type="text" placeholder="验证码" v-model="code" />
			<div class="button">
				<div class="ok" @click="okButton">确认注销</div>
				<div class="cancel" @click="setUserDeleteVerifyPage(false)">取消</div>
			</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { showLoading } from '@/components/util/loading.js';
import { showTip, tipType } from '@/components/util/tip.js';
import axios from 'axios';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapState: dataState, mapActions: dataActions } = createNamespacedHelpers('userdata');

export default {
	data() {
		return {
			userId: undefined,
			code: '',
		};
	},
	watch: {
		userDeleteVerify() {
			if (this.userDeleteVerify) {
				this.userId = this.onlineUserData.id;
			} else {
				this.userId = undefined;
				this.code = undefined;
			}
		},
	},
	computed: {
		...pageState(['userDeleteVerify']),
		...dataState(['onlineUserData']),
	},
	methods: {
		...pageMutations(['setInfoEditPage', 'setUserDeleteVerifyPage']),
		...dataActions(['userLogout']),
		/**
		 * 确认注销按钮
		 */
		async okButton() {
			if (this.code === '') {
				showTip('验证码不能为空！', tipType.error);
				return;
			}
			let loading = showLoading('45vw', '6vh', '请求用户注销...');
			try {
				const response = await axios({
					method: 'DELETE',
					url: '/api/player/delete/id/' + this.userId + '/code/' + this.code,
				});
				if (!response.data.success) {
					showTip('用户注销失败！' + response.data.message, tipType.error);
					loading.destory();
					return;
				}
				showTip('用户注销完成！', tipType.info);
				loading.destory();
				this.userLogout();
				this.setUserDeleteVerifyPage(false);
				this.setInfoEditPage(false);
			} catch (error) {
				showTip('用户注销失败！', tipType.error);
				loading.destory();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.userDeleteVerify {
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
		width: 520px;
		height: 250px;
		background-color: rgb(122, 255, 255);
		border-radius: 10px;

		.text {
			margin-top: 16px;
			width: 90%;
			font-size: 20px;
		}

		input {
			outline: none;
			height: 28px;
			width: 350px;
			font-size: 20px;
			border: 2px blue solid;
			border-radius: 5px;
			margin-top: 24px;

			&:focus {
				border: 3px rgb(255, 52, 164) solid;
				box-shadow: 0 0 8px 2px rgb(255, 33, 170);
			}
		}

		.button {
			width: 80%;
			margin-top: 32px;
			font-size: 21px;
			display: flex;
			justify-content: space-evenly;
			align-items: center;

			.ok,
			.cancel {
				width: 100px;
				height: 32px;
				line-height: 32px;
				border-radius: 8px;
				text-align: center;
				cursor: pointer;

				&:hover {
					color: white;
				}
			}

			.ok {
				&:hover {
					background-color: blue;
				}
			}

			.cancel {
				&:hover {
					background-color: purple;
				}
			}
		}
	}
}
</style>