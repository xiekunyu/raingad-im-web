<template>
  <div>
    <el-tooltip content="Bottom center" placement="bottom" effect="light">
       <div class="top-item">
          <div class="avatar">
              <el-avatar shape="square" size="small" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
          </div>
          <div class="username">
              可爱的聊天群
          </div>
        </div> 
    </el-tooltip>
          
  </div>
</template>

<script>
export default {
  name: "chatTop",
  props: {
    contact: {
      type: Object,
      default:{}
    }
  },
  data() {
    return {
      myDrawer: false,
      nospeak:0,
      form: {
          delivery: false,
          type: [],
        },
    };
  },
  methods: {
    closeDrawer(){
      this.myDrawer=false;
    }
  },
  created() {
  }
};
</script>
<style scoped lang="scss">
.top-item{
    margin-bottom:10px;
    margin-right:5px;
    width:40px;
    height:60px;
    display:flex;
    flex-direction:column;
    .avatar{
      margin-right:10px;
    }
    .username{
        overflow: hidden;
        font-size:12px;
        color: #8f959e;
        transform: scale(.84);
        text-align: center;
        line-height: 14px;
        word-break: break-all;
    }
}
</style>
