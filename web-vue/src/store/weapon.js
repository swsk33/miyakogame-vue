import {
	Position,
	Size,
	GameEntity
} from '@/assets/js/constructors.js';

/**
 * 武器类构造函数，用于构造一个武器模板，继承GameEntity，表示一个武器的子弹模板，发射时通过深复制作为子弹实体对象
 * @param {String} name 武器（魔法）名
 * @param {String} description 武器描述
 * @param {Number} price 武器价格
 * @param {NodeRequire} texture 子弹贴图
 * @param {Number} interval 射击间隔（ms）
 * @param {NodeRequire} sound 射击音效
 * @param {Function} shooting 子弹发射方法，用于生成子弹对象，返回Bullet对象实体（回调函数，需要有两个形参position（Position位置对象）和size（Size尺寸对象），分别表示子弹初始位置和大小）
 */
function Weapon(name, description, price, texture, interval, sound, shooting) {
	this.name = name;
	this.description = description;
	this.price = price;
	this.texture = texture;
	this.interval = interval;
	this.sound = sound;
	/**
	 * 发射子弹
	 * @param {Position} position 子弹初始的位置
	 * @param {Size} size 子弹大小
	 * @returns 子弹Bullet实体对象或者Bullet数组（有的武器是一次多发的）
	 */
	this.shooting = shooting;
}

/**
 * 子弹实体构造函数，继承GameEntity对象
 * @param {Position} position 子弹实体起始位置
 * @param {Size} size 子弹实体起始大小
 * @param {Function} flying 子弹飞行方法，决定子弹飞行方向速度等等，执行一次子弹就会飞行一下，需要计时器循环调用，这个方法返回一个Position对象表示子弹飞行一次后的位置（回调函数，需要有形参enemies表示敌人对象数组，若为单个敌人也放入数组作为单元素数组传入）
 * @param {Function} hitTrigger 子弹击中时触发的函数，击中敌人时发生事件，敌人消失这个事件需要写在这里（回调函数，需要有形参enemy，enemies，分别表示敌人对象和所有敌人数组）
 */
function Bullet(position, size, flying, hitTrigger) {
	GameEntity.call(this, position, size);
	/**
	 * 子弹飞行一次
	 * @param {Array} enemies 全部敌人对象数组
	 * @returns 子弹飞行一次后的位置，为一个Position对象
	 */
	this.flying = flying;
	/**
	 * 子弹击中敌人
	 * @param {Pudding} enemy 被击中的敌人对象
	 * @param {Array} enemies 全部敌人数组
	 */
	this.hitTrigger = hitTrigger;
}

// vuex-武器系统
export default {
	namespaced: true,
	state: {
		/**
		 * 武器列表
		 */
		weaponList: undefined
	},
	mutations: {},
	actions: {}
}