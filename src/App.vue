<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
import lockr from 'lockr';  

export default {
  name: 'App',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created() {
    let userInfo=lockr.get('UserInfo');
    let Config=lockr.get('globalConfig');
    if(Config){
      this.$store.commit('setGlobalConfig', Config);
    }
    // 初始化用户信息
    if(userInfo){
      this.$store.commit('SET_USERINFO', userInfo);
    }
    this.getSystemInfo();
    
  },
  methods: {
    getSystemInfo(){
      this.$api.imApi.getSystemInfo().then(res=>{
        if(res.code==0){
          lockr.set('globalConfig',res.data);
          this.$store.commit('setGlobalConfig', res.data);
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "assets/scss/style";

  .lemon-container .lemon-container__title{
    border-bottom:solid 1px #e6e6e6 !important
  }
  .el-transfer-panel .el-transfer-panel__body {
    height: 280px !important; 
  }
  .lemon-editor__submit .lemon-button{
    background: var(--el-color-primary);
    color:#fff;
  }
   .lemon-editor__submit .lemon-button:hover{
    background: var(--el-color-primary);
    color:#fff !important;
    border:solid 1px var(--el-color-primary) !important;
  }
  .lemon-editor__submit button[disabled],.lemon-editor__submit button[disabled]:hover{
    background: #fff;
    color:#aaa;
    border:solid 1px #aaa;
  }
  body,html,#app{
    height: 100%;
    width:100%
  }

  .el-scrollbar{
      height: 100% !important;
  }

  .el-scrollbar__wrap {
      overflow-x: hidden !important;
  }

  .el-container{
    overflow: auto;
  }

  .el-select-dropdown__wrap {
    margin-bottom: 0 !important;
  }

  .lemon-contact{
    padding:10px;
  }

  hr {
    height: 1px;
    background-color: #e6e6e6;
    border: none;
  }


</style>
