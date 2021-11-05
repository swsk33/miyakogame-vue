<!-- 排行榜页面 -->
<template>
	<div :class="styleValue" v-if="rankTable">
		<div class="frame">
			<div class="title">全服排行榜</div>
			<div class="totalPanelTitle">全服前十</div>
			<ul class="totalRank">
				<!-- 表头 -->
				<li class="header">
					<div class="avatar">头像</div>
					<div class="nickname">昵称</div>
					<div class="highScore">最高分</div>
					<div class="rank">排名</div>
				</li>
				<!-- 内容 -->
				<li class="listItem" v-for="rank in rankData" :key="rank.id">
					<div class="avatar">
						<img :src="rank.avatar" />
					</div>
					<div class="nickname">{{ rank.nickname }}</div>
					<div class="highScore">{{ rank.highScore }}</div>
					<div class="rank">{{ rank.sequence }}</div>
				</li>
			</ul>
			<div class="minePanelTitle">我的排名</div>
			<div class="myRankTable">
				<div class="avatar">
					<img :src="myRank.avatar" />
				</div>
				<div class="nickname">{{ myRank.nickname }}</div>
				<div class="highScore">{{ myRank.highScore }}</div>
				<div class="rank">{{ myRank.sequence }}</div>
			</div>
			<div class="ok" @click="setRankTablePage(false)">知道了</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { createNamespacedHelpers } from 'vuex';
import { showLoading } from '@/components/util/loading.js';
import { showTip, tipType } from '@/components/util/tip.js';

const { mapState: pageState, mapMutations: pageMutations } = createNamespacedHelpers('pagecontrol');
const { mapState: dataState } = createNamespacedHelpers('userdata');
const { mapState: imageState } = createNamespacedHelpers('image');

export default {
	data() {
		return {
			/**
			 * 样式变量
			 */
			styleValue: {
				rankTable: true,
				rankTableNight: false,
				rankTableHalloween: false,
			},
			/**
			 * 排行榜数据
			 */
			rankData: [],
			myRank: {
				nickname: undefined,
				avatar: undefined,
				highScore: undefined,
				sequence: undefined,
			},
		};
	},
	computed: {
		...pageState(['rankTable']),
		...imageState(['imageList']),
		...dataState(['isLogin', 'onlineUserData']),
	},
	watch: {
		/**
		 * 监听页面是打开还是关闭，打开时获取在线排行榜数据
		 */
		async rankTable() {
			if (this.rankTable) {
				// 获取排行榜
				let loading = showLoading('45vw', '6vh', '正在拉取排行榜...');
				try {
					const response = await axios.get('/api/rank/total');
					if (!response.data.success) {
						showTip('获取排行榜失败！', tipType.error);
						loading.destory();
						return;
					}
					this.rankData = response.data.data;
					loading.destory();
				} catch (error) {
					showTip('获取排行榜失败！', tipType.error);
					loading.destory();
					return;
				}
				// 获取个人排行榜
				if (this.isLogin) {
					try {
						const response = await axios.get('/api/rank/getmine/' + this.onlineUserData.id);
						if (!response.data.success) {
							showTip('获取个人排行榜失败！', tipType.error);
							return;
						}
						this.myRank.avatar = this.onlineUserData.avatar;
						this.myRank.nickname = this.onlineUserData.nickname;
						this.myRank.highScore = this.onlineUserData.highScore;
						this.myRank.sequence = response.data.data;
					} catch (error) {
						showTip('获取个人排行榜失败！', tipType.error);
					}
				} else {
					this.myRank.avatar = this.imageList.png.avatar.happy;
					this.myRank.nickname = '登录以查看';
					this.myRank.highScore = '';
					this.myRank.sequence = '';
				}
			} else {
				// 清空排行榜列表数据
				this.rankData = [];
			}
		},
	},
	methods: {
		...pageMutations(['setRankTablePage']),
	},
};
</script>

<style lang="scss" scoped>
@keyframes show {
	from {
		transform: scale(0);
	}
	to {
		transform: scale(1);
	}
}

.rankTable {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(255, 255, 255, 0.9);

	.frame {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		user-select: none;
		width: 600px;
		height: 450px;
		background-color: #aaffff;
		border-radius: 10px;
		box-shadow: 2px 2px 2px 1px rgba(2, 2, 2, 0.3);
		animation-name: show;
		animation-duration: 0.3s;
		animation-timing-function: ease-out;

		.title {
			font-size: 24px;
			margin-top: 16px;
		}

		.totalPanelTitle,
		.minePanelTitle {
			font-size: 18px;
			margin-top: 6px;
		}

		// 每个表头的公共属性
		.avatar,
		.nickname,
		.highScore,
		.rank {
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.avatar {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: 15%;

			img {
				width: 36px;
				height: 36px;
				border: 1.5px blue solid;
				border-radius: 50%;
			}
		}

		.nickname {
			width: 55%;
		}

		.highScore {
			width: 15%;
		}

		.rank {
			width: 15%;
		}

		// 每个排名表
		.totalRank {
			list-style: none;
			border: 2px blue solid;
			border-radius: 6px;
			width: 90%;
			height: 50%;
			margin-top: 3px;
			overflow: auto;

			li {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size: 18px;
				width: 100%;
				height: 42px;
				border-bottom: 1.5px green dashed;
			}

			.header {
				height: 28px;
				border-bottom: 1px orangered solid;
			}

			.listItem {
				.nickname,
				.highScore,
				.rank {
					font-size: 21px;
				}
			}
		}

		.myRankTable {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size: 18px;
			width: 90%;
			height: 48px;
			border: 2px rgb(252, 0, 252) solid;
			border-radius: 6px;
			margin-top: 3px;
		}

		.ok {
			font-size: 24px;
			cursor: pointer;
			margin-top: 8px;

			&:hover {
				color: rgb(255, 36, 255);
			}
		}
	}
}

// 排名表-夜晚
.rankTableNight {
	background-color: rgba(255, 255, 255, 0.3);

	.frame {
		background-color: #000038;
		box-shadow: 2px 2px 10px 0.5px rgb(255, 255, 255);

		div {
			color: white;
			text-shadow: 0.3px 0.3px 3px white;
		}

		.totalRank {
			border: #aaffff 2px solid;

			.header {
				border-bottom: 1px rgb(255, 138, 96) solid;
			}

			.listItem {
				border-bottom: greenyellow 1px dashed;
			}
		}

		.myRankTable {
			border: rgb(255, 101, 139) 2px solid;
		}

		.avatar {
			img {
				border: 1px #c8ff00 solid;
			}
		}

		.ok {
			&:hover {
				color: aqua;
			}
		}
	}
}

// 排名表-万圣节
.rankTableHalloween {
	background-color: rgba(255, 255, 255, 0.3);

	.frame {
		background-color: #4e3c8f;
		box-shadow: 2px 2px 10px 0.3px rgb(0, 255, 242);

		div {
			color: white;
		}

		.totalRank {
			border: #aaffff 2px solid;

			.header {
				border-bottom: 1px rgb(255, 138, 96) solid;
			}

			.listItem {
				border-bottom: greenyellow 1px dashed;
			}
		}

		.myRankTable {
			border: rgb(255, 130, 161) 2px solid;
		}

		.avatar {
			img {
				border: 1px #c8ff00 solid;
			}
		}

		.ok {
			&:hover {
				color: aqua;
			}
		}
	}
}
</style>