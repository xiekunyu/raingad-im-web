<template>
  <div
    class="main-container"
    :style="'background-image:url(' + Background + ')'"
  >
    <div class="chat-box">
      <lemon-imui
        :user="user"
        ref="IMUI"
        width="900px"
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
        style="min-height:530px"
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
              <span
                v-if="isEdit == false"
                @click="
                  if (contact.is_group == 1) {
                    isEdit = true;
                  }
                "
                class="displayName"
                >{{ contact.displayName }}</span
              >
              <input
                v-if="isEdit == true"
                v-model="displayName"
                class="editInput"
                @blur="saveGroupName(contact)"
              />
            </div>
            <div class="message-title-tools" v-if="contact.is_group == 1">
              <el-button
                type="primary"
                icon="el-icon-picture"
                circle
                title="群相册"
                @click="openGallery"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-s-order"
                circle
                title="群文件"
                @click="openFileList"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-s-tools"
                circle
                title="群设置"
                @click="openGroupSetting"
              ></el-button>
            </div>
          </div>
        </template>
        <!-- 最近联系人列表顶部插槽 -->
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
                type="primary"
                title="创建群聊"
                icon="el-icon-plus"
                @click="openCreateGroup"
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
                  <h3>群公告</h3>
                  <div>
                    <el-button
                      type="text"
                      @click="noticeBox = true"
                      v-if="contact.owner_id == user.id"
                      >编辑公告</el-button
                    >
                  </div>
                </div>
                <hr style="border:solid 1px #e6e6e6" />
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
                  <h3>群成员</h3>
                  <div>
                    <el-button type="text" @click="openAddGroupUser"
                      >添加成员</el-button
                    >
                  </div>
                </div>
                <hr style="border:solid 1px #e6e6e6" />
                <div class="group-user-body" id="group-user">
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
                      <span v-if="item.userInfo.id == user.id" class="fc-danger"
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
        <el-button @click="createChatBox = false;selectUid=[]">取 消</el-button>
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
        <el-button @click="addGroupUserBox = false;selectUid=[]">取 消</el-button>
        <el-button type="primary" @click="addGroupUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置中心 -->
    <el-dialog
      title="设置"
      :visible.sync="settingBox"
      :modal="true"
      width="500px"
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
            <p>1、单聊和群聊</p>
            <p>2、支持发送表情、图片和文件</p>
            <p>3、单聊支持消息已读未读的状态显示</p>
            <p>4、支持设置新消息提醒</p>
            <p>5、支持部分Lemon-imui内功能设置</p>
            <p>5、支持文件和图片在线预览</p>
            <p>6、群聊创建、删除和群成员管理、群公告等</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关于开源">
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
                >im-chat-front</a
              >
            </p>
            <p>
              后端地址：<a
                class="main-color"
                href="https://gitee.com/raingad/im-instant-chat"
                target="_blank"
                >im-instant-chat</a
              >
            </p>
          </div>

          <div class="setting-version" style="color: #a6a6a6">
            <p>后端技术栈：thinkphp6+workerman</p>
            <p>前端技术栈：vue+Lemon-IMUI+element-UI</p>
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
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span> -->
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
        :rows="4"
        placeholder="请输入内容"
        v-model="notice"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noticeBox = false">取 消</el-button>
        <el-button type="primary" @click="publishNotice">确 定</el-button>
      </span>
    </el-dialog>
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
    <Socket ref="socket"></Socket>
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
        <el-button @click="forwardBox = false;selectUid=[]">取 消</el-button>
        <el-button type="primary" @click="forwardUser">确 定</el-button>
      </span>
    </el-dialog>
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
  setNoticeAPI
} from "@/api/im";
import { bindGroupAPI } from "@/api/login";
import { search_object, arrayToString, editArrValue } from "@/utils/index";
import Lockr from "lockr";
import Socket from "../components/socket";

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
    Socket
  },
  data() {
    var _this = this;
    return {
      Background,
      version: "0.5.24",
      softname: "Raingad IM",
      logo: "http://img.raingad.com/logo/logo.png",
      // 搜索结果展示
      searchResult: false,
      createChatBox: false,
      addGroupUserBox: false,
      forwardBox: false,
      noticeBox: false,
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
        // {
        //   text: "删除该聊天",
        //   click: (e, instance, hide) => {
        //     const { IMUI, contact } = instance;
        //     IMUI.updateContact({
        //       id: contact.id,
        //       lastContent: null
        //     });
        //     if (IMUI.currentContactId == contact.id) IMUI.changeContact(null);
        //     hide();
        //   }
        // },
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
                      on-click={e => {
                        IMUI.setEditorValue(e.target.getAttribute("content"));
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
            IMUI.removeMessage(message.id);
            IMUI.appendMessage(data, true);
            hide();
          },
          visible: instance => {
            return instance.message.fromUser.id == this.user.id;
          },
          text: "撤回消息",
          click: (e, instance, hide) => {
            this.$message({
              message: "即将呈现！",
              type: "warning"
            });
            hide();
          }
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
            this.$message({
              message: "即将呈现！",
              type: "warning"
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
        //     alert("无法删除");
        //     return;
        //     const { IMUI, message } = instance;
        //     IMUI.removeMessage(message.id);
        //     hide();
        //   },
        //   icon: "lemon-icon-folder",
        //   color: "red",
        //   text: "删除"
        // }
      ],
      // 设置
      setting: {
        theme: "blue",
        hideMessageName: false,
        hideMessageTime: true,
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
      height: "600px",
      pageSize: 1,
      listRows: 10,
      is_group: 0,
      group_id: 0,
      contacts: [],
      allUser: [],
      groupUser: [],
      currentChat: {},
      currentMessage: {}
    };
  },
  computed: {
    // 监听全局socket消息状态
    ...mapState({
      socketAction: state => state.socketAction
    })
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
          if (this.setting.isVoice) {
            this.playAudio();
          }
          this.recieveMsg(message);
          break;
        // 接收群聊消息
        case "group":
          // 如果是自己发送的消息则不需要提示
          if (message.fromUser.id != this.user.id) {
            // 如果开启了声音才播放
            if (this.setting.isVoice) {
              this.playAudio();
            }
            this.recieveMsg(message);
          }
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
      }
    }
  },
  mounted() {
    // 初始化用户设置
    if (user.setting) {
      this.setting = eval(user.setting);
    }
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
  methods: {
    // 初始化聊天
    getSimpleChat() {
      const { IMUI } = this.$refs;
      IMUI.setLastContentRender("event", message => {
        return `[自定义通知内容]`;
      });
      // 获取联系人列表
      getContactsAPI().then(res => {
        const data = res.data;
        this.contacts = data;
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
          title: "退出",
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
          content: "正在重新发送消息..."
        });
        setTimeout(() => {
          instance.updateMessage({
            id: message.id,
            status: "succeed",
            content: message.content
          });
        }, 2000);
        return;
      }
      if (
        (message.type == "image" || message.type == "file") &&
        message.preview
      ) {
        this.previewUrl = message.preview;
        this.drawer = true;
      } else {
        this.$message.error("没有配置预览接口");
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
            next({ status: "failed" });
          });
      } else {
        sendMessageAPI(message)
          .then(res => {
            IMUI.setEditorValue("");
            IMUI.updateMessage(res.data);
            next();
          })
          .catch(error => {
            next({ status: "failed" });
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
      var _this = this;
      this.$alert(_this.notice, "公告", {
        confirmButtonText: "确定"
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
      this.selectUid=[];
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
          this.groupUser = res.data;
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
    playAudio() {
      const audio = document.getElementById("chatAudio");
      // 从头播放
      audio.currentTime = 0;
      audio.play();
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
    openFileList() {
      this.$message({
        message: "即将呈现！",
        type: "warning"
      });
    },
    openGroupSetting() {
      this.$message({
        message: "即将呈现！",
        type: "warning"
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
  font-size: 18px;
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

.message-title-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  visibility: visible;
}

.message-title-tools button {
  padding: 4px !important;
  font-size: 20px !important;
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

.slot-group-list {
  background: #fff;
  width: 200px;
  border-left: solid 1px #e6e6e6;
  height: 100%;
  white-space: initial;
  .group-side-box {
    padding: 10px 0;
    .group-side-title {
      padding: 0 10px;
    }
    .group-side-body {
      height: 85px;
      padding: 10px;
      cursor: pointer;
      overflow: hidden;
    }
    .group-user-body {
      margin-top: 10px;
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
          width: 130px;
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
  height: 150px;
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
</style>
