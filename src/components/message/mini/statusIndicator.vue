<!-- 原子脉冲状态显示器 ，引用于scui-->
<template>
	<span class="sc-state" :class="[{ 'sc-status-processing': pulse }, 'sc-state-bg--' + type]"></span>
</template>

<script>
export default {
	props: {
		type: { type: String, default: "primary" },
		pulse: { type: [Boolean,Number], default: true }
	}
}
</script>

<style lang="scss" scoped>

.sc-state {
	display: inline-block;
	background: var(--el-color-primary);
	width: 6px;
	height: 6px;
	margin:0 3px 3px;
	border-radius: 50%;
	vertical-align: middle;
}

.sc-status-processing {
	position: relative;

	&:after {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: inherit;
		content: '';
		animation: warns 1.2s ease-in-out infinite;
	}
}

.sc-state-bg--primary {
	background: var(--el-color-primary);
}

.sc-state-bg--success {
	background: var(--el-color-success);
}

.sc-state-bg--warning {
	background: var(--el-color-warning);
}

.sc-state-bg--danger {
	background: var(--el-color-danger);
}

.sc-state-bg--info {
	background: var(--el-color-info);
}
@-webkit-keyframes warns {
	0% {
		transform: scale(0.5);
		opacity: 1;
	}

	30% {
		opacity: 0.7;
	}

	100% {
		transform: scale(2.5);
		opacity: 0;
	}
}

@keyframes warns {
	0% {
		transform: scale(0.5);
		opacity: 1;
	}

	30% {
		opacity: 0.7;
	}

	100% {
		transform: scale(2.5);
		opacity: 0;
	}
}</style>
