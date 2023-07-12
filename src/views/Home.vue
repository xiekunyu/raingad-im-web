<template>
  <div
    class="main-container"
    :style="'background-image:url(' + Background + ')'"
  >
    <raingadIm :fullScreen="true"></raingadIm>
  </div>
</template>

<script>
import Background from "../assets/img/login-background.jpg";
import raingadIm from "@/components/message/index";

export default {
  name: "app",
  components: {
    raingadIm
  },
  data() {
    var _this = this;
    return {
      Background,
    };
  }
};
</script>

<style scoped lang="scss">
.main-container {
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-size: cover;
}
.chat-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}


</style>
