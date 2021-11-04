<template>
	<div class="register">
		<div class="frame">
			<div class="title">用户注册</div>
			<input class="username" type="text" placeholder="用户名" />
			<input class="password" type="password" />
			<input class="email" type="text" />
			<div class="ok">确认注册</div>
			<div class="close">关闭</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { showTip, tipType } from '@/components/util/tip.js';
import mouseffect from '@/assets/js/mouseffect.js';
import axios from 'axios';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');

export default {
	computed: {
		...pageState(['register']),
	},
	methods: {
		...pageMutations(['setRegisterPage']),
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
	}
}
</style>