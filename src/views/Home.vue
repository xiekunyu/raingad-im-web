<template>
  <div>
    <lemon-imui
      :user="user"
      ref="IMUI"
      width="100%"
      :height="height"
      :contextmenu="contextmenu"
      :contact-contextmenu="contactContextmenu"
      :theme="setting.theme"
      :hide-message-name="setting.hideMessageName"
      :hide-message-time="setting.hideMessageTime"
      :avatarCricle="setting.avatarCricle"
      :sendKey="setSendKey"
      @change-menu="handleChangeMenu"
      @change-contact="handleChangeContact"
      @pull-messages="handlePullMessages"
      @message-click="handleMessageClick"
      @menu-avatar-click="handleMenuAvatarClick"
      @send="handleSend"
    >
      <template #cover>
        <div>
          <div class="cover">
            <i class="lemon-icon-message"></i>
            <p><b>即时聊天 Raingad</b> IM</p>
          </div>
        </div>
      </template>
      <!-- 消息窗口顶部的插槽 -->
      <template #message-title="contact" style="color:red">
          <span v-if="isEdit==false" @click="if(contact.is_group==1){isEdit=true;}" class="displayName">{{ contact.displayName }}</span>
          <input v-if="isEdit==true" v-model="displayName" class="editInput" @blur="saveGroupName(contact)"/>
      </template>
      <!-- 最近联系人列表顶部插槽 -->
      <template #sidebar-message-fixedtop="instance">
        <div style="margin: 15px 10px;">
            <el-input placeholder="搜索联系人（未做）" v-model="keywords" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          
      </template>
      <!-- 群组聊天展示的抽屉 -->
      <template #message-side="contact">
        <div class="slot-group-list"  v-if="contact.is_group==1">
            <div class="group-side-box">
              <div class='group-side-title'>群公告</div>
              <div class='group-side-body'>这里的功能还没有想好怎么做！请留言</div>
            </div> 
        </div>
      </template>
      <!-- 每条消息后面展示的文字 -->
      <template #message-after="message">
        <span v-if="message.fromUser.id==user.id && message.is_group==0" style="visibility: visible">
           <span v-if="!message.is_read"> 未读 </span>
           <span v-if="message.is_read" style="color:green"> 已读 </span>
        </span>
      </template>
      <!-- 发送按钮左边插槽 -->
      <template #editor-footer>
        {{sendTips}}
      </template>
    </lemon-imui>
    <!-- 设置中心 -->
    <el-dialog
      title="设置"
      :visible.sync="settingBox"
      :modal='false'
      width="500px"
      >
      <el-tabs :tab-position="tabPosition" style="min-height:300px">
        <el-tab-pane label="账号设置">
          <div align="center">
            <el-avatar :src="user.avatar" :size="50">
            </el-avatar>
            <br><br>
            <p>{{user.displayName}}</p>
            <br>
            <p>账号：{{user.account}}</p>
            <br>
            <el-button type="danger" @click="logout">退出登录</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="通用设置">
          <el-form ref="form" :model="setting" label-width="100px">
            <el-form-item label="发送消息：">
              <el-radio-group v-model="setting.sendKey">
                <el-radio-button label="1">Enter</el-radio-button>
                <el-radio-button label="2">Ctrl + Enter</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="系统主题：">
              <el-radio-group v-model="setting.theme">
                <el-radio-button label="default"></el-radio-button>
                <el-radio-button label="blue"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="setting-switch">
            <el-switch v-model="setting.isVoice"> </el-switch>&emsp;开启新消息声音提醒
          </div>
          <div class="setting-switch">
            <el-switch v-model="setting.avatarCricle"> </el-switch>&emsp;开启聊天圆形头像（需要刷新）
          </div>
          <div class="setting-switch">
            <el-switch v-model="setting.hideMessageName"> </el-switch>&emsp;是否隐藏聊天窗口内的联系人名字
          </div>
           <div class="setting-switch">
            <el-switch v-model="setting.hideMessageTime"> </el-switch>&emsp;是否隐藏聊天窗口内的消息发送时间
          </div>
        </el-tab-pane>
        <el-tab-pane label="关于IM">
          <div align="center">
            <el-avatar src="http://img.raingad.com/logo/logo.png" :size="50">
            </el-avatar>
            <br><br>
            <p><span class="main-color"> Raingad IM </span>for 0.4.24</p>
          </div>
          <div class="setting-version">
              <b> 即将支持功能：</b>
              <p>1、群聊创建和邀请群成员</p>
          </div>
          <div class="setting-version">
              <b>  已经支持功能：</b>
              <p>1、单聊和群聊</p>
              <p>2、支持发送表情、图片和文件</p>
              <p>3、单聊支持消息已读未读的状态显示</p>
              <p>4、支持设置新消息提醒</p>
              <p>5、支持部分Lemon-imui内功能设置</p>
              <p>5、支持文件和图片在线预览</p>
          </div>
          <div class="setting-version" style="color:#a6a6a6">
              <p>后端技术栈：thinkphp6+workerman</p>
              <p>前端技术栈：vue+Lemon-IMUI+element-UI</p>
          </div>
          
        </el-tab-pane>
      </el-tabs>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
    <transition name="fade-user">
      <div class="previewBox" v-if="drawer">
        <el-button class="drawer-close" type="danger" @click="drawer = !drawer" icon="el-icon-close" circle></el-button>
        <iframe
          :src="previewUrl"
          frameborder="0"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </transition>
    <Socket ref="socket"></Socket>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import EmojiData from "../utils/emoji";
