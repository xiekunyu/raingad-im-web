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
  .el-transfer-panel .el-transfer-panel__body {
    height: 280px !important; 
  }
  .lemon-editor__submit .lemon-button{
    background: #409EFF;
    color:#fff;
  }
   .lemon-editor__submit .lemon-button:hover{
    background: #409EEE;
    color:#fff !important;
    border:solid 1px #409EEE !important;
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

  // 滚动条美化
  ::-webkit-scrollbar {
		  width: 10px;
		  height: 10px;
		}

  ::-webkit-scrollbar-track {
    background-color: #eee;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(185,185,185,0.5);
    border-radius: 10px;
  }

  /* Firefox scrollbar */
  .scrollbar-firefox {
		  scrollbar-width: thin;
		  scrollbar-color: #888 #eee;
		}

		.scrollbar-firefox::-webkit-scrollbar {
		  width: initial;
		  height: initial;
		}

		.scrollbar-firefox::-webkit-scrollbar-thumb {
		  background-color: #888;
		  border-radius: 10px;
		}


</style>
