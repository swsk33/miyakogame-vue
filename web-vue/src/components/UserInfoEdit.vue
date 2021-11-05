<template>
	<div class="userInfoEdit" v-if="infoEdit">
		<div class="frame">
			<div class="title">修改用户信息</div>
			<div class="avatar">
				<div class="text">修改头像：</div>
				<div class="upload">
					<div class="uploadButton">上传图片</div>
					<input type="file" @change="getImageFile($event)" />
				</div>
				<div class="random" @click="getRandomAvatar">随机</div>
				<img :src="previewImage" />
			</div>
			<div class="nickname">
				<div class="text">昵称：</div>
				<input type="text" class="textInput" v-model="userData.nickname" />
			</div>
			<div class="password">
				<div class="text">密码：</div>
				<input type="password" class="textInput" v-model="userData.password" placeholder="不修改留空" />
			</div>
			<div class="email">
				<div class="text">邮箱：</div>
				<input type="text" class="textInput" v-model="userData.email" placeholder="不修改留空" />
			</div>
			<div class="button">
				<div class="ok" @click="updateUser">确定</div>
				<div class="cancel" @click="setInfoEditPage(false)">取消</div>
			</div>
			<div class="userDeleteButton" @click="userDeleteButton">永久注销账户</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import random from '@/assets/js/random.js';
import { createNamespacedHelpers } from 'vuex';
import { showLoading } from '@/components/util/loading.js';
import { showTip, tipType } from '@/components/util/tip.js';
import { showDialog } from '@/components/util/mydialog.js';

const { mapState: dataState, mapActions: dataActions } = createNamespacedHelpers('userdata');
const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapState: imageState } = createNamespacedHelpers('image');

export default {
	data() {
		return {
			/**
			 * 预上传的头像图片文件
			 */
			preUploadImage: undefined,
			/**
			 * 预览头像
			 */
			previewImage: '',
			/**
			 * 提交的用户信息
			 */
			userData: {
				id: '',
				username: '',
				nickname: '',
				password: '',
				email: '',
				avatar: '',
			},
		};
	},
	computed: {
		...dataState(['onlineUserData']),
		...pageState(['infoEdit']),
		...imageState(['imageList']),
	},
	watch: {
		/**
		 * 监听信息修改页面，页面打开时填入用户信息
		 */
		infoEdit() {
			if (this.infoEdit) {
				this.userData.id = this.onlineUserData.id;
				this.userData.username = this.onlineUserData.username;
				this.userData.nickname = this.onlineUserData.nickname;
				this.userData.email = this.onlineUserData.email;
				this.userData.avatar = this.onlineUserData.avatar;
				this.previewImage = this.onlineUserData.avatar;
			} else {
				// 清空输入数据
				for (let key in this.userData) {
					this.userData[key] = '';
				}
			}
		},
	},
	methods: {
		...pageMutations(['setInfoEditPage', 'setUserDeleteVerifyPage']),
		...dataActions(['checkUserLogin']),
		/**
		 * 获取选择的文件并显示到预览图
		 */
		getImageFile(e) {
			this.preUploadImage = e.target.files[0];
			let reader = new FileReader();
			reader.onload = () => {
				this.previewImage = reader.result;
			};
			reader.readAsDataURL(this.preUploadImage);
		},
		/**
		 * 获取随机头像
		 */
		async getRandomAvatar() {
			let loading = showLoading('45vw', '6vh', '获取头像中...');
			try {
				const response = await axios.get('/api/avatar/random');
				if (!response.data.success) {
					showTip('获取随机头像失败！', tipType.error);
					loading.destory();
					return;
				}
				showTip('获取随机头像成功！', tipType.info);
				this.preUploadImage = undefined;
				this.userData.avatar = response.data.data;
				this.previewImage = response.data.data;
			} catch (error) {
				showTip('获取随机头像失败！', tipType.error);
			}
			loading.destory();
		},
		/**
		 * 更新用户信息
		 */
		async updateUser() {
			let loading = showLoading('45vw', '6vh', '请求更新信息中...');
			// 上传头像
			if (this.preUploadImage != undefined) {
				let form = new FormData();
				form.append('image', this.preUploadImage);
				try {
					const response = await axios({
						method: 'PUT',
						url: '/api/avatar/upload',
						data: form,
					});
					if (!response.data.success) {
						showTip('上传头像失败！' + response.data.message, tipType.error);
						loading.destory();
						return;
					}
					this.userData.avatar = response.data.data;
				} catch (error) {
					showTip('上传头像失败！' + error.response.data.message, tipType.error);
					loading.destory();
					return;
				}
			}
			// 提交用户信息
			try {
				const response = await axios({
					method: 'PATCH',
					url: '/api/player/update',
					data: this.userData,
				});
				if (!response.data.success) {
					showTip('修改用户信息失败！' + response.data.message, tipType.error);
					loading.destory();
					return;
				}
				loading.destory();
				showTip('修改用户信息成功！', tipType.info);
				// 刷新本地储存的用户数据
				this.checkUserLogin();
				this.setInfoEditPage(false);
			} catch (error) {
				showTip('修改用户信息失败！', tipType.error);
				loading.destory();
			}
		},
		/**
		 * 用户注销按钮
		 */
		userDeleteButton() {
			showDialog(
				'注销用户将永久地删除该用户，是否继续？',
				this.imageList.png.tipicon.error['e' + random.generateRandom(1, 5)],
				async () => {
					let loading = showLoading('45vw', '6vh', '请求发送验证码...');
					try {
						const response = await axios.get('/api/email/delete/' + this.onlineUserData.id);
						if (!response.data.success) {
							showTip('发送验证码失败！', tipType.error);
							loading.destory();
							return;
						}
						// 打开验证码窗口
						loading.destory();
						this.setUserDeleteVerifyPage(true);
					} catch (error) {
						showTip('发送验证码失败！', tipType.error);
						loading.destory();
					}
				},
				() => {}
			);
		},
	},
};
</script>

