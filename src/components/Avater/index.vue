<template>
  <div class="avater-components">
    <el-popover placement="right" width="400" :trigger="avatarevent" v-show="avatarMessageIsShow">
      <div class="tips">
        <div v-for="(every, i) in avatarMessage" :key="i">
          <div v-if="i !== 'avatarUrl'">
            <p>{{ every }}</p>
          </div>
        </div>
      </div>
      <div class="avatar" slot="reference">
        <el-avatar :size="avatarSize" :src="avatarMessage.avatarUrl" :shape="avatarShape" fit="contain"
          v-if="avatarMessage.avatarUrl"></el-avatar>
        <el-avatar :size="avatarSize" :shape="avatarShape" fit="contain" v-else></el-avatar>
      </div>

    </el-popover>
    <div class="avatar" slot="reference" v-show="!avatarMessageIsShow" @click="clickAvatar">
      <el-avatar :size="avatarSize" :src="avatarMessage.avatarUrl" :shape="avatarShape" fit="contain"></el-avatar>
    </div>
  </div>
</template>

<script>
export default {
  name: "avatar",
  data () {
    return {};
  },
  props: {
    avatarevent: {
      type: String,
      default: "hover",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    avatarSize: {
      type: Number,
      default: 20,
    },
    avatarMessage: {
      type: Object,
      default: () => {
        return {};
      },
    },
    avatarShape: {
      type: String,
      default: "circle",
    },
    avatarMessageIsShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 点击头像事件
    clickAvatar () {
      this.$emit("clickAvatar", true);
    },
  },
};
</script>
<style lang="scss">
.avater-components {
  .el-avatar--square {
    border-radius: 8px;
  }
}
.avatar{
  height:24px;
}
</style>


