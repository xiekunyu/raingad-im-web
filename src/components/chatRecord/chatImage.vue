<template>
  <div>
    <el-col :span="6" style="padding:0 12px 12px 0">
      <el-card :body-style="{ padding: '0px' }">
        <el-image
          style="width: 100%;height:120px"
          :src="data.content"
          fit="cover"
        ></el-image>
        <div style="padding: 10px;">
          <div class="bottom clearfix">
            <time class="time">{{ data.displayName }}</time>
            <el-button type="text" class="button">操作按钮</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import { date } from "@/utils/index";
import { getFileSize, getFileExtImg } from "@/utils/file";
export default {
  name: "chatImage",
  props: {
    data: {
      type: Object,
      default: {} //定义参数默认值
    }
  },
  computed: {
    formatTime() {
      return function(val) {
        return date("Y/m/d H:i:s", val);
      };
    },
    fileSize() {
      return function(val) {
        return getFileSize(val);
      };
    },
    fileExt() {
      return function(val) {
        return getFileExtImg(val);
      };
    }
  },
  data() {
    return {
      currentDate: new Date()
    };
  },
  methods: {
    copyText(val) {
      this.$clipboard(val);
      this.$message({
        type: "success",
        message: "复制成功!"
      });
    }
  },
  created() {}
};
</script>
<style scoped lang="scss">
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
