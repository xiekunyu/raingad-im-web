<script>
export default {
  name: "lemonMessageVoice",
  inheritAttrs: false,
  inject: ["IMUI"],
  render () {
    return (
      <lemon-message-basic
        class="lemon-message-voice"
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
              style={{width : props.extends.duration*3 +'px'}}>
                <div class={[
                  'iconfont icon-im-yuyin f-16', 
                  {
                      "voice-icon" : props.isPlay
                  },
                  {
                      "rotate180" : this.$attrs.reverse
                  }
                ]}></div> &nbsp;
                <div>
                  {props.extends.duration}" 
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
.lemon-message.lemon-message-voice {
  user-select: none;
  .lemon-message__content {
    font-size: 12px;
    cursor: pointer;
    background: #E7F0F3 !important;
    border-radius: 18px !important;
    &::before {
      display: none;
    }
  }
}
.voice-icon{
  animation: twinkle 0.5s infinite alternate;
}
@keyframes twinkle {
      0%{
          opacity:0.8;
      }
      100%{
          opacity:0.2;
      }
}
</style>
