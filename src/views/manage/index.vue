<template>
  <div class="pd-20">
    <el-row :gutter="20">
      
      <el-col :span="10">
        <el-card shadow="hover" header="欢迎" class="mb-20">
          <div class="welcome">
            <div class="logo">
              <img src="@/assets/img/logo.png">
              <h2>欢迎体验 {{$packageData.name}}</h2>
            </div>
            <div class="tips">
              <div class="tips-item">
                <div class="tips-item-icon"><i class="el-icon-chat-line-round"></i></div>
                <div class="tips-item-message">支持单聊和群聊，支持发送表情、图片、语音、视频和文件消息</div>
              </div>
              <div class="tips-item">
                <div class="tips-item-icon"><i class="el-icon-potato-strips"></i></div>
                <div class="tips-item-message">单聊支持消息已读未读的状态显示，在线状态显示</div>
              </div>
              <div class="tips-item">
                <div class="tips-item-icon"><i class="el-icon-user"></i></div>
                <div class="tips-item-message">群聊创建、删除和群成员管理、群公告、群禁言等</div>
              </div>
              <div class="tips-item">
                <div class="tips-item-icon"><i class="el-icon-ice-cream-round"></i></div>
                <div class="tips-item-message">支持置顶联系人，消息免打扰；支持设置新消息声音提醒，浏览器通知</div>
              </div>
              <div class="tips-item">
                <div class="tips-item-icon"><i class="el-icon-video-camera"></i></div>
                <div class="tips-item-message">支持一对一音视频通话（和移动端不互通）</div>
              </div>
              <div class="tips-item">
                <div class="tips-item-icon"><i class="el-icon-milk-tea"></i></div>
                <div class="tips-item-message">支持文件、图片和绝大部分媒体文件在线预览</div>
              </div>
              <div class="tips-item">
                <div class="tips-item-icon"><i class="el-icon-mobile-phone"></i></div>
                <div class="tips-item-message">支持移动端（H5和APP），即将支持后台管理</div>
              </div>
            </div>
            <div class="actions">
              <router-link to="/chat">
                <el-button type="primary" icon="el-icon-s-promotion" size="large">去聊天</el-button>
              </router-link>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" header="关于项目" class="item-background mb-20">
          <p>{{ $packageData.name }}是一个<b class="c-red">开源的即时通信demo，主要用于学习交流，为大家提供即时通讯的开发思路</b>，许多功能需要自行开发，开发的初衷旨在快速建立企业内部通讯系统，或者用于内网交流。不建议用于商业用途，如确有需要商用，请自行开发完善，并注明相关的版权问题。</p>
          <div class="mt-15 ml-15 mb-15">
            前端地址：<a :href="$packageData.frontUrl" target="_blank"><el-image
                :src="$packageData.frontUrl + '/badge/star.svg?theme=white'" alt="star"></el-image></a>
          </div>
          <div class="ml-15 mb-15">
            后端地址：<a :href="$packageData.backstageUrl" target="_blank"><el-image
                :src="$packageData.backstageUrl + '/badge/star.svg?theme=dark'" alt="star"></el-image></a>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6"><el-card  class="task task-item mb-20" shadow="hover">
        <div slot="header">
          <span>系统服务</span>
          <span class="handler" style="float: right;margin-top: -3px;">
							<el-popconfirm title="确定重启吗？" @confirm="run(item)">
								<template #reference>
									<el-button class="f-20 c-999" type="primary" style="padding:5px;" icon="el-icon-caret-right" circle></el-button>
								</template>
							</el-popconfirm>
						</span>
        </div>

        </el-card>
      </el-col>
      <el-col :span="6" header="数据概览">
        <el-card shadow="hover" class="mb-20">
          统计
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>

</script>
<style scoped lang="scss">
.item-background p {
  color: #999;
  line-height: 1.8;
}

.welcome {}

.welcome .logo {
  text-align: center;
}

.welcome .logo img {
  vertical-align: bottom;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.welcome .logo h2 {
  font-size: 24px;
  font-weight: normal;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tips {
  margin-top: 20px;
}

.tips-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
}

.tips-item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 18px;
  margin-right: 20px;
  color: var(--el-color-primary);
  background: rgba(180, 180, 180, 0.1);
}

.tips-item-message {
  flex: 1;
  font-size: 14px;
}

.actions {
  text-align: center;
  margin: 20px 0 20px 0;
}
</style>
  