<template>
  <div class="main-container">
    <div class="im-title">
      <div class="logo">
        <el-image style="width: 80px; height: 80px" :src="$packageData.logo" fit="cover"> </el-image>
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
      title="本项目为演示系统，请仔细阅读一下文档！进群请先Star项目。本项目是一款开源的即时通信demo（存在一定的BUG），主要用于学习交流，为大家提供即时通讯的开发思路。"
      type="info">
    </el-alert>
    <el-alert
    class="mt-15 mb-15"
      show-icon
      :closable="false"
      title="该项目服务端和web端都属于全开源项目，仅用于个人学习，任何个人和单位不得对源码进行售卖；捐赠后获得的移动端源码也仅供学习使用，不可对源码进行二次售卖。"
      type="warning">
    </el-alert>
    <el-alert
      class="mt-15 mb-15"
        show-icon
        :closable="false"
        title="免责声明：请勿将源码用于木马、病毒、色情、赌博、诈骗等违反国家法律法规行业，如有发现我会协助相关行政执法机关清查！"
        type="error">
      </el-alert>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="mb-20"> 
    <el-tab-pane label="📘 程序介绍">
      <div class="tip">
          <p class="mb-5" v-for="(item,index) in introduce" :key="index"><i :class="item.icon"></i> <span v-html="item.text"></span></p>
      </div>
    </el-tab-pane>
    <el-tab-pane label="🪄 支持功能">
      <div class="success">
        <p class="mb-5"  v-for="(item,index) in $packageData.funcList" :key="index"><i :class="item.icon"></i>  <span v-html="item.text"></span></p>
      </div>
    </el-tab-pane>
    <el-tab-pane label="🛒 技术栈">
      <div class="info">
          <p class="mb-5"  v-for="(item,index) in techStack"   :key="index"><i :class="item.icon"></i> <span v-html="item.text"></span></p>
      </div>
    </el-tab-pane>
  </el-tabs>

  <div class="mb-15"><b style="font-size:20px">功能演示</b></div>
    <!-- 消息 -->
    <div class="demo-btn">
      <div class="flex-box-center  mb-15" @click="showMessageBox()">
        <el-badge :value="unread" :max="99" :hidden="unread ? false : true" class="item">
          <el-button>窗口模式</el-button>
        </el-badge>
      </div>
      <div class="mb-15 mr-15" @click="$router.push({path:'/chat'})">
        <el-button>纯享模式</el-button>
      </div>
      <div class="mb-15 mr-15" @click="$router.push({path:'/manage/index'})">
        <el-button>管理后台</el-button>
      </div>
      <div class=" mb-15 mr-15">
        <el-tooltip placement="right-start" effect="light">
          <div slot="content"><el-image style="width:200px" src="/assets/img/h5.png"></el-image></div>
          <el-button><a :href="$packageData.mobileUrl"
                    target="_blank">H5体验</a></el-button>
        </el-tooltip>
        
      </div>
      <div class="mb-15">
        <el-button @click="downApp" ><a  target="_blank">客户端下载</a></el-button>
      </div>
    </div>
    
    
    <div class="contact-main">
      <div class="title"><b style="font-size:20px">联系人</b>（仅展示部分用于演示）</div>
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
   
    <div class="tip mb-20 mt-10">
      <h3 class="mb-5"><b>服务介绍</b></h3>
      <p>
        详细的使用方法在源码中基本上都有备注，如果您觉得这个项目对您有帮助，欢迎star，如果有问题可以加QQ群交流，如果您有更好的建议，欢迎提出。<b> 开源不易，如果需要以下功能，捐赠相应金额，作者可提供服务，进群后咨询作者！</b></p>
      
      <p>1. 服务端协助部署：仅提供服务端远程 [todesk] 技术指导，需要提供纯净的centOS服务器一台。</p>
      <p>2. uniapp移动端源码【付费获取】(源码无加密，仅提供源码，<b>不提供专业指导和部署 </b>)</p>
      <p>3. 桌面端源码【付费获取】：使用vue+electron前端技术打包，和web端功能一样，支持后台运行和消息通知。</p>
      <p>4. webRTC中继服务器：原则上参考底部的教程链接来自行安装，确需服务，也可联系作者协助。</p>
      <p>5. 技术指导服务：包含远程指导，代码解析，开发思路等，付费之日起一个月内有效。</p>
      <p>6. 团队安心包：包含上述前4项服务，根据需求选择，以及安卓APP和H5打包（需要提供Dcloud账号【打包】、服务器、域名、证书等，APP还需要提供应用名称和图标）</p>
      <p>7、其他未列出的服务，请进群咨询作者！作者8年phper，前端水平一般，不接外包和二开！当然除非你要的东西非常简单。</p>
      <el-link class="mt-10 mb-10" type="primary" :href="$packageData.qqGroupUrl" target="_blank">有技术问题需要交流或者购买移动端的可以【戳我】加入交流群。<b class="c-red">加群前请先点star，否则不予通过，长时间不活跃的将被定期清理</b></el-link>
    </div>

    <div class="danger mb-20" >
      <h3 class="mb-5"><b>注意事项</b></h3>
      <p class="m-5">
        1、捐赠购买移动端或者桌面端赠送文档，包含：接口说明、安装教程、常见问题的解决方法等。<br>
        2、源码作者不保证无任何问题，可能存在兼容性问题或者一些小的BUG，需要自行优化升级，望悉知。<br>
        3、捐赠获得的源码仅供学习或二次开发使用，不可对源码进行二次售卖。<br>
        4、价格或服务内容可能会有变动，<b class="c-red">随着功能的增加，价格会上涨</b>，以咨询作者时给的服务方案为准！
      </p>
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
        <el-link type="primary" href="https://lemon.raingad.com">Lemon-IMUI使用文档</el-link>
      </div>
      <div class="mb-15">
        <el-link type="primary" href="https://www.npmjs.com/package/chatarea">聊天输入框插件【chatarea】</el-link>
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
      activeName: '0',
      techStack: [
        {
          icon: 'el-icon-cpu',
          text: "后端：TP6+Mysql+workerman+webRTC中继服务。 <b class='c-success'>[开源]</b>"
        },
        {
          icon: 'el-icon-news',
          text: "前端：vue2+element-ui+lemon-imui。 <b class='c-success'>[开源]</b>"
        },
        {
          icon: 'el-icon-mobile',
          text: "移动端：uniapp for vue3+pinia。支持编译为小程序+h5+APP。<b class='c-red'>[联系作者，捐赠获取]</b>"
        },
        {
          icon: 'el-icon-monitor',
          text: "桌面端：vue2(web端修改版)+electron。<b class='c-red'>[联系作者，捐赠获取]</b>"
        }
      ],
      introduce:[
        {
          icon:'el-icon-chat-dot-square',
          text:this.$packageData.name+"是一个<b class='c-red'>开源的即时通信demo（存在一定的BUG），主要用于学习交流，为大家提供即时通讯的开发思路</b>，许多功能需要自行开发，开发的初衷旨在快速建立企业内部通讯系统、内网交流、社交交流。"
        },
        {
          icon:'el-icon-cpu',
          text:"不建议用于商业用途，如确有需要商用，请联系作者授权，自行开发代码量必须要高于原代码量的30%以上，并注明相关的版权问题。"
        },
        {
          icon: 'el-icon-office-building',
          text: '支持企业模式：类似于企业微信，初始化联系人是加载企业内的所有人员，无须加好友可以直接进行对话、创建群聊等，适用于企业内部通讯。'
        },
        {
          icon: 'el-icon-chat-line-round',
          text: '支持社交模式：类似于微信或QQ，需要添加好友才能进行对话，适用于社交交流。社交模式支持加好友、删除好友、改备注等功能。'
        },
        {
          icon: 'el-icon-discover',
          text: '选择适合自己项目的模式，然后在后台设置即可。社交模式体验需要自行搭建部署哦，可以在项目地址中看到相关的截图。'
        }
      ]
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    showMessageBox() {
      this.dialogTableVisible
        ? (this.dialogTableVisible = false)
        : (this.dialogTableVisible = true);
    },
    scrollTo(){
      // 滚动到底部
      window.scrollTo(0,document.body.scrollHeight);
    },
    downApp(){
      window.open(window.BASE_URL + 'downapp');
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
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.8;
    }
  }

  .danger{
    padding: 8px 16px;
    background-color: #fef0f0;
    border-radius: 4px;
    border-left: 5px solid #f56c6c;
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.8;
    }
  }

  .warning{
    padding: 8px 16px;
    background-color: #fdf6ec;
    border-radius: 4px;
    border-left: 5px solid #E6A23C;
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.8;
    }
  }

  .success{
    padding: 8px 16px;
    background-color: #f0f9eb;
    border-radius: 4px;
    border-left: 5px solid #67c23a;
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.8;
    }
  }

  .info{
    padding: 8px 16px;
    background-color: #f4f4f5;
    border-radius: 4px;
    border-left: 5px solid #909399;
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