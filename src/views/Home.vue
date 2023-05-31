<template>
  <div class="main-container">
    <div class="im-title">
      <div class="logo">
        <el-image style="width: 80px; height: 80px" :src="packageData.logo" fit="cover"></el-image>
      </div>
      <div class="im-content">
        <div class="im-name">
          <div class="text f-36">{{ packageData.name }}</div>
          <div class="version ml-5">
            <el-tag size="mini" type="primary" effect="plain">v{{
              packageData.version
            }}</el-tag>
          </div>
        </div>
        <div class="im-des">{{ packageData.description }}</div>
      </div>
    </div>
    <div class="code-url mb-20">
      <div class="ml-15">
        前端地址：<a :href="packageData.frontUrl" target="_blank"><el-image
            :src="packageData.frontUrl + '/badge/star.svg?theme=white'" alt="star"></el-image></a>
      </div>
      <div class="ml-15">
        后端地址：<a :href="packageData.backstageUrl" target="_blank"><el-image
            :src="packageData.backstageUrl + '/badge/star.svg?theme=dark'" alt="star"></el-image></a>
      </div>
      <div class="ml-15">
        <el-button type="warning" plain size="mini" round><a :href="packageData.qqGroupUrl"
            target="_blank">QQ交流群:336921267</a></el-button>
      </div>
      <div class="ml-15">
        <el-button plain size="mini" round><a href="http://june000.gitee.io/lemon-im"
            target="_blank">Lemon-IMUI手册</a></el-button>
      </div>
    </div>

    <div class="tip">
      <p>
        1.
        {{ packageData.name }}是一个开源的即时通信demo，主要用于学习交流，为大家提供即时通讯的开发思路，许多功能需要自行开发，开发的初衷旨在快速建立企业内部通讯系统，不建议用于商业用途。
      </p>
      <p>
        2.
        目前仅开源了网页端(lemon-imui+element-ui)和后台接口（TP6+workerman），主要是对接企业应用等内部聊天，非社区版，没有后台管理。移动端代码仅实现了基础聊天功能，无群聊管理等相关功能，未开源。
      </p>
    </div>

    <!-- 消息 -->
    <div class="demo-btn">
      <div class="flex-box-center" @click="showMessageBox()">
        <el-badge :value="unread" :max="99" :hidden="unread ? false : true" class="item">
          <el-button>打开消息盒子</el-button>
        </el-badge>
      </div>
      <div @click="$router.push({path:'/chat'})">
        <el-button>原来的DEMO</el-button>
      </div>
      <div class="ml-20">
        <el-tooltip placement="right-start" effect="light">
          <div slot="content"><el-image style="width:200px" src="https://emoji.raingad.com/file/h5.png"></el-image></div>
          <el-button><a :href="packageData.mobileUrl"
                    target="_blank">H5体验</a></el-button>
        </el-tooltip>
        
      </div>
      <div class="ml-20">
        <el-tooltip placement="right-start" effect="light">
          <div slot="content"><el-image style="width:200px" src="https://emoji.raingad.com/file/app.png"></el-image></div>
          <el-button><a href="https://emoji.raingad.com/file/raingad.apk"
                    target="_blank">安卓APP体验</a></el-button>
        </el-tooltip>
        
      </div>
      <div class="ml-20">
        前端技术有限，仅实现了基础功能。
      </div>
    </div>
    
    
    <div class="contact-main">
      <div class="title">联系人</div>
      <div class="contact-box" v-for="x in allContacts" :key="x.id" v-if="x.is_group == 0">
        <div class="contact-item">
          <el-avatar :src="x.avatar"></el-avatar>
          <span>{{ x.realname }}</span>
          <div>
            <!-- 假如在业务中很多地方都有展示人员，我们可以全局调用打开聊天窗口 -->
            <el-button plain size="mini" round @click="$store.commit('openChat',x.id)">发消息</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="warning">
      <p>
        详细的使用方法在源码中基本上都有备注，如果您觉得这个项目对您有帮助，欢迎star，如果有问题可以加QQ群交流，如果您有更好的建议，欢迎提出。如果觉得项目不错，不如请作者喝杯奶茶吧~
      </p>
      
    </div>
    <p>
        <el-image class="mr-40" style="width:300px;" src="https://emoji.raingad.com/file/wx.jpg"></el-image>
        <el-image style="width:280px;" src="https://emoji.raingad.com/file/zfb.jpg"></el-image>
    </p>
    <div class="tip">
      <p>开源不易，同时如果需要以下功能，作者提供付费服务，收费标准为：进群后咨询作者！</p>
      <p>1. 协助部署：200元/次（需要自行安装好运行环境，最好是宝塔面板）</p>
      <p>2. 1v1音视频通话源码：200元/套</p>
      <p>3. uniapp移动端源码：200元/套</p>
    </div>

    <Message ref="Message" :dialogTableVisible.sync="dialogTableVisible"></Message>
  </div>
</template>

<script>
import packageData from "../../package.json";
import { mapGetters, mapMutations, mapState } from "vuex";
import Message from "@/views/message/Index"; //临时位置
export default {
  name: "Index",
  components: {
    Message,
  },
  data() {
    return {
      packageData,
      dialogTableVisible: false, //消息弹窗是否显示
      unread: 0,
      allContacts: [],
    };
  },
  computed: {
    ...mapState({
      chatSocket: (state) => state.unread,
      getContacts: (state) => state.allContacts,
    }),
  },
  watch: {
    chatSocket(val) {
      this.unread = val;
    },
    // 全局获取联系人，在实际的业务场景中，在任何地方都可能会有人员点击，可以直接发送消息
    getContacts(val) {
      this.allContacts = val;
    },
  },
  methods: {
    showMessageBox() {
      this.dialogTableVisible
        ? (this.dialogTableVisible = false)
        : (this.dialogTableVisible = true);
    }
  },
};
</script>
<style scoped lang="scss">
.main-container {
  padding: 50px 10%;

  .im-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .logo {
      width: 80px;
      height: 80px;
      background: #eee;
      border-radius: 50%;
      margin-right: 20px;
    }

    .im-content {
      .im-name {
        font-weight: 600;
        margin-bottom: 5px;
        display: flex;
        align-items: start;
      }

      .im-des {
        font-size: 18px;
        color: #999;
        margin-bottom: 10px;
      }
    }
  }

  .code-url {
    display: flex;
    align-items: center;
  }

  .tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;

    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.8;
    }
  }

  .warning{
    padding: 8px 16px;
    background-color: #fff6f7;
    border-radius: 4px;
    border-left: 5px solid #fe6c6f;
    margin: 20px 0;
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.8;
    }
  }

  .contact-main {
    .contact-box {
      .contact-item {
        width: 300px;
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;

        .el-avatar {
          margin-right: 10px;
        }

        div {
          display: flex;
          align-items: center;
          margin-left: auto;
        }
      }
    }
  }
  .demo-btn{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .item{
      margin-right: 20px;
    }
  }
}

</style>

<style>
.el-image {
  overflow: inherit;
}
.el-tooltip__popper{
  padding:0 !important;
}
</style>