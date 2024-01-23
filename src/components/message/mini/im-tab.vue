<template name="im-tab">
	<div class="tab-main lz-flex lz-justify-content-start lz-align-items-center" :style="{height:height+'px'}">
		<div class="tab-item" :class="active==index ? 'active' : ''" v-for="(item,index) in values" @click="changeItem(item,index)"  :style="{height:itemHeight+'px',borderRadius:itemHeight+'px',lineHeight:itemHeight+'px'}">
			{{item.name}} <span v-if="item.count>0">{{item.count>99 ? '99+' : item.count}}</span>	
		</div>
	</div>
</template>
<script>
export default {
	name  : "im-tab",
	components: {
	},
	props : {
		values:{type:Array, default:function(){return [];}},
		height:{type:Number,default:40}
	},
	data() {
		return {
			active:0,
			itemHeight:24
		}
	},
	created : function(){
		this.itemHeight=this.height-16;
	},
	methods:{
		changeItem(item,index){
			this.active=index;
			this.$emit('change',item,index)
		}
	}
}
</script>
<style lang="scss" scoped>
	.tab-main{
		padding:0 10px 5px;
		.tab-item{
			cursor: pointer;
			padding: 3px 6px;
			min-width:50px;
			text-align: center;
			vertical-align: middle;
			&.active{
				box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
				background-color: #fff;
				color:#18bc37;
			}
		}
	}
</style>