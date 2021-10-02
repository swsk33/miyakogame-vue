//鼠标点击和移动效果
let isDropDotExists = false;
import random from './random.js';

/**
 * 获取一个随机的点dom对象
 */
function getRandomDot() {
	let dot = document.createElement('div');
	let color = random.getRandomColor();
	dot.style.position = 'absolute';
	dot.style.width = '2px';
	dot.style.height = '2px';
	dot.style.borderRadius = '50%';
	dot.style.backgroundColor = color;
	dot.style.boxShadow = '0px 0px 4px 5px ' + color;
	return dot;
}

/**
 * 每200ms生成下落点
 */
function genDropDot() {
	if (!isDropDotExists) {
		let mx = window.event.pageX;
		let my = window.event.pageY;
		let dropDot = getRandomDot();
		dropDot.style.left = mx + 'px';
		dropDot.style.top = my + 'px';
		document.body.appendChild(dropDot);
		isDropDotExists = true;
		let addition = 0.05;
		let dotMove = setInterval(() => {
			my = my + addition;
			dropDot.style.top = my + 'px';
			addition = addition + 0.1;
			if (addition > 5 || my + 5 >= window.innerHeight || mx + 5 >= window.innerWidth) {
				clearInterval(dotMove);
				dropDot.remove();
			}
		}, 16);
		setTimeout(() => {
			isDropDotExists = false;
		}, 200);
	}
}

/**
 * 生成随机一条线
 */
function genRandomLine() {
	let line = document.createElement('div');
	line.style.position = 'absolute';
	line.style.width = '1.5px';
	line.style.height = '2px';
	line.style.backgroundColor = random.getRandomColor();
	return line;
}

/**
 * 生成发散线
 */
function genDivergenceLine() {
	let count = random.generateRandom(15, 24);
	for (let i = 0; i < count; i++) {
		let lineDeg = random.generateRandom(1, 360);
		let line = genRandomLine();
		let length = line.offsetHeight;
		let offsetX = Math.sin((lineDeg / 180) * Math.PI) * (length / 2);
		let offsetY = Math.cos((lineDeg / 180) * Math.PI) * (length / 2);
		let mx = window.event.pageX;
		let my = window.event.pageY;
		let initX = mx + offsetX;
		let initY = my + offsetY;
		line.style.transform = 'rotate(' + lineDeg + 'deg' + ')';
		line.style.left = initX + 'px';
		line.style.top = initY + 'px';
		document.body.appendChild(line);
		let moveAddition = 1;
		let lengthAddition = 1;
		let keyFrame = 1;
		let totalFrame = random.generateRandom(18, 30);
		let lineMove = setInterval(() => {
			let signX = 1;
			let signY = 1;
			let signLength = 1;
			if (lineDeg <= 90) {
				signX = 1;
				signY = -1;
			} else if (lineDeg > 90 && lineDeg <= 180) {
				signX = 1;
				signY = -1;
			} else if (lineDeg > 180 && lineDeg <= 270) {
				signX = 1;
				signY = -1;
			} else {
				signX = 1;
				signY = -1;
			}
			if (keyFrame > totalFrame / 2) {
				signLength = -1;
			}
			initX = initX + (signX * Math.sin((lineDeg / 180) * Math.PI)) * moveAddition;
			initY = initY + (signY * Math.cos((lineDeg / 180) * Math.PI)) * moveAddition;
			length = length + (signLength * lengthAddition);
			line.style.left = initX + 'px';
			line.style.top = initY + 'px';
			line.style.height = length + 'px';
			keyFrame++;
			if (keyFrame > totalFrame || initX + 10 >= window.innerWidth || initY + 10 >= window.innerHeight) {
				line.remove();
				clearInterval(lineMove);
			}
		}, 16);
	}
}

export default {
	/**
	 * 控制鼠标下落点效果
	 * @param {*} isOpen 是否打开
	 */
	mouseMoveDropDotControl(isOpen) {
		if (isOpen) {
			document.addEventListener('mousemove', genDropDot);
		} else {
			document.removeEventListener('mousemove', genDropDot);
		}
	},
	/**
	 * 控制鼠标点击发散线效果
	 * @param {*} isOpen 是否打开
	 */
	mouseClickLineControl(isOpen) {
		if (isOpen) {
			document.addEventListener('click', genDivergenceLine);
		} else {
			document.removeEventListener('click', genDivergenceLine);
		}
	},
	/**
	 * 启用全部效果
	 */
	enableAll() {
		document.addEventListener('mousemove', genDropDot);
		document.addEventListener('click', genDivergenceLine);
	},
	/**
	 * 关闭全部效果
	 */
	disableAll() {
		document.removeEventListener('mousemove', genDropDot);
		document.removeEventListener('click', genDivergenceLine);
	}
}