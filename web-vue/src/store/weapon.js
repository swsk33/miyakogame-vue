import {
	Position,
	Size,
	GameEntity
} from '@/assets/js/constructors.js';

import random from '@/assets/js/random.js';

import {
	tipType,
	showTip
} from '@/components/util/tip.js';

/**
 * 武器类构造函数，用于构造一个武器，武器会生成子弹对象
 * @param {String} name 武器（魔法）名
 * @param {String} description 武器描述
 * @param {Number} price 武器价格
 * @param {Number} interval 射击间隔（ms）
 * @param {NodeRequire} texture 子弹贴图
 * @param {Audio} sound 射击音效
 * @param {Function} shooting 子弹发射方法，用于生成子弹对象（回调函数，需要有个形参position（Position位置对象）），表示子弹初始位置，如果子弹是图片需要在style中定义background-image属性）
 */
function Weapon(name, description, price, interval, texture, sound, shooting) {
	this.name = name;
	this.description = description;
	this.price = price;
	this.interval = interval;
	this.texture = texture;
	this.sound = sound;
	/**
	 * 当前武器是否就绪
	 */
	this.isReady = true;
	/**
	 * 就绪状态，为0-1的整数，1表示已经就绪
	 */
	this.readyState = 1;
	/**
	 * 发射子弹，即为生成子弹对象并加入到所有子弹数组中去
	 * @param {Position} position 子弹初始的位置
	 */
	this.shooting = shooting;
}

/**
 * 子弹实体构造函数，继承GameEntity对象
 * @param {Position} position 子弹实体起始位置
 * @param {Size} size 子弹实体起始大小
 * @param {Function} flying 子弹飞行方法，决定子弹飞行方向速度等等，执行一次子弹就会飞行一下，需要计时器循环调用，这个方法返回一个对象表示子弹飞行一次后的位置和大小，返回对象中position属性为飞行一次后的位置，size表示飞行一次后的大小，size非必须（回调函数，需要有形参enemies表示敌人对象数组，若为单个敌人也放入数组作为单元素数组传入）
 * @param {Function} hitTrigger 子弹击中时触发的函数，击中敌人时发生事件，敌人消失这个事件需要写在这里（回调函数，需要有形参enemy，enemies，分别表示敌人对象和所有敌人数组）
 */
function Bullet(position, size, flying, hitTrigger) {
	GameEntity.call(this, position, size);
	/**
	 * 这个子弹实体是否有效，如果这个子弹实体无效，则会在屏幕上隐藏，全局子弹飞行控制器也会将其从子弹数组中移除（例如一个子弹击中敌人，那就无效了，除非是穿透性子弹）
	 */
	this.valid = true;
	/**
	 * 子弹飞行一次
	 * @param {Array} enemies 全部敌人对象数组
	 * @returns 子弹飞行一次后的状态，为一个对象，其中有position属性表示飞行一次后的位置，size属性表示飞行一次后的大小，如果大小不变，那么这个size属性将为undefined
	 */
	this.flying = flying;
	/**
	 * 子弹击中敌人
	 * @param {Pudding} enemy 被击中的敌人对象
	 * @param {Array} enemies 全部敌人数组
	 */
	this.hitTrigger = hitTrigger;
}

/**
 * 设定图片子弹贴图
 * @param {Bullet} bulletEntity 子弹实体 
 * @param {NodeRequire} image 要设定的贴图
 */
function setBulletEntityImage(bulletEntity, image) {
	bulletEntity.style.backgroundImage = 'url(' + image + ')';
	bulletEntity.style.backgroundRepeat = 'no-repeat';
	bulletEntity.style.backgroundPosition = 'center';
	bulletEntity.style.backgroundSize = 'cover';
}

/**
 * 实体水平方向飞行，执行一次该函数，就会获得一个实体以指定速度水平方向飞行一次后的位置，正方向为水平向右
 * @param {GameEntity} entity 传入实体
 * @param {Number} velocity 飞行速度
 * @returns 飞行一次之后实体的位置
 */
