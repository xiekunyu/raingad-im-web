<template>
  <div>
        <transition name="fade-user">
      <div class="previewBox">
        <el-button
          class="drawer-close"
          type="danger"
          @click="closeDrawer"
          icon="el-icon-close"
          circle
        ></el-button>
        <iframe
          :src="url"
          frameborder="0"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "preview",
  props: {
    url:{
       type:String,
       default:''
		}
  },
  data() {
    return {

    };
  },
  methods: {
    closeDrawer(){
      this.$emit('close');
    }
  }
};
</script>
<style scoped lang="scss">
.previewBox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(222, 222, 222, 0.3);
  z-index: 99999;
}
.drawer-close {
  position: absolute;
  top: 60px;
  right: 40px;
}

</style>
