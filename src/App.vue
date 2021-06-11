<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "assets/scss/reset";
  .lemon-container .lemon-container__title{
    border-bottom:solid 1px #e6e6e6 !important
  }
  .el-transfer-panel >>> .el-transfer-panel__body {
    height: 280px !important; 
  }
  .lemon-editor__submit .lemon-button{
    background: #409EFF;
    color:#fff;
  }
   .lemon-editor__submit .lemon-button:hover{
    background: #409EEE;
    color:#fff;
    border:solid 1px #409EEE;
  }
  .lemon-editor__submit button[disabled],.lemon-editor__submit button[disabled]:hover{
    background: #fff;
    color:#aaa;
    border:solid 1px #aaa;
  }
</style>
