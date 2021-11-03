<template>
	<div class="loginButton" v-if="!isLogin">
		<div class="login">登录</div>
		<div class="register">注册</div>
	</div>
	<div class="userInfo" v-if="isLogin">
		<img class="avatar" :src="onlineUserData.avatar" />
		<div class="nickname">{{ onlineUserData.nickname }}</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState: dataState, mapActions: dataActions } = createNamespacedHelpers('userdata');

export default {
	computed: {
		...dataState(['isLogin', 'onlineUserData']),
	},
	methods: {
		...dataActions(['userLogout']),
	},
};
</script>

<style lang="scss" scoped>
</style>