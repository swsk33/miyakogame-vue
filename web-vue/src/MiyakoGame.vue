<template>
	<div class="miyakoGame">
		<gamebody></gamebody>
		<mainmenu></mainmenu>
		<help></help>
		<successpage></successpage>
		<failedpage></failedpage>
		<pausepage></pausepage>
		<loadingpage></loadingpage>
	</div>
</template>

<script>
import mouseffect from '@/assets/js/mouseffect.js';
import loadingpage from '@/components/LoadingPage.vue';
import mainmenu from '@/components/MainMenu.vue';
import gamebody from '@/components/GameBody.vue';
import help from '@/components/Help.vue';
import successpage from '@/components/SuccessPage.vue';
import failedpage from '@/components/FailedPage.vue';
import pausepage from '@/components/PausePage.vue';
import { createNamespacedHelpers } from 'vuex';

const { mapActions: loadingActions } = createNamespacedHelpers('loading');

export default {
	components: {
		loadingpage,
		mainmenu,
		gamebody,
		help,
		successpage,
		failedpage,
		pausepage,
	},
	methods: {
		...loadingActions(['loadAll']),
	},
	mounted() {
		mouseffect.enableAll();
		// 加载全部资源文件
		this.loadAll();
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