<template>
	<div class="particle normal" v-if="type.normal" :style="style.normal"></div>
	<img class="particle image" :src="imageSource" v-if="type.image" :style="style.image" />
</template>

<script>
import random from '@/assets/js/random.js';

export default {
	data() {
		return {
			/**
			 * 颗粒类型
			 */
			type: {
				/**
				 * 普通div随机颜色发光颗粒类型
				 */
				normal: false,
				/**
				 * 图片自定义类型
				 */
				image: false,
			},
			/**
			 * 变化样式，由js文件调用的时候赋值
			 */
			style: {
				/**
				 * 普通颗粒
				 */
				normal: {},
				/**
				 * 自定义图片颗粒
				 */
				image: {},
			},
			/**
			 * 自定义图片颗粒的图片
			 */
			imageSource: undefined,
		};
	},
	/**
	 * 用于监听颗粒类型以给对应类型赋值
	 */
	watch: {
		type: {
			handler() {
				if (this.type.normal) {
					const color = random.getRandomColor();
					const radius = random.generateRandomFloat(0.5, 1.5);
					this.style.normal = {
						width: radius + 'px',
						height: radius + 'px',
						backgroundColor: color,
						boxShadow: '0px 0px 3.5px 2px ' + color,
					};
				}
			},
			deep: true,
			immediate: true,
		},
	},
};
</script>

<style lang="scss" scoped>
// 通用
.particle {
	position: absolute;
	left: 0;
	top: 0;
}

// 普通颗粒
.normal {
	border-radius: 50%;
}
</style>