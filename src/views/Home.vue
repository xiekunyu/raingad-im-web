<template>
  <div
    class="main-container"
    :style="'background-image:url(' + Background + ')'"
  >
    <div class="chat-box">
      <lemon-imui
        :user="user"
        ref="IMUI"
        width="1000px"
        :height="height"
        :contextmenu="contextmenu"
        :contact-contextmenu="contactContextmenu"
        :theme="setting.theme"
        :hide-message-name="setting.hideMessageName"
        :hide-message-time="setting.hideMessageTime"
        :avatarCricle="setting.avatarCricle"
        :sendKey="setSendKey"
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
                  <el-tag size="mini" v-if="contact.is_group == 1">群聊</el-tag> {{ contact.displayName }} <span>({{ groupUserCount }})</span>
                  <el-tag size="mini" v-if="contact.setting.nospeak == 1"  type="warning">仅群管理员可发言</el-tag>
                  <el-tag size="mini" v-if="contact.setting.nospeak == 2"  type="danger">全员禁言中</el-tag>
                </span>
                <span class="displayName" v-if="is_group == 0">{{
                  contact.displayName
                }}</span>
              </span>

              <input
                v-if="isEdit == true"
                v-model="displayName"
                class="editInput"
                @blur="saveGroupName(contact)"
              />
            </div>
            <div class="message-title-tools" v-if="contact.is_group == 1">
              <i
                class="el-icon-time"
                @click="openMessageBox"
                title="消息管理器"
              ></i>
              <!-- <i class="el-icon-more" title="设置" @click="changeDrawer(contact, $refs.IMUI)"></i> -->
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
                class="el-icon-close-notification font-16"
                v-if="Contact.is_notice == 0"
              ></span>
            </p>
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
            <div style="margin-left:10px">
              <el-button
                title="创建群聊"
                icon="el-icon-plus"
                @click="openCreateGroup"
                circle
              ></el-button>
            </div>
            <div class="search-list" v-if="searchResult">
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
                      class="el-icon-edit font-18 handle"
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
                      class="el-icon-circle-plus-outline font-18 handle"
                      v-if="contact.role <3 || contact.setting.invite==1"
                      @click="openAddGroupUser"
                    ></span>
                  </div>
                </div>
                <hr />
                <div class="group-user-body" id="group-user">
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
          {{ sendTips }}
        </template>
      </lemon-imui>
    </div>
    <!-- 创建群聊 -->
    <el-dialog
      title="创建群聊"
      :visible.sync="createChatBox"
      :modal="true"
      width="612px"
    >
      <el-transfer
        filterable
        :titles="createChatTitles"
        filter-placeholder="请输入关键词"
        v-model="selectUid"
        :props="defaultProps"
        :data="allUser"
      >
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            createChatBox = false;
            selectUid = [];
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="createGroup">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加群成员 -->
    <el-dialog
      title="添加成员"
      :visible.sync="addGroupUserBox"
      :modal="true"
      width="612px"
    >
      <el-transfer
        filterable
        :titles="createChatTitles"
        filter-placeholder="请输入关键词"
        v-model="selectUid"
        :props="defaultProps"
        :data="allUser"
      >
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            addGroupUserBox = false;
            selectUid = [];
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="addGroupUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置中心 -->
    <el-dialog
      title="设置"
      :visible.sync="settingBox"
      :modal="true"
      width="550px"
    >
      <el-tabs :tab-position="tabPosition" style="min-height: 300px">
        <el-tab-pane label="账号设置">
          <div align="center">
            <el-avatar :src="user.avatar" :size="50"> </el-avatar>
            <br /><br />
            <p>{{ user.displayName }}</p>
            <br />
            <p>账号：{{ user.account }}</p>
            <br />
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
            <el-switch v-model="setting.isVoice"> </el-switch
            >&emsp;开启新消息声音提醒
          </div>
          <div class="setting-switch">
            <el-switch v-model="setting.avatarCricle"> </el-switch
            >&emsp;开启聊天圆形头像（需要刷新）
          </div>
          <div class="setting-switch">
            <el-switch v-model="setting.hideMessageName"> </el-switch
            >&emsp;是否隐藏聊天窗口内的联系人名字
          </div>
          <div class="setting-switch">
            <el-switch v-model="setting.hideMessageTime"> </el-switch
            >&emsp;是否隐藏聊天窗口内的消息发送时间
          </div>
        </el-tab-pane>
        <el-tab-pane label="关于 IM">
          <div align="center">
            <el-avatar :src="logo" :size="50"></el-avatar>
            <br /><br />
            <p>
              <span class="main-color"> {{ softname }} </span>for {{ version }}
            </p>
          </div>
          <div class="setting-version">
            <b> 已经支持功能：</b>
            <p>1、单聊和群聊，新增消息管理器</p>
            <p>2、支持发送表情、图片和文件</p>
            <p>3、单聊支持消息已读未读的状态显示</p>
            <p>4、支持设置新消息声音提醒，浏览器通知</p>
            <p>5、支持部分Lemon-imui内功能设置</p>
            <p>6、支持文件、图片和绝大部分媒体文件在线预览</p>
            <p>7、群聊创建、删除和群成员管理、群公告、群禁言等</p>
            <p>8、可以置顶联系人，所有联系人可以设置消息免打扰</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="开源">
          <div align="center">
            <el-avatar :src="logo" :size="50"></el-avatar>
            <br /><br />
            <p>
              <span class="main-color"> {{ softname }} </span>for {{ version }}
            </p>
          </div>
          <!-- <div class="setting-version">
            <b> 即将支持功能：</b>
            <p>1、解散群聊、群公告设置、群功能设置</p>
          </div> -->
          <div class="setting-version">
            <p>
              前端地址：<a
                class="main-color"
                href="https://gitee.com/raingad/im-chat-front"
                target="_blank"
              >[链接] im-chat-front</a
              >
            </p>
            <p>
              后端地址：<a
                class="main-color"
                href="https://gitee.com/raingad/im-instant-chat"
                target="_blank"
                >[链接] im-instant-chat</a
              >
            </p>
          </div>
          <div class="setting-version" style="color: #a6a6a6">
            <p>前端技术栈：vue+Lemon-IMUI+element-UI</p>
            <p>后端技术栈：thinkphp6+workerman</p>
          </div>
          <div class="setting-version">
            <p>
              QQ交流群：
              <a
                class="main-color"
                href="https://jq.qq.com/?_wv=1027&k=jMQAt9lh"
                target="_blank"
                >336921267</a
              >
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 创建群聊 -->
    <el-dialog
      title="发布公告"
      :visible.sync="noticeBox"
      :modal="true"
      width="500px"
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
    <!-- 预览接口 -->
    <transition name="fade-user">
      <div class="previewBox" v-if="drawer">
        <el-button
          class="drawer-close"
          type="danger"
          @click="drawer = !drawer"
          icon="el-icon-close"
          circle
        ></el-button>
        <iframe
          :src="previewUrl"
          frameborder="0"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </transition>
    <!-- 转发聊天 -->
    <el-dialog
      title="转发"
      :visible.sync="forwardBox"
      :modal="true"
      width="612px"
    >
      <el-transfer
        filterable
        :titles="createChatTitles"
        filter-placeholder="请输入关键词"
        v-model="selectUid"
        :props="contactsProps"
        :data="allUser"
      >
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            forwardBox = false;
            selectUid = [];
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="forwardUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 消息管理器 -->
    <el-dialog
      title="消息管理器"
      :visible.sync="messageBox"
      :modal="true"
      width="800px"
    >
      <ChatRecord :contact="currentChat" :key="componentKey"></ChatRecord>
    </el-dialog>
    <!-- 群设置中心 -->
    <el-dialog
      title="群设置"
      :visible.sync="groupSetting"
      :modal="true"
      width="500px"
    >
      <ChatSet :contact="contactSetting" :key="componentKey"></ChatSet>
    </el-dialog>
    <!-- <preview  :drawer="drawer" :previewUrl="previewUrl" :key="componentKey"></preview> -->
    <Socket ref="socket"></Socket>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EmojiData from "../utils/emoji";
