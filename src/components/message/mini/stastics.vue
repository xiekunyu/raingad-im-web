<!--
 * @Descripttion: 统计数值组件
 * @version: 1.1
 * @Author: sakuya
 * @Date: 2021年6月23日13:11:32
 * @LastEditors: sakuya
 * @LastEditTime: 2022年5月14日19:55:09
-->

<template>
	<div class="im-statistic">
		<div class="im-statistic-title">
			{{ title }}
			<el-tooltip v-if="tips" effect="light">
				<template #content>
					<div style="width: 200px;line-height: 2;">
						{{ tips }}
					</div>
				</template>
				<div class="im-statistic-tips"><i class="el-icon el-icon-question"></i></div>
			</el-tooltip>
		</div>
		<div class="im-statistic-content">
			<span v-if="prefix" class="im-statistic-content-prefix">{{ prefix }}</span>
			<span class="im-statistic-content-value">{{ cmtValue }}</span>
			<span v-if="suffix" class="im-statistic-content-suffix">{{ suffix }}</span>
		</div>
		<div v-if="description || $slots.default" class="im-statistic-description">
			<slot>
			{{ description }}
			</slot>
		</div>
	</div>
</template>

<script>
import { groupSeparator as Separator } from '@/utils';   
	export default {
		props: {
			title: { type: String, required: true, default: "" },
			value: { type: Number, required: true, default:0},
			prefix: { type: String, default: "" },
			suffix: { type: String, default: "" },
			description: { type: String, default: "" },
			tips: { type: String, default: "" },
			groupSeparator: { type: Boolean, default: false }
		},
		data() {
			return {

			}
		},
		computed: {
			cmtValue(){
				return this.groupSeparator ? Separator(this.value) : this.value
			}
		}
	}
</script>

<style scoped>
	.im-statistic-title {font-size: 12px;color: #999;margin-bottom: 10px;display: flex;align-items: center;}
	.im-statistic-tips {margin-left: 5px;}
	.im-statistic-content {font-size: 20px;color: #333;}
	.im-statistic-content-value {font-weight: bold;}
	.im-statistic-content-prefix {margin-right: 5px;}
	.im-statistic-content-suffix {margin-left: 5px;font-size: 12px;}
	.im-statistic-description {margin-top: 10px;color: #999;}

	.dark .im-statistic-content {color: #d0d0d0;}
</style>