function entityFlyX(entity, velocity) {
	const position = entity.getPosition();
	position.x = position.x + velocity;
	return position;
}

/**
 * 实体向任一方向飞行，执行一次该函数，就会获得一个实体以指定速度和方向飞行一次后的位置
 * @param {GameEntity} entity 传入实体
 * @param {Number} velocity 速度
 * @param {Number} direction 飞行方向，以水平向右为0，逆时针为正方向，单位度
 * @returns 飞行一次之后的实体位置1
 */
function entityFly(entity, velocity, direction) {
	// 弧度制转换
	const arcDirection = (direction / 180) * Math.PI;
	const position = entity.getPosition();
	position.x = position.x + Math.cos(arcDirection) * velocity;
	position.y = position.y - Math.sin(arcDirection) * velocity;
	return position;
}

/**
 * 实体大小改变，执行一次该函数，就会获得实体以指定速度改变大小之后的尺寸和位置，改变实体大小后，实体的中心位置不变（因此，实体坐标会变）
 * @param {GameEntity} entity 游戏实体
 * @param {Number} rate 大小改变速度（将游戏实体视作一个矩形，大小改变速度表示长和宽每一次增加的量）
 * @returns 一个对象，其中position属性表示改变大小之后的位置，size属性表示改变大小之后的尺寸
 */
function entitySizeChange(entity, rate) {
	const position = entity.getPosition();
	const size = entity.getSize();
	size.width = size.width + rate;
	size.height = size.height + rate;
	position.x = position.x - rate / 2;
	position.y = position.y - rate / 2;
	return {
		size,
		position
	};
}

