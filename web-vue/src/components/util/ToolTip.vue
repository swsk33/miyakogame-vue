<template>
	<div class="toolTop">{{ text }}</div>
</template>

<script>
export default {
	data() {
		return {
			text: '',
		};
	},
};
</script>

<style lang="scss" scoped>
.toolTop {
	position: absolute;
	white-space: nowrap;
	border: 1.5px rgb(255, 16, 96) solid;
	border-radius: 5px;
	background-color: rgb(247, 255, 203);
	padding-top: 3px;
	padding-bottom: 3px;
	padding-left: 4px;
	padding-right: 4px;
	box-sizing: border-box;
	text-align: center;
}
</style>