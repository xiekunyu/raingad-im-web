<template>
  <div class="chat-main">
    <el-input
      placeholder="请输入内容"
      v-model="input3"
      class="input-with-select"
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all">
        <div class="el-tab-body-list">
          <el-scrollbar style="height:100%;">
            <ChatItem
              :data="item"
              v-for="(item, index) in dataList"
              :key="index"
            ></ChatItem>
          </el-scrollbar>
        </div>
        <el-pagination background  :page-size.sync="listRows" :current-page.sync="pageSize" layout="prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="文本" name="text">
        <div class="el-tab-body-list">
          <el-scrollbar style="height:100%;"> </el-scrollbar>
        </div>
        <el-pagination background layout="prev, pager, next" :total="1000">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="图片" name="image">
        <div class="el-tab-body-list">
          <el-scrollbar style="height:100%;">
            <el-row style="100%">
              <ChatImage :data="items"></ChatImage>
              <ChatImage :data="items"></ChatImage>
              <ChatImage :data="items"></ChatImage>
              <ChatImage :data="items"></ChatImage>
              <ChatImage :data="items"></ChatImage>
            </el-row>
          </el-scrollbar>
        </div>
        <el-pagination background :page-size="listRows" :current-page.sync="pageSize" layout="prev, pager, next" :total="total">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="文件" name="file">
        <div class="el-tab-body-list">
          <el-table :data="tableData" style="width: 100%" height="400">
            <el-table-column prop="fileName" label="文件" width="300">
              <template slot-scope="scope">
                <div class="chat-file">
                  <div>
                    <el-avatar
                      class="fileExt"
                      shape="square"
                      size="small"
                      src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                    ></el-avatar>
                  </div>
                  <div class="fileName">{{ scope.row.fileName }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sendTime" label="发送时间" width="160">
            </el-table-column>
            <el-table-column prop="fileSize" label="大小" width="100">
            </el-table-column>
            <el-table-column prop="displayName" label="上传者" width="100">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >下载</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination :current-page.sync="pageSize" background layout="prev, pager, next" :total="total">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ChatItem from "./chatItem";
import ChatImage from "./chatImage";
import { getMessageListAPI } from "@/api/im";
export default {
  name: "file",
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
  data() {
    return {
      websocket: null,
      activeName: "all",
      input3: "",
      select: "",
      items: {
        avatar:
          "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        displayName: "管理员",
        content:
          "http://im-img.gzydong.club/media/images/talks/60c1be090a0f1CpBf8qMZ6NzvczF8_550x281.png",
        sendTime: 1601234567,
        fileSize: "26545",
        type: "file",
        fileName: "测试文件.docx"
      },
      pageSize: 1,
      listRows: 3,
      total:0,
      dataList: [],
      tableData: [
        {
          sendTime: "2016-05-03 12:25:52",
          displayName: "王小虎",
          fileName: "上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄",
          content: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          fileSize: 200333
        },
        {
          sendTime: "2016-05-03 12:25:52",
          displayName: "王小虎",
          fileName: "上海",
          content: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          fileSize: 200333
        },
        {
          sendTime: "2016-05-03 12:25:52",
          displayName: "王小虎",
          fileName: "上海",
          content: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          fileSize: 200333
        }
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getMessage(type) {
      getMessageListAPI({
        toContactId: this.contact.id,
        is_group: this.contact.is_group,
        type: type,
        pageSize: this.pageSize,
        listRows: this.listRows
      })
        .then(res => {
          this.dataList = res.data;
          this.total=res.count;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleCurrentChange(val){
        console.log(val);
        this.pageSize=val;
        this.getMessage('');
    }
    
  },
  created() {
    this.getMessage("");
  },
  mounted(){

  }
};
</script>
<style scoped lang="scss">
.chat-main {
  margin: -20px -5px;
}
.el-tab-body-list {
  height: 400px;
}

.input-with-select {
  width: 250px;
}
.el-select .el-input {
  width: 130px;
}
.el-dialog >>> .el-dialog__body {
  padding: 15px;
}

.chat-file {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .fileExt {
    display: block;
  }
  .fileName {
    margin-left: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
