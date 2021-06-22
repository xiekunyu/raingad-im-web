<template>
  <div>

  </div>
</template>

<script>
export default {
  name: "chatSet",
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    previewUrl:{
       type:String,
       default:''
		}
  },
  data() {
    return {
      myDrawer: this.drawer
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
.previewBox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(222, 222, 222, 0.3);
  z-index: 99;
}
.drawer-close {
  position: absolute;
  top: 60px;
  right: 40px;
}

</style>
