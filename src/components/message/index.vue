<template>
  <div>
    <div class="chat-box">
      <lemon-imui
        :user="user"
        ref="IMUI"
        :width="curWidth"
        :height="curHeight"
        :contextmenu="contextmenu"
        :contact-contextmenu="contactContextmenu"
        :theme="setting.theme"
        :hide-message-name="setting.hideMessageName"
        :hide-message-time="setting.hideMessageTime"
        :avatarCricle="setting.avatarCricle"
        :sendKey="setSendKey"
        :wrapKey="wrapKey"
        @menu-avatar-click="openSetting"
        @change-contact="handleChangeContact"
        @pull-messages="handlePullMessages"
        @message-click="handleMessageClick"
        @send="handleSend"
        style="min-height:600px"
      >
        <template #cover>
          <div>
            <div class="cover">
              <i class="lemon-icon-message"></i>
              <p><b>即时聊天 Raingad</b> IM</p>
            </div>
          </div>
        </template>
                <!-- 最近联系人列表插槽 -->
        <template #sidebar-message="Contact">
            <span class="lemon-badge lemon-contact__avatar">
            <span
              class="lemon-avatar"
              v-bind:class="{ 'lemon-avatar--circle': setting.avatarCricle }"
              style="width: 40px; height: 40px; line-height: 40px; font-size: 20px;"
            >
              <img :src="Contact.avatar"
            /></span>
            <span
              class="lemon-badge__label"
              v-if="Contact.unread > 0 && Contact.is_notice == 1"
              >{{ Contact.unread }}</span
            >
          </span>
          <div class="lemon-contact__inner">
            <p class="lemon-contact__label">
              <span class="lemon-contact__name">
                <OnlineStatus v-if="Contact.is_online && Contact.is_group==0 && globalConfig.chatInfo.online==1" title="在线" type="success"></OnlineStatus> 
                <el-tag size="mini" v-if="Contact.is_group == 1">群聊</el-tag>
                {{ Contact.displayName }}
              </span>
              <span
                class="lemon-contact__time"
                v-text="formatTime(Contact.lastSendTime)"
              ></span>
            </p>
            <p class="lemon-contact__content lemon-last-content">
              <span class="lastContent">
                <span v-if="Contact.is_notice == 0 && Contact.unread > 0"
                  >[{{ Contact.unread }}条未读]</span
                >
                <span v-html="Contact.lastContent"></span>
              </span>
              <span
                class="el-icon-close-notification f-16"
                v-if="Contact.is_notice == 0"
              ></span>
            </p>
          </div>
          
        </template>
        <!-- 消息窗口顶部的插槽 -->
        <template #message-title="contact" style="color: red">
          <div class="message-title-box">
            <div>
              <span v-if="isEdit == false">
                <span
                  class="displayName"
                  v-if="is_group == 1"
                  @click="isEdit = true"
                >
                  <el-tag size="mini">群聊</el-tag> {{ contact.displayName }}<span class="mr-5">({{ groupUserCount }})</span>
                  <el-tag size="mini" v-if="contact.setting.nospeak == 1"  type="warning">仅群管理员可发言</el-tag>
                  <el-tag size="mini" v-if="contact.setting.nospeak == 2"  type="danger">全员禁言中</el-tag>
                </span>
                <span class="displayName" v-if="is_group == 0">
                  <OnlineStatus :type="contact.is_online ? 'success' : 'info'" :pulse="contact.is_online " v-if="globalConfig.chatInfo.online" ></OnlineStatus> {{contact.displayName}}</span>
              </span>

              <input
                v-if="isEdit == true"
                v-model="displayName"
                class="editInput"
                @blur="saveGroupName(contact)"
              />
            </div>
            <div class="message-title-tools">
              <template v-if="globalConfig.chatInfo.webrtc">
                <i class="el-icon-phone-outline mr-10" title="语音通话" v-if="!contact.is_group" @click="called(false)"></i>
                <i class="el-icon-video-camera mr-10" title="视频通话" v-if="!contact.is_group" @click="called(true)"></i>
              </template>
              <i class="el-icon-time mr-10" @click="openMessageBox" title="消息管理器"></i>
              <i class="el-icon-more" @click="$user(contact.id)" title="基本资料" v-if="!contact.is_group"></i>
              
            </div>
          </div>
        </template>

        <!-- 最近联系人列表顶部插槽 不滚动-->
        <template #sidebar-message-fixedtop="instance">
          <div class="contact-fixedtop-box">
            <el-input
              placeholder="搜索联系人"
              prefix-icon="el-icon-search"
              @blur="closeSearch"
              @focus="searchResult = true"
              v-model="keywords"
              class="input-with-select"
            >
            </el-input>
            <div style="margin-left:10px" v-if="globalConfig.sysInfo.runMode==2">
              <el-dropdown @command="handleCommand">
                <el-button
                icon="el-icon-plus"
                circle
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="addFriend">添加朋友</el-dropdown-item>
                <el-dropdown-item command="addGroup" v-if="globalConfig.chatInfo.groupChat">创建群聊</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
              
            </div>
            <div style="margin-left:10px" v-if="globalConfig.sysInfo.runMode==1 && globalConfig.chatInfo.groupChat">
              <el-button
                title="创建群聊"
                icon="el-icon-plus"
                @click="openCreateGroup"
                circle
              ></el-button>
            </div>
            <div class="search-list" v-show="searchResult">
              <div
                v-for="(item, index) in searchList"
                :key="index"
                v-if="searchList.length > 0"
                class="search-list-item"
              >
                <lemon-contact
                  :contact="item"
                  @click="openChat(item.id, instance)"
                />
              </div>
              <div
                v-if="searchList.length == 0"
                style="margin: 20px"
                align="center"
              >
                暂无
              </div>
            </div>
          </div>
        </template>
        <!-- 最近联系人列表顶部插槽，滚动 -->
        <template #sidebar-message-top="instance">
          <div class="chat-top-list" v-if="chatTopList.length > 0">
            <ChatTop
              :contact="item"
              v-for="(item, index) in chatTopList"
              :key="index"
              :avatarCricle="setting.avatarCricle"
              :currentId="currentChat.id"
              @click.native="openChat(item.id, instance)"
            ></ChatTop>
          </div>
        </template>
        <!-- 联系人列表顶部插槽 -->
        <template #sidebar-contact-fixedtop="instance">
          <div style="margin: 15px 10px">
            联系人
          </div>
        </template>
        <!-- 群组聊天展示的抽屉 -->
        <template #message-side="contact">
          <div class="slot-group-list" v-if="contact.is_group == 1">
            <div class="group-side-box">
              <div class="group-notice">
                <div class="group-side-title">
                  <h4>群公告</h4>
                  <div>
                    <span
                      class="el-icon-edit f-18 cur-handle"
                      @click="noticeBox = true"
                      v-if="contact.role <3 || contact.setting.manage==false"
                    ></span>
                  </div>
                </div>
                <hr />
                <div
                  class="group-side-body"
                  v-if="contact.notice"
                  @click="openNotice"
                >
                  {{ contact.notice }}
                </div>
                <div class="group-side-body" v-if="!contact.notice">
                  暂无公告
                </div>
              </div>
              <div class="group-user">
                <div class="group-side-title">
                  <h4>群成员</h4>
                  <div>
                    <span
                      class="el-icon-circle-plus-outline f-18 cur-handle"
                      v-if="contact.role <3 || contact.setting.invite==1"
                      @click="openAddGroupUser"
                    ></span>
                  </div>
                </div>
                <hr/>
                <div class="group-user-body" :style="'height:calc('+curHeight+' - 230px )'" id="group-user">
                  <el-scrollbar style="height:100%;">
                    <lemon-contact
                      class="user-list"
                      v-for="(item, index) in groupUser"
                      :key="index"
                      :contact="item"
                      v-lemon-contextmenu.contact="groupMenu"
                    >
                      <div class="user-avatar">
                        <el-avatar
                          :size="20"
                          :src="item.userInfo.avatar"
                        ></el-avatar>
                      </div>
                      <div class="user-name">
                        <span
                          v-if="item.userInfo.id == user.id"
                          class="fc-danger"
                          >{{ item.userInfo.displayName }}（我）</span
                        >
                        <span v-if="item.userInfo.id != user.id">{{
                          item.userInfo.displayName
                        }}</span>
                      </div>
                      <div class="user-role">
                        <i
                          class="el-icon-user-solid fc-danger"
                          title="创建者"
                          v-if="item.role == 1"
                        ></i>
                        <i
                          class="el-icon-user-solid fc-warning"
                          title="管理员"
                          v-if="item.role == 2"
                        ></i>
                      </div>
                    </lemon-contact>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- 每条消息后面展示的文字 -->
        <template #message-after="message">
          <span
            v-if="message.fromUser.id == user.id && message.is_group == 0"
            style="visibility: visible"
          >
            <span v-if="!message.is_read"> 未读 </span>
            <span v-if="message.is_read" style="color: green"> 已读 </span>
          </span>
        </template>
        <!-- 发送按钮左边插槽 -->
        <template #editor-footer>
          {{ setting.sendKey ==1 ? '使用 Enter 键发送消息' : '使用 Ctrl + Enter 键发送消息' }}
        </template>
      </lemon-imui>
    </div>
    <!-- 创建群聊 -->
    <Group :visible.sync="createChatBox" :title="dialogTitle" @manageGroup="manageGroup" :isAdd="isAdd" :userIds="userIds"></Group>
    <!-- 发布公告 -->
    <el-dialog
      title="发布公告"
      :visible.sync="noticeBox"
      :modal="true"
      width="500px"
      append-to-body
    >
      <el-input
        type="textarea"
        :rows="10"
        placeholder="请输入内容"
        v-model="notice"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noticeBox = false">取 消</el-button>
        <el-button type="primary" @click="publishNotice">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 添加好友 -->
     <addFriend :visible.sync="addFriendBox"></addFriend>
    <!-- 转发聊天 -->
    <ChooseDialog :visible.sync="forwardBox" title="转发聊天" @selectChat="forwardUser" :allUser="allUser"></ChooseDialog>
    <!-- 消息管理器 -->
    <el-dialog
      title="消息管理器"
      :visible.sync="messageBox"
      :modal="true"
      width="800px"
      append-to-body
    >
    
      <ChatRecord :contact="currentChat" :key="componentKey"></ChatRecord>
    </el-dialog>
    <!-- 消息管理器 -->
    <!-- 群设置中心 -->
    <el-dialog
      title="群设置"
      :visible.sync="groupSetting"
      :modal="true"
      width="500px"
      append-to-body
    >
      <ChatSet :contact="contactSetting" :key="componentKey"></ChatSet>
    </el-dialog>
    <!-- 语音录制 -->
    <el-dialog title="语音录制" custom-class="no-padding" :visible.sync="VoiceStatus" :modal="true" width="500px"
        append-to-body destroy-on-close>
        <voice-recorder @send="sendVoice"></voice-recorder>
      </el-dialog>
    <Socket ref="socket"></Socket>
    <!-- 视频通话组件 -->
    <webrtc :contact="currentChat" :config="webrtcConfig" :alias="$packageData.name" :userInfo="user" ref="webrtc" :key="componentKey"></webrtc>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EmojiData from "@/utils/emoji";
