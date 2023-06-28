<template>
  <div class="main-container">
    <el-container style="height:100vh;border: 1px solid #eee">
      
      <el-header style="text-align: right; font-size: 12px;border-bottom: 1px solid #e6e6e6">
        <el-row type="flex" justify="space-between" align="middle" :style="{ height: '60px' }">
          <el-col :span="8" class="logo">
            <div class="image">
              <img :src="packageData.logo" alt="logo">
            </div>
            <div class="f-20 ml-5">{{packageData.name}}</div>  
          </el-col>
          <el-col :span="16" class="text-right">
            <div class="user">
              <span class="message">
                <router-link to="/chat">
                  <el-button> 进入聊天 </el-button>
                </router-link>
              </span>
              <span class="message"  @click="showMessageBox()">
                <el-badge :value="unread" :max="99" :hidden="unread ? false : true">
                  <el-button icon="el-icon-chat-line-round f-18" circle></el-button>
                </el-badge>
              </span>
              <el-dropdown trigger="click">
                <span class="avatar">
                  <img :src="packageData.logo" alt="avatar">
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span class="username">用户名</span>
            </div>
          </el-col>
        </el-row>
        </el-header>
      <el-container>
        <el-aside class="main-aside" :style="{width:asideWidth}">
          <div class="aside-menu">
            <el-scrollbar style="height:100%">
              <el-menu :default-active="active" mode="vertical" @select="handleMenuSelect" style="border:none" class="el-menu-vertical-demo" ext-color="#fff"  :collapse="isCollapse">
                <template v-for="(route, index) in routes">
                  <el-menu-item :index="route.path" :key="index">
                    <i :class="route.meta.icon"></i>
                    <span slot="title">{{ route.meta.title }}</span>
                  </el-menu-item>
                </template>
              </el-menu>
              <el-menu :default-active="active" mode="vertical" @select="handleMenuSelect" style="border:none" class="el-menu-vertical-demo" ext-color="#fff"  :collapse="isCollapse">
                <template v-for="(route, index) in routes">
                  <el-menu-item :index="route.path" :key="index">
                    <i :class="route.meta.icon"></i>
                    <span slot="title">{{ route.meta.title }}</span>
                  </el-menu-item>
                </template>
              </el-menu>
              <el-menu :default-active="active" mode="vertical" @select="handleMenuSelect" style="border:none" class="el-menu-vertical-demo" ext-color="#fff"  :collapse="isCollapse">
                <template v-for="(route, index) in routes">
                  <el-menu-item :index="route.path" :key="index">
                    <i :class="route.meta.icon"></i>
                    <span slot="title">{{ route.meta.title }}</span>
                  </el-menu-item>
                </template>
              </el-menu>
            </el-scrollbar>
          </div>
          <div class="aside-bottom" @click="isCollapse=!isCollapse">
            <span class="el-icon-s-fold f-18"></span>
          </div>
        </el-aside>
        
        <el-main style="background-color: #f5f5f5;max-height: calc(100vh - 61px);;">
          <el-scrollbar style="height:100%">
            <transition name="fade" mode="out-in">
              <router-view :key="key" />
            </transition>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
    <Message ref="Message" :dialogTableVisible.sync="dialogTableVisible"></Message>
  </div>
</template>

<script>
import packageData from "../../package.json";
import { mapGetters, mapMutations, mapState } from "vuex";
import Message from "@/views/message/Index"; 
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
      isCollapse:false,
      asideWidth:'200px',
      active: '',
      routes: []
    };
  },
  computed: {
    ...mapState({
      chatSocket: (state) => state.unread,
      getContacts: (state) => state.allContacts,
    }),
    key(){
      return this.$route.path
    }
  },
  watch: {
    chatSocket(val) {
      this.unread = val;
    },
    // 全局获取联系人，在实际的业务场景中，在任何地方都可能会有人员点击，可以直接发送消息
    getContacts(val) {
      this.allContacts = val;
    },
    isCollapse(val){
      if(val){
        this.asideWidth = '65px'
      }else{
        this.asideWidth = '200px'
      }
    }
  },
  mounted() {
    this.active = this.$route.path;
    const route = this.$router.options.routes.filter(route => route.name=='manage');
    this.routes = route[0].children;
  },
  methods: {
    handleMenuSelect(index) {
      this.active = index
      if(this.$route.path == index) return;
      this.$router.push(index)
    },
    showMessageBox() {
      this.dialogTableVisible
        ? (this.dialogTableVisible = false)
        : (this.dialogTableVisible = true);
    }
  }
};
</script>
<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  img{
    width: 40px;
    height: 40px;
    overflow: hidden;
  }
}

.text-center {
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.text-right {
  text-align: right;
}

.user {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.avatar {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.message {
  margin-right: 20px;
  cursor: pointer;
}

.username {
  margin-left: 5px;
}

.main-aside{
  width:200px;
  border-right:1px solid #e6e6e6;
  display: flex;
  flex-flow: column;
  flex-shrink: 0;
  transition: width .2s;
  .aside-menu{
    overflow: auto;
    overflow-x: hidden;
    flex: 1;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
    max-height: calc(100vh - 112px);
  }
  .aside-bottom{
    border-top: 1px solid #ebeef5;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>