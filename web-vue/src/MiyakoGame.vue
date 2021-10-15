<template>
	<div class="miyakoGame">
		<gamebody></gamebody>
		<mainmenu @showSubPage="showFrame"></mainmenu>
		<help ref="help"></help>
		<loadingpage></loadingpage>
	</div>
</template>

<script>
import mouseffect from '@/assets/js/mouseffect.js';
import loadingpage from '@/components/LoadingPage.vue';
import mainmenu from '@/components/MainMenu.vue';
import gamebody from '@/components/GameBody.vue';
import help from '@/components/Help.vue';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('gamingcontrol');

export default {
	components: {
		loadingpage,
		mainmenu,
		gamebody,
		help,
	},
	methods: {
		...mapActions(['readGameData']),
		/**
		 * 显示一些游戏子页面
		 * @param {String} page 页面名，名字有：shop - 商店；rank - 排行榜；help - 帮助；succeed - 成功；failed - 失败；pause - 暂停
		 */
		showFrame(page) {
			switch (page) {
				case 'help':
					this.$refs.help.operateHelp(true);
					break;
			}
		},
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