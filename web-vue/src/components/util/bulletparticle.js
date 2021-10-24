import {
	createApp
} from 'vue';
import random from '@/assets/js/random.js';

import BulletParticle from './BulletParticle.vue';

// 最大最小角（°）
const maxDeg = 260;
const minDeg = 170;

// 粒子生存时间(ms)
const liveTime = 250;

/**
 * 获取一个用于挂载Vue组件的dom元素
 * @param {String} x dom所在x坐标位置，需要带单位例如px、vw等等
 * @param {String} y dom所在y坐标位置，需要带单位例如px、vh等等
 * @returns dom元素
 */
function getMountDom(x, y) {
	const dom = document.createElement('div');
	dom.style.position = 'absolute';
	dom.style.width = 0;
	dom.style.height = 0;
	dom.style.left = x;
	dom.style.top = y;
	dom.style.transitionProperty = 'left top';
	dom.style.transitionDuration = '1s';
	dom.style.transitionTimingFunction = 'ease-out';
	return dom;
}

/**
 * 生成一个随机颜色的子弹飞行尾迹粒子
 * @param {String} x dom所在x坐标位置，需要带单位例如px、vw等等
 * @param {String} y dom所在y坐标位置，需要带单位例如px、vh等等
 */
export function generateRandomParticle(x, y) {
	const dom = getMountDom(x, y);
	document.body.appendChild(dom);
	const particle = createApp(BulletParticle).mount(dom);
	particle.type.normal = true;
	// 移动颗粒
	let dotFlydirect = random.generateRandom(minDeg, maxDeg);
	dom.style.left = dom.offsetLeft + Math.cos(dotFlydirect * Math.PI / 180) * 25 + 'px';
	dom.style.top = dom.offsetTop - Math.sin(dotFlydirect * Math.PI / 180) * 25 + 'px';
	setTimeout(() => {
		dom.remove();
	}, liveTime);
}

/**
 * 生成一个自定义的图片型颗粒
 * @param {String} x dom所在x坐标位置，需要带单位例如px、vw等等
 * @param {String} y dom所在y坐标位置，需要带单位例如px、vh等等
 * @param {Array} images 粒子图片数组，需要require引用后的图片资源对象
 */
export function generateImageParticle(x, y, images) {
	const dom = getMountDom(x, y);
	document.body.appendChild(dom);
	const particleImage = images[random.generateRandom(0, images.length - 1)];
	const particle = createApp(BulletParticle).mount(dom);
	particle.type.image = true;
	particle.imageSource = particleImage;
	// 移动颗粒
	let dotFlydirect = random.generateRandom(minDeg, maxDeg);
	dom.style.left = dom.offsetLeft + Math.cos(dotFlydirect * Math.PI / 180) * 25 + 'px';
	dom.style.top = dom.offsetTop - Math.sin(dotFlydirect * Math.PI / 180) * 25 + 'px';
	setTimeout(() => {
		dom.remove();
	}, liveTime);
}