<template>
	<div class="mainMenu">
		<div class="title">
			<img class="avatar" src="@/assets/image/avatar/excepted.png" />
			<div class="main"></div>
		</div>
		<ul class="menu">
			<li>继续游戏</li>
			<li>新游戏</li>
			<li>魔法商店</li>
			<li>排行榜</li>
			<li>帮助</li>
		</ul>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
//开始界面
.mainMenu {
	position: absolute;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	left: 0;
	top: 0;
	width: 100%;
	height: 100vh;
	background-color: #88ffff;
	transition: left 0.8s cubic-bezier(0, 0, 0, 1);

	.title {
		display: flex;
		justify-content: center;
		margin-top: 10vh;

		.main {
			position: relative;
			width: 600px;
			height: 150px;
			bottom: 24px;
			background: url(../assets/image/title/normal.png) no-repeat center/cover;
		}

		.avatar {
			width: 95px;
			height: 95px;
			margin-right: 20px;
			border-radius: 50%;
			border-color: #ff02bc;
			border-width: 3px;
			border-style: solid;
		}
	}

	.menu {
		position: relative;
		top: -10px;
		list-style: none;
		user-select: none;
		width: 35%;

		li {
			margin-top: 35px;
			text-align: center;
			font-size: 38px;
			color: #ff5500;

			&:hover {
				cursor: pointer;
				color: #00a6ff;
				background-color: #dfdeff;
			}
		}
	}
}

//开始界面-傍晚样式
.mainMenu-evening {
	background-color: #1a008b;
	background-image: linear-gradient(180deg, #1a008b 28%, #ffc03a 100%);

	.menu {
		li {
			margin-top: 35px;
			text-align: center;
			font-size: 38px;
			color: #ff0037;
			text-shadow: 1px 1px 3px lightcoral;
		}
	}
}

//开始界面-夜晚样式
.mainMenu-night {
	background-color: rgb(0, 0, 56);

	.menu {
		li {
			margin-top: 35px;
			text-align: center;
			font-size: 38px;
			color: #00ff95;
			text-shadow: 1px 1px 3px rgb(173, 240, 128);
		}
	}
}
</style>