<template>
  <div class="pd-20">
    <el-row :gutter="20">
      
      <el-col :span="10" v-if="globalConfig && globalConfig.demon_mode">
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
      <el-col :span="8" v-if="globalConfig && globalConfig.demon_mode">
        <el-card shadow="hover" header="关于项目" class="item-background mb-20">
          <p>{{ $packageData.name }}是一个<b class="c-red">开源的即时通信demo，主要用于学习交流，为大家提供即时通讯的开发思路</b>，许多功能需要自行开发，开发的初衷旨在快速建立企业内部通讯系统、内网交流、社区交流。不建议用于商业用途，如确有需要商用，请联系作者授权，自行开发代码量必须要高于原代码量的30%以上，并注明相关的版权问题。</p>
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
      <el-col :span="6" v-if="globalConfig && globalConfig.demon_mode">
        <el-card shadow="hover" class="mb-20" header="数据概览">
          <div class="mb-15">用户总数：xxxx</div> 
          <div class="mb-15">群聊总数：xxxx</div> 
          <div class="mb-15">文件总数：xxxx</div> 
        </el-card>
      </el-col>
      <el-col :span="14"><el-card  class="task task-item mb-20" shadow="hover" v-loading="loading">
        <div slot="header">
          <span>系统服务</span>
            <span class="handler" style="float: right;margin-top: -3px;">
							<i class="f-24 c-999 cur-handle" type="primary" style="padding:3px;" :class="taskStatus ? 'el-icon-video-pause stop-task' : 'el-icon-video-play start-task'" @click="startService"></i>
						</span>
            
        </div>
        <el-alert
            type="warning"
            title="系统服务使用要求运行的PHP的版本必须是默认的，并且可以直接执行PHP命令。如果启动失败可能是某些函数被禁用或者runtime的目录没有写入权限，可以在终端中运行 ‘php think task start’ 来调试程序的错误。"
            show-icon
            :closable="false">
          </el-alert>
        <div class="lz-flex lz-space-between mt-10 mb-10 lz-align-items-center" v-for="(x,index) in taskList" :key="index">
          <div class="task-name el-icon-timer"> {{x.remark}} </div>
          <div class="el-icon-alarm-clock"> {{x.started}} </div>
          <div class="c-green" v-if="x.status=='active'">运行中</div>
          <div class="c-red" v-else>未启动</div>
          <el-button size="mini"  type="text" @click="showLog(x.name)" class="ml-10">日志</el-button>
        </div>
        <el-dialog width="900px" title="运行日志" :visible.sync="dialogTableVisible">
          <el-button @click="clearTaskLog">清除进程日志</el-button>
          <div style="height:500px" class="mt-10">
            <el-scrollbar>
              <div class="task-log pd-10">{{taskLog}}</div>
            </el-scrollbar>
          </div>
        </el-dialog>
        </el-card>
      </el-col>
      
    </el-row>
  </div>
</template>
  
<script>
import { mapState } from "vuex";
export default {
    components: {
    },
    computed: {
      ...mapState({
        globalConfig: state => state.globalConfig
      })
    },
    data() {
      return {
          loading: false,
          taskStatus: false,
          taskList:[],
          curName:'',
          dialogTableVisible:false,
          taskLog:'',
          task: [
                {
                  name: "im_task_schedule",
                  started: "--",
                  status: "stop",
                  remark: "计划任务"
                },
                {
                  name: "im_task_queue",
                  started: "--",
                  status: "stop",
                  remark: "消息队列"
                },
                {
                  name: "im_task_worker",
                  started: "--",
                  status: "stop",
                  remark: "消息推送"
                }
              ] 
        }
      },
      mounted() {
        this.resetTask();
        this.getTaskList();
      },
      methods: {
          resetTask(){
            let task=this.task;
            this.taskList=task;
          },
          getTaskList(){
            this.$api.taskApi.getTaskList().then(res => {
              if(res.code == 400){
                this.taskStatus = false;
              }else if(res.code == 0){
                this.taskStatus = true;
                this.taskList=res.data;
              }
            })
          },
          startService() {
            this.loading = true;
            if(this.taskStatus == false){
              this.$api.taskApi.startTask().then(res => {
                this.loading = false;
                if(res.code == 0){
                  this.getTaskList();
                }
              })
            }else{
              this.$confirm('确定要停止服务吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$api.taskApi.stopTask().then(res => {
                  this.loading = false;
                  if(res.code == 0){
                    this.taskStatus = false;
                    this.resetTask();
                  }
                })
              }).catch(() => {
                this.loading = false;
                this.$message({
                  type: 'info',
                  message: '已取消停止'
                });          
              });
            }
            
          },
          // 获取进程日志
          showLog(name){
            this.curName=name;
            this.$api.taskApi.getTaskLog({name:name}).then(res => {
              if(res.code == 0){
                if(res.data == '') return this.$message.error('暂无日志');
                this.dialogTableVisible=true;
                this.taskLog=res.data;
              }
            })
          },
          clearTaskLog(){
            this.$confirm('确定要清除日志吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$api.taskApi.clearTaskLog({name:this.curName}).then(res => {
                if(res.code == 0){
                  this.dialogTableVisible=false;
                  this.taskLog='';
                }
              })
            }).catch(() => {

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
.stop-task:hover{
  color: #f56c6c;
}
.start-task{
  color: #409EFF;
}
.task-name{
  font-weight: 600;
}

.task-log{
  background: #000;
  color: #fff;
  white-space: break-spaces;
  letter-spacing: 1px;
}
</style>
  