import{ getContactsAPI,sendMessageAPI,getMessageListAPI,setMsgIsReadAPI,editGroupNameAPI,sendFileAPI,settingAPI } from "@/api/im";
import Lockr from 'lockr';
import Socket from '../components/socket';

const getTime = () => {
  return new Date().getTime();
};
const generateRandId = () => {
  return Math.random().toString(36).substr(-8);
};

const user=Lockr.get('UserInfo');

export default {
  name: "app",
  components: {
    Socket
  },
  data() {
    return {
      keywords:'',
      displayName:'',
      oldName:'',
      drawer:false,
      previewUrl:'',
      isEdit:false,
      settingBox:false,
      tabPosition:'left',
      sendTips:'使用 Enter 键发送消息',
      // 定义联系人的右键菜单
      contactContextmenu: [
        {
          text: "删除该聊天",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            IMUI.updateContact({
              id: contact.id,
              lastContent: null,
            });
            if (IMUI.currentContactId == contact.id) IMUI.changeContact(null);
            hide();
          },
        },
        {
          click(e, instance, hide) {
            const { IMUI, contact } = instance;
            IMUI.removeContact(contact.id);
            if (IMUI.currentContactId == contact.id) IMUI.changeContact(null);
            hide();
          },
          color: "red",
          text: "删除好友",
        },
      ],
      // 定义消息内容的右键菜单
      contextmenu: [
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance;
            const data = {
              id: generateRandId(),
              type: "event",
              //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
              content: (
                <div>
                  <span>
                    你撤回了一条消息{" "}
                    <span
                      v-show={message.type == "text"}
                      style="color:#333;cursor:pointer"
                      content={message.content}
                      on-click={(e) => {
                        IMUI.setEditorValue(e.target.getAttribute("content"));
                      }}
                    >
                      重新编辑
                    </span>
                  </span>
                </div>
              ),

              toContactId: message.toContactId,
              sendTime: getTime(),
            };
            IMUI.removeMessage(message.id);
            IMUI.appendMessage(data, true);
            hide();
          },
          visible: (instance) => {
            return instance.message.fromUser.id == this.user.id;
          },
          text: "撤回消息",
        },
        // {
        //   visible: (instance) => {
        //     return instance.message.fromUser.id != this.user.id;
        //   },
        //   text: "举报",
        // },
        // {
        //   text: "转发",
        // },
        {
          visible: (instance) => {
            return instance.message.type == "text";
          },
          text: "复制文字",
        },
        {
          visible: (instance) => {
            return instance.message.type == "image";
          },
          text: "下载图片",
          click: (e, instance, hide) => {
            const { message } = instance;
            this.download(message.content,message.fileName,message.type);
            hide();
          },
        },
        {
          visible: (instance) => {
            return instance.message.type == "file";
          },
          text: "下载文件",
          click: (e, instance, hide) => {
            const { message } = instance;
            this.download(message.content,message.fileName,message.type);
            hide();
          },
        },
        {
          click: (e, instance, hide) => {
           alert('无法删除');return;
            const { IMUI, message } = instance;
            IMUI.removeMessage(message.id);
            hide();
          },
          icon: "lemon-icon-folder",
          color: "red",
          text: "删除",
        },
      ],
      setting:{
        theme: "blue",
        hideMessageName: false,
        hideMessageTime: true,
        avatarCricle:true,
        sendKey:1,
        isVoice:true
      },
      user: {
        id: user.user_id,
        displayName: user.realname,
        avatar: user.avatar,
        account:user.account
      },
      height:'900px',
      pageSize:1,
      listRows:10,
      is_group:0,
      data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
      ,
    };
  },
  computed: {
    // 监听全局socket消息状态
      ...mapState({
          socketAction: state => state.socketAction,
      }),
  },
  watch:{
      'setting.sendKey'(val){
        if(val==1){
          this.sendTips="使用 Enter 键发送消息";
        }else{
           this.sendTips="使用 Ctrl + Enter 键发送消息";
        }
      },
      // 监听设置发送变化需要进行设置更改
      setting:{
        handler(newValue,oldValue){
            settingAPI(newValue);
            user.setting=newValue;
            Lockr.set('UserInfo',user);
        },
        deep:true
      },
     // 监听接收socket消息
      socketAction(val) {
        let message=val.data;
        const { IMUI } = this.$refs;
        switch(val.type){
          // 接收单聊消息
          case 'simple':
            // 如果开启了声音才播放
            if(this.setting.isVoice){
              this.playAudio ()
            }
            this.recieveMsg(message);
            break;
          // 接收群聊消息
          case 'group':
            // 如果是自己发送的消息则不需要提示
            if(message.fromUser.id!=this.user.id){
              // 如果开启了声音才播放
              if(this.setting.isVoice){
                this.playAudio ()
              }
              this.recieveMsg(message);
            }
            break;
            // 修改群组名称
          case 'editGroupName':
            IMUI.updateContact({
              id: message.id,
              displayName: message.displayName,
            });
            // 更新群名
            const data = {
              id: generateRandId(),
              type: "event",
              //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
              content: (
                <div>
                  <span>
                   {message.editUserName} 修改了群名为 {message.displayName}
                  </span>
                </div>
              ),
              toContactId: message.id,
              sendTime: getTime(),
            };
            IMUI.appendMessage(data, true);
            break;
          //处理消息已读,将本地的未读消息修改为已读状态
          case 'isRead':
              this.setLocalMsgIsRead(message);
            break;
        }
      }
        
  },
  mounted() {
    // 初始化用户设置
    if(user.setting){
      this.setting=eval(user.setting);
    }
    // 初始化动态设置窗口的高度
    this.height = document.documentElement.clientHeight;
    const that = this
    window.onresize = () => {
      return (() => {
        that.height = document.documentElement.clientHeight
      })()
    }
    
    // 初始化联系人
    this.getSimpleChat();
  },
  methods: {
    // 将本地消息设置为已读
    setLocalMsgIsRead(message){
      const { IMUI }=this.$refs;
      for(let i=0;message.length>i;i++){
        const data={
          id: message[i]['id'],
          is_read:1,
          status: 'succeed',
          content: message[i]['content']+' '
        }
        IMUI.updateMessage(data);
      }
    },
    // 下载文件
    download(src,name,type){
      let a = document.createElement('a')
      if(type=='image'){
        a.download=name || 'pic'
      }else{
        a.download=name || 'file'
      }
      a.href =src
      a.click();
    },
    // 播放消息声音
    playAudio () {
        const audio = document.getElementById('chatAudio');
        // 从头播放
        audio.currentTime = 0;
        audio.play();
    },
    // 接收消息重新渲染
    recieveMsg(message){
        const { IMUI } = this.$refs;
        const contact = IMUI.getCurrentContact();
        // 如果收到消息是当前窗口的聊天，需要将消息修改为已读
        if(contact.id==message.toContactId){
          var data=[];
          data.push(message);
          setMsgIsReadAPI({toContactId:contact.id,is_group:contact.is_group,messages:data,fromUser:message.fromUser.id});
        }
        IMUI.appendMessage(message,true);
    },
    // 修改群组的名称
    saveGroupName(contact) {
      if(this.displayName.length<1){
        this.$notify({
          title: '警告',
          message: '名称不能为空！',
          type: 'warning'
        });
        this.isEdit=false;
        return false;
      }
      // 如果更改了名称，请求服务器，并通知所有群更改名称
      if(this.displayName!=this.oldName){
          const { IMUI } = this.$refs;
          editGroupNameAPI({id:contact.id,displayName:this.displayName}).then(res=>{
            IMUI.updateContact({
                  id: contact.id,
                  displayName: this.displayName,
                });
          });
      }
      this.isEdit=false;
    },
    // 退出聊天室
    logout() {
        this.$confirm('你确定要退出聊天室吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store
          .dispatch('LogOut')
          .then(() => {
              this.$router.push({ path: '/login' })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });          
        });
    },
    // 初始化聊天
    getSimpleChat(){
      const { IMUI } = this.$refs;
      IMUI.setLastContentRender("event", (message) => {
        return `[自定义通知内容]`;
      });
      // 获取联系人列表
      getContactsAPI().then(res => {
          const data = res.data;
          IMUI.initContacts(data);
      })
      // 初始化左侧菜单栏
      IMUI.initMenus([
      {
        name: "messages",
      },
      {
        name: "contacts",
      },
      {
        name: "custom2",
        title: "退出",
        unread: 0,
        click: () => {
          this.settingBox=true;
        },
        render: (menu) => {
          return <i class="el-icon-setting" />;
        },
        isBottom: true,
      },
    ]);
    // 初始化工具栏
      IMUI.initEditorTools([
        {
          name: "emoji",
        },
        {
          name: "uploadImage",
          title:"发送图片"
        },
        {
          name: "uploadFile",
          title: "发送文件"
        }
      ]);
      // 初始化表情
      IMUI.initEmoji(EmojiData);
    },
    scrollToTop() {
      document.body.scrollIntoView();
    },
    handleMenuAvatarClick() {
      console.log("Event:menu-avatar-click");
    },
    // 设置发送键
    setSendKey(e){
      if(this.setting.sendKey==1){
        return e.keyCode == 13;
      }else{
        return e.keyCode == 13 && e.ctrlKey === true;
      }
    },
    // 点击了消息
    handleMessageClick(e, key, message, instance) {
      if (key == "status") {
        instance.updateMessage({
          id: message.id,
          status: "going",
          content: "正在重新发送消息...",
        });
        setTimeout(() => {
          instance.updateMessage({
            id: message.id,
            status: "succeed",
            content: message.content,
          });
        }, 2000);
        return;
      }
      if((message.type=="image" || message.type=="file") && message.preview){
        this.previewUrl=message.preview;
        this.drawer=true;
      }else{
        this.$message.error('没有配置预览接口');
      }
    },
    changeMenuAvatarVisible() {
      this.hideMenuAvatar = !this.hideMenuAvatar;
    },
    changeMenuVisible() {
      this.hideMenu = !this.hideMenu;
    },
    changeMessageNameVisible() {
      this.hideMessageName = !this.hideMessageName;
    },
    changeMessageTimeVisible() {
      this.hideMessageTime = !this.hideMessageTime;
    },
    removeMessage() {
      const { IMUI } = this.$refs;
      const messages = IMUI.getCurrentMessages();
      const id = messages[messages.length - 1].id;
      if (messages.length > 0) {
        IMUI.removeMessage(id);
      }
    },
    appendEventMessage() {
      const { IMUI } = this.$refs;
      const message = {
        id: generateRandId(),
        type: "event",
        content: (
          <span>
            邀请你加入群聊{" "}
            <span
              style="color:#333;cursor:pointer"
              on-click={() => alert("OK")}
            >
              接受
            </span>
          </span>
        ),
        toContactId: "contact-3",
        sendTime: getTime(),
      };
      IMUI.appendMessage(message, true);
    },

    changeDrawer(contact, instance) {
      instance.changeDrawer({
        render: () => {
          return (
            <div class="drawer-content">
              <p>
                <b>自定义抽屉</b>
              </p>
              <p>买跌的</p>
            </div>
          );
        },
      });
    },
    // 切换聊天窗口时要检测那些消息未读
    handleChangeContact(contact, instance) {
      instance.updateContact({
        id: contact.id,
        unread: 0,
      });
      // 聊天记录列表恢复到最初第一页
      this.pageSize=1;
      this.displayName=contact.displayName;
      this.oldName=contact.displayName;
      //切换聊天后全局设置是否是群聊或者单聊
      this.is_group=contact.is_group;
      var data=[];
      const { IMUI } = this.$refs;
      // 获取当前聊天窗口的所有消息
      var messages=IMUI.getMessages(contact.id)
      for(var i=0;messages.length>i;i++){
        if(messages[i].is_read==0 && messages[i].fromUser.id!=this.user.id){
          data.push(messages[i]);
        }
      }
      // 如果有未读的消息，需要将消息修改为已读
      if(data.length>0){
        setMsgIsReadAPI({is_group:contact.is_group,toContactId:contact.id,messages:data,fromUser:contact.id}).then(res => {
            if(res.code==0){
              this.setLocalMsgIsRead(data);
            }
        });
      }
      instance.closeDrawer();
    },
    // 发送聊天消息
    handleSend(message, next, file) {
      let formdata = new FormData();
      message.is_group=this.is_group;
      const { IMUI} = this.$refs;
      // 如果是文件选择文件上传接口
      if(file){
        // 判断文件如果大于5M就删除该聊天消息
        if(file.size>5242880){
            IMUI.removeMessage(message.id);
          return this.$message.error('上传的内容不等大于5MB！');
        }
        formdata.append('file', file);
        formdata.append('message', JSON.stringify(message));
        sendFileAPI(formdata).then(res => {
            IMUI.updateMessage(res.data);
            next();
        }).catch(error => {
            next({status:'failed'})
        })
      }else{
        sendMessageAPI(message).then(res => {
            IMUI.setEditorValue('');
            IMUI.updateMessage(res.data);
            next();
        }).catch(error => {
            next({status:'failed'})
        })
      }
    },
    // 拉取聊天记录
    handlePullMessages(contact, next, instance) {
      getMessageListAPI({
        toContactId:contact.id,
        is_group:contact.is_group,
        pageSize:this.pageSize,
        listRows:this.listRows
        }).then(res => {
          this.pageSize++;
          let isEnd = false;
          let messages=res.data
          if(messages.length<this.listRows){
            isEnd = true;
          }
          next(messages,isEnd);
      }).catch(error => {
          next([],true);
      })
      return true;
    },
    handleChangeMenu() {
      console.log("Event:change-menu");
    },
    openCustomContainer() {},
  },
};
</script>
<style scoped lang="scss">

