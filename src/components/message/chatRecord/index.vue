<template>
  <div class="chat-main">
    <el-input
      placeholder="请输入关键字搜索聊天"
      v-model="params.keywords"
      class="input-with-select"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="searchMessage"
      ></el-button>
    </el-input>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all">
        <div class="el-tab-body-list">
          <el-scrollbar>
            <template v-if="dataList.length">
              <ChatItem
                :data="item"
                v-for="(item, index) in dataList"
                :key="index"
              ></ChatItem>
            </template>
            <div v-else>
                <el-empty description="暂无数据"></el-empty>
            </div>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文本" name="text">
        <div class="el-tab-body-list">
          <template v-if="dataList.length">
            <el-scrollbar>
              <ChatItem
                :data="item"
                v-for="(item, index) in dataList"
                :key="index"
              ></ChatItem>
            </el-scrollbar>
          </template>
              <div v-else>
                  <el-empty description="暂无数据"></el-empty>
              </div>
          </div>
      </el-tab-pane>
      <el-tab-pane label="图片" name="image">
        <div class="el-tab-body-list">
          <template v-if="dataList.length">
              <el-scrollbar>
                <el-row style="100%">
                  
                  <ChatImage
                    :data="item"
                    :previewUrl="previewList"
                    v-for="(item, index) in dataList"
                    :key="index"
                  ></ChatImage>
                </el-row>
              </el-scrollbar>
            </template>
              <div v-else>
                  <el-empty description="暂无数据"></el-empty>
              </div>
          </div>
      </el-tab-pane>
      <el-tab-pane label="视频" name="video">
        <div class="el-tab-body-list">
          <template v-if="dataList.length">
            <el-scrollbar>
              <ChatItem
                :data="item"
                v-for="(item, index) in dataList"
                :key="index"
              ></ChatItem>
            </el-scrollbar>
          </template>
          <div v-else>
              <el-empty description="暂无数据"></el-empty>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文件" name="file">
        <div class="el-tab-body-list">
          <template v-if="dataList.length">
            <el-table :data="dataList" style="width: 100%" height="450">
              <el-table-column prop="fileName" label="文件" width="300">
                <template slot-scope="scope">
                  <div class="chat-file">
                    <div>
                      <el-image
                        class="fileExt"
                        fit="cover"
                        :src="fileExt(scope.row.fileName)"
                      ></el-image>
                    </div>
                    <div class="fileName">{{ scope.row.fileName }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="sendTime" label="上传时间" width="160">
                <template slot-scope="scope">
                  {{ formatTime(scope.row.sendTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="fileSize" label="大小" width="100">
                <template slot-scope="scope">
                  {{ fileSize(scope.row.fileSize) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="fromUser.realname"
                label="上传者"
                width="100"
              >
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="downloadFile(scope.row)"
                    >下载</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
          <div v-else>
              <el-empty description="暂无数据"></el-empty>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      background
      :hide-on-single-page="singlePage"
      :page-size.sync="params.limit"
      :current-page.sync="params.page"
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import ChatItem from "./chatItem";
import ChatImage from "./chatImage";
import { arrayToString, date } from "@/utils/index";
import { getFileSize, getFileExtImg, download } from "@/utils/file";
export default {
  name: "chatRecord",
  components: {
    ChatItem,
    ChatImage
  },
  props: {
    contact: {
      type: Object,
      default: {} //定义参数默认值
    }
  },
  computed: {
    formatTime() {
      return function(val) {
        val = val / 1000;
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
      activeName: "all",
      total: 0,
      singlePage: false,
      dataList: [],
      previewList: [],
      params: {
        toContactId: this.contact.id,
        is_group: this.contact.is_group,
        type: "all",
        keywords: "",
        page: 1,
        limit: 20
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      this.params.page = 1;
      this.params.type = tab.name;
      this.getMessage();
    },
    searchMessage() {
      this.getMessage();
    },
    getMessage() {
      this.$api.imApi.getMessageListAPI(this.params)
        .then(res => {
          this.dataList = res.data;
          this.total = res.count;
          if (res.count <= this.params.limit) {
            this.singlePage = true;
          } else {
            this.singlePage = false;
          }
          if (this.params.type == "image") {
            this.previewList = arrayToString(res.data, "content", false);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getMessage();
    },
    downloadFile(item) {
      download(item.content, item.fileName, item.type);
    }
  },
  created() {
    this.getMessage();
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.chat-main {
  margin: -20px -5px;
}
.el-tab-body-list {
  height: 450px;
}

.input-with-select {
  width: 250px;
}
.el-select .el-input {
  width: 130px;
}
.el-dialog .el-dialog__body {
  padding: 15px;
}

.chat-file {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .fileExt {
    width: 30px;
    display: block;
  }
  .fileName {
    margin-left: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
