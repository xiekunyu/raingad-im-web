<template>
  <div class="main-container">
    <div class="im-title">
      <div class="logo">
        <el-image style="width: 80px; height: 80px" :src="$packageData.logo" fit="cover"></el-image>
      </div>
      <div class="im-content">
        <div class="im-name">
          <div class="text f-36">{{ $packageData.name }}</div>
          <div class="version ml-5">
            <el-tag size="mini" type="primary" effect="plain">v{{
              $packageData.version
            }}</el-tag>
          </div>
        </div>
        <div class="im-des">{{ $packageData.description }}</div>
      </div>
    </div>
    <div class="code-url">
      <div class="ml-15 mb-15"> 前端地址：
        <a :href="$packageData.frontUrl" target="_blank">
          <el-image :src="$packageData.frontUrl + '/badge/star.svg?theme=white'" alt="star"></el-image>
        </a>
      </div>
      <div class="ml-15 mb-15">
        后端地址：<a :href="$packageData.backstageUrl" target="_blank"><el-image
            :src="$packageData.backstageUrl + '/badge/star.svg?theme=dark'" alt="star"></el-image></a>
      </div>
      <div class="ml-15 mb-15">
        <el-button type="warning" plain size="mini" round><a :href="$packageData.qqGroupUrl"
            target="_blank">QQ交流群:336921267</a></el-button>
      </div>
      <div class="ml-15 mb-15">
        <el-button plain size="mini" round><a href="http://june000.gitee.io/lemon-im"
            target="_blank">Lemon-IMUI手册</a></el-button>
      </div>
    </div>

    <div class="tip">
      <h3 class="mb-5"><b>介绍</b></h3>
      <p>
        1、{{ $packageData.name }}是一个<b class="c-red">开源的即时通信demo，主要用于学习交流，为大家提供即时通讯的开发思路</b>，许多功能需要自行开发，开发的初衷旨在快速建立企业内部通讯系统，或者用于内网交流。不建议用于商业用途，如确有需要商用，请自行开发完善，并注明相关的版权问题。
      </p>
      <p>
        2、支持发送表情、图片、语音、视频和文件消息，支持单聊、群聊、群管理、1对1音视频通话（移动端目前仅支持H5和安卓APP，IOS没条件测试，和web端不相通，独立使用）具体功能可以看项目主页。
      </p>
    </div>

    <div class="warning">
      <h3 class="mb-5"><b>TIPS</b></h3>
      <p>1、目前仅开源了网页端(lemon-imui+element-ui)和后台接口（TP6+workerman），可以用于对接企业应用等内部聊天，内网私有聊天室。</p>
      <p>2、非社区版，不能加好友等，暂时没有后台管理，正在计划开发中，增加一些简单的管理功能，比如加、减人等。</p>
      <p>3、移动端代码未开源，如有需要请查看底部说明。</p>
    </div>

    <!-- 消息 -->
    <div class="demo-btn">
      <div class="flex-box-center  mb-15" @click="showMessageBox()">
        <el-badge :value="unread" :max="99" :hidden="unread ? false : true" class="item">
          <el-button>打开消息盒子</el-button>
        </el-badge>
      </div>
      <div class="mb-15 mr-20" @click="$router.push({path:'/chat'})">
        <el-button>纯享模式</el-button>
      </div>
      <div class=" mb-15 mr-20">
        <el-tooltip placement="right-start" effect="light">
          <div slot="content"><el-image style="width:200px" src="https://emoji.raingad.com/file/h5.png"></el-image></div>
          <el-button><a :href="$packageData.mobileUrl"
                    target="_blank">H5体验</a></el-button>
        </el-tooltip>
        
      </div>
      <div class="mb-15">
        <el-tooltip placement="right-start" effect="light">
          <div slot="content"><el-image style="width:200px" src="https://emoji.raingad.com/file/app.png"></el-image></div>
          <el-button><a href="https://emoji.raingad.com/file/raingad.apk"
                    target="_blank">安卓APP体验</a></el-button>
        </el-tooltip>
        
      </div>
    </div>
    
    
    <div class="contact-main">
      <div class="title"><b style="font-size:24px">联系人</b>（仅展示部分用于演示）</div>
      <div class="contact-box" v-for="x in allContacts" :key="x.id" v-if="x.is_group == 0 && x.id<6">
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
        <el-image class="mr-40 mb-20" style="width:300px;" src="https://emoji.raingad.com/file/wx.jpg"></el-image>
        <el-image class="" style="width:280px;" src="https://emoji.raingad.com/file/zfb.jpg"></el-image>
    </p>
    <div class="tip">
      <h3 class="mb-5"><b>服务介绍</b></h3>
      <p>开源不易，同时如果需要以下功能，作者提供付费服务，收费标准为：进群后咨询作者！</p>
      <p>1. 协助部署：200元/次（需要自行安装好运行环境，最好是宝塔面板），赠送web端1v1音视频通话源码</p>
      <p>2. uniapp移动端源码：388元/套。(全开源)</p>
    </div>

        <!-- 其他项目 -->
    <div class="other-pro">
      <h2>其他项目</h2>
      <br>
      <div class="mb-15">
        <el-link type="primary" href="https://gitee.com/raingad/j-preview">纯JS文件预览插件</el-link>
      </div>
    </div>

    <Message ref="Message" :dialogTableVisible.sync="dialogTableVisible"></Message>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import Message from "@/views/message/Index"; //临时位置
export default {
  name: "Index",
  components: {
    Message,
  },
  data() {
    return {
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
        align-items: flex-start;
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
    flex-wrap: wrap;
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
    flex-wrap: wrap;
    .item{
      margin-right: 20px;
    }
  }
}

@media screen and (max-width: 768px) {
  .main-container{
    padding: 15px;
  }
}
::v-deep .el-tooltip__popper{
  padding:0 !important;
}
</style>

<style>
.el-image {
  overflow: inherit;
}

</style>