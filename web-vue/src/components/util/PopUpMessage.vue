<template>
	<div :class="{ popupMessage: true, popupMessageNight: isNight }">{{ text }}</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState: timeState } = createNamespacedHelpers('timecontrol');

export default {
	data() {
		return {
			text: undefined,
			isNight: false,
		};
	},
	computed: {
		...timeState(['time', 'festival']),
	},
	mounted() {
		this.isNight = this.festival.halloween || this.time.night;
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

.popupMessageNight {
	color: white;
	text-shadow: 0.2px 0.2px 2px white;
}
</style>