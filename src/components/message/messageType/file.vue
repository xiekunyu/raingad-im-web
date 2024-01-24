<script>
import { getFileSize } from "@/utils/file";
export default {
  name: "lemonMessageFile",
  inheritAttrs: false,
  render() {
    return (
      <lemon-message-basic
        class="lemon-message-file"
        props={{ ...this.$attrs }}
        scopedSlots={{
          content: props => [
            <div class="lemon-message-file__inner">
              <p class="lemon-message-file__name">{props.fileName}</p>
              <p class="lemon-message-file__byte">
                {getFileSize(props.fileSize)}
              </p>
            </div>,
            <div class="lemon-message-file__sfx">
               <img src={props.extUrl} style="width:34px;height:42px"></img>
            </div>
          ]
        }}
      />
    );
  }
};
</script>
<style lang="scss" scoped>
.lemon-message__content img{
  background-color: #fff;
}
.lemon-message-file {
  .lemon-message {
    & > .content {
      display: flex;
      cursor: pointer;
      width: 200px;
      background: #fff;
      padding: 12px 18px;
      overflow: hidden;
      p {
        margin: 0;
      }
    }

    & > .tip {
      display: none;
    }

    & > .inner {
      background-color: #fff;
      flex: 1;
    }

    & > .name {
      font-size: 14px;
    }

    & > .byte {
      font-size: 12px;
      color: #aaa;
    }

    & > .sfx {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      user-select: none;
      font-size: 34px;
      color: #ccc;
    }
  }
}
</style>
