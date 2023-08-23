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
      document.title = Config.sysInfo.name;
      this.$store.commit('setGlobalConfig', Config);
    }
    // 初始化用户信息
    if(userInfo){
      this.$store.commit('SET_USERINFO', userInfo);
    }
    this.$store.dispatch('getSystemInfo').then(res=>{
      if(res.data.sysInfo.state==0){
          this.$router.push({path:'/404',query:{msg:res.data.sysInfo.closeTips}});
          return 
      }
    });
  },
  watch: {
    "$store.state.globalConfig" (val) {
      document.title = val.sysInfo.name;
    }
  },
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