<style lang="scss" scoped>
.userInfoEdit {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100vh;
	left: 0;
	top: 0;
	background-color: rgba(255, 255, 255, 0.8);

	@keyframes frame-show {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}

	.frame {
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;
		background-color: rgb(150, 255, 255);
		width: 650px;
		height: 450px;
		border-radius: 10px;
		box-shadow: 3px 3px 10px 2px gray;
		user-select: none;
		animation-name: frame-show;
		animation-duration: 0.5s;
		animation-timing-function: ease-in-out;

		.title {
			position: relative;
			font-size: 28px;
			margin-top: 28px;
		}

		.avatar,
		.nickname,
		.password,
		.email,
		.button {
			position: relative;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-top: 24px;

			.text {
				position: relative;
				font-size: 24px;
			}

			.textInput {
				outline: none;
				height: 28px;
				width: 350px;
				font-size: 20px;
				border: 2px blue solid;
				border-radius: 5px;

				&:focus {
					border: 3px rgb(255, 52, 164) solid;
					box-shadow: 0 0 8px 2px rgb(255, 33, 170);
				}
			}
		}

		.avatar {
			position: relative;
			width: 80%;
			height: 72px;
			justify-content: space-evenly;
			margin-top: 18px;

			.text {
				left: 36px;
			}

			.upload {
				position: relative;
				width: 100px;
				height: 32px;

				input {
					position: absolute;
					width: 100%;
					height: 100%;
					opacity: 0;
				}

				.uploadButton {
					position: absolute;
					width: 100%;
					height: 100%;
					background-color: rgb(255, 216, 145);
					line-height: 32px;
					text-align: center;
				}
			}

			.random {
				width: 48px;
				height: 32px;
				line-height: 32px;
				text-align: center;
				background-color: pink;
			}

			img {
				position: relative;
				height: 64px;
				width: 64px;
				border: 2px blueviolet solid;
				border-radius: 50%;
			}
		}

		.button {
			width: 80%;
			margin-top: 48px;
			justify-content: space-evenly;
			font-size: 28px;

			.ok,
			.cancel {
				width: 80px;
				height: 36px;
				line-height: 36px;
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

		.userDeleteButton {
			position: absolute;
			right: 2%;
			bottom: 2%;
			cursor: pointer;

			&:hover {
				color: rgb(255, 31, 255);
			}
		}
	}
}
</style>