import * as utils from "@/utils/index";
import Lockr from "lockr";
import Socket from "./socket";
import ChatRecord from "./chatRecord";
import ChatSet from "./chatSet";
import ChatTop from "./chatTop";
import VoiceRecorder from "./messageBox/voiceRecorder";
import Group from "./group/index";
import ChooseDialog from "./chooseDialog/index";
import Files from "./files/index";
import Setting from "./setting/index";
import addFriend from "./friend/add";
import OnlineStatus from "./mini/statusIndicator";
import webrtc from "./webrtc";
import Apply from "./apply/index";
import InviteImg from '@/assets/img/invite.png'
const getTime = () => {
  return new Date().getTime();
};

const user = Lockr.get("UserInfo");
export default {
  name: "app",
  components: {
    Socket,
    ChatRecord,
    ChatSet,
    ChatTop,
    VoiceRecorder,
    webrtc,
    Group,
    Files,
    addFriend,
    Setting,
    ChooseDialog,
    OnlineStatus,
    Apply
  },
  props: {
    width: {
      type: String,
      default: "1000px"
    },
    height: {
      type: String,
      default: "640px"
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
  },
  data() {
    var _this = this;
    let stun= this.$store.state.globalConfig.chatInfo.stun ? this.$store.state.globalConfig.chatInfo.stun : 'stun:stun.callwithus.com';
    return {
      noSimpleTips:'系统已开启单聊权限，或者群已开启禁言，无法发送消息',
      isFullscreen:false,
      curWidth:this.width,
      curHeight:this.height,
      unread:0,
      webrtcConfig:{
          config: { 'iceServers':[{
	  	    'urls': stun,
	  	  }]}
      },
      curFile:null,
      componentKey: 1,
      // 搜索结果展示
      searchResult: false,
      addFriendBox: false,
      createChatBox: false,
      forwardBox: false,
      noticeBox: false,
      messageBox: false,
      webrtcBox: false,
      groupSetting: false,
      VoiceStatus: false,
      contactSetting: {},
      groupUserCount: 0,
      dialogTitle: "创建群聊",
      isAdd: true,
      userIds: [],
      // 公告
      notice: "",
      // 搜索结果列表
      searchList: [],
      keywords: "",
      displayName: "",
      oldName: "",
      isEdit: false,
      // 当前登录用户
      user: {
        id: user.user_id,
        displayName: user.realname,
        avatar: user.avatar,
        account: user.account
      },
      params:{
        page:1,
        limit:10,
      },
      is_group: 0,
      group_id: 0,
      contacts: [],
      allUser: [],
      groupUser: [],
      // 当前聊天
      currentChat: {},
      // 当前消息
      currentMessage: {},
      // 置顶列表
      chatTopList: [],
      playAudio: null,
      // 群成员邮件菜单
      groupMenu: [
        {
          text: "发送消息",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            IMUI.changeContact(contact.user_id);
            hide();
          },
          visible: instance => {
            return instance.contact.user_id != this.user.id && this.globalConfig.sysInfo.runMode==1;
          }
        },
        {
          text: "设置管理员",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            hide();
            this.$confirm("确定设置该成员为管理员吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.$api.imApi.setManagerAPI({
                id: this.group_id,
                user_id: contact.user_id,
                role: 2
              });
              this.$message({
                type: "success",
                message: "设置成功!"
              });
            });
          },
          visible: instance => {
            // 只有群主才可以设置管理员
            return (
              instance.contact.role == 3 &&
              this.currentChat.owner_id == this.user.id
            );
          }
        },
        {
          text: "取消管理员",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            hide();
            this.$confirm("确定取消该成员的管理员权限吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.$api.imApi.setManagerAPI({
                id: this.group_id,
                user_id: contact.user_id,
                role: 3
              });
              this.$message({
                type: "success",
                message: "取消成功!"
              });
            });
          },
          visible: instance => {
            // 只有群主才可以设置管理员
            return (
              instance.contact.role == 2 &&
              this.currentChat.owner_id == this.user.id
            );
          }
        },
        {
          text: "查看资料",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            hide();
            this.$user(contact.user_id);
          }
        },
        {
          text: "移出群聊",
          color: "red",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            hide();
            this.$confirm("确定移除该成员吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.$api.imApi.removeUserAPI({ id: this.group_id, user_id: contact.user_id });
            });
          },
          visible: instance => {
            return (
              instance.contact.user_id != this.user.id &&
              this.currentChat.owner_id != instance.contact.user_id &&
              this.currentChat.role <= 2
            );
          }
        }
        
      ],
      // 定义联系人的右键菜单
      contactContextmenu: [
        {
          click(e, instance, hide) {
            const { IMUI, contact } = instance;
            _this.$user(contact.user_id);
            hide();
          },
          icon: "el-icon-tickets",
          text: "查看资料",
          visible: instance => {
            return instance.contact.is_group == 0;
          }
        },
        {
          icon: "el-icon-upload2",
          text: "置顶聊天",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            _this.$api.imApi.setChatTopAPI({
              id: contact.id,
              is_top: 1,
              is_group: contact.is_group
            }).then(res => {
              if (res.code == 0) {
                IMUI.updateContact({
                  id: contact.id,
                  is_top: 1
                });
                contact.is_top = 1;
                const hasContact=_this.chatTopList.filter(item => item.id == contact.id);
                if(!hasContact.length){
                  _this.chatTopList.push(contact);
                }
              }
            });
            hide();
          },
          visible: instance => {
            return instance.contact.is_top == 0;
          }
        },
        {
          icon: "el-icon-download",
          text: "取消置顶",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            _this.$api.imApi.setChatTopAPI({
              id: contact.id,
              is_top: 0,
              is_group: contact.is_group
            }).then(res => {
              if (res.code == 0) {
                IMUI.updateContact({
                  id: contact.id,
                  is_top: 0
                });
                // 删除置顶聊天列表人员
                utils.delArrValue(this.chatTopList, "id", contact.id);
              }
            });
            hide();
          },
          visible: instance => {
            return instance.contact.is_top == 1;
          }
        },
        
        {
          click(e, instance, hide) {
            const { IMUI, contact } = instance;
            hide();
            _this.$api.imApi.isNoticeAPI({ id: contact.id, is_notice: 0 ,is_group:contact.is_group});
            IMUI.updateContact({
              id: contact.id,
              is_notice: 0
            });
          },
          icon: "el-icon-bell",
          text: "消息免打扰",
          visible: instance => {
            return (
              instance.contact.is_notice == 1
            );
          }
        },
        {
          click(e, instance, hide) {
            const { IMUI, contact } = instance;
            hide();
            _this.$api.imApi.isNoticeAPI({ id: contact.id, is_notice: 1 ,is_group:contact.is_group});
            IMUI.updateContact({
              id: contact.id,
              is_notice: 1
            });
          },
          icon: "el-icon-close-notification",
          text: "取消免打扰",
          visible: instance => {
            return (
              instance.contact.is_notice == 0
            );
          }
        },
        {
          click(e, instance, hide) {
            const { IMUI, contact } = instance;
            hide();
            _this.groupSetting = true;
            _this.contactSetting = contact;
            _this.componentKey ++;
          },
          icon: "el-icon-setting",
          text: "群管理",
          visible: instance => {
            return instance.contact.role == 1 && instance.contact.is_group == 1;
          }
        },
        {
          click(e, instance, hide) {
            const { IMUI, contact } = instance;
            hide();
            _this
              .$confirm("确定删除该群聊吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
              .then(() => {
                _this.$api.imApi.removeGrouprAPI({ id: contact.id });
                _this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              });
          },
          icon: "el-icon-delete",
          color: "red",
          text: "删除群聊",
          visible: instance => {
            return (
              instance.contact.owner_id == _this.user.id &&
              instance.contact.is_group == 1
            );
          }
        },
        {
          click(e, instance, hide) {
            const { IMUI, contact } = instance;
            hide();
            _this
              .$confirm("确定退出该群聊吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
              .then(() => {
                _this.$api.imApi.removeUserAPI({ id: contact.id, user_id: _this.user.id });
                _this.$message({
                  type: "success",
                  message: "退出成功!"
                });
              });
          },
          icon: "el-icon-remove-outline",
          color: "red",
          text: "退出群聊",
          visible: instance => {
            return (
              instance.contact.owner_id != _this.user.id &&
              instance.contact.is_group == 1
            );
          }
        }
      ],
      // 定义消息内容的右键菜单
      contextmenu: [
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance;
            this.$api.imApi.undoMessageAPI({ id: message.id })
              .then(res => {
                const data = {
                  id: message.id,
                  type: "event",
                  //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
                  content: (
                    <div>
                      <span>
                        你撤回了一条消息{" "}
                        <span
                          v-show={message.type == "text"}
                          style="color:#409EFF;cursor:pointer"
                          content={message.content}
                          on-click={e => {
                            IMUI.setEditorValue(
                              e.target.getAttribute("content")
                            );
                          }}
                        >
                          重新编辑
                        </span>
                      </span>
                    </div>
                  ),
                  toContactId: message.toContactId,
                  sendTime: getTime()
                };
                IMUI.updateMessage(data);
              })
              .catch(error => {
                this.$message.error("发生错误");
              });
            hide();
          },
          visible: instance => {
            return (
              instance.message.fromUser.id == this.user.id &&
              getTime() - instance.message.sendTime < 120000
            );
          },
          text: "撤回消息"
        },
        {
          text: "转发",
          click: (e, instance, hide) => {
            this.currentMessage = instance.message;
            // 获取本地所有联系人，转发时必须去除当前的聊天对象
            const { IMUI } = this.$refs;
            const contactList = IMUI.getContacts();
            const currentContact = IMUI.getCurrentContact();
            this.allUser = utils.editArrValue(contactList, "id", currentContact.id);
            hide();
            this.forwardBox = true;
          }
        },
        {
          visible: instance => {
            return instance.message.type == "text";
          },
          text: "复制文字",
          click: (e, instance, hide) => {
            this.$clipboard(instance.message.content);
            this.$message({
              type: "success",
              message: "复制成功!"
            });
            hide();
          }
        },
        {
          visible: instance => {
            return instance.message.type == "image";
          },
          text: "下载图片",
          click: (e, instance, hide) => {
            const { message } = instance;
            utils.download(message.content, message.fileName);
            hide();
          }
        },
        {
          visible: instance => {
            return instance.message.type == "file";
          },
          text: "下载文件",
          click: (e, instance, hide) => {
            const { message } = instance;
            utils.download(message.content, message.fileName);
            hide();
          }
        }
      ]
    };
  },
  computed: {
    // 监听全局socket消息状态
    ...mapState({
      socketAction: state => state.socketAction,
      contactId: state => state.toContactId,
      contactSync: state => state.contactSync,
      setting: state => state.setting,
      userInfo: state => state.userInfo,
      globalConfig: state => state.globalConfig,
    }),
    formatTime() {
      return function(val) {
        return utils.timeFormat(val);
      };
    }
  },
  watch: {
    isFullscreen(val){
      Lockr.set('isFullscreen',val);
      this.curWidth=val?'100vw':this.width;
      this.curHeight=val?'100vh':this.height;
    },
    playAudio (val) {
      if (val && this.currentMessage) {
        let message = this.currentMessage;
        var that = this;
        const { IMUI } = this.$refs;
        this.playAudio.addEventListener('ended', function () {
          console.log('声音停止');
          that.playAudio = null;
          that.currentMessage = null;
          IMUI.updateMessage({
            id: message.id,
            status: 'successd',
            isPlay: 0,
          })
        }, false);
      }

    },
    // 全局调用发送消息
    contactSync (val) {
      this.$emit('newChat', val);
      const { IMUI } = this.$refs;
      IMUI.changeContact(this.contactId);
    },
    unread (val) {
      this.$store.commit('updateUnread', val);
    },
    // 监听联系人搜索
    keywords() {
      const { IMUI } = this.$refs;
      const contacts = IMUI.getContacts();
      this.searchContact(contacts);
    },
    // 监听接收socket消息
    socketAction(val) {
      let message = val.data;
      const { IMUI } = this.$refs;
      let client_id=Lockr.get('client_id');
      switch (val.type) {
        //上线、下线通知
        case "isOnline":
          IMUI.updateContact({
            id:message.id,
            is_online:message.is_online
          })
          break;
        case "offline":
          if(message.id==this.user.id && message.client_id!=client_id && !message.isMobile){
            this.$message.error="您的账号在其他地方登录，已被迫下线！";
            this.$store.dispatch("LogOut").then(() => {
                this.$router.push({ path: "/login" });
            });
          }
          
          break;
        // 接收消息
        case "simple":
        case "group":
          // 如果是自己发送的消息则不需要提示
          if (message.fromUser.id != this.user.id) {
            var contact = this.getContact(message.toContactId);
            // 如果开启了声音才播放
            if (this.setting.isVoice && contact.is_notice == 1) {
              this.popNotice(message);
            }
          }
          this.recieveMsg(message);
          break;
        // 撤回消息
        case "undoMessage":
          IMUI.updateMessage(message);
          break;
        // 设置置顶
        case "setChatTop":
          IMUI.updateContact({
            id: message.id,
            is_top: message.is_top
          });
          if(message.is_top==1){
            const contact = this.getContact(message.id);
            const hasContact=this.chatTopList.filter(item => item.id == message.id);
            if(!hasContact.length){
              this.chatTopList.push(contact);
            }
          }else{
            utils.delArrValue(this.chatTopList, "id", message.id);
          }
          break;
        // 设置消息免打扰
        case "setIsNotice":
          IMUI.updateContact({
            id: message.id,
            is_notice: message.is_notice
          });
          break;
        // 修改群组名称
        case "editGroupName":
          IMUI.updateContact({
            id: message.id,
            displayName: message.displayName
          });
          // 更新群名
          const data = {
            id: utils.generateRandId(),
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
            sendTime: getTime()
          };
          IMUI.appendMessage(data, true);
          break;
        //处理消息已读,将本地的未读消息修改为已读状态
        case "isRead":
          this.setLocalMsgIsRead(message);
          break;
        // 新增加了群聊
        case "addGroup":
          if (message.owner_id != this.user.id) {
            IMUI.appendContact(message);
          }
          this.$api.commonApi.bindGroupAPI({ client_id: client_id, group_id: message.id });
          break;
        // 设置群管理员
        case "setManager":
        case "addGroupUser":
        case "removeUser":
          if (message.group_id == this.group_id) {
            this.getGroupUserList(message.group_id);
          }
          IMUI.updateContact({
            id: message.group_id,
            avatar: message.avatar
          });
          break;
        case "removeGroup":
          IMUI.removeContact(message.group_id);
          if (IMUI.currentContactId == message.group_id)
            IMUI.changeContact(null);
          break;
        // 发布公告
        case "setNotice":
          IMUI.updateContact({
            id: message.group_id,
            notice: message.notice
          });
          // 发布事件消息
          IMUI.appendMessage(
            {
              id: utils.generateRandId(),
              type: "event",
              //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
              content: (
                <div>
                  <span>管理员 发布了公告： {message.notice}</span>
                </div>
              ),
              toContactId: message.group_id,
              sendTime: getTime()
            },
            true
          );
          break;
          // 群聊设置
        case "groupSetting":
          IMUI.updateContact({
            id: message.group_id,
            setting: message.setting
          });
      }
    }
  },
  created() {
    // 初始化用户
    let userInfo=this.$store.state.userInfo;
    if (userInfo) {
      this.user={
        id: userInfo.user_id,
        displayName: userInfo.realname,
        avatar: userInfo.avatar,
        account: userInfo.account
      }
    }
    if (window.Notification) {
      // 浏览器通知--window.Notification
      if (Notification.permission == "granted") {
        console.log("允许通知");
      } else if (Notification.permission != "denied") {
        console.log("需要通知权限");
        Notification.requestPermission(permission => {});
      }
    } else {
      console.error("浏览器不支持Notification");
    }
  },
  mounted() {
    // 设置全屏
    if(this.fullScreen){
      this.isFullscreen=Lockr.get('isFullscreen');
    }
    if (this.searchResult) {
      document.addEventListener("click", function(e) {
        if (!that.$refs.configforms.contains(e.target)) {
          that.searchResult = false;
        }
      });
    }
    // 初始化联系人
    this.getSimpleChat();
  },
  methods: {
    called(is_video){
      this.webrtcBox=true;
      this.$refs.webrtc.called(is_video);
    },
    // 初始化聊天
    getSimpleChat(update) {
      this.$nextTick(() => {
        const IMUI = this.$refs.IMUI;
        this.IMUI=IMUI;
        IMUI.setLastContentRender("voice", message => {
          return `[语音]`;
        });
        IMUI.setLastContentRender("video", message => {
          return `[视频]`;
        });
        // 获取联系人列表
        this.$api.imApi.getContactsAPI().then(res => {
          const data = res.data;
          this.contacts = data;
          var msg = {};
          // 重新渲染消息
          data.forEach((item, index) => {
              if (item.type) {
                msg.type = item.type;
                msg.content = item.lastContent;
                data[index]['lastContent'] = IMUI.lastContentRender(msg);
              }
              if (item.unread && !update) {
                this.unread += item.unread;
              }
          })
          if(this.globalConfig.sysInfo.runMode==2){
            const sysContact = {
              id: 'system',
              displayName: "新邀请",
              avatar: InviteImg,
              index: "[1]系统消息",
              click(next) {
                next();
              },
              renderContainer: () => {
                return <Apply></Apply>;
              },
              lastSendTime: res.page,
              lastContent: res.count ? "新的申请" : '',
              unread:res.count,
            };
            this.unread += res.count;
            data.push({...sysContact});
          }
        
          this.$store.commit('initContacts', data);
          // 设置置顶人
          this.getChatTop(data);
          IMUI.initContacts(data);
          this.initMenus(IMUI);
          // 初始化左侧菜单栏
          
          // 初始化工具栏
          IMUI.initEditorTools([
            {
              name: "emoji"
            },
            {
              name: "uploadImage",
              title: "发送图片"
            },
            {
              name: "sendVoice",
              title: "发送语音",
              click: () => { this.VoiceStatus = true },
              render: () => { return <i class="el-icon el-icon-microphone f-18" style="vertical-align: middle;font-weight: 600;"></i> }
            },
            {
              name: "uploadVideo",
              title: "发送视频",
              click: () => {
                var uploadVideo = this.$refs.uploadVideo;
                uploadVideo.click();
              },
              render: () => {
                return <i class="el-icon el-icon-video-play f-18" style="vertical-align: middle;font-weight: 600;">
                  <input style="display:none" type="file" accept="video/*" ref="uploadVideo" on-change={e => {
                    this.uploadVideo(e);
                  }} /></i>
              }
            },
            {
              name: "uploadFile",
              title: "发送文件",
            }
          ]);
          // 初始化表情
          IMUI.initEmoji(EmojiData);
        });
      });
    },
    // 初始化菜单
    initMenus(IMUI) {
      let menus=[
            {
              name: "messages",
              unread: this.unread,
            },
            {
              name: "contacts"
            },
            {
              name: "files",
              title: "文件",
              unread: 0,
              render: menu => {
                return <i class="el-icon-folder" />;
              },
              renderContainer: () => {
                return (
                  <Files title={this.dialogTitle}></Files>
                );
              },
            },
            {
              name: "setting",
              title: "设置",
              unread: 0,
              render: menu => {
                return <i class="el-icon-setting" />;
              },
              renderContainer: () => {
                return (
                  <Setting></Setting>
                );
              },
              isBottom: true
            },
          ];
          if(this.fullScreen){
            menus.push({
              name: "fullscrren",
              title: "全屏/窗口",
              unread: 0,
              click: () => {
                this.isFullscreen=!this.isFullscreen;
              },
              render: menu => {
                return <i class="el-icon-full-screen" />;
              }
            });
          }
          // 如果是管理员或者演示模式才显示后台管理
          if(user.role>0 || this.globalConfig.demon_mode){
            menus.push({
              name: "manage",
              title: "后台管理",
              unread: 0,
              click: () => {
                // 如果路由中有manage则关闭
                if(this.$route.path.indexOf('manage')>-1){
                  this.$emit('close');
                  return;
                }
                this.$router.push('/manage/index')

              },
              render: menu => {
                return <i class="el-icon-s-operation" />;
              },
              isBottom: true
            });
          }
          IMUI.initMenus(menus);
    },
    // 获取置顶联系人列表
    getChatTop() {
      var list = this.contacts;
      var topList = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].is_top == 1) {
          topList.push(list[i]);
        }
      }
      this.chatTopList = topList;
    },
    // 获取联系人
    getContact(id) {
      const { IMUI } = this.$refs;
      const contactList = IMUI.getContacts();
      for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].id == id) {
          return contactList[i];
        }
      }
    },
    wrapKey(e){
      return this.setting.sendKey == 1 ? (e.keyCode == 13 && e.ctrlKey) : (e.keyCode == 13 && !e.ctrlKey && !e.shiftKey);
    },
    // 设置发送键
    setSendKey(e) {
      return this.setting.sendKey == 1 ? (e.keyCode == 13 && !e.ctrlKey && !e.shiftKey) : (e.keyCode == 13 && e.ctrlKey);
    },
    // 点击了消息
    handleMessageClick(e, key, message, instance) {
      if (key == "status") {
        // 重发消息
        instance.updateMessage({
          id: message.id,
          status: "going"
        })
        message.status = "going";
        this.diySendMessage(message, this.curFile);
        return;
      }else if(key == 'avatar'){
        this.$user(message.fromUser.id);
        return;
      }
      // 语音消息点击事件
      if (message.type == 'voice') {
        // 如果没有其他语音在播放，直接播放
        if (!this.playAudio) {
          this.currentMessage = message;
          return this.playVoice(message, instance);
        }
        //只要有在播放的直接停止
        this.playAudio.pause();
        this.playAudio = null;
        instance.updateMessage({
          id: this.currentMessage.id,
          status: "successd",
          isPlay: 0,
        })
        // 如果不是点击的同一条数据，重新进行播放
        if (message.id != this.currentMessage.id) {
          this.currentMessage = message;
          this.playVoice(message, instance);
        }
      }
      var imageTypes = ["image", "file", "video"];
      if (imageTypes.includes(message.type)) {
        if (!message.preview) {
          return this.$message.error("没有配置预览接口");
        }
        this.$preview(message.preview);
      } else {
      }
    },
    playVoice (message, instance) {
      this.playAudio = new Audio(message.content);
      this.playAudio.play(); //播放这个音频对象
      instance.updateMessage({
        id: message.id,
        status: "succeed",
        isPlay: 1,
      })
    },
    // 打开聊天窗口
    openChat(contactId, instance) {
      this.keywords = "";
      instance.changeContact(contactId);
    },
    // 切换聊天窗口时要检测那些消息未读
    handleChangeContact(contact, instance) {
      instance.updateContact({
        id: contact.id,
        unread: 0
      });
      // 将未读的总数减去当前选择的聊天
      this.unread -= contact.unread;
      const { IMUI } = this.$refs;
      this.initMenus(IMUI);
      // 聊天记录列表恢复到最初第一页
      this.params.page = 1;
      this.displayName = contact.displayName;
      this.oldName = contact.displayName;
      this.currentChat = contact;
      // 如果是群聊，拉取群成员列表，如果刚才拉取过，现在就不用拉取了
      if (contact.is_group == 1 && this.group_id != contact.id) {
        this.getGroupUserList(contact.id);
      }
      //切换聊天后全局设置是否是群聊或者单聊
      this.is_group = contact.is_group;
      // 如果是团队id，保存当前团队id避免下次切换回来的时候重复请求成员列表
      if (this.is_group == 1) {
        this.group_id = contact.id;
        this.notice = contact.notice;
      }
      var data = [];
      
      // 获取当前聊天窗口的所有消息
      var messages = IMUI.getMessages(contact.id);
      for (var i = 0; messages.length > i; i++) {
        if (
          messages[i].is_read == 0 &&
          messages[i].fromUser.id != this.user.id
        ) {
          data.push(messages[i]);
        }
      }
      // 如果有未读的消息，需要将消息修改为已读
      if (data.length > 0) {
        this.$api.imApi.setMsgIsReadAPI({
          is_group: contact.is_group,
          toContactId: contact.id,
          messages: data,
          fromUser: contact.id
        }).then(res => {
          if (res.code == 0) {
            this.setLocalMsgIsRead(data);
          }
        });
      }
      instance.closeDrawer();
    },
    uploadVideo (e) {
      if(!this.globalConfig.chatInfo.simpleChat && this.currentChat.is_group == 0){
        this.$message.error(this.noSimpleTips);
        return false;
      }
      let file = e.srcElement.files[0];
      let url = URL.createObjectURL(file);
      //经测试，发现audio也可获取视频的时长
      let audioElement = new Audio(url);
      let duration;
      audioElement.addEventListener("loadedmetadata", function (_event) {
        duration = audioElement.duration;
      });
      let message = {
        content: url,
        fromUser: this.user,
        id: utils.generateRandId(),
        sendTime: getTime(),
        status: 'going',
        toContactId: this.currentChat.id,
        type: 'video',
        extends: {
          duration: duration
        }//录音时长
      }
      this.diySendMessage(message, file);
      // 将选择的文件清空
      this.$refs.uploadVideo.value='';
    },
    // 发送语音消息
    sendVoice (duration, file) {
      if(!this.globalConfig.chatInfo.simpleChat && this.currentChat.is_group == 0){
        this.$message.error(this.noSimpleTips);
        return false;
      }
      let message = {
        content: URL.createObjectURL(file),
        fromUser: this.user,
        id: utils.generateRandId(),
        sendTime: getTime(),
        status: 'going',
        toContactId: this.currentChat.id,
        type: 'voice',
        isPlay: 0,
        extends: {
          duration: duration
        }//录音时长
      }
      this.VoiceStatus = false;
      this.diySendMessage(message, file);
    },
    //自定义消息的发送
    diySendMessage (message, file) {
      const { IMUI } = this.$refs;
      IMUI.appendMessage(message, true);
      this.handleSend(message, function () {
        var replaceMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          status: "succeed"
        };
        IMUI.updateContact({
          id: message.toContactId,
          lastContent: IMUI.lastContentRender(message),
          lastSendTime: message.sendTime
        });
        IMUI.CacheDraft.remove(message.toContactId);
        IMUI.updateMessage(Object.assign(message, replaceMessage));
      }, file);
    },
    // 禁言时禁止发送消息
    nospeak(){
      if(this.is_group==1 || this.currentChat.setting.nospeak>0){
        if(this.currentChat.setting.nospeak==1 && this.currentChat.role==2){
          return true;
        }else if(this.currentChat.setting.nospeak==2 && this.currentChat.role==1){
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }
    },
    // 发送聊天消息
    handleSend(message, next, file) {
      const { IMUI } = this.$refs;
      message.is_group = this.is_group;
      this.curFile=file;
      // 如果开启了群聊禁言或者关闭了单聊权限，就不允许发送消息
      if((!this.globalConfig.chatInfo.simpleChat && this.currentChat.is_group == 0) || !this.nospeak()){
        IMUI.removeMessage(message.id);
        this.$message.error(this.noSimpleTips);
        return false;
      }
      let formdata = new FormData();
      // 如果是文件选择文件上传接口
      if (file) {
        // 判断文件如果大于5M就删除该聊天消息
        if (file.size > 5242880) {
          IMUI.removeMessage(message.id);
          return this.$message.error("上传的内容不等大于5MB！");
        }
        formdata.append("file", file);
        formdata.append("message", JSON.stringify(message));
        this.$api.imApi.sendFileAPI(formdata)
          .then(res => {
            IMUI.updateMessage(res.data);
            next();
          })
          .catch(error => {
            if(error.code==401){//已开启禁言
              IMUI.removeMessage(message.id);
            }else{
              next({ status: "failed" });
            }
          });
      } else {
        this.$api.imApi.sendMessageAPI(message)
          .then(res => {
            IMUI.setEditorValue("");
            IMUI.updateMessage(res.data);
            next();
          })
          .catch(error => {
            if(error.code==401){//已开启禁言
              IMUI.removeMessage(message.id);
            }else{
              next({ status: "failed" });
            }
          });
      }
    },
    // 拉取聊天记录
    handlePullMessages(contact, next, instance) {
      let params=this.params;
      params.toContactId=contact.id;
      params.is_group=contact.is_group;
      this.$api.imApi.getMessageListAPI(params)
        .then(res => {
          this.params.page++;
          let isEnd = false;
          let messages = res.data;
          if (messages.length < this.params.limit) {
            isEnd = true;
          }
          next(messages, isEnd);
        })
        .catch(error => {
          next([], true);
        });
      return true;
    },
    // 发布公告
    publishNotice() {
      this.noticeBox = false;
      this.$api.imApi.setNoticeAPI({ id: this.group_id, notice: this.notice }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "发布成功!"
          });
        }
      });
    },
    // 查看
    openNotice() {
      var notice="<div style='white-space: pre;'>"+this.notice+"</div>"
      this.$alert(notice, "群公告", {
        confirmButtonText: "确定",
         dangerouslyUseHTMLString: true
      });
    },
    // 打开创建团队的窗口
    openCreateGroup() {
      this.isAdd=true;
      this.dialogTitle = "创建群聊";
      this.createChatBox = true;
    },
    // 打开添加群成员的窗口
    openAddGroupUser() {
      var user_ids = utils.arrayToString(this.groupUser, "user_id");
      this.isAdd=false;
      this.userIds=user_ids;
      this.dialogTitle = "添加群成员";
      this.createChatBox = true;
    },
    // 添加群成员或者创建群聊
    manageGroup(selectUid,isAdd,groupName) {
      this.createChatBox = false;
      let num=this.globalConfig.chatInfo.groupUserMax;
      if(!isAdd){
        if((selectUid.length + this.groupUser.length) > num && num>0){
          return this.$message.error("群成员不能大于"+num+"人！");
        }
        this.$api.imApi.addGroupUserAPI({ user_ids: selectUid, id: this.group_id });
      }else{
        if(selectUid.length > num && num>0){
          return this.$message.error("群成员不能大于"+num+"人！");
        }
        this.$api.imApi.addGroupAPI({ user_ids: selectUid,name:groupName }).then(res => {
          const data = res.data;
          const { IMUI } = this.$refs;
          if (res.code == 0) {
            // 添加联系人
            IMUI.appendContact(data);
            // 切换到该联系人
            IMUI.changeContact(data.id);
          }
        });
      }
    },
    // 封装循环请求
    fn(formData) {
      return new Promise((resolve, reject) => {
        this.$api.imApi.sendMessageAPI(formData)
          .then(res => {
            if (res.code === 0) {
              resolve(res);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {});
      });
    },
    async test(formData) {
      let n = await this.fn(formData);
      return n;
    },
    // 转发消息
    forwardUser(userIds) {
      if (userIds.length > 5) {
        return this.$message.error("转发的人数不能超过5人！");
      }
      this.forwardBox = false;
      var message = this.currentMessage;
      var arr = [];
      for (var i = 0; i < userIds.length; i++) {
        var toContactId = userIds[i].toString();
        message.id = utils.generateRandId();
        message.status = "successd";
        message.sendTime = getTime();
        message.toContactId = toContactId;
        message.fromUser = this.user;
        message.is_group = 0;
        if (toContactId.indexOf("group") != -1) {
          message.is_group = 1;
        }
        if(!this.globalConfig.chatInfo.simpleChat && message.is_group==0){
          continue;
        }
        arr.push(this.test(message));
      }
      // 批量请求
      Promise.all(arr)
        .then(res => {
          const { IMUI } = this.$refs;
          for (var i = 0; i < res.length; i++) {
            var data = res[i].data;
            if (data.is_group == 0) {
              data.toContactId = parseInt(data.toContactId);
            }
            // 添加消息
            IMUI.appendMessage(data);
            // 自己发送消息，修改未读数
            IMUI.updateContact({
              id: data.toContactId,
              unread: 0
            });
          }
        })
        .catch(err => {
          console.log("error", err);
        });
    },
    // 获取群聊成员列表
    getGroupUserList(group_id) {
      this.$api.imApi.groupUserListAPI({
        group_id: group_id
      }).then(res => {
        if (res.code == 0) {
          var data = res.data;
          this.groupUser = data;
          this.groupUserCount = data.length;
        }
      });
    },
    // 修改群组的名称
    saveGroupName(contact) {
      if (this.displayName.length < 1) {
        this.$notify({
          title: "警告",
          message: "名称不能为空！",
          type: "warning"
        });
        this.isEdit = false;
        return false;
      }
      // 如果更改了名称，请求服务器，并通知所有群更改名称
      if (this.displayName != this.oldName) {
        const { IMUI } = this.$refs;
        this.$api.imApi.editGroupNameAPI({
          id: contact.id,
          displayName: this.displayName
        }).then(res => {
          IMUI.updateContact({
            id: contact.id,
            displayName: this.displayName
          });
        });
      }
      this.isEdit = false;
    },
    // 关闭搜索结果
    closeSearch() {
      var that = this;
      setTimeout(function() {
        that.searchResult = false;
      }, 300);
    },
    // 搜索联系人
    searchContact(contacts) {
      if (this.keywords != "") {
        this.searchList = utils.search_object(
          contacts,
          ["displayName", "name_py"],
          this.keywords
        );
      }
    },
    // 将本地消息设置为已读
    setLocalMsgIsRead(message) {
      const { IMUI } = this.$refs;
      for (let i = 0; message.length > i; i++) {
        const data = {
          id: message[i]["id"],
          is_read: 1,
          status: "succeed",
          content: message[i]["content"] + " "
        };
        IMUI.updateMessage(data);
      }
    },
    // 播放消息声音
    popNotice(message) {
      let that = this;
      if (Notification.permission == "granted") {
        let notification = new Notification("收到一条新消息", {
          body: message.fromUser.displayName + "：" + message.content,
          icon: message.fromUser.avatar
        });
        notification.onclick = function(e) {
          that.$nextTick(() => {
            setTimeout(() => {
              //具体操作
            }, 500);
          });
          //可直接打开通知notification相关联的tab窗
          window.focus();
          notification.close();
        };
        console.log("浏览器通知！");
      } else {
        console.log("声音通知！");
        const audio = document.getElementById("chatAudio");
        // 从头播放
        audio.currentTime = 0;
        audio.play();
      }
    },
    // 接收消息重新渲染
    recieveMsg(message) {
      const { IMUI } = this.$refs;
      const contact = IMUI.getCurrentContact();
      // 如果收到消息是当前窗口的聊天，需要将消息修改为已读
      if (contact.id == message.toContactId) {
        var data = [];
        data.push(message);
        this.$api.imApi.setMsgIsReadAPI({
          toContactId: contact.id,
          is_group: contact.is_group,
          messages: data,
          fromUser: message.fromUser.id
        });
      }else{
        // 如果不是自己的消息，需要将未读数加1
        if (this.user.id != message.fromUser.id) {
          this.unread++;
        }
      }
      
      if(this.user.id==message.toContactId){
        // 这里需要将原来的发送对象的id换回来，哈哈哈
        message.toContactId=message.toUser;
      }
      IMUI.appendMessage(message, true);
    },
    openMessageBox() {
      this.messageBox = true;
      // 组件重置
      this.componentKey += 1;
    },
    // 打开设置中心
    openSetting(){
      const { IMUI } = this.$refs;
      IMUI.changeMenu("setting");
    },
    handleCommand(e){
      if(e=='addGroup'){
        this.openCreateGroup();
      }else{
        this.addFriendBox=true;
      }
    },
    // 退出聊天室
    logout() {
      this.$confirm("你确定要退出聊天室吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            this.$router.push({ path: "/login" });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>
<style scoped lang="scss">
.main-container {
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-size: cover;
}

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

.chat-box {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.cover {
  text-align: center;
  user-select: none;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  i {
    font-size: 84px;
    color: #e6e6e6;
  }
  p {
    font-size: 18px;
    color: #ddd;
    line-height: 50px;
  }
}

.displayName {
  font-size: 16px;
  visibility: visible;
}

.contact-fixedtop-box {
  margin: 15px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  visibility: visible;
  position: relative;
}

.search-list {
  background: #fff;
  position: absolute;
  z-index: 99;
  top: 40px;
  width: 230px;
  height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  overflow: auto;
  border: solid 1px #e6e6e6;
  .search-list-item :hover {
    background: #f1f1f1;
  }
  .lemon-contact {
    background: #fff;
  }
}

.chat-top-list {
  display: flex;
  padding: 0 5px 10px 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.message-title-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  visibility: visible;
}

.message-title-tools {
  font-size: 20px;
  color: #999999;
  letter-spacing: 5px;
  cursor: pointer;
}

.editInput {
  font-size: 18px;
  border: none;
  width: 400px;
}

.editInput:focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.lemon-last-content {
  display: flex;
  justify-content: space-between;
  .lastContent {
    width: 150px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.slot-group-list {
  background: #fff;
  width: 180px;
  border-left: solid 1px #e6e6e6;
  height: 100%;
  white-space: initial;
  .group-side-box {
    .group-side-title {
      padding: 5px 10px;
    }
    .group-side-body {
      height: 85px;
      padding: 10px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
    .group-user-body {
      min-height: 410px;
      .user-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: flex-start;
        padding: 5px;
        background: #fff;
        .user-avatar {
          margin: 3px 8px 0 0;
          line-height: 10px;
        }
        .user-name {
          width: 110px;
        }
        .user-role {
          width: 20px;
        }
      }
      .user-list:hover {
        background: #e6e6e6;
      }
    }
  }
}

.group-side-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.group-notice {
  height: 140px;
}

.group-user {
  min-height: 300px;
  overflow: auto;
}
</style>
