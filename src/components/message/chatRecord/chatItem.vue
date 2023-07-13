<template>
  <div class="chat-list-item">
    <div class="chat-list-avatar" @click="$user(data.fromUser.id)">
      <el-avatar shape="square" size="medium" :src="data.fromUser.avatar"></el-avatar>
    </div>
    <div class="chat-list-body">
      <div class="chat-list-title">
        {{ data.fromUser.realname }}
        <span class="time"> {{ formatTime(data.sendTime) }}</span>
      </div>
      <div
        class="chat-list-text"
        v-if="data.type == 'text'"
        v-html="data.content"
      ></div>
      <div class="chat-list-tools" v-if="data.type == 'text'">
        <el-tooltip effect="dark" content="复制文本" placement="top">
          <i class="el-icon-document-copy" @click="copyText(data.content)"></i>
        </el-tooltip>
      </div>
      <div v-if="data.type == 'image'" class="chat-list-image">
        <el-image
          style="max-width: 300px;"
          :src="data.content"
          :z-index="3000"
          :preview-src-list="[data.content]"
          fit="contain"
        ></el-image>
      </div>
      <div v-if="data.type == 'video'" class="chat-list-video">
        <video  style="max-width: 300px;" :src="data.content" controls></video>
      </div>
      <div v-if="data.type == 'file'" class="chat-list-file">
        <el-card
          :body-style="{ padding: '10px 10px 0 10px' }"
          style="width:260px"
        >
          <div class="chat-file-content">
            <div class="chat-file-ext">
              <el-image
                style="width: 35px;"
                :src="fileExt(data.fileName)"
                fit="fill"
              ></el-image>
            </div>
            <div class="chat-file-title">
              <div class="chat-file-name">
                <span class="fileName">{{ data.fileName }} </span>
                <span class="fileSize">({{ fileSize(data.fileSize) }})</span>
              </div>
              <div class="chat-file-remark">
                文件已成功发送, 文件助手永久保存
              </div>
            </div>
          </div>
          <hr />
          <div class="bottom clearfix" align="right">
            <el-button type="text" class="button" @click="downloadFile(data)">下载</el-button>
            <el-button type="text" class="button" @click="onlinePreview(data)">在线预览</el-button>
          </div>
        </el-card>
      </div>
      <!-- <div class="chat-list-tools"><span class='el-icon-document-copy' @click="copyText(data.content)" title="复制文本"></span></div> -->
    </div>
  </div>
</template>

<script>
import { date } from "@/utils/index";
import { getFileSize, getFileExtImg,download } from "@/utils/file";
export default {
  name: "chatItem",
  props: {
    data: {
      type: Object,
      default: {} //定义参数默认值
    }
  },
  computed: {
    formatTime() {
      return function(val) {
        val=parseInt(val/1000);
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
    };
  },
  methods: {
    // 复制文本
    copyText(val) {
      this.$clipboard(val);
      this.$message({
        type: "success",
        message: "复制成功!"
      });
    },
    // 预览文件
    onlinePreview(item){
      this.$preview(item.preview);
    },
    // 下载文件
    downloadFile(item){
      download(item.content,item.fileName);
    }
  },
  created() {}
};
</script>
<style scoped lang="scss">
.chat-list-item {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
  .chat-list-avatar {
    width: 40px;
    margin-right: 10px;
  }
  .chat-list-body {
    flex: auto;
    position: relative;
    .chat-list-title {
      color: #666;
      margin-bottom: 5px;
      .time {
        font-size: 12px;
        color: #ccc;
        margin-left: 20px;
      }
    }
    .chat-list-text {
      padding: 5px 10px;
      color: #909399;
      background-color: #f4f4f5;
    }
    .chat-list-image {
      padding: 5px 10px;
    }
    .chat-list-tools {
      position: absolute;
      display: none;
      right: 15px;
      top: -1px;
      font-size: 18px;
      cursor: pointer;
    }
    .chat-list-file {
      .chat-file-content {
        display: flex;
        justify-content: flex-start;
        .chat-file-ext {
          margin: 0 10px 10px 0;
        }
        .chat-file-title {
          .chat-file-name {
            display: flex;
            justify-content: space-between;
            .fileName {
              width:120px;
              margin-bottom: 8px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .fileSize {
              color: #ccc;
              font-size: 12px;
            }
          }
          .chat-file-remark {
            font-size: 12px;
            color: #aaa;
          }
        }
      }
    }
  }
  .chat-list-body:hover .chat-list-tools {
    display: block;
  }
}
</style>
