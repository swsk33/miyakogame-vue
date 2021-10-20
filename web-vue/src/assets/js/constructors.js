// 游戏中的抽象对象构造函数

/**
 * 元素位置构造函数，表示一个元素的绝对定位的位置
 * @param {Number} x x坐标，即为绝对定位的left值，单位px
 * @param {Number} y y坐标，即为绝对定位的top值，单位px
 */
function Position(x = 0, y = 0) {
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
function Size(width = 0, height = 0) {
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
function GameEntity(position = new Position(0, 0), size = new Size(0, 0)) {
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
	/**
	 * 获取这个实体的尺寸
	 * @returns 实体尺寸对象
	 */
	this.getSize = () => {
		const widthStr = this.style.width;
		const heightStr = this.style.height;
		const width = parseInt(widthStr.substring(0, widthStr.length - 2));
		const height = parseInt(heightStr.substring(0, heightStr.length - 2));
		return new Size(width, height);
	}
	/**
	 * 判断自身是否与传入的实体相碰撞
	 * @param {GameEntity} otherEntity 传入实体
	 * @returns 是否碰撞
	 */
	this.isCollision = (otherEntity) => {
		const selfPosition = this.getPosition();
		const selfSize = this.getSize();
		const otherPosition = otherEntity.getPosition();
		const otherSize = otherEntity.getSize();
		// 起始条件：自身的右下角的点位于传入实体的左上角
		const startCondition = (selfPosition.x + selfSize.width >= otherPosition.x) && (selfPosition.y + selfSize.height >= otherPosition.y);
		// 终止条件：自身的左上角的点位于传入实体的右下角
		const endCondition = (selfPosition.x <= otherPosition.x + otherSize.width) && (selfPosition.y <= otherPosition.y + otherSize.height);
		// 两者同时达成，才算碰撞
		return startCondition && endCondition;
	}
}

export {
	Size,
	Position,
	GameEntity
}