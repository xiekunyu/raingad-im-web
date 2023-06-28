<template>
    <div class="m-20">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 基础设置</span>
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
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :auto-upload="false"
                      :on-success="handleAvatarSuccess"
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
                          <el-button slot="append">复制链接</el-button>
                      </el-input>
                      <div class="mt-15">
                          <span class="c-999 f-12 mr-10">邀请链接有效期：48小时</span> <el-button >重新生成</el-button>
                      </div>
                      
                      <vue-qr ref="qrCode" :text="inviteUrl" width="200" height="200" :logoSrc="logo"></vue-qr>
                  </div>
              </el-form-item>
              <el-form-item label="系统状态" prop="state">
                  <el-switch v-model="sysInfo.state"></el-switch>
                  <div v-show="!sysInfo.state">
                      <span class="mr-10 c-999 f-12">关闭提示语</span>
                      <el-input placeholder="请输入系统关闭后的提示语" type="textarea" v-model="sysInfo.closeTips"></el-input>
                  </div>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('sysInfo')">保存</el-button>
              </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="聊天设置">
          <el-form :model="chatInfo" :rules="rules" ref="chatInfo" label-width="120px" class="demo-chatInfo">
              <el-form-item label="允许用户私聊"  prop="simpleChat">
                  <el-switch v-model="chatInfo.simpleChat"></el-switch>
                  <span class="ml-10 c-999 f-12">关闭后，用户将无法私聊</span>
              </el-form-item>
              <el-form-item label="允许用户建群" prop="groupChat">
                  <el-switch v-model="chatInfo.groupChat"></el-switch>
                  <span class="ml-10 c-999 f-12">关闭后，用户将无法创建群聊</span>
              </el-form-item>
              <el-form-item label="开启在线状态" prop="online">
                  <el-switch v-model="chatInfo.online"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，用户可以看到联系人的在线状态</span>
              </el-form-item>
              <el-form-item label="消息自动清理"  prop="msgClear">
                  <el-switch v-model="chatInfo.msgClear"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，将会自动删除系统内的聊天记录</span>
                  <div v-show="chatInfo.msgClear">
                      <span class="c-999 f-12">消息最大保留天数</span> 
                      <el-input v-model="chatInfo.msgClearDay" type="text" class="ml-10" style="width:120px"></el-input>
                      <span class="ml-10 c-999 f-12">系统在每日凌晨2点自动清理消息</span>
                  </div>
              </el-form-item>
              <el-form-item label="音视频通话" prop="webrtc">
                  <el-switch v-model="chatInfo.webrtc"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，可以进行音视频通话，仅支持1对1音视频</span>
                  <div v-show="chatInfo.webrtc">
                      <span class="c-999 f-12">stun服务器</span> 
                      <el-input type="text"  placeholder="请输入stun服务器" v-model="chatInfo.stun" class="ml-10" style="width:300px"></el-input>
                      <span class="ml-10 c-999 f-12">音视频通话需要有Stun服务器才可以进行</span>
                  </div>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('chatSet')">保存</el-button>
              </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="邮件SMTP设置">
          <el-form :model="smtp" :rules="rules" ref="smtp" label-width="120px"  style="width:500px">
              <el-form-item label="邮件服务器" prop="host">
                  <el-input v-model="smtp.host" placeholder="请输入邮件服务器，如：smtp.mail.qq.com"></el-input>
              </el-form-item>
              <el-form-item label="端口号" prop="port">
                  <el-input v-model="smtp.port" style="width:80px"></el-input>
              </el-form-item>
              <el-form-item label="发件人邮箱"  prop="email">
                  <el-input v-model="smtp.email" placeholder="请输入发件人的邮箱"></el-input>
              </el-form-item>
              <el-form-item label="发件人密码" prop="password">
                  <el-input v-model="smtp.password" show-password  placeholder="请输入发件人的面"></el-input>
              </el-form-item>
              <el-form-item label="发件人签名" prop="sign">
                  <el-input v-model="smtp.sign" placeholder="请输入发件人签名"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('smtp')">保存</el-button>
              </el-form-item>
              <el-form-item label="测试邮件">
                  <el-input placeholder="请输入邮件地址" v-model="textEmail" class="input-with-select">
                      <el-button slot="append" icon="el-icon-s-promotion">发送</el-button>
                  </el-input>
              </el-form-item>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="文件上传设置">
          <el-form :model="fileUpload" :rules="rules" ref="fileUpload" label-width="120px"  style="width:500px">
              <el-form-item label="上传位置" prop="disk">
                  <el-radio-group v-model="fileUpload.disk">
                  <el-radio label="1" border>本地</el-radio>
                  <el-radio label="2" border>阿里云OSS</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item v-show="fileUpload.disk==2" label="阿里云配置">
                  <div>
                    <span  class="mr-10 c-999 f-12">accessId</span> <el-input placeholder="请输入阿里云OSS平台的accessId" v-model="fileUpload.aliyun.size"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">accessSecret</span> <el-input placeholder="请输入阿里云OSS平台的accessSecret" v-model="fileUpload.aliyun.size"></el-input>
                  </div>
                  <div>
                    <span  class="mr-10 c-999 f-12">endpoint</span> <el-input placeholder="请输入阿里云OSS平台的endpoint" v-model="fileUpload.aliyun.size"></el-input>
                  </div>
              </el-form-item>
              <el-form-item label="文件预览地址" prop="preview">
                  <el-input v-model="fileUpload.preview"  placeholder="请输入文件预览的地址，若无则使用默认预览工具"></el-input>
              </el-form-item>
              <el-form-item label="文件大小限制"  prop="size">
                  <el-input v-model="fileUpload.size" style="width:80px;"></el-input> <span class="ml-10 c-999 f-12">MB</span>
              </el-form-item>
              <el-form-item label="文件格式限制" prop="fileExt">
                  <el-select
                      v-model="fileUpload.fileExt"
                      multiple
                      filterable
                      allow-create
                      default-first-option
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
import VueQr from 'vue-qr';
import logo from '@/assets/img/logo.png';
export default {
    components: {
        VueQr
    },
    data() {
      return {
        logo,
        sysInfo: {
          name: '',
          description: '',
          logo: '',
          regtype: '1',
          state:true,
          closeTips:''
        },
        chatInfo: {
          simpleChat: true,
          groupChat: true,
          online: '',
          msgClear: true,
          msgClearDay: 0,
          webrtc:true,
          stun:''
        },
        smtp:{
            host:'',
            port:465,
            email:'',
            password:'',
            sign:''
        },
        fileUpload:{
            disk:'1',
            aliyun:{
                accessId:'',
                accessSecret:'',
                endpoint:''
            },
            preview:'',
            size:'',
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
          logo: [
            { required: true, message: '请上传LOGO', trigger: 'change' }
          ],
          description: [
            { required: true, message: '请输入系统描述', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleAvatarSuccess(res, file) {
        this.sysInfo.logo = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        console.log(file)
        
        return isJPG && isLt2M;
      },
      change(file,fileList) {
        this.sysInfo.logo = URL.createObjectURL(file.raw);
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
  