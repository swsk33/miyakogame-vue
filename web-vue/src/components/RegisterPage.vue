<template>
	<div v-if="register" class="register">
		<div class="frame">
			<div class="title">玩家注册</div>
			<input class="username" type="text" placeholder="用户名" v-model="postData.username" />
			<input class="password" type="password" placeholder="密码" v-model="postData.password" />
			<input class="email" type="text" placeholder="邮箱" v-model="postData.email" />
			<input class="nickname" type="text" placeholder="昵称" v-model="postData.nickname" />
			<div class="ok" @click="okButton">确认注册</div>
			<div class="close" @click="setRegisterPage(false)">关闭</div>
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
const { mapActions: dataActions } = createNamespacedHelpers('userdata');

export default {
	data() {
		return {
			/**
			 * 提交的数据
			 */
			postData: {
				username: '',
				password: '',
				nickname: '',
				email: '',
			},
		};
	},
	computed: {
		...pageState(['register']),
	},
	watch: {
		/**
		 * 监听注册页面是否显示，若显示则关闭鼠标效果
		 */
		register() {
			if (this.register) {
				mouseffect.disableAll();
			} else {
				mouseffect.enableAll();
				// 清空输入
				for (let key in this.postData) {
					this.postData[key] = '';
				}
			}
		},
	},
	methods: {
		...dataActions(['userLogin']),
		...pageMutations(['setRegisterPage']),
		/**
		 * 确认注册按钮
		 */
		async okButton() {
			let loading = showLoading('45vw', '12vh', '发起注册请求...');
			try {
				const response = await axios({
					method: 'POST',
					url: '/api/player/register',
					data: this.postData,
				});
				if (!response.data.success) {
					showTip('注册失败！' + response.data.message, tipType.error);
					loading.destory();
					return;
				}
				showTip('注册成功！', tipType.info);
				loading.destory();
				// 注册成功，则自动登录
				this.userLogin({
					credential: this.postData.username,
					password: this.postData.password,
				});
				// 关闭页面
				this.setRegisterPage(false);
			} catch (error) {
				showTip('注册失败！', tipType.error);
				loading.destory();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.register {
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
			font-size: 24px;
			margin-top: 18px;
		}

		input {
			width: 75%;
			height: 32px;
			margin-top: 9px;
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

		.username {
			margin-top: 15px;
		}

		.ok,
		.close {
			margin-top: 17px;
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
			margin-top: 5px;
		}
	}
}
</style>