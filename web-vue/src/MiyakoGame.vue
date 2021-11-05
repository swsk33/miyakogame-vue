<template>
	<div class="miyakoGame">
		<gamebody ref="gameBody"></gamebody>
		<mainmenu ref="mainMenu"></mainmenu>
		<help ref="helpPage"></help>
		<shop ref="shopPage"></shop>
		<loginpage></loginpage>
		<resetpasswordpage></resetpasswordpage>
		<loadingpage ref="loadingPage"></loadingpage>
		<successpage></successpage>
		<failedpage></failedpage>
		<pausepage></pausepage>
		<registerpage></registerpage>
		<userinfoeditpage></userinfoeditpage>
		<userdeleteverifypage></userdeleteverifypage>
		<ranktablepage ref="rankTablePage"></ranktablepage>
	</div>
</template>

<script>
import loadingpage from '@/components/LoadingPage.vue';
import mainmenu from '@/components/MainMenu.vue';
import gamebody from '@/components/GameBody.vue';
import help from '@/components/Help.vue';
import successpage from '@/components/SuccessPage.vue';
import failedpage from '@/components/FailedPage.vue';
import pausepage from '@/components/PausePage.vue';
import shop from '@/components/Shop.vue';
import loginpage from '@/components/LoginPage.vue';
import resetpasswordpage from '@/components/ResetPasswordPage.vue';
import registerpage from '@/components/RegisterPage.vue';
import userinfoeditpage from '@/components/UserInfoEdit.vue';
import userdeleteverifypage from '@/components/UserDeleteVerify.vue';
import ranktablepage from '@/components/RankTable.vue';

import mouseffect from '@/assets/js/mouseffect.js';
import random from '@/assets/js/random.js';
import { createNamespacedHelpers } from 'vuex';

const { mapActions: loadingActions } = createNamespacedHelpers('loading');
const { mapState: timeState, mapActions: timeActions } = createNamespacedHelpers('timecontrol');

export default {
	components: {
		loadingpage,
		mainmenu,
		gamebody,
		help,
		successpage,
		failedpage,
		pausepage,
		shop,
		loginpage,
		resetpasswordpage,
		registerpage,
		userinfoeditpage,
		userdeleteverifypage,
		ranktablepage,
	},
	computed: {
		...timeState(['time', 'festival']),
	},
	methods: {
		...loadingActions(['loadAll']),
		...timeActions(['modifyResourcesBeforeLoad', 'modifyResourcesAfterLoad', 'checkTime']),
		/**
		 * 给页面背景生成星星
		 * @param {*} dom 页面dom对象
		 */
		generateStar(dom) {
			for (let i = 0; i < 150; i++) {
				let starDiv = document.createElement('div');
				starDiv.className = 'star';
				starDiv.style.position = 'absolute';
				starDiv.style.borderRadius = '50%';
				starDiv.style.backgroundColor = 'white';
				starDiv.style.boxShadow = '0 0 9px 0.5px white';
				starDiv.style.left = random.generateRandom(dom.offsetWidth * 0.05, dom.offsetWidth * 0.95) + 'px';
				starDiv.style.top = random.generateRandom(dom.offsetHeight * 0.05, dom.offsetHeight * 0.95) + 'px';
				let sideLength = Math.random();
				if (sideLength < 0.5) {
					sideLength = random.generateRandom(1, 2);
				}
				starDiv.style.width = sideLength + 'px';
				starDiv.style.height = sideLength + 'px';
				dom.insertBefore(starDiv, dom.children[0]);
			}
		},
		/**
		 * 应用样式
		 */
		applyStyle() {
			// 加载页面
			this.$refs.loadingPage.styleValue.loadingHalloween = this.festival.halloween;
			this.$refs.loadingPage.styleValue.loadingNight = this.time.night;
			// 主菜单
			this.$refs.mainMenu.styleValue.menuHalloween = this.festival.halloween;
			this.$refs.mainMenu.styleValue.menuNight = this.time.night;
			// 帮助
			this.$refs.helpPage.styleValue.helpHalloween = this.festival.halloween;
			this.$refs.helpPage.styleValue.helpNight = this.time.night;
			// 商店
			this.$refs.shopPage.styleValue.shopHalloween = this.festival.halloween;
			this.$refs.shopPage.styleValue.shopNight = this.time.night;
			// 排行榜
			this.$refs.rankTablePage.styleValue.rankTableHalloween = this.festival.halloween;
			this.$refs.rankTablePage.styleValue.rankTableNight = this.time.night;
			// 游戏主体背景
			this.$refs.gameBody.styleValue.gameBodyHalloween = this.festival.halloween;
			this.$refs.gameBody.styleValue.gameBodyNight = this.time.night;
			// 给部分背景生成小星星
			if (this.time.night) {
				this.generateStar(this.$refs.loadingPage.$refs.loadingPageDom);
				this.generateStar(this.$refs.mainMenu.$refs.mainMenuDom);
				this.generateStar(this.$refs.gameBody.$refs.gameBodyDom);
			}
		},
	},
	async mounted() {
		// 节日的样式全部由根组件进行管理和修改，而数据方面分散到各个模块中进行修改
		// 打开鼠标效果
		mouseffect.enableAll();
		// 时间和节日检测
		await this.checkTime();
		// 根据时间和节日修改部分加载前资源
		this.modifyResourcesBeforeLoad();
		// 应用样式
		this.applyStyle();
		// 加载全部资源文件
		await this.loadAll();
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