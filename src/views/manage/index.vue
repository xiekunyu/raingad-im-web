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
              <div class="tips-item" v-for="item in $packageData.funcList" :key="item.icon">
                <div class="tips-item-icon"><i :class="item.icon"></i></div>
                <div class="tips-item-message" v-text="item.text"></div>
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
							<el-button class="f-20 c-999" type="primary" style="padding:5px;" icon="el-icon-caret-right" circle @click="startService"></el-button>
						</span>
            
        </div>
        <div class="lz-flex lz-space-between mb-10">
          <div class="el-icon-set-up"> 消息推送服务 </div> <div class="c-green">运行中</div>
        </div>
        <div class="lz-flex lz-space-between mb-10">
          <div class="el-icon-files"> 消息队列服务 </div>  <div class="c-red">已停止</div>
        </div>
        <div class="lz-flex lz-space-between">
        <div class="el-icon-alarm-clock"> 定时任务 </div>  <div class="c-green">运行中</div>
        </div>
        </el-card>
      </el-col>
      <el-col :span="6" header="数据概览">
        <el-card shadow="hover" class="mb-20">
          用户总数：{{ $packageData.userCount }}
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>
export default {
    components: {
    },
    data() {
      return {
        }
        },
        methods: {
            startService() {
              this.$api.taskApi.startTask().then(res => {
                    this.$message.success('服务启动成功');
                })
            }
        },
        }
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
  