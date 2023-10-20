# IM即时聊天

### 介绍
Raingad-IM是一个开源的即时通信demo，需要前后端配合使用，主要用于学习交流，为大家提供即时通讯的开发思路，许多功能需要自行开发，开发的初衷旨在快速建立企业内部通讯系统、内网交流、社区交流。

|  类型 | 链接 |
| --------- | ---- |
| 前端源码    | https://gitee.com/raingad/im-chat-front |
| 后端源码 | https://gitee.com/raingad/im-instant-chat |
| web端演示 | http://im.raingad.com/index.html |
| 移动端H5演示 | http://im.raingad.com/h5 |
| 安卓APP演示 | https://emoji.raingad.com/file/raingad.apk |


体验账号：13800000002  密码：123456

尾号2、3、4......18、19、20 都是

体验账号：13800000020  密码：123456 

### 支持功能

- 支持单聊和群聊，支持发送表情、图片、语音、视频和文件消息
- 单聊支持消息已读未读的状态显示，在线状态显示
- 群聊创建、删除和群成员管理、群公告、群禁言等
- 支持置顶联系人，消息免打扰；
- 支持设置新消息声音提醒，浏览器通知
- 支持管理员撤回群成员消息
- 支持群成员不能互相添加好友
- 支持一对一音视频通话（已打通web端和移动端，小程序不支持）
- 支持文件、图片和绝大部分媒体文件在线预览
- 支持移动端（H5、APP和小程序，部分功能不兼容）
- 全新支持企业模式和社区模式，社区模式支持注册、添加好友功能
- APP支持单聊消息在线、离线推送（需要自行申请unipush服务）
- 支持简易后台管理，包括用户管理、群组管理、系统设置等

### 最新更新
请查看右侧发行版更新日志

### 软件架构

后端技术栈：`thinkphp6+workerman+redis`

前端技术栈：`vue2+Lemon-IMUI+element-UI`


### 安装教程
1.  克隆代码到本地： 
``` 
git clone https://gitee.com/raingad/im-chat-front.git
```
2.  进入项目目录，执行： 
```
npm install
```
3.  开发调试
```
npm run serve
```

4.  修改服务端域名

修改项目根目录下的 `.env.development` 文件，将VUE_APP_BASE_API的值改为自己的后端域名，构建后放服务端在运行时直接获取服务端的域名。


5.  构建
```
npm run build
```

6. 将打包好的文件(dist目录)里面的所有文件覆盖到后端的public目录下即可。

### 音视频通话组件
> 新的音视频通话组件已上线，完全开源，纯原生webrtc实现，不依赖任何第三方通讯组件，可以和移动端进行互通，这里就不在介绍了，自己看源码，下面将介绍旧版的音视频组件，采用的是peerjs组件。

> peer音视频通话是一个独立的组件（@/components/message/webrtc/peer.vue），仅支持点对点通话，JS部分已加密且未开源，仅用于效果展示和学习，也可以将组件用到其他项目，但是依赖于element-ui。如果需要未加密源码，请进行捐赠并向作者（进交流群）索取未加密的源码，捐赠金额：200元/次！

#### 使用方法

引入组件
``` javascript
//组件依赖于peerjs，需要在index.html中引入

 <script src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"></script>

// 在需要用到组件的地方导入组件，最好是全局的
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

#### 组件参数

|  参数 | 类型 | 备注 |
| --------- | ---- | ---- |
| contact    | 对象 |   当前窗口的联系人   |
| userInfo | 对象 |   当前登录用户   |
| config    | 对象 |  peer的配置信息，用于点对点传输    |
| alias    | 字符串 |   用于生成唯一通讯id的前缀   |

#### 组件方法

``` javascript
//参数为true时表示视频通话，为false时为语音通话。
this.$refs.webrtc.called(true);
```
#### 已知BUG
1、由于浏览器限制，如果登录进聊天系统没有进行过交互，音视频通话无法播放响铃，导致通话无法正常进行。

### 安装部署服务

服务器要求：
|  所需环境 | 版本 | 备注 | 推荐版本 |
| --------- | ---- | ---- | ---|
| linux    | >= 7.0 |  以下的版本未做测试   | 7.9 |
| nginx    | >= 1.17 |     | 最新的 |
| php | >= 7.1 |  不兼容8和7.4    | 7.3 |
| mysql    | >= 5.7 | 必须要5.7及以上     | 5.7 |
| redis    | >= 5.0 |     | 7.0 |
| workerman    | >= 4.0 |  用于消息服务部署  | 4.0 |

前端项目运行要求：

|  所需环境 | 版本 | 备注 |
| --------- | ---- | ---- |
| node    | >= 14.0.0 |  14以下的版本未做测试   |
| npm | >= 7.0.0 |      |


作者提供本系统的安装服务，包括后端和前端部署到线上，保证项目的完美运行，捐赠200元/次，如有需要可以进群联系作者！

### 交流群

如果有什么问题，请留言，或者加入我们的QQ群！

创作不易，点个star吧

[QQ 交流群：336921267](https://jq.qq.com/?_wv=1027&k=jMQAt9lh).

### 部分截图
![聊天界面](src/assets/img/qunliao.png)

![语音视频消息卡片](src/assets/img/shipinxmsg.png)

![音视频通话](src/assets/img/webrtccall.jpg)

![音视频通话](src/assets/img/webrtc.jpg)

![新朋友](src/assets/img/newfriend.png)

![资料修改](src/assets/img/setting.png)

![资料](src/assets/img/usercard.png)

![后台首页](src/assets/img/manage.png)

![后台设置](src/assets/img/managesetting.png)

![用户管理](src/assets/img/users.png)

![群聊管理](src/assets/img/groups.png)

![文件管理](src/assets/img/files.png)

