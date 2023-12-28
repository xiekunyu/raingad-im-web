<template>
  <div class="login-wrapper" :style="'background-image:url('+ Background +')'">
    <div class="form-box">
      <div class="form-title">
        <img :src="globalConfig.sysInfo.logo ? globalConfig.sysInfo.logo : $packageData.logo" width="100" alt="icon">
        <!-- <p>Raingad-IM 账号登录</p> -->
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="0px" class="login-form">
        <el-form-item prop="account">
          <el-input ref="account" v-model="loginForm.account" type="text" auto-complete="off" placeholder="请输入账号" prefix-icon="el-icon-user" />
        </el-form-item>
        <el-form-item prop="password" v-show="!forget">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入密码" prefix-icon="el-icon-lock" @keyup.enter.native="handleLogin" />
        </el-form-item>
        <el-form-item prop="code" v-show="forget">
          <el-input
              placeholder="请输入验证码"
              maxlength="6"
              v-model="loginForm.code">
              <el-button slot="append" @click="sendCode()" :loading="coding">发送验证码</el-button>
            </el-input>
        </el-form-item>
        <div class="c-666" style="font-size:12px;" v-if="globalConfig.demon_mode">演示账号：13800000002~13800000020，密码:123456</div>
        <el-form-item>
          <div class="remenber">
            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
            <el-button type="text" @click="forget=!forget">{{forget ? '密码登陆'  : '忘记密码'}}</el-button>
          </div>
          
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" size="small" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          
        </el-form-item>
        <el-form-item v-if="globalConfig.sysInfo.regtype==1">
          <el-button size="small" style="width:100%;" plain @click="$router.push('/register')">
            注册
          </el-button>
        </el-form-item>
        <div align="center" class="c-999">{{globalConfig.sysInfo.name}} for {{$packageData.version}}</div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Background from '../assets/img/login-background.jpg'
import { mapState } from 'vuex';
import Lockr from 'lockr';
export default {
  name: 'Login',
  data() {
    return {
      Background,
      forget:false,
      loginForm: {
        account: '',
        password: '',
        code:'',
        rememberMe: true
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false,
      coding: false,
      redirect: undefined
    }
  },
  computed: {
    ...mapState({
      globalConfig: state => state.globalConfig
    })
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    forget(val){
      if(val){
        this.loginForm.password='123456';
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取url的参数
      let token=this.$route.query.token;
      if(token){
        return this.dologin({token:token});
      }
      // 如果是演示模式、获取1-20的随机数填充账号密码
      if(this.globalConfig.demon_mode){
        const random = Math.floor(Math.random() * 19 + 2)
        this.loginForm.account=13800000000+random;
        this.loginForm.password='123456';
        this.$refs.account.focus()
      };

      // 如果有记住密码、则填充
      const LoginAccount = Lockr.get('LoginAccount');
      if(LoginAccount){
        this.loginForm.account=LoginAccount.account;
        this.loginForm.password=LoginAccount.password;
        this.loginForm.rememberMe=true;
        this.$refs.account.focus()
      };
      
    })
  },
  methods: {
    handleLogin() {
      if(this.forget){
        if(!this.loginForm.code){
          this.$message.error('请输入验证码');
          return;
        }
      }
      this.$refs.loginForm.validate(valid => {
        const data = {
          account: this.loginForm.account,
          password: this.loginForm.password,
          code:this.loginForm.code
        }
        if(this.loginForm.rememberMe){
          Lockr.set('LoginAccount',data);
        }else{
          Lockr.rm('LoginAccount');
        }
        if (valid) {
          this.dologin(data);
        }
      })
    },
    dologin(data){
      this.loading = true
          this.$store
          .dispatch('Login', data)
          .then(res => {
            window.location.reload();
          })
        .catch(() => {
          this.loading = false
        })
    },
    sendCode(){
      if(!this.loginForm.account){
        this.$message.error('请输入账号');
        return;
      }
      this.coding=true;
      let data={
        account:this.loginForm.account,
        type:1
      }
      this.$store.dispatch('sendCode',data).then(res=>{
        this.$message.success('发送成功');
        this.coding=false;
      }).catch(()=>{
        this.coding=false;
      })
    }
  }
}
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-size: cover;
  .form-box {
    width: 300px;
    padding: 15px 30px 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 15px 30px 0 rgba(0, 0, 1, .1);
    .form-title {
      margin: 0 auto 35px;
      text-align: center;
      color: #707070;
      font-size: 18px;
      letter-spacing: 2px;
    }
  }
  .remenber{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
