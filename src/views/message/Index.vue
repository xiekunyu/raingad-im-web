<template>
  <div class="messageBoxStyle" v-show="dialogTableVisible">
  <el-dialog :visible.sync="dialogIsShow" :modal="false" @close="closeDialog" custom-class="sideMenu-message"
        :show-close="false" :width="'1000px'" :close-on-press-escape="true" >
      <rainagdIm @newChat="contactSync" @close="closeDialog"></rainagdIm>
    </el-dialog>
  </div>
</template>

<script>

import rainagdIm from "@/components/message/index.vue";
const getTime = () => {
  return new Date().getTime();
};


export default {
  name: "app",
  components: {
    rainagdIm
  },
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      unread:0,
      dialogIsShow:true,
    };
  },
  computed: {
    // 监听全局socket消息状态
    formatTime() {
      return function(val) {
        return timeFormat(val);
      };
    }
  },
  watch: {
   // 全局调用发送消息
    dialogTableVisible (New) {
      if (New) {
        this.$nextTick(() => {
          this.dialogIsShow = New
        })
        // this.getSimpleChat('update')
      }
    }
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    closeDialog () {
      this.appList = false
      this.$nextTick(() => {
        this.$emit('update:dialogTableVisible', false)
      })
    },
    contactSync (val) {
      this.dialogIsShow = true;
      this.$emit('update:dialogTableVisible', true);
    },
    
  }
};
</script>
<style scoped lang="scss">

.messageBoxStyle {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 1999;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: visible;
  .el-dialog__wrapper {
    display: flex;
    align-items: center;
  }
}
.sideMenu-message {
  margin-top: 0 !important;
  height: 580px;
  border-radius: 4px;
  .el-tab-pane {
    background: white;
  }
}

::v-deep .el-dialog__header {
    display: none;
  }
  
::v-deep .el-dialog__body {
  padding: 0px;
}

</style>