.cover{
  text-align:center;
  user-select:none;
  position:absolute;
  top:45%;
  left:50%;
  transform:translate(-50%,-50%);
  i
    {font-size:84px;
    color:#e6e6e6}
  p
    {font-size:18px;
    color:#ddd;
    line-height:50px}
}
  .cover-text1{
    display: flex;
    display: -webkit-flex;
    height: 100%;
    width: 100%;
    align-items:center;
    justify-content:center;

  }

  .displayName{
    font-size:18px;
  }

  .editInput{
    font-size:18px;
    border:none;
    width:500px;
  }

  .editInput:focus{
    outline: -webkit-focus-ring-color auto 0px
  }

  .article{
    padding:15px;
  }

  .slot-group-list{
    padding:0 10px;
    width:200px;
    border-left:solid 1px #e6e6e6;
    height:100%;
    .group-side-box{
      padding:10px;
      .group-side-title{
        font-size:16px;
        font-weight: 500;
      }
    }
  }
  .setting-switch{
    margin:0 30px 20px;
  }

  .setting-version{
    margin:10px 20px;
    line-height: 20px;
  }

  .main-color{
    color:#409EFF
  }

  .previewBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:rgba(222,222,222,.3);
    z-index: 99;
  }
  .drawer-close {
    position: absolute;
    top: 60px;
    right: 40px;
  }
</style>

