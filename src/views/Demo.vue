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
    </div>

    <el-alert
    class="mt-15 mb-15"
      show-icon
      :closable="false"
      title="请仔细阅读一下文档！（webrtc一对一音视频通话需要自己搭建turn服务器，本文底部有搭建链接）。"
      type="info">
    </el-alert>
<!-- 
    <el-alert
    class="mt-15 mb-15"
      show-icon
      :closable="false"
      title="请注意！3.0 以上版本改了很多内容，不兼容之前的版本，旧版本无法升级，如需使用只能全部替换3.0版本。"
      type="warning">
    </el-alert> -->

    <el-alert
    class="mt-15 mb-15"
      show-icon
      :closable="false"
      title="该项目服务端和web端都属于全开源项目，仅用于个人学习，任何个人和单位不得对源码进行售卖；捐赠后获得的移动端源码也仅供学习使用，不可对源码进行二次售卖。"
      type="error">
    </el-alert>

    <div class="tip">
      <h3 class="mb-5"><b>介绍</b></h3>
      <p>
        1、{{ $packageData.name }}是一个<b class="c-red">开源的即时通信demo，主要用于学习交流，为大家提供即时通讯的开发思路</b>，许多功能需要自行开发，开发的初衷旨在快速建立企业内部通讯系统、内网交流、社区交流。不建议用于商业用途，如确有需要商用，请联系作者授权，自行开发代码量必须要高于原代码量的30%以上，并注明相关的版权问题。
      </p>
      <p>
        2、支持发送表情、图片、语音、视频和文件消息，支持单聊、群聊、群管理、1对1音视频通话（移动端目前仅支持H5和安卓APP，IOS没条件测试）具体功能可以看项目主页。
      </p>
      <p>
        3、目前仅开源了网页端(vue2+lemon-imui+element-ui)和后台接口（TP6+workerman），可以用于对接企业应用等内部聊天，内网私有聊天室,社区聊天等等。
      </p>
      <p>
        4、移动端（uniapp开发，支持H5+APP）<b class="c-red">代码未开源</b>，和web功能几乎无差异，如有需要<b class="c-red cur-handle" @click="scrollTo()">请查看底部说明 <el-link type="primary">[GO]</el-link></b>。
      </p>
    </div>

    

    <!-- 消息 -->
    <div class="demo-btn">
      <div class="flex-box-center  mb-15" @click="showMessageBox()">
        <el-badge :value="unread" :max="99" :hidden="unread ? false : true" class="item">
          <el-button>窗口模式</el-button>
        </el-badge>
      </div>
      <div class="mb-15 mr-20" @click="$router.push({path:'/chat'})">
        <el-button>纯享模式</el-button>
      </div>
      <div class="mb-15 mr-20" @click="$router.push({path:'/manage/index'})">
        <el-button>管理后台</el-button>
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

    <div class="tip">
      <h3 class="mb-5"><b>功能</b></h3>
      <div>
        <p v-for="item in $packageData.funcList" :key="item.icon"><i :class="item.icon"></i> {{ item.text }}</p>
      </div>
      <h3 class="mb-5 mt-5"><b>模式介绍</b></h3>
      <p>
        1、企业模式：类似于企业微信，初始化联系人是加载企业内的所有人员，无须加好友可以直接进行对话、创建群聊等，适用于企业内部通讯。
      </p>
      <p>
        2、社区模式：类似于微信或QQ，需要添加好友才能进行对话，适用于社区交流。社区模式支持加好友、删除好友、改备注等功能。
      </p>
      <p>
        3、选择适合自己项目的模式，然后在后台设置即可。社区模式体验需要自行搭建部署哦，可以在项目地址中看到相关的截图。
      </p>
      <h3 class="mb-5 mt-5"><b>计划</b></h3>
      <p>
        继续优化，完善功能！
      </p>
    </div>

    <div class="warning">
      <p>
        详细的使用方法在源码中基本上都有备注，如果您觉得这个项目对您有帮助，欢迎star，如果有问题可以加QQ群交流，如果您有更好的建议，欢迎提出。
        <br> <b>如果觉得项目不错，不如请作者喝杯奶茶吧~</b>
      </p>
      
    </div>
    <p>
        <el-image class="mr-40 mb-20" style="width:300px;" src="https://emoji.raingad.com/file/wx.jpg"></el-image>
        <el-image class="" style="width:280px;" src="https://emoji.raingad.com/file/zfb.jpg"></el-image>
    </p>
    <div class="tip">
      <h3 class="mb-5"><b>服务介绍</b></h3>
      <p>开源不易，如果需要以下功能，捐赠相应金额，作者可提供服务，进群后咨询作者！或者进群后直接扫码支付，联系群主提供支付凭证即可！</p>
      <p class="m-5"><b>（作者8年phper，前端水平一般，不接外包，除非价格确实高，功能也不难！）</b></p>
      <p>1. 服务端协助部署：<b>200元/次</b>（提供远程 [todesk] 技术指导，赠送API文档。需要自行安装好运行环境，最好是宝塔面板）</p>
      <p>2. uniapp移动端源码：<b> 488元/套。</b>(全开源，仅提供源码，赠送API文档，不提供专业指导和部署，源码仅供学习使用，不可对源码进行二次售卖)</p>
      <p>3. webRTC中继服务器：<b>200元/次</b>（原则上参考底部的教程链接来自行安装，确需服务，可联系作者协助，此服务跟部署服务端是分开的，毕竟这个东西不是自己的产品）</p>
    </div>

    <!-- 其他项目 -->
    <div class="other-pro">
      <h2>其他项目</h2>
      <br>
      <div class="mb-15">
        <el-link type="primary" href="https://gitee.com/raingad/j-preview">纯JS文件预览插件</el-link>
      </div>
    </div>

    <div class="other-pro">
      <h2>其他资料</h2>
      <br>
      <div class="mb-15">
        <el-link type="primary" href="http://june000.gitee.io/lemon-im">Lemon-IMUI使用文档</el-link>
      </div>
      <div class="mb-15">
        <el-link type="primary" href="https://blog.csdn.net/ruiye99/article/details/130992960">WebRTC 网络中继 Coturn 服务安装及部署</el-link>
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
    },
    scrollTo(){
      // 滚动到底部
      window.scrollTo(0,document.body.scrollHeight);
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