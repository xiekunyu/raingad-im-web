<script>
export default {
  name: "lemonMessageVideo",
  inheritAttrs: false,
  inject: ["IMUI"],
  render () {
    return (
      <lemon-message-basic
        class="lemon-message-video"
        props={{ ...this.$attrs }}
        reverse={this.$attrs.reverse}
        message={this.$attrs.message}
        hideName={this.$attrs.hideName}
        hideTime={this.$attrs.hideTime}
        scopedSlots={{
          content: props => {
            return (
              <div class={[
                'video-card'
              ]}
              style={{
              }}
              >
                 <el-image style="max-height: 200px" src={ props.extends.poster } fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                 </el-image>
                  <div class="video-shadow">
                  <div class="el-icon el-icon-video-play c-white f-28 video-icon"></div>
                  </div>
              </div>
            );
          },
        }}
      />
    );
  },
};
</script>
<style lang="scss">
  .video-card{
    min-width:60px;
    max-width:400px;
    color:#666;
    position: relative;
  }
.video-shadow{
  position: absolute;width:100%;height:100%;background: #83838387;z-index:9;top:0;
}
.video-icon{
    position: absolute;
	  top: 50%;
	  z-index: 10;
	  transform: translate(-50%, -50%);
	  left: 50%;
  }
.lemon-message.lemon-message-video{
  user-select: none;
  .lemon-message__content {
    padding:0;
    font-size: 12px;
    cursor: pointer;
    background: #E7F0F3 !important;
    border-radius: 6px !important;
    overflow: hidden;
    &::before {
      display: none;
    }
  }
  
}

</style>
