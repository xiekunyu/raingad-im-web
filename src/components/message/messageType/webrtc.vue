<script>
export default {
  name: "lemonMessageWebrtc",
  inheritAttrs: false,
  inject: ["IMUI"],
  render () {
    return (
      <lemon-message-basic
        class="lemon-message-webrtc"
        props={{ ...this.$attrs }}
        reverse={this.$attrs.reverse}
        message={this.$attrs.message}
        hideName={this.$attrs.hideName}
        hideTime={this.$attrs.hideTime}
        scopedSlots={{
          content: props => {
            return (
              <div class={[
                'voice-card lz-flex lz-justify-content-start lz-align-items-center',
                {
                    "im-rows-reverse" : this.$attrs.reverse,
                  }
              ]}
              style=''>
                <div class={[
                  'el-icon f-16', 
                  {
                      "el-icon-phone-outline" : props.extends.type == 0,
                  },
                  {
                    "el-icon-video-camera" : props.extends.type == 1,
                  },
                  {
                    "rotate180" : this.$attrs.reverse
                  }
                ]}></div> &nbsp;
                <div>
                  {props.content} 
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
  .voice-card{
    min-width:60px;
    max-width:200px;
    color:#666
  }
.lemon-message.lemon-message-webrtc {
  user-select: none;
  .lemon-message__content {
    font-size: 12px;
    cursor: pointer;
    background: #E7F0F3 !important;
    &::before {
      display: none;
    }
  }
}

</style>
