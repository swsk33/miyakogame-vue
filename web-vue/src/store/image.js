// vuex-图片资源模块
export default {
	namespaced: true,
	state: {
		imageList: {
			png: {
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
				title: undefined,
				miyako: undefined,
				youlStatic: undefined,
				ready: undefined
			},
			gif: {
				bullet: {
					boom: undefined
				},
				pause: undefined,
				youlDynamic: undefined
			}
		}
	},
	mutations: {
		/**
		 * 递归加载图片，payload有两个属性，其中type表示图片扩展名（例如gif），path表示要加载的图片列表对象路径，加载根路径传入空字符串('')即可（例如要加载上述state中imageList对象的png中的pudding对象中p1，那么payload.path为：pudding/p1）。图片列表对象中属性和图片文件夹目录结构一致，每个表示图片文件的属性先要留空为undefined
		 */
		loadImageList(state, payload) {
			// 处理路径字符串
			if (payload.path.indexOf('/') == 0) {
				payload.path = payload.path.substring(1, payload.path.length);
			}
			// 检索至图片列表对象中的指定属性
			let pathes;
			if (payload.path === '') {
				pathes = [payload.type];
			} else {
				pathes = payload.path.split('/');
				pathes.unshift(payload.type);
			}
			let imageObject = state.imageList;
			// 只索引到第n - 1个，也就是目标属性的的前一个，这样就可以引用到对象并修改其中的属性（否则会发生单类型复制导致无法赋值到对象中）
			for (let i = 0; i < pathes.length - 1; i++) {
				imageObject = imageObject[pathes[i]];
			}
			// 如果说当前索引到路径是undefined，这个属性代表图片，执行加载
			if (imageObject[pathes[pathes.length - 1]] === undefined) {
				let image = new Image();
				image.src = require('@/assets/image/' + payload.path + '.' + payload.type);
				imageObject[pathes[pathes.length - 1]] = image;
			} else if (Object.prototype.toString.call(imageObject[pathes[pathes.length - 1]]) === '[object Object]') { // 否则，说明这个属性还有子属性，遍历子属性并进入递归流程加载其中的图片
				let list = imageObject[pathes[pathes.length - 1]];
				for (let key in list) {
					this.commit('image/loadImageList', {
						type: payload.type,
						path: payload.path + '/' + key
					});
				}
			}
		},
		/**
		 * 将图片列表中的所有资源递归替换为require的图片形式方便外部调用，payload表示图片对象路径，例如设定state中imageList对象的png中的pudding对象中p1，那么payload为：imageList/png/pudding/p1
		 */
		setImageResource(state, payload) {
			const pathes = payload.split('/');
			let imageObject = state;
			// 只索引到第n - 1个，也就是目标属性的的前一个，这样就可以引用到对象并修改其中的属性（否则会发生单类型复制导致无法赋值到对象中）
			for (let i = 0; i < pathes.length - 1; i++) {
				imageObject = imageObject[pathes[i]];
			}
			if (Object.prototype.toString.call(imageObject[pathes[pathes.length - 1]]) === '[object HTMLImageElement]') {
				imageObject[pathes[pathes.length - 1]] = imageObject[pathes[pathes.length - 1]].src;
			} else if (Object.prototype.toString.call(imageObject[pathes[pathes.length - 1]]) === '[object Object]') {
				let list = imageObject[pathes[pathes.length - 1]];
				for (let key in list) {
					this.commit('image/setImageResource', payload + '/' + key);
				}
			}
		},
		/**
		 * 修改图片资源，建议在加载之前调用，payload中有两个属性：path表示修改路径，例如修改上述imageList.png.bullet.normal，表示为png/bullet/normal，image属性则为Image对象，也可以是包含多个Image对象的大对象，路径不存在会添加
		 */
		modifyImage(state, payload) {
			// 处理路径字符串
			if (payload.path.indexOf('/') == 0) {
				payload.path = payload.path.substring(1, payload.path.length);
			}
			if (payload.path === '') {
				return;
			}
			const pathes = payload.path.split('/');
			let imageObject = state.imageList;
			// 只索引到第n - 1个，也就是目标属性的的前一个，这样就可以引用到对象并修改其中的属性（否则会发生单类型复制导致无法赋值到对象中）
			for (let i = 0; i < pathes.length - 1; i++) {
				if (imageObject[pathes[i]] == undefined) {
					imageObject[pathes[i]] = {};
				}
				imageObject = imageObject[pathes[i]];
			}
			imageObject[pathes[pathes.length - 1]] = payload.image;
		}
	},
	actions: {
		/**
		 * 加载全部图片
		 */
		loadAllImage(context) {
			context.commit('loadImageList', {
				type: 'png',
				path: ''
			});
			context.commit('loadImageList', {
				type: 'gif',
				path: ''
			});
		},
		/**
		 * 获取全部图片资源数量，payload为待获取的图片列表对象，图片列表对象中属性和图片文件夹目录结构一致
		 * @returns 全部图片资源数
		 */
		async getTotal(context, payload) {
			if (payload === null) {
				payload = context.state;
			}
			let total = 0;
			for (let key in payload) {
				if (Object.prototype.toString.call(payload[key]) === '[object Object]') {
					total = total + await context.dispatch('getTotal', payload[key]);
				} else {
					total++;
				}
			}
			return total;
		},
		/**
		 * 检查已加载图片资源数量，payload为待检查的图片列表对象，图片列表对象中属性和图片文件夹目录结构一致
		 * @returns 已加载图片资源数
		 */
		async getLoaded(context, payload) {
			if (payload === null) {
				payload = context.state;
			}
			let loaded = 0;
			for (let key in payload) {
				if (Object.prototype.toString.call(payload[key]) === '[object Object]') {
					loaded = loaded + await context.dispatch('getLoaded', payload[key]);
				} else if (Object.prototype.toString.call(payload[key]) === '[object HTMLImageElement]' && payload[key].complete) {
					loaded++;
				}
			}
			return loaded;
		},
	}
}