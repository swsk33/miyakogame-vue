<template>
	<div class="mydialog">
		<div class="frame">
			<div class="content">
				<img :src="image" />
				<div class="text">{{ text }}</div>
			</div>
			<div class="buttons">
				<div class="ok" @click="clickOk">确定</div>
				<div class="cancel" @click="clickCancel">取消</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'mydialog',
	data() {
		return {
			text: '',
			image: '',
			mountDom: '',
		};
	},
	methods: {
		/**
		 * 自定义确定事件
		 */
		ok() {},
		/**
		 * 自定义取消事件
		 */
		cancel() {},
		clickOk() {
			this.ok();
			this.mountDom.remove();
		},
		clickCancel() {
			this.cancel();
			this.mountDom.remove();
		},
		setData(text, image, ok, cancel, mountDom) {
			this.text = text;
			this.image = image;
			this.ok = ok;
			this.cancel = cancel;
			this.mountDom = mountDom;
		},
	},
};
</script>

<style lang="scss" scoped>
.mydialog {
	position: absolute;
	width: 100vw;
	height: 100vh;
	left: 0;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.7);

	.frame {
		width: 560px;
		height: 250px;
		background-color: rgb(177, 255, 229);
		box-shadow: 1px 1px 7px 2px rgb(90, 203, 255);
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;

		.content {
			display: flex;
			width: 85%;
			justify-content: flex-start;
			align-items: center;

			img {
				height: 64px;
			}

			.text {
				font-size: 24px;
				margin-left: 24px;
			}
		}

		.buttons {
			display: flex;
			width: 80%;
			justify-content: space-around;
			align-items: center;
			font-size: 26px;

			.ok,
			.cancel {
				width: 75px;
				height: 32px;
				text-align: center;
				line-height: 32px;
				border-radius: 6px;
				user-select: none;
				cursor: pointer;
			}

			.ok {
				&:hover {
					color: white;
					background-color: blue;
				}
			}

			.cancel {
				&:hover {
					color: white;
					background-color: rgb(255, 0, 98);
				}
			}
		}
	}
}
</style>