<template>
  <div class="chatTop">
    <el-tooltip :content="contact.displayName" placement="top-start" effect="light">
       <div class="top-item" :class="currentId==contact.id ? 'active' : ''">
          <div class="avatar">
              <el-avatar :shape="avatarCricle?'circle':'square'" size="small" :src="contact.avatar"></el-avatar>
          </div>
          <div class="username">
              {{contact.displayName}}
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
    },
    currentId: [String, Number],
    avatarCricle:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
    };
  },
  methods: {
  },
  created() {
  }

};
</script>
<style scoped lang="scss">
.top-item:hover{
  background: #e9e9e9;
  border-radius:6px;
}
.chatTop .active{
  background: #d9d9d9;
  border-radius:6px;
}
.top-item{
    padding:5px 0;
    width:46px;
    height:46px;
    display:flex;
    flex-direction:column;
    flex-basis: 41px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    .avatar{
      align-content: center;
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
