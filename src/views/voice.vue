<script>
export default {
  name: "lemonMessageVoice",
  inheritAttrs: false,
  inject: ["IMUI"],
  render() {
    return (
      <lemon-message-basic
        class="lemon-message-voice"
        props={{ ...this.$attrs }}
        scopedSlots={{
          content: (props) => {
            return <span>{props.content}&nbsp;🔈</span>;
          },
        }}
      />
    );
  },
};
</script>
