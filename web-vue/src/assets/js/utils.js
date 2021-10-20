/**
 * 对一个对象进行深复制
 * @param {*} originObject 原对象
 * @returns 复制的对象
 */
export function copyObject(originObject, map = new WeakMap()) {
	// 如果传入对象是基本类型，则直接返回
	// null是一种特殊情况，它被判定为Object类型，但是实质上它是个基本类型
	if (originObject === null || (typeof originObject != 'object' && typeof originObject != 'function')) {
		return originObject;
	}
	// 否则，说明是引用类型
	// 我们使用map记录已经克隆过的变量，先检测map中是否记录了原对象，如果是说明这个传入对象已被复制过，直接返回
	if (map.has(originObject)) {
		return map.get(originObject);
	}
	// 获取原对象的构造函数，并用这个构造函数创建新的对象
	let destObject = new originObject.constructor();
	// 记录到map里面，表示这个对象已被复制，并传入递归调用，防止循环引用导致内存溢出
	map.set(originObject, destObject);
	// 开始遍历对象的属性并执行递归复制
	for (let key in originObject) {
		destObject[key] = copyObject(originObject[key], map);
	}
	return destObject;
}