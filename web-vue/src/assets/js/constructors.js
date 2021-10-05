// 游戏中的抽象对象构造函数

/**
 * 元素位置构造函数，表示一个元素的绝对定位的位置
 * @param {Number} x x坐标，即为绝对定位的left值，单位px
 * @param {Number} y y坐标，即为绝对定位的top值，单位px
 */
function Position(x, y) {
	/**
	 * x坐标
	 */
	this.x = x;
	/**
	 * y坐标
	 */
	this.y = y;
}

/**
 * 元素尺寸构造函数，表示一个元素的大小
 * @param {Number} width 宽度，单位px
 * @param {Number} height 高度，单位px
 */
function Size(width, height) {
	/**
	 * 实体宽度
	 */
	this.width = width;
	/**
	 * 实体高度
	 */
	this.height = height;
}

/**
 * 游戏实体对象构造函数，表示任何在游戏背景中可以运动的实体
 * @param {Position} position 位置
 * @param {Size} size 大小
 */
function GameEntity(position, size) {
	/**
	 * 元素的css属性
	 */
	this.style = {
		position: 'absolute',
		display: 'block',
		left: position.x + 'px',
		top: position.y + 'px',
		width: size.width + 'px',
		height: size.height + 'px'
	};
	/**
	 * 获取这个实体的位置
	 * @returns 实体位置对象
	 */
	this.getPosition = () => {
		const left = this.style.left;
		const top = this.style.top;
		const x = parseInt(left.substring(0, left.length - 2));
		const y = parseInt(top.substring(0, top.length - 2));
		return new Position(x, y);
	};
}

export {
	Size,
	Position,
	GameEntity
}