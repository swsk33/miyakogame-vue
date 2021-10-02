<template>
	<div :style="gifPosition" class="loading">
		<img src="../assets/image/youlDynamic.gif" />
		<div class="text">{{ text }}</div>
	</div>
</template>

<script>
export default {
	name: 'loading',
	data() {
		return {
			text: '',
			gifPosition: {
				left: '',
				top: '',
			},
		};
	},
	methods: {
		setData(x, y, text) {
			this.gifPosition.left = x;
			this.gifPosition.top = y;
			this.text = text;
		},
	},
};
</script>

<style lang="scss" scoped>
.loading {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;

	img {
		height: 64px;
		margin-right: 10px;
	}

	.text {
		white-space: nowrap;
	}
}
</style>