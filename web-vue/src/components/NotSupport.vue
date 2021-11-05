<!-- 不支持设备页面 -->
<template>
	<div class="notSupport" v-if="notSupport">
		<img src="@/assets/image/avatar/notSupport.png" />
		<div class="text">抱歉！该游戏不支持移动端！请使用电脑端访问！</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState: pageState } = createNamespacedHelpers('pagecontrol');

export default {
	computed: {
		...pageState(['notSupport']),
	},
};
</script>

<style lang="scss" scoped>
.notSupport {
	position: absolute;
	display: flex;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	background-color: #88ffff;
	justify-content: center;
	align-items: center;

	img {
		width: 90px;
		height: 90px;
		border: 3px blue solid;
		border-radius: 50%;
		margin-left: 2vw;
	}

	.text {
		font-size: 28px;
		width: 60%;
		margin-left: 3vw;
	}
}
</style>