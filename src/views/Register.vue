<template>
  <div class="login-wrapper" :style="'background-image:url('+ Background +')'">
    <div class="form-box">
      <div class="form-title">
        <div class="f-14 cur-handle" @click="$router.push('/login')"> <i class="el-icon-back">返回</i></div> 
        <div class="mr-40"><b>注册用户</b> </div>
        <div> </div>
      </div>
      <el-form ref="regForm" :model="regForm" :rules="loginRules" label-width="0px" class="login-form">
        <el-form-item prop="username">
          <el-input ref="username" v-model="regForm.username" type="text" auto-complete="off" placeholder="请输入账号" prefix-icon="el-icon-user" />
        </el-form-item>
        <el-form-item prop="code">
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
        username: '',
        password: '',
        repass: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
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
    
  },
  methods: {
    handleRegist() {
      this.$refs.regForm.validate(valid => {
        if(this.regForm.password != this.regForm.repass){
          this.$message.error('两次密码不一致')
          return false
        }
        const data = {
          username: this.regForm.username,
          password: this.regForm.password,
          code: this.regForm.code,
          inviteCode: this.$route.query.inviteCode ?? ''
        }
        console.log(data);
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
        }
      })
    },
    sendCode(){
      if(!this.regForm.username){
        this.$message.error('请输入账号');
        return;
      }
      this.coding=true;
      let data={
        account:this.regForm.username,
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
