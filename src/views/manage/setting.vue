<template>
    <div class="m-20">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-setting"></i> 基础设置</span>
          <el-form :model="sysInfo" :rules="rules" ref="sysInfo" label-width="120px" style="width:600px">
              <el-form-item label="系统名称" prop="name">
                  <el-input placeholder="请输入系统名称" v-model="sysInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="系统描述" prop="description">
                  <el-input placeholder="请输入系统描述" v-model="sysInfo.description"></el-input>
              </el-form-item>
              <el-form-item label="系统LOGO" prop="logo">
                  <el-upload
                      class="avatar-uploader"
                      :headers="getToken"
                      :action="getUrl"
                      :show-file-list="false"
                      :on-success="uploadSuccess"
                      :on-change="change"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="sysInfo.logo" :src="sysInfo.logo" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                      <el-input v-model="sysInfo.logo" style="display: none;"></el-input>
              </el-form-item>
              <el-form-item label="注册方式" prop="regtype">
                  <el-radio-group v-model="sysInfo.regtype">
                  <el-radio label="1" border>开启注册</el-radio>
                  <el-radio label="2" border>邀请注册</el-radio>
                  </el-radio-group>
                  <div class="mt-15" v-show="sysInfo.regtype==2">
                      <el-input v-model="inviteUrl" class="input-with-select">
                          <el-button slot="append" @click="copyUrl">复制链接</el-button>
                      </el-input>
                      <div class="mt-15">
                          <span class="c-999 f-12 mr-10">邀请链接有效期：48小时</span> <el-button @click="resetInviteUrl">重新生成</el-button>
                      </div>
                      
                      <vue-qr ref="qrCode" :text="inviteUrl" width="200" height="200" :logoSrc="logo"></vue-qr>
                  </div>
              </el-form-item>
              <el-form-item label="注册认证" prop="regauth">
                  <el-radio-group v-model="sysInfo.regauth">
                  <el-radio label="0" border>关闭</el-radio>
                  <el-radio label="1" border>手机号</el-radio>
                  <el-radio label="2" border>邮箱</el-radio>
                  <el-radio label="3" border>手机号+邮箱</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="开启IP定位" prop="ipregion">
                  <el-radio-group v-model="sysInfo.ipregion">
                  <el-radio label="0" border>关闭</el-radio>
                  <el-radio label="1" border>开启</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="运行模式" prop="regtype">
                  <el-radio-group v-model="sysInfo.runMode">
                  <el-radio label="1" border>企业模式</el-radio>
                  <el-radio label="2" border>社区模式</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="系统状态" prop="state">
                  <el-switch v-model="sysInfo.state" active-value="1" inactive-value="0"></el-switch>
                  <div v-show="sysInfo.state==0">
                      <span class="mr-10 c-999 f-12">关闭提示语</span>
                      <el-input placeholder="请输入系统关闭后的提示语" type="textarea" v-model="sysInfo.closeTips"></el-input>
                  </div>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('sysInfo')">保存</el-button>
              </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-chat-line-square"></i> 聊天设置</span>
          <el-form :model="chatInfo" :rules="chatRules" ref="chatInfo" label-width="120px" class="demo-chatInfo">
              <el-form-item label="允许用户私聊"  prop="simpleChat">
                  <el-switch v-model="chatInfo.simpleChat" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">关闭后，用户将无法私聊</span>
              </el-form-item>
              <el-form-item label="允许用户建群" prop="groupChat">
                  <el-switch v-model="chatInfo.groupChat" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">关闭后，用户将无法创建群聊</span>
              </el-form-item>
              <el-form-item label="群聊最多人数" prop="groupChat">
                <el-input v-model="chatInfo.groupUserMax" type="text" class="ml-10" style="width:120px"></el-input>
                  <span class="ml-10 c-999 f-12">人，0表示不限制</span>
              </el-form-item>
              <el-form-item label="开启在线状态" prop="online">
                  <el-switch v-model="chatInfo.online" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，用户可以看到联系人的在线状态</span>
              </el-form-item>
              <el-form-item label="消息自动清理"  prop="msgClear">
                  <el-switch v-model="chatInfo.msgClear" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，将会自动删除系统内的聊天记录</span>
                  <div v-show="chatInfo.msgClear==1">
                      <span class="c-999 f-12">消息最大保留天数</span> 
                      <el-input v-model="chatInfo.msgClearDay" type="text" class="ml-10" style="width:120px"></el-input>
                      <span class="ml-10 c-999 f-12">系统在每日凌晨2点自动清理该天数以前的消息</span>
                  </div>
              </el-form-item>
              <el-form-item label="音视频通话" prop="webrtc">
                  <el-switch v-model="chatInfo.webrtc" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，可以进行音视频通话，仅支持1对1音视频</span>
                  <div v-show="chatInfo.webrtc==1">
                    <div class="mt-15">
                        <span class="c-999 f-12">stun服务器</span> 
                        <el-input type="text"  placeholder="请输入stun服务器" v-model="chatInfo.stun" class="ml-10" style="width:300px"></el-input>
                        <span class="ml-10 c-999 f-12">音视频通话需要有Stun服务器才可以进行</span>
                    </div>
                    <div class="mt-15">
                        <span class="c-999 f-12">stun用户名</span> 
                        <el-input type="text"  placeholder="请输入stun用户名" v-model="chatInfo.stunUser" class="ml-10" style="width:300px"></el-input>
                        <span class="ml-10 c-999 f-12">如果是公开的则可以不填写</span>
                    </div>
                    <div class="mt-15">
                        <span class="c-999 f-12">stun密码</span> 
                        <el-input type="text"  placeholder="请输入stun服务器密码" v-model="chatInfo.stunPass" class="ml-10" style="width:300px"></el-input>
                        <span class="ml-10 c-999 f-12">如果是公开的则可以不填写</span>
                    </div>
                  </div>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('chatInfo')">保存</el-button>
              </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-message"></i> 邮件短信设置</span>
          <div class="m-20">
            <el-alert
              title="系统支持短信验证码，请到项目：[根目录/config/sms.php] 中配置短信开放平台的参数，支持阿里云、腾讯云、七牛云、又拍云、Ucloud和华为云。"
              type="warning">
            </el-alert>
          </div>
          <el-form :model="smtp" :rules="smtpRules" ref="smtp" label-width="120px"  style="width:500px">
              <el-form-item label="邮件服务器" prop="host">
                  <el-input v-model="smtp.host" placeholder="请输入邮件服务器，如：smtp.mail.qq.com"></el-input>
              </el-form-item>
              <el-form-item label="端口号" prop="port">
                <el-input-number v-model="smtp.port" :min="0" :max="99999"></el-input-number>
              </el-form-item>
              <el-form-item label="加密方式" prop="security">
                  <el-radio-group v-model="smtp.security">
                  <el-radio label="ssl" border>SSL</el-radio>
                  <el-radio label="tls" border>TLS</el-radio>
                  </el-radio-group>
              </el-form-item>
              
              <el-form-item label="发件人邮箱"  prop="addr">
                  <el-input v-model="smtp.addr" placeholder="请输入发件人的邮箱"></el-input>
              </el-form-item>
              <el-form-item label="发件人密码" prop="pass">
                  <el-input v-model="smtp.pass" show-password  placeholder="请输入发件人的密码"></el-input>
              </el-form-item>
              <el-form-item label="发件人签名" prop="sign">
                  <el-input v-model="smtp.sign" placeholder="请输入发件人签名"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('smtp')">保存</el-button>
              </el-form-item>
              <el-form-item label="测试邮件">
                  <el-input placeholder="请输入邮件地址" v-model="textEmail" class="input-with-select">
                      <el-button slot="append" icon="el-icon-s-promotion" @click="sendEmail"  :loading="loadding">发送</el-button>
                  </el-input>
              </el-form-item>
          </el-form>
          
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-upload"></i> 文件上传设置</span>
          <div class="mb-20">
            <el-alert
              title="一旦设置了储存位置，就不能再进行更改，否则之前的文件或者图片加载就会出错！此修改会变更环境变量中的参数，请慎重操作！"
              type="warning"
              show-icon
              :closable="false">
            </el-alert>
          </div>
          <el-form :model="fileUpload" :rules="fileRules" ref="fileUpload" label-width="120px"  style="width:600px">
              <el-form-item label="储存位置" prop="disk">
                  <el-radio-group v-model="fileUpload.disk">
                  <el-radio label="local" border>本地</el-radio>
                  <el-radio label="aliyun" border>阿里云</el-radio>
                  <el-radio label="qiniu" border>七牛云</el-radio>
                  <el-radio label="qcloud" border>腾讯云</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item v-show="fileUpload.disk=='aliyun'" label="阿里云配置">
                  <div>
                    <span  class="mr-10 c-999 f-12">accessId</span> <el-input placeholder="请输入阿里云OSS平台的accessId" v-model="fileUpload.aliyun.accessId"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">accessSecret</span> <el-input placeholder="请输入阿里云OSS平台的accessSecret" v-model="fileUpload.aliyun.accessSecret"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">endpoint</span> <el-input placeholder="请输入阿里云OSS平台的endpoint" v-model="fileUpload.aliyun.endpoint"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">bucket</span> <el-input placeholder="请输入阿里云OSS平台的bucket" v-model="fileUpload.aliyun.bucket"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">url</span> <el-input placeholder="请输入阿里云OSS平台的域名" v-model="fileUpload.aliyun.url"></el-input>
                  </div>
              </el-form-item>
              <el-form-item v-show="fileUpload.disk=='qiniu'" label="七牛云配置">
                  <div>
                    <span  class="mr-10 c-999 f-12">accessKey</span> <el-input placeholder="请输入七牛云平台的accessKey" v-model="fileUpload.qiniu.accessKey"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">secretKey</span> <el-input placeholder="请输入七牛云平台的secretKey" v-model="fileUpload.qiniu.secretKey"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">bucket</span> <el-input placeholder="请输入七牛云平台的bucket" v-model="fileUpload.qiniu.bucket"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">url</span> <el-input placeholder="请输入七牛云平台的域名" v-model="fileUpload.qiniu.url"></el-input>
                  </div>
              </el-form-item>
              <el-form-item v-show="fileUpload.disk=='qcloud'" label="腾讯云配置">
                  <div>
                    <span  class="mr-10 c-999 f-12">appId</span> <el-input placeholder="请输入腾讯云平台的appId" v-model="fileUpload.qcloud.appId"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">secretId</span> <el-input placeholder="请输入腾讯云平台的secretId" v-model="fileUpload.qcloud.secretId"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">secretKey</span> <el-input placeholder="请输入腾讯云平台的secretKey" v-model="fileUpload.qcloud.secretKey"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">region</span> <el-input placeholder="请输入腾讯云平台的region" v-model="fileUpload.qcloud.region"></el-input>
                  </div>
                  
                  <div>
                    <span  class="mr-10 c-999 f-12">bucket</span> <el-input placeholder="请输入腾讯云平台的bucket" v-model="fileUpload.qiniu.bucket"></el-input>
                  </div>
                  <div>
                    <span class="mr-10 c-999 f-12">cdn</span> <el-input placeholder="请输入腾讯云平台的域名" v-model="fileUpload.qiniu.cdn"></el-input>
                  </div>
              </el-form-item>
              <el-form-item label="文件预览地址" prop="preview">
                  <el-input v-model="fileUpload.preview"  placeholder="请输入文件预览的地址，若无则使用默认预览工具"></el-input>
              </el-form-item>
              <el-form-item label="文件大小限制"  prop="size">
                <el-input-number v-model="fileUpload.size" :min="0" :max="100" label=""></el-input-number> <span class="ml-10 c-999 f-12">MB</span>
              </el-form-item>
              <el-form-item label="文件格式限制" prop="fileExt">
                  <el-select
                      v-model="fileUpload.fileExt"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      style="width: 480px"
                      placeholder="请输入允许上传的文件格式">
                      <el-option
                      v-for="item in options"
                      :key="item"
                      :label="item"
                      :value="item">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('fileUpload')">保存</el-button>
              </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
