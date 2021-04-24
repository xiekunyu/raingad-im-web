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
</style>
