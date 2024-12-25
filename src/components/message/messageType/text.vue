<script>
export default {
  name: "lemonMessageText",
  inheritAttrs: false,
  inject: ["IMUI"],
  render() {
    return (
      <lemon-message-basic
        class="lemon-message-text"
        props={{ ...this.$attrs }}
        scopedSlots={{ 
          content: props => {
            const content = this.IMUI.emojiNameToImage(props.content);
            const isQuote = props.extends && props.extends.content;
            return (
              <div>
                <span domProps={{ innerHTML: content }} />
                {isQuote ? 
                <div class="message-quote">
                  <span>{props.extends.content}</span>
                </div>
                : ''
              }
              </div>
            );
          }
        }}
      />
    );
  }
};
</script>
<style lang="scss" scoped>
.lemon-message-text{
  .lemon-message{
    .content{
      img{
        width:18px;
        height:18px;
        display:inline-block;
        background:transparent;
        position:relative;
        top:-1px;
        padding:0 2px;
        vertical-align:middle;
      }
      
    }
  }
}
.message-quote{
	padding:3px 5px;
	font-size:12px;
	margin-top:10px;
	background-color: #ffffff;
	overflow: hidden !important;
	text-overflow: ellipsis;
	white-space: nowrap !important;
	max-width:240px;
  border-radius:4px;
  border-left:solid #999 4px;
}
</style>
