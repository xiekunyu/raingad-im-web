# IM即时聊天

#### 介绍
IM前端代码，需要配合后端使用，本软件主要用于学习交流，开发的初衷旨在快速建立企业内部通讯系统，不能用于商业用途。

后端传送门：https://gitee.com/raingad/im-instant-chat

体验地址：http://im.raingad.com/index.html

账号：13800000002  密码：123456

······手机尾号2-9都是

账号：13800000009  密码：123456

#### 支持功能

1. 单聊和群聊，新增消息管理器

2. 支持发送表情、图片、语音、视频和文件消息

3. 单聊支持消息已读未读的状态显示

4. 支持设置新消息声音提醒，浏览器通知

5. 支持部分Lemon-imui内功能设置

6. 支持文件、图片和绝大部分媒体文件在线预览

7. 群聊创建、删除和群成员管理、群公告、群禁言等

8. 可以置顶联系人，所有联系人可以设置消息免打扰
   
9.  全新支持增加音视频通话


> 移动端版本正在开发中哦，敬请期待！

#### 最新更新

**2022年10月30日**
新增支持音视频通话

**2022年10月27日**

升级vue-cli2到vue-cli3
优化发送按键和换行键
修复bug

**2022年10月23日**

新增语音消息、视频消息
使用sass依赖替代node-sass（这东西太坑了）
修复若干bug

#### 软件架构

后端技术栈：`thinkphp6+workerman`

前端技术栈：`vue+Lemon-IMUI+element-UI`


#### 安装教程
1.  克隆代码到本地： 
``` 
git clone https://gitee.com/raingad/im-chat-front.git
```
2.  进入项目目录，执行： 
```
npm intsall
```
3.  开发调试
```
npm run serve
```

4.  构建
```
npm run build
```
#### 音视频通话组件

> 音视频通话是一个独立的组件，暂时未开源，源码js部分已经加密，仅用于效果展示和学习，不可以将组件用到其他项目，如果需要源码，请进行捐赠并向作者（进交流群）索取未加密的源码。开源不易，捐赠金额：200元！

###### 使用方法

引入组件
``` javascript
import webrtc from "@/components/webrtc";
```
注册组件

``` javascript
export default {
  name: "app",
  components: {
    webrtc
  },
```
使用组件
``` javascript
<webrtc :contact="currentChat" :config="webrtcConfig" alias="raingad" :userInfo="user" ref="webrtc" :key="componentKey"></webrtc>
```

###### 组件参数

|  参数 | 类型 | 备注 |
| --------- | ---- | ---- |
| contact    | 对象 |   当前窗口的联系人   |
| userInfo | 对象 |   当前登录用户   |
| config    | 对象 |  peer的配置信息，用于点对点传输    |
| alias    | 字符串 |   用于生成唯一通讯id的前缀   |

###### 组件方法
``` javascript
//参数为true时表示视频通话，为false时为语音通话。
this.$refs.webrtc.called(true);
```

#### 交流群
如果有什么问题，请留言，或者加入我们的QQ群！

创作不易，点个star吧

[QQ 交流群：336921267](https://jq.qq.com/?_wv=1027&k=jMQAt9lh).

