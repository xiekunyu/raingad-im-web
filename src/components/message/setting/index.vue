<template>
    <!-- 设置中心 -->
      <el-tabs tab-position="left" style="height: 100%;">
        <el-tab-pane label="账号设置" class="pd-20">
          <div align="center">
            <el-avatar :src="user.avatar" :size="50"> </el-avatar>
            <br /><br />
            <p>{{ user.realname }}</p>
            <br />
            <p>账号：{{ user.account }}</p>
            <br />
            <el-button type="danger" @click="logout">退出登录</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="通用设置" class="pd-20">
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
        <el-tab-pane label="关于 IM" class="pd-20">
          <div class="about-logo">
            <el-avatar :src="$packageData.logo" :size="50"></el-avatar>
            <br /><br />
            <p>
              <span class="main-color"> {{ $packageData.name }} </span>for {{ $packageData.version }}
            </p>
          </div>
          <div class="setting-version">
            <b> 已经支持功能：</b>
            <p v-for="item in $packageData.funcList" :key="item.icon"><i :class="item.icon"></i> {{ item.text }}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="开源" class="pd-20">
          <div  class="about-logo">
            <el-avatar :src="$packageData.logo" :size="50"></el-avatar>
            <br /><br />
            <p>
              <span class="main-color"> {{ $packageData.name }} </span>for {{ $packageData.version }}
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
                :href="$packageData.frontUrl"
                target="_blank">[链接] im-chat-front</a>
            </p>
            <p>
              后端地址：<a
                class="main-color"
                :href="$packageData.backstageUrl"
                target="_blank">[链接] im-instant-chat</a>
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
                :href="$packageData.qqGroupUrl"
                target="_blank">336921267</a>
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
</template>
<script>
import Lockr from "lockr";
let user = Lockr.get("UserInfo");
import { mapState } from "vuex";
export default {
    name: "manageGroup",
    props: {
    },
    data() {
        return {

        };
    },
    computed: {
        ...mapState({
            setting: (state) => state.setting,
            user: (state) => state.userInfo,
        }),
    },
    watch: {
        // 监听设置发送变化需要进行设置更改
        setting: {
            handler(newValue, oldValue) {
                console.log(newValue,'val')
                this.$api.imApi.settingAPI(newValue);
                user.setting = newValue;
                Lockr.set("UserInfo", user);
            },
            deep: true,
        }
    },
    methods: {
        logout() {
            this.$confirm("确定退出登录吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$store.dispatch("logout");
                    this.$router.push("/login");
                })
                .catch(() => {});
        },
    },
    
};
</script>
<style>
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

.about-logo {
  text-align: center;
  width:200px;
}
</style>