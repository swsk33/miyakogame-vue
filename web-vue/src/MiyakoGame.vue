<template>
	<div class="miyakoGame">
		<mainmenu></mainmenu>
		<gamebody></gamebody>
		<loadingpage></loadingpage>
	</div>
</template>

<script>
import mouseffect from '@/assets/js/mouseffect.js';
import loadingpage from '@/components/LoadingPage.vue';
import mainmenu from '@/components/MainMenu.vue';
import gamebody from '@/components/GameBody.vue';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('gamingcontrol');

export default {
	components: {
		loadingpage,
		mainmenu,
		gamebody,
	},
	methods: {
		...mapActions(['readGameData']),
	},
	mounted() {
		mouseffect.enableAll();
		this.readGameData();
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