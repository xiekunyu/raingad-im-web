# IM即时聊天

### 介绍
Raingad-IM是一个开源的即时通信demo，需要前后端配合使用，主要用于学习交流，为大家提供即时通讯的开发思路，许多功能需要自行开发，开发的初衷旨在快速建立企业内部通讯系统、内网交流、社区交流。

|  类型 | 链接 |备注|
| --------- | ---- |---- |
| 前端源码（含后台管理）    | https://gitee.com/raingad/im-chat-front | 只维护后台管理 |
| 后端源码（已编译前端） | https://gitee.com/raingad/im-instant-chat |  |
| web端演示 | http://im.raingad.com/index.html |  |
| 移动端H5演示 | http://im.raingad.com/h5 |  |
| 桌面端/安卓端 | 请进前端演示页下载 |  持续更新 |

体验账号：13800000002  密码：123456

尾号2、3、4......18、19、20 都是

体验账号：13800000020  密码：123456 

### 支持功能

- 支持单聊和群聊，支持发送表情、图片、语音、视频和文件消息
- 单聊支持消息已读未读的状态显示，在线状态显示
- 群聊创建、删除和群成员管理、群公告、群禁言、@群成员等
- 支持置顶联系人，消息免打扰；
- 支持设置新消息声音提醒，浏览器通知
- 支持管理员撤回群成员消息，支持群成员不能互相添加好友
- 支持一对一音视频通话（已打通web端和移动端，小程序不支持）
- 支持文件、图片和绝大部分媒体文件在线预览
- 支持移动端（由uniapp开发，可打包H5、APP和小程序）
- 全新支持企业模式和社区模式，社区模式支持注册、添加好友功能
- APP支持通知栏消息推送（需要开启unipush模块，并开启手机通知权限，仅支持APP在线推送）
- 支持简易后台管理，包括用户管理、群组管理、系统设置等

### 最新更新
请查看右侧发行版更新日志

**v6.0.0** (2025年5月20日) 

1. 新增移动端和桌面端国际化，可以自由新增语言。
2. 新增群头像、消息已读、消息转发等消息队列处理；采用默认头像，取消后台生成文字头像，提升性能。
3. 新增定时清理消息可以删除文件，避免文件占用太大空间。
4. 移动端调整大量的UI界面和配色，更换了导航栏图标。
5. 移动端更换了新的保活插件，支持IOS，支持APP提示直接去系统设置消息通知权限和调整省电策略。
6. 移动端会话列表支持下拉刷新消息，支持双击导航栏消息图标，快速定位未读会话和@我的会话。
7. 移动端聊天记录列表采用虚拟列表，再多的数据也不对卡顿，采用z-paging，可以丝滑加载更多聊天记录。
8. 移动端聊天记录滚动时，可以看到新消息数量。
9. web端后台管理新增建议用户数据统计，可以查看在线用户数和设备数。
10. 桌面端新增音视频通话窗口移动，支持最小化到右下角，让聊天无遮挡，通话体验更佳！
11. 优化Lemon-IMUI组件的国际化，以及更新chatarea组件为最新版本。
12. 修复若干BUG！

### 软件架构

后端技术栈：`thinkphp6+workerman+redis`

前端技术栈：`vue2+Lemon-IMUI+element-UI`

桌面端：`vue2+Lemon-IMUI+element-UI + electron`

移动端：`uniapp for vue3 + pinia`

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

前端项目运行要求：

|  所需环境 | 版本 | 备注 |
| --------- | ---- | ---- |
| node    | >= 14.0.0 |  14以下的版本未做测试   |
| npm | >= 7.0.0 |      |


作者提供本系统的安装服务，包括后端和前端部署到线上，可手把手教学，保证项目的完美运行，200元/次，安装服务可赠送详细的安装教程以及接口文档，如有需要可以进群联系作者！

### 交流群

请先认真查看本页文档，如果有什么问题，可以留言，有购买移动端需求可以加入我们的QQ群。

【仅限有问题或者购买移动端需求才可以申请加入交流群（长时间不活跃的将被定期清理），加群前请先点Star，否则不予通过】

[QQ 交流群：1031495465](https://qm.qq.com/q/RgHdvLGiMk)

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

