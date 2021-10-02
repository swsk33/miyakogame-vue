<template>
	<div class="tipFrame">
		<img :src="image" />
		<div :style="textColor" class="text">{{ text }}</div>
	</div>
</template>

<script>
export default {
	name: 'tip',
	data() {
		return {
			image: '',
			text: '',
			audio: '',
			textColor: {
				color: '',
			},
		};
	},
	methods: {
		setData(image, text, color) {
			this.image = image;
			this.text = text;
			this.textColor.color = color;
		},
	},
};
</script>

<style lang="scss" scoped>
@keyframes show {
	0% {
		top: -60px;
		opacity: 0;
	}

	50% {
		top: 5px;
		opacity: 0.9;
	}

	100% {
		top: 5px;
		opacity: 0.9;
	}
}

.tipFrame {
	position: absolute;
	width: 850px;
	height: 60px;
	left: calc(50vw - 425px);
	top: 65px;
	justify-content: center;
	align-items: center;
	display: flex;
	background-color: white;
	opacity: 0;
	border: 2.5px black dashed;
	border-radius: 10px;
	animation-name: show;
	animation-duration: 2s;
	animation-iteration-count: 2;
	animation-direction: alternate;
	animation-timing-function: ease-out;

	img {
		position: relative;
		height: 55px;
		margin-right: 10px;
	}

	.text {
		font-size: 20px;
	}
}
</style>