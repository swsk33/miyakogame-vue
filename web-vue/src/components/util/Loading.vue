<template>
	<div :style="gifPosition" class="loading">
		<img :src="imageList.gif.youlDynamic" />
		<div class="text">{{ text }}</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState: imageState } = createNamespacedHelpers('image');

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
	computed: {
		...imageState(['imageList']),
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