import Background from "../assets/img/login-background.jpg";
import {
  getContactsAPI,
  sendMessageAPI,
  getMessageListAPI,
  setMsgIsReadAPI,
  editGroupNameAPI,
  sendFileAPI,
  settingAPI,
  groupUserListAPI,
  getAllUserAPI,
  addGroupAPI,
  setManagerAPI,
  removeUserAPI,
  addGroupUserAPI,
  removeGrouprAPI,
  setNoticeAPI,
  undoMessageAPI,
  isNoticeAPI,
  setChatTopAPI,
  removeMessageAPI
} from "@/api/im";
import { bindGroupAPI } from "@/api/login";
import {
  search_object,
  arrayToString,
  editArrValue,
  timeFormat,
  delArrValue
} from "@/utils/index";
import Lockr from "lockr";
import Socket from "../components/socket";
import preview from "../components/preview";
import ChatRecord from "../components/chatRecord";
import ChatSet from "../components/chatSet";
import ChatTop from "../components/chatTop";

const getTime = () => {
  return new Date().getTime();
};
const generateRandId = () => {
  return Math.random()
    .toString(36)
    .substr(-8);
};

const user = Lockr.get("UserInfo");

export default {
  name: "app",
  components: {
    Socket,
    preview,
    ChatRecord,
    ChatSet,
    ChatTop
  },
  data() {
    var _this = this;
    return {
      Background,
      componentKey: 1,
      version: "0.6.26",
      softname: "Raingad IM",
      logo: "https://img.file.raingad.com/logo/logo.png",
      // 搜索结果展示
      searchResult: false,
      createChatBox: false,
      addGroupUserBox: false,
      forwardBox: false,
      noticeBox: false,
      messageBox: false,
      groupSetting: false,
      contactSetting: {},
      groupUserCount: 0,
      // 公告
      notice: "",
      createChatTitles: ["待选成员", "已选成员"],
      selectUid: [],
      // 所有成员默认的props
      defaultProps: {
        key: "user_id",
        label: "realname",
        pinyin: "name_py"
      },
      contactsProps: {
        key: "id",
        label: "realname"
      },
      // 搜索结果列表
      searchList: [],
      keywords: "",
      displayName: "",
      oldName: "",
      drawer: false,
      previewUrl: "",
      isEdit: false,
      settingBox: false,
      tabPosition: "left",
      sendTips: "使用 Enter 键发送消息",
      // 设置
      setting: {
        theme: "blue",
        hideMessageName: false,
        hideMessageTime: false,
        avatarCricle: true,
        sendKey: 1,
        isVoice: true
      },
      // 当前登录用户
      user: {
        id: user.user_id,
        displayName: user.realname,
        avatar: user.avatar,
        account: user.account
      },
      height: "640px",
      pageSize: 1,
      listRows: 10,
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
            return instance.contact.user_id != this.user.id;
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
              setManagerAPI({
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
              setManagerAPI({
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
              removeUserAPI({ id: this.group_id, user_id: contact.user_id });
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
          icon: "el-icon-upload2",
          text: "置顶聊天",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            setChatTopAPI({
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
                this.chatTopList.push(contact);
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
            setChatTopAPI({
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
                delArrValue(this.chatTopList, "id", contact.id);
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
            isNoticeAPI({ id: contact.id, is_notice: 0 ,is_group:contact.is_group});
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
            isNoticeAPI({ id: contact.id, is_notice: 1 ,is_group:contact.is_group});
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
                removeGrouprAPI({ id: contact.id });
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
                removeUserAPI({ id: contact.id, user_id: _this.user.id });
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
            undoMessageAPI({ id: message.id })
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
            this.allUser = editArrValue(contactList, "id", currentContact.id);
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
            this.download(message.content, message.fileName, message.type);
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
            this.download(message.content, message.fileName, message.type);
            hide();
          }
        }
        // {
        //   click: (e, instance, hide) => {
        //     const { IMUI, message } = instance;
        //     hide();
        //     console.log(message);
        //     console.log(IMUI.getMessages());
        //     IMUI.removeMessage(message.id)
        //     // this.$confirm("确定删除该条消息吗？", "提示", {
        //     //   confirmButtonText: "确定",
        //     //   cancelButtonText: "取消",
        //     //   type: "warning"
        //     // }).then(() => {
        //     //   console.log(message.id)
        //     //   ;
        //     //   removeMessageAPI({ id: message.id });
        //     // }).catch(error => {
        //     //       console.log(error);
        //     // });;
        //   },
        //   color: "red",
        //   text: "删除"
        // }
      ]
    };
  },
  computed: {
    // 监听全局socket消息状态
    ...mapState({
      socketAction: state => state.socketAction
    }),
    formatTime() {
      return function(val) {
        return timeFormat(val);
      };
    }
  },
  watch: {
    // 监听联系人搜索
    keywords() {
      const { IMUI } = this.$refs;
      const contacts = IMUI.getContacts();
      this.searchContact(contacts);
    },
    "setting.sendKey"(val) {
      if (val == 1) {
        this.sendTips = "使用 Enter 键发送消息";
      } else {
        this.sendTips = "使用 Ctrl + Enter 键发送消息";
      }
    },
    // 监听设置发送变化需要进行设置更改
    setting: {
      handler(newValue, oldValue) {
        settingAPI(newValue);
        user.setting = newValue;
        Lockr.set("UserInfo", user);
      },
      deep: true
    },
    // 监听接收socket消息
    socketAction(val) {
      let message = val.data;
      const { IMUI } = this.$refs;
      switch (val.type) {
        // 接收单聊消息
        case "simple":
          // 如果开启了声音才播放
          var contact = this.getContact(message.toContactId);
            // 如果开启了声音才播放
          if (this.setting.isVoice && contact.is_notice == 1) {
            this.popNotice(message);
          }
          this.recieveMsg(message);
          break;
        // 接收群聊消息
        case "group":
          // 如果是自己发送的消息则不需要提示
          if (message.fromUser.id != this.user.id) {
            var contact = this.getContact(message.toContactId);
            // 如果开启了声音才播放
            if (this.setting.isVoice && contact.is_notice == 1) {
              this.popNotice(message);
            }
            this.recieveMsg(message);
          }
          break;
        // 撤回消息
        case "undoMessage":
          IMUI.updateMessage(message);
          break;
        // 修改群组名称
        case "editGroupName":
          IMUI.updateContact({
            id: message.id,
            displayName: message.displayName
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
          const client_id = Lockr.get("client_id");
          if (message.owner_id != this.user.id) {
            IMUI.appendContact(message);
          }
          bindGroupAPI({ client_id: client_id, group_id: message.id });
          break;
        // 设置群管理员
        case "setManager":
        case "addGroupUser":
        case "removeUser":
          if (message.group_id == this.group_id) {
            this.getGroupUserList(message.group_id);
          }
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
              id: generateRandId(),
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
  mounted() {
    // 初始化动态设置窗口的高度
    // this.height = document.documentElement.clientHeight;
    // const that = this;
    // window.onresize = () => {
    //   return (() => {
    //     if (this.is_group == 1) {
    //       var html = document.getElementById("group-user");
    //       html.style.height =
    //         document.documentElement.clientHeight - 280 + "px";
    //     }
    //     that.height = document.documentElement.clientHeight;
    //   })();
    // };
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
  created() {
    // 初始化用户设置
    if (user.setting) {
      console.log(user.setting);
      this.setting = eval(user.setting);
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
  methods: {
    // 初始化聊天
    getSimpleChat() {
      const { IMUI } = this.$refs;
      // IMUI.setLastContentRender("event", message => {
      //   return `[自定义通知内容]`;
      // });
      // 获取联系人列表
      getContactsAPI().then(res => {
        const data = res.data;
        this.contacts = data;
        // 设置置顶人
        this.getChatTop(data);
        IMUI.initContacts(data);
      });
      // 初始化左侧菜单栏
      IMUI.initMenus([
        {
          name: "messages"
        },
        {
          name: "contacts"
        },
        {
          name: "custom2",
          title: "系统设置",
          unread: 0,
          click: () => {
            this.settingBox = true;
          },
          render: menu => {
            return <i class="el-icon-setting" />;
          },
          isBottom: true
        }
      ]);
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
          name: "uploadFile",
          title: "发送文件"
        }
      ]);
      // 初始化表情
      IMUI.initEmoji(EmojiData);
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
    // 设置发送键
    setSendKey(e) {
      if (this.setting.sendKey == 1) {
        return e.keyCode == 13;
      } else {
        return e.keyCode == 13 && e.ctrlKey === true;
      }
    },
    // 点击了消息
    handleMessageClick(e, key, message, instance) {
      if (key == "status") {
        instance.updateMessage({
          id: message.id,
          status: "going",
          content: "这个功能没做"
        });
        setTimeout(() => {
          instance.updateMessage({
            id: message.id,
            status: "failed",
            content: "还是发送失败，哈哈哈哈！！！"
          });
        }, 2000);
        return;
      }
      if (message.type == "image" || message.type == "file") {
        if (!message.preview) {
          return this.$message.error("没有配置预览接口");
        }
        this.previewUrl = message.preview;
        this.drawer = true;
      } else {
      }
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
      // 聊天记录列表恢复到最初第一页
      this.pageSize = 1;
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
      const { IMUI } = this.$refs;
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
        setMsgIsReadAPI({
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
    // 发送聊天消息
    handleSend(message, next, file) {
      let formdata = new FormData();
      message.is_group = this.is_group;
      const { IMUI } = this.$refs;
      // 如果是文件选择文件上传接口
      if (file) {
        // 判断文件如果大于5M就删除该聊天消息
        if (file.size > 5242880) {
          IMUI.removeMessage(message.id);
          return this.$message.error("上传的内容不等大于5MB！");
        }
        formdata.append("file", file);
        formdata.append("message", JSON.stringify(message));
        sendFileAPI(formdata)
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
        sendMessageAPI(message)
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
      getMessageListAPI({
        toContactId: contact.id,
        is_group: contact.is_group,
        pageSize: this.pageSize,
        listRows: this.listRows
      })
        .then(res => {
          this.pageSize++;
          let isEnd = false;
          let messages = res.data;
          if (messages.length < this.listRows) {
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
      setNoticeAPI({ id: this.group_id, notice: this.notice }).then(res => {
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
    // 获取所有人员列表
    getAllUser(data) {
      getAllUserAPI(data).then(res => {
        const data = res.data;
        this.allUser = data;
      });
    },
    // 打开创建团队的窗口
    openCreateGroup() {
      this.getAllUser({});
      this.createChatBox = true;
    },
    // 打开添加群成员的窗口
    openAddGroupUser() {
      var user_ids = arrayToString(this.groupUser, "user_id");
      this.getAllUser({ user_ids: user_ids });
      this.addGroupUserBox = true;
    },
    // 封装循环请求
    fn(formData) {
      return new Promise((resolve, reject) => {
        sendMessageAPI(formData)
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
    forwardUser() {
      var userIds = this.selectUid;
      this.selectUid = [];
      if (userIds.length > 5) {
        return this.$message.error("转发的人数不能超过5人！");
      }
      this.forwardBox = false;
      var message = this.currentMessage;
      var arr = [];
      for (var i = 0; i < userIds.length; i++) {
        var toContactId = userIds[i].toString();
        message.id = generateRandId();
        message.status = "successd";
        message.sendTime = getTime();
        message.toContactId = toContactId;
        message.fromUser = this.user;
        message.is_group = 0;
        if (toContactId.indexOf("group") != -1) {
          message.is_group = 1;
        }
        arr.push(this.test(message));
      }
      // 批量请求
      Promise.all(arr)
        .then(res => {
          console.log(res);
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
    // 添加群成员
    addGroupUser() {
      this.addGroupUserBox = false;
      addGroupUserAPI({ user_ids: this.selectUid, id: this.group_id });
      this.selectUid = [];
    },
    // 创建群聊
    createGroup() {
      this.createChatBox = false;
      addGroupAPI({ user_ids: this.selectUid }).then(res => {
        const data = res.data;
        const { IMUI } = this.$refs;
        if (res.code == 0) {
          // 添加联系人
          IMUI.appendContact(data);
          // 切换到该联系人
          IMUI.changeContact(data.id);
        }
        this.selectUid = [];
      });
    },
    // 获取群聊成员列表
    getGroupUserList(group_id) {
      groupUserListAPI({
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
        editGroupNameAPI({
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
        this.searchList = search_object(
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
    // 下载文件
    download(src, name, type) {
      let a = document.createElement("a");
      if (type == "image") {
        a.download = name || "pic";
      } else {
        a.download = name || "file";
      }
      a.href = src;
      a.click();
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
        setMsgIsReadAPI({
          toContactId: contact.id,
          is_group: contact.is_group,
          messages: data,
          fromUser: message.fromUser.id
        });
      }
      IMUI.appendMessage(message, true);
    },
    openGallery() {
      this.$message({
        message: "即将呈现！",
        type: "warning"
      });
    },
    openMessageBox() {
      this.messageBox = true;
      // 组件重置
      this.componentKey += 1;
    },
    changeDrawer(contact, instance) {
      instance.changeDrawer({
        //width: 240,
        //height: "90%",
        offsetX: 0,
        offsetY: 1,
        //position: "center",
        // inside: true,
        // offsetX: -280,
        // offsetY: -100,
        render: () => {
          return (
            <div class="drawer-content">
              <p>
                <b>自定义抽屉</b>
              </p>
              <p>{contact.displayName}</p>
            </div>
          );
        }
      });
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
.chat-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
.cover-text1 {
  display: flex;
  display: -webkit-flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
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
    background: #e6e6e6;
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

.article {
  padding: 15px;
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
      height: 410px;
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

.setting-switch {
  margin: 0 30px 20px;
}

.setting-version {
  margin: 10px 20px;
  line-height: 2;
}

.main-color {
  color: #409eff;
}

.previewBox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(222, 222, 222, 0.3);
  z-index: 99;
}
.drawer-close {
  position: absolute;
  top: 60px;
  right: 40px;
}
.handle {
  cursor: pointer;
}
.fc-danger {
  color: #f56c6c;
}
.fc-warning {
  color: #e6a23c;
}
.fc-success {
  color: #67c23a;
}
.fc-info {
  color: #909399;
}
.fc-primary {
  color: #409eff;
}
.font-20 {
  font-size: 20px;
}
.font-18 {
  font-size: 18px;
}
.font-16 {
  font-size: 16px;
}
.lemon-editor__submit .lemon-button{
  background: #409EFF;
  color:#fff;
}
  .lemon-editor__submit .lemon-button:hover{
  background: #409EEE;
  color:#fff;
  border:solid 1px #409EEE;
}
.lemon-editor__submit button[disabled],.lemon-editor__submit button[disabled]:hover{
  background: #fff;
  color:#aaa;
  border:solid 1px #aaa;
}

.el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>