// vuex-武器系统
export default {
	namespaced: true,
	state: {
		/**
		 * 武器列表
		 */
		weaponList: [new Weapon('default', 'null', 0, 0, null, null, null)],
		/**
		 * 当前武器索引
		 */
		currentWeapon: 0,
		/**
		 * 当前屏幕上的所有子弹
		 */
		bullets: []
	},
	mutations: {
		/**
		 * 改变当前的某个子弹的状态（位置、大小）,payload要有三个参数：position表示位置，size表示大小（非必须），index表示子弹数组中的子弹下标
		 */
		changeBulletOnScreen(state, payload) {
			let getBullet = state.bullets[payload.index];
			getBullet.style.left = payload.position.x + 'px';
			getBullet.style.top = payload.position.y + 'px';
			if (payload.size != undefined) {
				getBullet.style.width = payload.size.width + 'px';
				getBullet.style.height = payload.size.height + 'px';
			}
		},
		/**
		 * 改变当前子弹有效性，payload为一个整数表示要改变的子弹在子弹数组中的下标
		 */
		changeBulletValid(state, payload) {
			state.bullets[payload].valid = !state.bullets[payload].valid;
			state.bullets[payload].style.display = 'none';
		},
		/**
		 * 移除指定子弹，payload为一个整数表示要移除的子弹数组下标
		 */
		removeBullet(state, payload) {
			state.bullets.splice(payload, 1);
		},
		/**
		 * 添加子弹到当前子弹数组中，payload表示子弹对象
		 */
		addBullet(state, payload) {
			state.bullets.push(payload);
		},
		/**
		 * 设定全部武器列表，payload表示全部武器列表
		 */
		setWeapons(state, payload) {
			state.weaponList = payload;
		},
		/**
		 * 设定当前武器就绪状态，payload中要有两个属性：index表示要设定的武器索引，ready为布尔值，true表示指定武器已经就绪
		 */
		setWeaponReady(state, payload) {
			state.weaponList[payload.index].isReady = payload.ready;
		},
		/**
		 * 设定当前武器就绪状态，payload中要有两个属性：index表示要设定的武器索引，readyState为一个0-1之间的浮点数表示就绪状态
		 */
		setWeaponReadyState(state, payload) {
			state.weaponList[payload.index].readyState = payload.readyState;
		},
		/**
		 * 切换武器，payload为一个布尔值，true表示下一个武器，false表示上一个武器
		 */
		alterWeapon(state, payload) {
			if (payload) {
				if (state.currentWeapon == state.weaponList.length - 1) {
					state.currentWeapon = 0;
				} else {
					state.currentWeapon++;
				}
			} else {
				if (state.currentWeapon == 0) {
					state.currentWeapon = state.weaponList.length - 1;
				} else {
					state.currentWeapon--;
				}
			}
		},
		/**
		 * 清空屏幕上的子弹
		 */
		clearBullets(state) {
			state.bullets = [];
		}
	},
	actions: {
		/**
		 * 初始化所有武器，需要在组件挂载时调用
		 */
		initializeWeapon(context) {
			// 图片和音频资源对象
			const imageState = context.rootState.image.imageList;
			const audioState = context.rootState.audio.audioList;
			// 默认武器
			let defaultWeapon = new Weapon('常规鬼火', '最普通的鬼火武器，宫子借助它吃布丁', 0, 600, imageState.png.bullet.normal, audioState.weapon.normal, function (position) {
				let bullet = new Bullet(position, new Size(15, 24), function (enemies) {
					return {
						position: entityFlyX(this, 8)
					};
				}, function (enemy, enemies) {
					// 标记该子弹无效
					context.commit('changeBulletValid', context.state.bullets.indexOf(this));
					// 击中布丁标记为被吃掉
					context.dispatch('pudding/setPuddingEaten', {
						column: enemy.column,
						line: enemy.line
					}, {
						root: true
					});
				});
				// 设定子弹贴图等等
				setBulletEntityImage(bullet, this.texture);
				context.commit('addBullet', bullet);
			});
			// 穿透鬼火
			let penetrateWildfire = new Weapon('穿透鬼火', '可以穿透水平方向上的布丁', 10, 1500, imageState.png.bullet.penetrate, audioState.weapon.penetrate, function (position) {
				let bullet = new Bullet(position, new Size(17, 30), function (enemies) {
					return {
						position: entityFlyX(this, 9)
					};
				}, function (enemy, enemies) {
					// 穿透鬼火，击中布丁不消失
					// 击中布丁标记为被吃掉
					context.dispatch('pudding/setPuddingEaten', {
						column: enemy.column,
						line: enemy.line
					}, {
						root: true
					});
				});
				// 设定子弹贴图等等
				setBulletEntityImage(bullet, this.texture);
				context.commit('addBullet', bullet);
			});
			// 爆裂之火
			let boomWildfire = new Weapon('爆裂之火', '遇到布丁会爆炸的鬼火，一次吃掉多个布丁', 10, 1250, imageState.gif.bullet.boom, audioState.weapon.boom, function (position) {
				let bullet = new Bullet(position, new Size(19, 30), function (enemies) {
					return {
						position: entityFlyX(this, 7)
					};
				}, function (enemy, enemies) {
					// 获取此时子弹位置
					const currentPosition = this.getPosition();
					// 标记该子弹无效
					context.commit('changeBulletValid', context.state.bullets.indexOf(this));
					// 击中布丁时产生冲击波，冲击波在这里也被视为子弹实体，不会改变位置但是会在一定时间内改变尺寸
					audioState.score.boom.play();
					let wave = new Bullet(currentPosition, new Size(1, 1), function (enemies) {
						// 冲击波的飞行方法即为自身扩散
						// 冲击波的存在时间为42帧（以60帧/秒来算）
						if (this.liveTime == undefined) {
							this.liveTime = 42;
						}
						// 冲击波的半径增幅为每帧5px
						if (this.radiusAdd == undefined) {
							this.radiusAdd = 5;
						}
						// 执行一次大小增大
						let state = entitySizeChange(this, this.radiusAdd);
						// 每执行一次，生存时间-1
						this.liveTime--;
						// 生存时间小于12时，增幅减少
						if (this.liveTime <= 12 && this.radiusAdd > 0) {
							this.radiusAdd--;
						}
						// 生存时间小于0，则标记自己为无效
						if (this.liveTime < 0) {
							context.commit('changeBulletValid', context.state.bullets.indexOf(this));
						}
						return state;
					}, function (enemy, enemies) {
						// 被冲击波碰到的布丁标记为被吃掉
						context.dispatch('pudding/setPuddingEaten', {
							column: enemy.column,
							line: enemy.line
						}, {
							root: true
						});
					});
					// 设定冲击波样式
					wave.style.borderColor = random.getRandomColor();
					wave.style.borderRadius = '50%';
					wave.style.borderStyle = 'solid';
					wave.style.borderWidth = '5px';
					// 加入冲击波到子弹列表
					context.commit('addBullet', wave);
				});
				// 设定子弹贴图等等
				setBulletEntityImage(bullet, this.texture);
				context.commit('addBullet', bullet);
			});
			// 散布魔法
			let scatterMagic = new Weapon('散布魔法', '一次发射8个魔法球，射角分散', 15, 2000, imageState.png.bullet.scatterIcon, audioState.weapon.scatter, function (position) {
				// 将子弹复制8个并赋予随机的颜色、大小和飞行角度
				let bulletCount = 8;
				const sideLength = random.generateRandomFloat(0.5, 3.5);
				let shootInterval = setInterval(() => {
					let bullet = new Bullet(position, new Size(sideLength, sideLength), function (enemies) {
						return {
							position: entityFly(this, 8, this.flyDirect)
						};
					}, function (enemy) {
						// 标记该子弹无效
						context.commit('changeBulletValid', context.state.bullets.indexOf(this));
						// 击中布丁标记为被吃掉
						context.dispatch('pudding/setPuddingEaten', {
							column: enemy.column,
							line: enemy.line
						}, {
							root: true
						});
					});
					// 设定样式
					const color = random.getRandomColor();
					bullet.style.width = sideLength + 'px';
					bullet.style.height = sideLength + 'px';
					bullet.style.backgroundColor = color;
					bullet.style.boxShadow = '0px 0px 4px 5px ' + color;
					bullet.flyDirect = random.generateRandom(-20, 20);
					bullet.style.borderRadius = '50%';
					// 放入子弹数组
					context.commit('addBullet', bullet);
					bulletCount--;
					if (bulletCount <= 0) {
						clearInterval(shootInterval);
					}
				}, 60);
			});
			// 弹弹魔法
			let bounceMagic = new Weapon('弹弹魔法', '遇到上下边界会发生反弹的魔法星星，只不过射击角度有点随机...', 5, 250, imageState.png.bullet.bounceIcon, audioState.weapon.bounceShoot, function (position) {
				let bullet = new Bullet(position, new Size(18, 18), function (enemies) {
					if (this.flyDirect == undefined) {
						this.flyDirect = random.generateRandom(-60, 60);
					}
					let flyPosition = entityFly(this, 7, this.flyDirect);
					// 预判下一次移动，碰到边界改变方向
					if (flyPosition.y - 7 <= 0 || flyPosition.y + this.getSize().height + 7 >= context.rootState.gamingcontrol.gameArea.height) {
						audioState.weapon.bounceReflect.play();
						this.flyDirect = -this.flyDirect;
					}
					return {
						position: flyPosition
					};
				}, function (enemy, enemies) {
					// 标记该子弹无效
					context.commit('changeBulletValid', context.state.bullets.indexOf(this));
					// 击中布丁标记为被吃掉
					context.dispatch('pudding/setPuddingEaten', {
						column: enemy.column,
						line: enemy.line
					}, {
						root: true
					});
				});
				// 设定子弹贴图等等
				setBulletEntityImage(bullet, imageState.png.bullet['bounce' + random.generateRandom(1, 2)]);
				context.commit('addBullet', bullet);
			});
			// 设定武器列表
			const weapons = [defaultWeapon, penetrateWildfire, boomWildfire, scatterMagic, bounceMagic];
			context.commit('setWeapons', weapons);
		},
		/**
		 * 当前武器射击，payload中要有position属性表示子弹初始位置
		 */
		shooting(context, payload) {
			const currentIndex = context.state.currentWeapon;
			const getWeapon = context.state.weaponList[currentIndex];
			const weaponCounts = context.rootState.userdata.gameData.weaponCount;
			if (weaponCounts[currentIndex] == 0) {
				showTip('当前武器没有子弹！', tipType.error);
				return;
			}
			// 武器开火
			if (getWeapon.isReady) {
				if (weaponCounts[currentIndex] != -1) {
					weaponCounts[currentIndex]--;
					context.commit('userdata/setGameData', {
						name: 'weaponCount',
						value: weaponCounts
					}, {
						root: true
					});
				}
				getWeapon.shooting(payload.position);
				getWeapon.sound.play();
				context.commit('setWeaponReady', {
					index: currentIndex,
					ready: false
				});
				const loadingTime = getWeapon.interval;
				let elapseTime = 0;
				let loadInterval = setInterval(() => {
					if (context.rootState.gamingcontrol.isProcessing) {
						elapseTime = elapseTime + 16;
						context.commit('setWeaponReadyState', {
							index: currentIndex,
							readyState: elapseTime / loadingTime
						});
					}
					if (elapseTime >= loadingTime) {
						context.commit('setWeaponReady', {
							index: currentIndex,
							ready: true
						});
						clearInterval(loadInterval);
					}
				}, 16);
			}
		},
		/**
		 * 将每一个子弹执行一次飞行方法
		 */
		flyAllBullet(context) {
			const allBullets = context.state.bullets;
			const allPuddings = context.rootState.pudding.puddings;
			const gameArea = context.rootState.gamingcontrol.gameArea;
			for (let i = 0; i < allBullets.length; i++) {
				const getBullet = allBullets[i];
				// 控制子弹飞行时，检查每个子弹有效性，无效子弹移出数组
				if (!getBullet.valid) {
					context.commit('removeBullet', i);
					i--;
					continue;
				}
				// 飞行一次
				let state = getBullet.flying();
				context.commit('changeBulletOnScreen', {
					position: state.position,
					size: state.size,
					index: i
				});
				// 然后检查这个子弹是否和布丁相碰
				for (let j = 0; j < allPuddings.length; j++) {
					for (let k = 0; k < allPuddings[j].length; k++) {
						const getPudding = allPuddings[j][k];
						// 这个布丁被吃了，则跳过此次遍历
						if (getPudding.isEaten) {
							continue;
						}
						// 否则，判断这个子弹和这个布丁是否相撞
						if (getBullet.isCollision(getPudding)) {
							// 执行子弹撞击方法
							getBullet.hitTrigger(getPudding, allPuddings);
							// 重新设定布丁上下边界
							context.dispatch('pudding/scanPuddingsAtBorder', null, {
								root: true
							});
							// 如果这个子弹无效了，跳出循环
							if (!getBullet.valid) {
								break;
							}
						}
					}
					// 如果这个子弹无效了，跳出循环
					if (!getBullet.valid) {
						break;
					}
				}
				// 如果这个子弹仍然有效，说明未击中敌人或者是击中敌人但是不消失类型，这时子弹遇到边界自动消失
				if (getBullet.valid && (getBullet.getPosition().x + getBullet.getSize().width > gameArea.width || getBullet.getPosition().y < 0 || getBullet.getPosition().y + getBullet.getSize().height > gameArea.height)) {
					context.commit('removeBullet', i);
					i--;
				}
			}
		}
	}
}