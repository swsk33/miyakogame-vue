<template>
	<div class="popupMessage">{{ text }}</div>
</template>

<script>
export default {
	data() {
		return {
			text: undefined,
		};
	},
};
</script>

<style lang="scss" scoped>
@keyframes up {
	from {
		top: 0px;
		opacity: 1;
	}
	to {
		top: -50px;
		opacity: 0;
	}
}
.popupMessage {
	position: absolute;
	animation-name: up;
	animation-duration: 0.9s;
	animation-timing-function: cubic-bezier(0, 0, 0, 1);
	white-space: nowrap;
}
</style>