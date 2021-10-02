<template>
	<div class="miyakoGame">
		<loadingpage></loadingpage>
	</div>
</template>

<script>
import mouseffect from '@/assets/js/mouseffect.js';
import loadingpage from '@/components/LoadingPage.vue';

export default {
	components: {
		loadingpage,
	},
	mounted() {
		mouseffect.enableAll();
	},
};
</script>

<style lang="scss" scoped>
.miyakoGame {
	position: absolute;
	width: 100vw;
	height: 100vh;
	left: 0;
	top: 0;
}
</style>