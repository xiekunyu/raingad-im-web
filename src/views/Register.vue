<template>
  <div class="login-wrapper" :style="'background-image:url('+ Background +')'">
    <div class="form-box">
      <div class="form-title">
        <div class="f-14 cur-handle" @click="$router.push('/login')"> <i class="el-icon-back">返回</i></div> 
        <div class="mr-40"><b>注册用户</b> </div>
        <div> </div>
      </div>
      <el-form ref="regForm" :model="regForm" :rules="loginRules" label-width="0px" class="login-form">
        <el-form-item prop="account">
          <el-input ref="account" v-model="regForm.account" type="text" auto-complete="off" placeholder="请输入账号:手机/邮箱" prefix-icon="el-icon-user"  @input="handleInput" />
        </el-form-item>
        <el-form-item prop="realname">
          <el-input ref="realname" v-model="regForm.realname" type="text" auto-complete="off" placeholder="请输入用户名/昵称" prefix-icon="el-icon-user" />
        </el-form-item>
        <el-form-item prop="code" v-if="globalConfig.sysInfo.regauth!=0">
          <el-input
              placeholder="请输入验证码"
              maxlength="6"
              v-model="regForm.code">
              <el-button slot="append" @click="sendCode(true)" :loading="loading">发送验证码</el-button>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="regForm.password" type="password" show-password auto-complete="off" placeholder="请输入密码" prefix-icon="el-icon-lock" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="regForm.repass" type="password" show-password auto-complete="off" placeholder="请再次输入密码" prefix-icon="el-icon-lock" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" size="small" type="primary" style="width:100%;" @click.native.prevent="handleRegist">
            <span v-if="!loading">注册</span>
            <span v-else>注 册 中...</span>
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
export default {
  name: 'Register',
  data() {
    return {
      Background,
      regForm: {
        account: '',
        realname: '',
        password: '',
        repass: '',
        code: ''
      },
      loginRules: {
            account: [
               { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
            ],
            realname: [
               { required: true, message: '请输入用户名/昵称', trigger: 'blur' },
               { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
            ],
            password: [
               { required: true, message: '请输入密码', trigger: 'blur' },
               { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
            ],
      },
      loading: false,
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
    }
  },
  mounted() {
    let regauth=this.globalConfig.sysInfo.regauth ?? 0;
    let msg='请输入账号：4-32个字符';
    switch(parseInt(regauth)){
      case 1:
        msg='请输入正确的手机号';
        break;
      case 2:
        msg='请输入正确的邮箱';
        break;
      case 3:
        msg='请输入正确的手机号或者邮箱';
        break;
      default:
        msg='请输入正确的账号';
    }
    let req={ required: true, message: msg, trigger: 'blur' };
    this.loginRules.account.push(req)
    let email={ type: 'email', message: msg, trigger: 'blur', validator: this.validateContact };
    let mobile={ type: 'phone', message: msg, trigger: 'blur', validator: this.validateContact };
    if(regauth==1){
      this.loginRules.account.push(mobile)
    }else if(regauth==2){
      this.loginRules.account.push(email)
    }else if(regauth==3){
      this.loginRules.account.push(email)
      this.loginRules.account.push(mobile)
    }
  },
  methods: {
    handleInput(value) {
      const filteredValue = value.replace(/[\u4e00-\u9fa5]/g, '');
      this.regForm.account = filteredValue;
    },
    validateContact(rule, value, callback) {
         if (!value) {
            callback();
         } else if (/^1[3456789]\d{9}$/.test(value) || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            callback();
         } else {
            callback(new Error('请输入正确的手机号或邮箱'));
         }
      },
    handleRegist() {
      this.$refs.regForm.validate(valid => {
        if(this.regForm.password != this.regForm.repass){
          this.$message.error('两次密码不一致')
          return false
        }
        const data = {
          account: this.regForm.account,
          realname: this.regForm.realname,
          password: this.regForm.password,
          code: this.regForm.code,
          inviteCode: this.$route.query.inviteCode ?? ''
        }
        if (valid) {
          this.loading = true
          this.$api.commonApi.register(data).then(res => {
            this.loading = false
            if (res.code === 0) {
              this.$message.success('注册成功')
              this.$router.push('/login')
            }
          }).catch(err => {
            this.loading = false
          })
        }else{
          return this.$message.error('请检查输入项');
        }
      })
    },
    sendCode(){
      if(!this.regForm.account){
        this.$message.error('请输入账号');
        return;
      }
      this.coding=true;
      let data={
        account:this.regForm.account,
        type:2
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

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-size: cover;
  .form-box {
    width: 240px;
    padding: 15px 30px 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 15px 30px 0 rgba(0, 0, 1, .1);
    .form-title {
      margin: 0 auto 35px;
      color: #707070;
      font-size: 18px;
      letter-spacing: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
