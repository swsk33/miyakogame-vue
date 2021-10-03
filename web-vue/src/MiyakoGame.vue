<template>
	<div class="miyakoGame">
		<mainmenu></mainmenu>
		<loadingpage></loadingpage>
		<gamebody></gamebody>
	</div>
</template>

<script>
import mouseffect from '@/assets/js/mouseffect.js';
import loadingpage from '@/components/LoadingPage.vue';
import mainmenu from '@/components/MainMenu.vue';
import gamebody from '@/components/GameBody.vue';

export default {
	components: {
		loadingpage,
		mainmenu,
		gamebody,
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