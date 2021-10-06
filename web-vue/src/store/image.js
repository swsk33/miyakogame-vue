/**
 * 根据一个图片列表对象递归加载png图片文件
 * @param {String} pathPrefix 图片所在路径（需要以/结尾，根路径传入空字符串''）
 * @param {Object} imageList 图片列表对象，图片列表对象中属性和图片文件夹目录结构一致，每个表示图片文件的属性先要留空为undefined
 * @param {String} type 图片类型（.开头扩展名）
 */
function loadImageByObject(pathPrefix, imageList, type) {
	for (let key in imageList) {
		if (imageList[key] == undefined) {
			let image = new Image();
			let filePath = pathPrefix + key + type;
			image.src = require('@/assets/image/' + filePath);
			imageList[key] = image;
		} else {
			let prefix = pathPrefix + key + '/';
			loadImageByObject(prefix, imageList[key], type);
		}
	}
}

/**
 * 递归获取一个图片列表的总数
 * @param {Object} imageList 图片列表对象，图片列表对象中属性和图片文件夹目录结构一致
 * @returns 全部图片资源数量
 */
function getImageCount(imageList) {
	let total = 0;
	for (let key in imageList) {
		if (Object.prototype.toString.call(imageList[key]) === '[object Object]') {
			total = total + getImageCount(imageList[key]);
		} else {
			total++;
		}
	}
	return total;
}

/**
 * 递归检查一个图片列表中已加载的图片数量
 * @param {Object} imageList 图片列表对象，图片列表对象中属性和图片文件夹目录结构一致
 * @returns 已加载图片数量
 */
function checkImageLoaded(imageList) {
	let loaded = 0;
	for (let key in imageList) {
		if (Object.prototype.toString.call(imageList[key]) === '[object Object]') {
			loaded = loaded + checkImageLoaded(imageList[key]);
		} else {
			if (Object.prototype.toString.call(imageList[key]) === '[object HTMLImageElement]' && imageList[key].complete) {
				loaded++;
			}
		}
	}
	return loaded;
}

// vuex-图片资源模块
export default {
	namespaced: true,
	state: {
		pngImageList: {
			avatar: {
				angry: undefined,
				excepted: undefined,
				happy: undefined,
				notSupport: undefined
			},
			bullet: {
				normal: undefined,
				penetrate: undefined,
				scatterIcon: undefined,
				bounce1: undefined,
				bounce2: undefined,
				bounceIcon: undefined,
				trace: undefined
			},
			prop: {
				addHealth: undefined,
				freezePuddings: undefined,
				moveFaster: undefined
			},
			pudding: {
				p1: undefined,
				p2: undefined,
				p3: undefined
			},
			tipicon: {
				info: {
					i1: undefined,
					i2: undefined,
					i3: undefined,
					i4: undefined,
					i5: undefined
				},
				warn: {
					w1: undefined,
					w2: undefined,
					w3: undefined,
					w4: undefined,
					w5: undefined
				},
				error: {
					e1: undefined,
					e2: undefined,
					e3: undefined,
					e4: undefined,
					e5: undefined
				}
			},
			title: {
				normal: undefined
			},
			miyako: {
				normal: undefined
			},
			youlStatic: undefined
		},
		gifImageList: {
			bullet: {
				boom: undefined
			},
			pause: undefined,
			youlDynamic: undefined
		}
	},
	mutations: {
		loadAll(state) {
			loadImageByObject('', state.pngImageList, '.png');
			loadImageByObject('', state.gifImageList, '.gif');
		}
	},
	actions: {
		loadAllImage(context) {
			context.commit('loadAll');
		},
		/**
		 * 获取全部图片资源数量
		 * @returns 全部图片资源数
		 */
		getTotal(context) {
			return getImageCount(context.state.pngImageList) + getImageCount(context.state.gifImageList);
		},
		/**
		 * 获取已加载图片资源数量
		 * @returns 已加载图片资源数
		 */
		getLoaded(context) {
			return checkImageLoaded(context.state.pngImageList) + checkImageLoaded(context.state.gifImageList);
		}
	}
}