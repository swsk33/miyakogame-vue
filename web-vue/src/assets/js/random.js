// 颜色列表
const colors = ['#00ff7f', '#ff0f26', '#ff7d0f', '#ffe72e', '#b2ff2e', '#3cff2e', '#2effd3', '#0700ff', '#c000ff', '#ffffff', '#f375ff', '#ffd1e4', '#ddff57', '#ffdd8a'];

export default {
	/**
	 * 生成范围是[min,max]的随机整数
	 * @param {Number} min 期望最小值
	 * @param {Number} max 期望最大值
	 * @returns 介于min，max且包含两者的随机整数
	 */
	generateRandom(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	/**
	 * 生成范围是[min,max)的随机浮点数
	 * @param {Number} min 期望最小值
	 * @param {Number} max 期望最大值
	 * @returns 介于min，max且包含两者的随机浮点数
	 */
	generateRandomFloat(min, max) {
		return Math.random() * (max - min) + min;
	},
	/**
	 * 获取一个随机颜色
	 * @returns 一个十六进制颜色代码
	 */
	getRandomColor() {
		return colors[this.generateRandom(0, colors.length - 1)];
	}
}