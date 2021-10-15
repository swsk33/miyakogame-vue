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
	 * 发射子弹，即为生成子弹对象并加入到所有子弹数组中去
	 * @param {Position} position 子弹初始的位置
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
 * 实体垂直方向飞行，执行一次该函数，就会获得一个实体以指定速度垂直方向飞行一次后的位置，正方向为垂直向下
 * @param {GameEntity} entity 传入实体
 * @param {Number} velocity 飞行速度
 * @returns 飞行一次之后实体的位置
 */
function entityFlyY(entity, velocity) {
	const position = entity.getPosition();
	position.y = position.y + velocity;
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
		 * 设定当前武器就绪状态，payload为布尔值，true表示武器已经就绪
		 */
		setWeaponReady(state, payload) {
			state.weaponList[state.currentWeapon].isReady = payload;
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
			// 默认武器
			let defaultWeapon = new Weapon('常规鬼火', '最普通的鬼火武器，宫子借助它吃布丁，冷却0.6s', 0, 600, require('@/assets/image/bullet/normal.png'), new Audio(require('@/assets/audio/weapon/normal.mp3')), function (position) {
				let bullet = new Bullet(position, new Size(15, 24), function (enemies) {
					return entityFlyX(this, 8);
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
				bullet.style.backgroundImage = 'url(' + require('@/assets/image/bullet/normal.png') + ')';
				bullet.style.backgroundRepeat = 'no-repeat';
				bullet.style.backgroundPosition = 'center';
				bullet.style.backgroundSize = 'cover';
				context.commit('addBullet', bullet);
			});
			// 设定武器列表
			const weapons = [];
			weapons.push(defaultWeapon);
			context.commit('setWeapons', weapons);
		},
		/**
		 * 当前武器射击，payload中要有position属性表示子弹初始位置
		 */
		shooting(context, payload) {
			const getWeapon = context.state.weaponList[context.state.currentWeapon];
			if (getWeapon.isReady) {
				getWeapon.shooting(payload.position);
				getWeapon.sound.play();
				context.commit('setWeaponReady', false);
				setTimeout(() => {
					context.commit('setWeaponReady', true);
				}, getWeapon.interval);
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
				let position = getBullet.flying();
				context.commit('changeBulletOnScreen', {
					position: position,
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
				if (getBullet.valid && (getBullet.getPosition().x + getBullet.getSize().width >= gameArea.width || getBullet.getPosition().y <= 0 || getBullet.getPosition().y + getBullet.getSize().height >= gameArea.height)) {
					context.commit('removeBullet', i);
					i--;
				}
			}
		}
	}
}