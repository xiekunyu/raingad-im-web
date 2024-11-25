<template>
    <!-- 设置中心 -->
      <el-tabs tab-position="left" style="height: 100%;">
        <el-tab-pane label="账号设置" class="pd-20">
          <div class="user-center">
            <div class="user-avatar">
              <el-upload ref="upload" class="upload-demo" :multiple="false" :action="getUrl" :show-file-list='false'
                :data='{type:1}' :headers="getToken" :on-success="handleAvatarSuccess" :auto-upload="false" :on-change="change"
                :before-upload="before" :http-request="request">
                <el-image :src="user.avatar" style="width:160px;border-radius: 8px;overflow: hidden;" class="m-20"></el-image>
                <el-button size="mini" class="replace-picture-button mab-30">更换头像</el-button>
              </el-upload>
              <el-dialog title="头像剪裁" :close-on-click-modal="false" :visible.sync="cropperDialogVisible" width="580px" :append-to-body="true" :show-close="true"
                  @closed='$refs.upload.clearFiles()'>
                  <Cropper :key="componentsKey" :src="cropperImg" :compress="compress" :aspectRatio="aspectRatio" ref="cropper">
                  </Cropper>
                  <template #footer>
                    <el-button @click="cropperDialogVisible=false;$refs.upload.clearFiles()">取 消</el-button>
                    <el-button type="primary" @click="cropperSave">确 定</el-button>
                  </template>
                </el-dialog>
                <div class="mt-20">
                  <el-button type="warning" @click="editInfo(1)">修改密码</el-button>
                </div>
                
            </div>
            <div class="user-info">
              <el-form :model="user" ref="userinfo" label-width="100px">
                <el-form-item label="登陆账号" prop="account">
                    {{user.account}}
                    <span class="fc-primary ml-10 cur-handle" @click="editInfo(0)">修改</span>
                </el-form-item>
                <el-form-item label="姓名" v-if="$store.state.globalConfig.sysInfo.runMode==1 && $store.state.globalConfig.sysInfo.diyName!=1">
                    {{user.realname}}
                </el-form-item>
                <el-form-item label="昵称" v-else>
                    <el-input placeholder="请输入昵称" v-model="user.realname" maxlength="20" style="width:400px"></el-input>
                </el-form-item>
                <el-form-item label="e-mail">
                    <el-input placeholder="请输入邮箱地址" v-model="user.email" maxlength="120" style="width:400px"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="user.sex">
                      <el-radio :label="2" border>未知</el-radio>
                      <el-radio :label="1" border>男</el-radio>
                      <el-radio :label="0" border>女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="个性签名">
                  <el-input type="textarea" :rows="3" v-model="user.motto" maxlength="100" style="width:400px" show-word-limit></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-dialog
              :title="dialogTitle"
              :visible.sync="dialog"
              :modal="true"
              width="400px"
              append-to-body
            >
                <el-form label-width="100px">
                    <el-form-item label="当前账号">
                      {{user.account}}
                    </el-form-item>
                    <el-alert
                      class="mb-20"
                      title="验证账户的真实性，绑定后请使用新账户来重新登录！"
                      type="warning">
                    </el-alert>
                    <el-form-item label="验证码" v-if="user.is_auth">
                      <el-input
                          placeholder="请输入验证码"
                          maxlength="6"
                          style="width: 260px"
                          v-model="code">
                          <el-button slot="append" @click="sendCode(true)" :loading="loading">发送验证码</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="原密码" v-if="editPass &&  (!globalConfig.sysInfo.regauth || !user.is_auth)">
                      <el-input v-model="originalPassword"  show-password placeholder="请输入原来的密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新账号" v-if="!editPass">
                      <el-input v-model="account" placeholder="请输入新的账号"></el-input>
                    </el-form-item>
                    <el-form-item label="新账号验证码" v-if="!editPass">
                      <el-input
                          placeholder="请输入新账号验证码"
                          maxlength="6"
                          style="width: 260px"
                          v-model="newCode">
                          <el-button slot="append" @click="sendCode(false)" :loading="loading">发送验证码</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="新密码" v-if="editPass">
                      <el-input v-model="password" show-password  placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="重复密码" v-if="editPass">
                      <el-input v-model="repass" show-password  placeholder="请输入重复输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="editPassword()">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
          <div class="mt-40" align="center">
            <el-button type="danger" @click="logout"  plain round style="width:150px;">退出登录</el-button>
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
        <el-tab-pane label="关于 IM" class="pd-20" v-if="parseInt(globalConfig.demon_mode)==1">
          <div class="about-logo">
            <el-avatar :src="$packageData.logo" :size="50"></el-avatar>
            <br /><br />
            <p>
              <span class="fc-primary"> {{ $packageData.name }} </span>for {{ $packageData.version }}
            </p>
          </div>
          <div class="setting-version">
            <b> 已经支持功能：</b>
            <p v-for="item in $packageData.funcList" :key="item.icon"><i :class="item.icon"></i> {{ item.text }}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="开源" class="pd-20" v-if="parseInt(globalConfig.demon_mode)==1">
          <div  class="about-logo">
            <el-avatar :src="$packageData.logo" :size="50"></el-avatar>
            <br /><br />
            <p>
              <span class="fc-primary"> {{ $packageData.name }} </span>for {{ $packageData.version }}
            </p>
          </div>
          <!-- <div class="setting-version">
            <b> 即将支持功能：</b>
            <p>1、解散群聊、群公告设置、群功能设置</p>
          </div> -->
          <div class="setting-version">
            <p>
              前端地址：<a
                class="fc-primary"
                :href="$packageData.frontUrl"
                target="_blank">[链接] im-chat-front</a>
            </p>
            <p>
              后端地址：<a
                class="fc-primary"
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
                class="fc-primary"
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
import Cropper from "@/components/cropper/index.vue";
import { Dialog } from "element-ui";
export default {
    name: "manageGroup",
    props: {
    },
    components: {
        Cropper,
    },
    data() {
        return {
          componentsKey: 1,
          maxSize: 5,
          compress: 1,
          aspectRatio: 1 / 1,
          cropperDialogVisible: false,
          cropper: true,
          cropperImg: '',
          tempImg: '',
          dialogVisible: false,
          dialog: false,
          dialogTitle: '修改密码',
          editPass:1,
          originalPassword:'',
          account: '',
          password: '',
          repass: '',
          code: '',
          newCode:'',
          loading: false,
          
        };
    },
    computed: {
        ...mapState({
            setting: (state) => state.setting,
            user: (state) => state.userInfo,
            globalConfig: state => state.globalConfig
        }),
        getUrl () {
          return window.BASE_URL + '/common/upload/uploadAvatar'
        },
        getToken () {
          const authKey = Lockr.get('authToken');
          return { Authorization: authKey }
        },
    },
    watch: {
        // 监听设置发送变化需要进行设置更改
        setting: {
            handler(newValue, oldValue) {
                this.$api.imApi.settingAPI(newValue);
                let user = Lockr.get("UserInfo");
                user.setting = newValue;
                Lockr.set("UserInfo", user);
            },
            deep: true,
        },
        editPass(val){
          if(val==1){
            this.dialogTitle = '修改密码';
          }else{
            this.dialogTitle = '修改账号';
          }
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
                    this.$store.dispatch("LogOut").then(() => {
                        this.$router.push("/login");
                    })
                })
                .catch(() => {});
        },
        submitForm(){
          if(this.user.realname == ''){
            this.$message.error('请输入昵称')
            return false
          }
          let params={
            realname:this.user.realname,
            email:this.user.email,
            sex:this.user.sex,
            motto:this.user.motto
          }
          this.$api.imApi.updateUserInfo(params).then(res=>{
            if(res.code == 0){
              this.$message.success('修改成功');
              let data=JSON.parse(JSON.stringify(this.user))
              this.$store.commit("SET_USERINFO", data)
            }
          })

        },
        // 是否为图片
        isImg (fileUrl) {
          var strRegex = "(.jpg|.png|.gif|.jpeg)$";
          var re = new RegExp(strRegex);
          if (re.test(fileUrl.toLowerCase())) {
            this.fileIsImg = true;
          } else {
            this.fileIsImg = false;
          }
        },
        // 选择图片后进行操作
        change (file) {
          if (this.cropper && file.status == 'ready') {
            this.isImg(file.name)
            if (!this.fileIsImg) {
              this.$message.error('选择的文件非图像类文件')
              return false
            }
            this.componentsKey++;
            this.cropperDialogVisible = true
            this.cropperImg = URL.createObjectURL(file.raw)
          }
        },
        // 选择图片的时候进行验证
        before (file) {
          file = this.cropper ? this.cropperUploadFile : file
          const maxSize = file.size / 1024 / 1024 < this.maxSize;
          if (!maxSize) {
            this.$message.warning(`上传文件大小不能超过 ${this.maxSize}MB!`);
            return false;
          }
          this.isImg(file.name)
          this.tempImg = URL.createObjectURL(file);
        },
        // 上传图图片
        request (param) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
          });
          const data = new FormData();
          var file = this.cropper ? this.cropperUploadFile : param.file
          data.append("file", file);
          data.append("type", 1);
          this.$api.commonApi.uploadAvatar(data).then(res => {
            this.cropperImg = '';
            loading.close();
            this.handleAvatarSuccess(res)
            param.onSuccess(res)
          }).catch(err => {
            loading.close();
            param.onError(err)
          })
        },
        // 保存裁剪图片并上传
        cropperSave () {
          var uploadFile = this.$refs.upload.uploadFiles[0].raw
          this.$refs.cropper.getCropFile(file => {
            this.cropperUploadFile = file
            this.$refs.upload.submit()
            this.cropperDialogVisible = false
          }, uploadFile.name, uploadFile.type)

        },
        handleAvatarSuccess (res, file) {
          let data = this.$store.state.userInfo
          this.$set(data, 'avatar', res.data)
          this.$store.commit("SET_USERINFO", data)
        },
        editInfo(edit){
          this.dialog=true;
          this.editPass=edit;
        },
        // 修改密码
        editPassword(){
          if(this.code=='' && this.user.is_auth){
              this.$message({
                message: '请输入验证码',
                type: 'warning'
              });
              return false;
          }
          if(this.editPass){
            if(this.password=='' || this.password.length<6 || this.password.length>16){
                this.$message({
                  message: '请输入6-16个字符串的密码',
                  type: 'warning'
                });
                return false;
            }
            if(this.password!=this.repass){
                this.$message({
                  message: '两次密码不一致',
                  type: 'warning'
                });
                return false;
            }
            if(!this.originalPassword){
                this.$message({
                  message: '请输入原密码',
                  type: 'warning'
                });
                return false;
            }
            let params = {
                password:this.password,
                code:this.code,
                originalPassword:this.originalPassword
            }
            this.$api.imApi.editPassword(params).then(res=>{
                if(res.code==0){
                  this.dialog = false;
                  this.password = '';
                  this.repass = '';
                  this.$message({
                      message: res.msg,
                      type: 'success'
                  });
                }
            })
          }else{
            if(this.account==''){
                this.$message({
                  message: '请输入账号',
                  type: 'warning'
                });
                return false;
            }
            if(this.newCode==''){
                this.$message({
                  message: '请输入新账户验证码',
                  type: 'warning'
                });
                return false;
            }
            let params = {
                account:this.account,
                code:this.code,
                newCode:this.newCode
            }
            this.$api.imApi.editAccount(params).then(res=>{
                if(res.code==0){
                  this.dialog = false;
                  this.account = '';
                  this.code = '';
                  this.newCode = '';
                  this.$message({
                      message: res.msg,
                      type: 'success'
                  });
                  this.$store.dispatch("LogOut").then(() => {
                        this.$router.push("/login");
                    })
                }
            })
          }
          
        },
        sendCode(e){
          let account=e ? this.user.account : this.account;
          let type = this.editPass ? 3 : 4;
          if(account==''){
            this.$message({
              message: '请输入新的账号',
              type: 'warning'
            });
            return false;
          }
          this.loading = true;
          this.$store.dispatch('sendCode',{type:type,account:account}).then(res=>{
            this.$message.success('发送成功');
            this.loading=false;
          }).catch(()=>{
            this.loading=false;
          })
        }
    },
    
};
</script>
<style lang="scss" scoped>
.user-center{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    .user-avatar{
      width:240px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
    }
    .user-info{
      flex:1;
    }
}
.setting-switch {
  margin: 0 30px 20px;
}

.setting-version {
  margin: 10px 20px;
  line-height: 2;
}

.fc-primary {
  color: #409eff;
}

.about-logo {
  text-align: center;
  width:200px;
}
::v-deep .el-tabs__nav{
  margin-top:20px;
  width:120px;
}
</style>