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
                      
                      <vue-qr ref="qrCode" :text="inviteUrl" width="200" height="200" :logoSrc="sysInfo.logo"></vue-qr>
                  </div>
              </el-form-item>
              <el-form-item label="注册时间间隔" prop="registerInterval">
                <el-input-number class="ml-10" v-model="sysInfo.registerInterval" :min="0" :step="60"></el-input-number>
                <span class="ml-10 c-999 f-12">秒，0表示不限制，防止用户无限注册，仅限单IP</span>
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
              <el-form-item label="多端同时登录" prop="multipleLogin">
                  <el-radio-group v-model="sysInfo.multipleLogin">
                  <el-radio label="0" border>关闭</el-radio>
                  <el-radio label="1" border>开启</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="运行模式" prop="runMode">
                  <el-radio-group v-model="sysInfo.runMode">
                  <el-radio label="1" border>企业模式</el-radio>
                  <el-radio label="2" border>社交模式</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="自由改名" prop="diyName" v-show="sysInfo.runMode==1">
                  <el-radio-group v-model="sysInfo.diyName">
                  <el-radio label="0" border>关闭</el-radio>
                  <el-radio label="1" border>开启</el-radio>
                  </el-radio-group>
                  <span class="ml-10 c-999 f-12">企业模式下默认不允许自由改名，开启后生效</span>
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
              <el-form-item label="群聊最多人数" prop="groupUserMax">
                <el-input-number class="ml-10" v-model="chatInfo.groupUserMax" :min="0" :max="1000"></el-input-number>
                <span class="ml-10 c-999 f-12">人，0表示不限制，不建议超过300人</span>
              </el-form-item>
              <el-form-item label="开启在线状态" prop="online">
                  <el-switch v-model="chatInfo.online" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，用户可以看到联系人的在线状态</span>
              </el-form-item>
              <el-form-item label="消息发送频率" prop="sendInterval">
                <el-input-number class="ml-10" v-model="chatInfo.sendInterval" :min="0" :max="1000"></el-input-number>
                <span class="ml-10 c-999 f-12">秒，0表示不限制，防止用户刷消息</span>
              </el-form-item>
              <el-form-item label="消息撤回时间" prop="redoTime">
                <el-input-number class="ml-10" v-model="chatInfo.redoTime" :min="0" :max="86400"></el-input-number>
                <span class="ml-10 c-999 f-12">秒，0表示不支持撤回</span>
              </el-form-item>
              <el-form-item label="消息双向删除" prop="dbDelMsg">
                  <el-switch v-model="chatInfo.dbDelMsg" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，用户删除消息会删除双方，仅限删除自己发送的</span>
              </el-form-item>
              <el-form-item label="消息自动清理"  prop="msgClear">
                  <el-switch v-model="chatInfo.msgClear" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，将会自动删除系统内的聊天记录</span>
                  <div v-show="chatInfo.msgClear==1">
                      <span class="c-999 f-12">消息最大保留天数</span> 
                      <el-input-number class="ml-10" v-model="chatInfo.msgClearDay" :min="0" :max="1000"></el-input-number>
                      <span class="ml-10 c-999 f-12">系统在每日凌晨2点自动清理该天数以前的消息</span>
                  </div>
              </el-form-item>
              <el-form-item label="自动添加客服" prop="autoAddUser">
                <el-switch v-model="chatInfo.autoAddUser.status" active-value="1" inactive-value="0"></el-switch>
                <span class="ml-10 c-999 f-12">开启后，用户注册之后自动设置为专属客服。</span>
                <div class="mt-10" v-show="chatInfo.autoAddUser.status=='1'">
                  <div class="lz-flex">
                    <span class="c-999 f-12">客服人员：</span> 
                    <user-select :width="'300px'"  v-model="chatInfo.autoAddUser.user_items" @change="changeUser"></user-select>
                    <span class="ml-10 c-999 f-12">如果选择多个则循环设置</span>
                  </div>
                  <div class="mt-10">
                    <span class="c-999 f-12">欢迎语</span> 
                    <el-input v-model="chatInfo.autoAddUser.welcome" type="text" class="ml-10" style="width:300px"></el-input>
                    <span class="ml-10 c-999 f-12">通过客服自动发送给新注册的人员</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="自动加入群聊" prop="autoAddGroup">
                <el-switch v-model="chatInfo.autoAddGroup.status" active-value="1" inactive-value="0"></el-switch>
                <span class="ml-10 c-999 f-12">开启后，用户注册之后自动加入群聊。</span>
                <div v-show="chatInfo.autoAddGroup.status=='1'">
                  <div class="mt-10">
                    <span class="c-999 f-12">群聊名称</span> 
                    <el-input type="text"  placeholder="请输入群聊名称" v-model="chatInfo.autoAddGroup.name" class="ml-10" style="width:180px"></el-input>
                    <span class="ml-10 c-999 f-12">自动生成群聊名称</span>
                  </div>
                  <div class="lz-flex mt-10">
                     <span class="c-999 f-12">默认群主：</span> 
                     <user-select :width="'180px'" :radio="true" v-model='chatInfo.autoAddGroup.owner_uid' @change="changeOwner" ></user-select>
                     <span class="ml-10 c-999 f-12">选择后将自动设置为默认群主</span>
                  </div>
                  <div class="mt-10">
                    <span class="c-999 f-12">群聊成员上限：</span> 
                    <el-input-number v-model="chatInfo.autoAddGroup.userMax" :min="5" :max="1000"></el-input-number>
                    <span class="ml-10 c-999 f-12">达到上限后自动创建新的群聊</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="音视频通话" prop="webrtc">
                  <el-switch v-model="chatInfo.webrtc" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">开启后，可以进行音视频通话，仅支持1对1音视频</span>
                  <div v-show="chatInfo.webrtc==1">
                    <div class="mt-15">
                        <span class="c-999 f-12">turn服务器</span> 
                        <el-input type="text"  placeholder="请输入stun服务器" v-model="chatInfo.stun" class="ml-10" style="width:300px"></el-input>
                        <span class="ml-10 c-999 f-12">音视频通话需要有Stun服务器才可以进行，请加`turn:`协议头</span>
                    </div>
                    <div class="mt-15">
                        <span class="c-999 f-12">turn用户名</span> 
                        <el-input type="text"  placeholder="请输入stun用户名" v-model="chatInfo.stunUser" class="ml-10" style="width:300px"></el-input>
                        <span class="ml-10 c-999 f-12">如果是公开的则可以不填写</span>
                    </div>
                    <div class="mt-15">
                        <span class="c-999 f-12">turn密码</span> 
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
          <el-alert
            class="mb-20"
              title="系统支持短信验证码，请到项目：[根目录/config/sms.php] 中配置短信开放平台的参数，支持阿里云、腾讯云、七牛云、又拍云、Ucloud和华为云。"
              type="warning">
          </el-alert>
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
                    <span  class="mr-10 c-999 f-12">bucket</span> <el-input placeholder="请输入腾讯云平台的bucket" v-model="fileUpload.qcloud.bucket"></el-input>
                  </div>
                  <div>
                    <span class="mr-10 c-999 f-12">cdn</span> <el-input placeholder="请输入腾讯云平台的域名" v-model="fileUpload.qcloud.cdn"></el-input>
                  </div>
              </el-form-item>
              <el-form-item label="文件预览地址" prop="preview">
                  <el-input v-model="fileUpload.preview"  placeholder="请输入文件预览的地址，若无则使用默认预览工具"></el-input>
              </el-form-item>
              <el-form-item label="文件大小限制"  prop="size">
                <el-input-number v-model="fileUpload.size" :min="0" :max="500" label=""></el-input-number> <span class="ml-10 c-999 f-12">MB</span>
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
                      v-for="(item,index) in options"
                      :key="index"
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
        <el-tab-pane>
          <span slot="label"><i class="el-icon-discover"></i> 探索设置</span>
          <el-alert
              class="mb-15"
                show-icon
                :closable="false"
                title="应用内的链接一定要是 '/' 开头，外部URL需要带协议头，以 '/' 结尾；图标、名称、链接为必填项，如果没填写则无法保存。该功能只对移动端有效！"
                type="warning">
          </el-alert>
          
          <el-form :model="compass" :rules="compassRules" ref="compass" label-width="120px">
              <el-form-item label="开启探索">
                  <el-switch v-model="compass.status" active-value="1" inactive-value="0"></el-switch>
                  <span class="ml-10 c-999 f-12">关闭后，不显示探索页面</span>
              </el-form-item>
              <el-form-item label="展示模式">
                  <el-radio-group v-model="compass.mode">
                  <el-radio label="1" border>列表模式</el-radio>
                  <el-radio label="2" border>宫格模式</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="应用列表" >
                <div class="lz-flex lz-align-items-center lz-align-content-center">
                    <div class="ml-10" style="width:60px">图标</div>
                    <div style="width:130px">名称</div>
                    <div style="width:130px">类型</div>
                    <div style="width:310px">链接</div>
                    <div style="width:80px">排序</div>
                    <div style="width:60px">状态</div>
                    <div style="width:60px">操作</div>
                </div>
              </el-form-item>
              <el-form-item prop="list" v-for="(item,index) in compass.list" :key="index">
                <div class="lz-flex lz-align-items-center lz-align-content-center">
                  <el-upload
                        class="avatar-uploader mr-10"
                        :headers="getToken"
                        :action="getUrl"
                        :show-file-list="false"
                        :on-success="iconUploadSuccess.bind(null,index)"
                        style="width:50px;height:50px">
                        <img v-if="item.icon" :src="item.icon" style="width:50px;height:50px;" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" style="width:50px;height:50px;line-height: 50px;" ></i>
                        <el-input v-model="item.icon" style="display: none;"></el-input>
                  </el-upload>
                  <el-input class="mr-10" v-model="item.name" style="width:120px"></el-input>
                  <el-select class="mr-10" v-model="item.type" style="width:120px" placeholder="请选择应用类型">
                    <el-option label="应用内" value="1"></el-option>
                    <el-option label="外部URL" value="2"></el-option>
                  </el-select>
                  <el-input class="mr-10" v-model="item.url" style="width:300px"></el-input>
                  <el-input class="mr-10" v-model="item.order" style="width:80px"></el-input>
                  <el-switch v-model="item.status" active-value="1" inactive-value="0" style="width:60px"></el-switch>
                  <el-button type="danger" icon="el-icon-minus" circle @click="delAppItem(item)"></el-button>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="addAppItem">添加应用</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('compass')">保存</el-button>
              </el-form-item>
          </el-form>
          
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
<script>
import Lockr from 'lockr'
import VueQr from 'vue-qr';
import userSelect from '@/components/userSelect/index';
export default {
    components: {
        VueQr,
        userSelect
    },
    data() {
      return {
        loadding:false,
        sysInfo: {
          name: '',
          description: '',
          logo: '',
          regtype: '1',
          registerInterval:0,
          regauth: '2',
          ipregion: '1',
          runMode: '1',
          diyName: '0',
          state:true,
          closeTips:'',
          multipleLogin:'0'
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
          stunPass:'',
          sendInterval:'',
          redoTime:120,
          dbDelMsg:false,
          autoAddGroup:{
            status:0,
            userMax:'',
            owner_uid:'',
            owner_info:[],
            name:''
          },
          autoAddUser:{
            status:0,
            user_ids:[],
            user_items:[]
          }
        },
        smtp:{
            host:'',
            port:465,
            security:'ssl',
            addr:'',
            pass:'',
            sign:''
        },
        compass:{
          status:'1',
          mode:'1',
          list:[]
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
        inviteUrl:'',
        textEmail:'',
        rules: {
          name: [
            { required: true, message: '请输入系统名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
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
        },
        compassRules:{
          compassMode:[
            { required: true, message: '请选择展示模式', trigger: 'blur' }
          ],
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
                  if(item.value) this.sysInfo=Object.assign(this.sysInfo,item.value);
                  break;
                case 'chatInfo':
                  if(item.value) this.chatInfo=Object.assign(this.chatInfo,item.value);
                  break;
                case 'smtp':
                if(item.value) this.smtp=Object.assign(this.smtp,item.value);
                  break;
                case 'fileUpload':
                if(item.value) this.fileUpload=Object.assign(this.fileUpload,item.value);
                  break;
                case 'compass':
                if(item.value) this.compass=Object.assign(this.compass,item.value);
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
                  case 'compass':
                    let compass=this.compass;
                    let newList=compass.list.filter(item => item.name!='' && item.icon!='' && item.url!='');
                    compass.list=newList;
                    params.value=compass;
                    break;
              }
              // console.log(params);return;
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
        this.sysInfo.logo = res.data;
      },
      iconUploadSuccess(index, res, file) {
        this.compass.list[index].icon = res.data;
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
        
      },
      // 添加应用
      addAppItem(){
        let list=this.compass.list;
        list.push({
          id: 1,
          url: "",
          icon: "",
          name: "",
          type: '2',
          badge: 0,
          order: 0,
          status: '1'
        });
        this.compass.list=list;
      },
      // 删除应用
      delAppItem(item){
        var index = this.compass.list.indexOf(item)
        if (index !== -1) {
          this.compass.list.splice(index, 1)
        }
      },
      changeUser(values,item){
        this.chatInfo.autoAddUser.user_ids=values;
        this.chatInfo.autoAddUser.user_items=item;
      },
      changeOwner(values,item){
        this.chatInfo.autoAddGroup.owner_uid=values;
        this.chatInfo.autoAddGroup.owner_info=item;
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
  