<script>
import Lockr from 'lockr'
import VueQr from 'vue-qr';
import logo from '@/assets/img/logo.png';
export default {
    components: {
        VueQr
    },
    data() {
      return {
        logo,
        loadding:false,
        sysInfo: {
          name: '',
          description: '',
          logo: '',
          regtype: '1',
          regauth: '2',
          ipregion: '1',
          runMode: '1',
          state:true,
          closeTips:''
        },
        chatInfo: {
          simpleChat: true,
          groupChat: true,
          groupUserMax: 0,
          online:true,
          msgClear: true,
          msgClearDay: 0,
          webrtc:true,
          stun:'',
          stunUser:'',
          stunPass:''
        },
        smtp:{
            host:'',
            port:465,
            security:'ssl',
            addr:'',
            pass:'',
            sign:''
        },
        fileUpload:{
            disk:'local',
            aliyun:{
                accessId:'',
                accessSecret:'',
                endpoint:'',
                bucket:'',
                url:''
            },
            qiniu:{
                accessKey:'',
                secretKey:'',
                bucket:'',
                url:''
            },
            qcloud:{
                appId:'',
                secretId:'',
                secretKey:'',
                region:'',
                bucket:'',
                cdn:''
            },
            preview:'',
            size:0,
            fileExt:''
        },
        options:['jpg','png'],
        inviteUrl:'https://im.raingad.com/#/invite/JSYEHNSH233K',
        textEmail:'',
        rules: {
          name: [
            { required: true, message: '请输入系统名称', trigger: 'blur' },
            { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入系统描述', trigger: 'blur' }
          ]
        },
        chatRules:{
          groupUserMax:[
            { required: true, message: '请输入群组人数上限', trigger: 'blur' }
          ],
          msgClearDay:[
            { required: true, message: '请输入消息保存天数', trigger: 'blur' }
          ]
        },
        smtpRules:{
          host:[
            { required: true, pattern:'^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$', message: '请输入SMTP服务器地址', trigger: 'blur' }
          ],
          port:[
            { required: true,type: 'number',  message: '请输入SMTP服务器端口', trigger: 'blur' }
          ],
          addr:[
            { required: true, type: 'email',  message: '请输入SMTP邮箱', trigger: ['blur', 'change'] }
          ],
          pass:[
            { required: true, message: '请输入SMTP邮箱密码', trigger: 'blur' }
          ]
        },
        fileRules:{
          size:[
            { required: true, type: 'number',  message: '请输入文件大小限制', trigger: 'blur' }
          ],
          fileExt:[
            { required: true, message: '请输入文件格式限制', trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      getToken () {
        const authKey = Lockr.get('authToken');
        return { Authorization: authKey }
      },
      getUrl () {
        return window.BASE_URL + '/common/upload/uploadImage'
      }
    },
    mounted() {
      this.initConfig();
      this.resetInviteUrl();
    },
    methods: {
      initConfig(){
        this.$api.configApi.getAllConfig({}).then(res=>{
          if(res.code==0){
            res.data.forEach(item=>{
              switch(item.name){
                case 'sysInfo':
                  if(item.value) this.sysInfo=item.value;
                  break;
                case 'chatInfo':
                  if(item.value) this.chatInfo=item.value;
                  break;
                case 'smtp':
                if(item.value) this.smtp=item.value;
                  break;
                case 'fileUpload':
                if(item.value) this.fileUpload=item.value;
                  break;
              }
            }) 
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = {};
            params.name=formName;
              switch(formName){
                  case 'sysInfo':
                    params.value=this.sysInfo;
                    break;
                  case 'chatInfo':
                    params.value=this.chatInfo;
                    break;
                  case 'smtp':
                    params.value=this.smtp;
                    break;
                  case 'fileUpload':
                    params.value=this.fileUpload;
                    break;
              }
              this.$api.configApi.setConfig(params).then(res=>{
                if(res.code==0){
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      uploadSuccess(res, file) {
        console.log(res)
        this.sysInfo.logo = res.data;
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // console.log(file)
        
        // return isJPG && isLt2M;
      },
      change(file,fileList) {
        // this.sysInfo.logo = URL.createObjectURL(file.raw);
      },
      copyUrl(){
        this.$clipboard(this.inviteUrl)
        this.$message({
            message: '复制成功',
            type: 'success'
        });
      },
      resetInviteUrl(){
        this.$api.configApi.getInviteLink({}).then(res=>{
          if(res.code==0){
            this.inviteUrl=res.data;
          }
        })
      },
      sendEmail(){
        if(!this.textEmail){
          this.$message({
              message: '请输入邮箱地址',
              type: 'warning'
          });
          return;
        }
        this.loadding=true;
        this.$confirm('确定发送测试邮件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.configApi.sendTestEmail({email:this.textEmail}).then(res=>{
          this.loadding=false;
          this.textEmail='';
          if(res.code==0){
              this.$message({
                  message: res.msg,
                  type: 'success'
              });
            }
          })
        }).catch(() => {  
          this.loadding=false;       
        });
        
      }
    }
  }
  </script>
  <style scoped lang="scss">
    ::v-deep .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    ::v-deep .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    ::v-deep .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
  </style>
  