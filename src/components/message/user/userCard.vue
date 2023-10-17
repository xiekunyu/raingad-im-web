<template>
    <div class="user-card-box">
          <el-container class="container"  v-outside="closeDialog">
            <el-header class="no-padding header" height="180px">
              <i class="close el-icon-error cur-handle" @click="closeDialog" />
              <div class="img-banner">
                
              </div>
              <div class="user-header">
                <div class="avatar">
                  <div class="avatar-box">
                    <img :src="detail.avatar"/>
                  </div>
                </div>
                <div class="username">
                  <i class="iconfont icon-qianming" />
                  <span>{{ detail.realname || '未设置昵称' }}</span>
                </div>
              </div>
            </el-header>
            <el-main class="no-padding main">
              <div class="user-sign">
                <div class="sign-arrow"></div>
                <i class="iconfont icon-bianji" />
                <span>{{detail.motto || "这家伙有点懒，什么都没留下！"}} </span>
              </div>

              <div class="card-rows no-select">
                <div class="card-row">
                  <div class="label">账号</div>
                  <div>{{ detail.account}}</div>
                </div>
                <div class="card-row">
                  <div class="label">{{ globalConfig.sysInfo.runMode==2 ? '昵称' : '姓名'}}</div>
                  <div>{{ detail.realname}}</div>
                </div>
                <div class="card-row" v-if="detail.friend && globalConfig.sysInfo.runMode==2">
                  <div class="label">备注</div>
                  <div>{{ detail.friend.nickname || '未设置' }} <i class="el-icon-edit ml-10" title="设置备注" @click="setNickname"></i></div>
                </div>
                <div class="card-row">
                  <div class="label">性别</div>
                  <div>{{ detail.sex | sex }}</div>
                </div>
                <div class="card-row">
                  <div class="label">邮箱</div>
                  <div>{{ detail.email || "未设置"}}</div>
                </div>
                <div class="card-row" v-if="parseInt(globalConfig.sysInfo.ipregion) && isFriend">
                  <div class="label">IP</div>
                  <div v-if="detail.last_login_ip">{{ detail.last_login_ip || "未知"}} （{{detail.location || "未知"}}）</div>
                  <div v-else>未知</div>
                </div>
              </div>
            </el-main>
            <el-footer class="footer">
              <!-- <el-button round>加好友</el-button> -->
              <el-button type="primary" v-if="isFriend" round @click="openChat()" style="width:150px">发消息</el-button>
              <el-button type="primary" v-if="globalConfig.sysInfo.runMode==2 && !detail.friend && user_id!=userInfo.user_id" round @click="addFriend()" style="width:150px">加好友</el-button>
              <el-button round v-if="options.isManage" style="width:150px" @click="editUser">编辑资料</el-button>
            </el-footer>
          </el-container>
    </div>
    
  </template>
  
  <script>
  import { mapState } from 'vuex';
  export default {
    name: 'UserCard',
    props: {
        user_id: {
            type: [Number,String],
            default: 0,
        },
        options: {
            type: Object,
            default: () => {
                return {
                    isManage: false,
                }
            }
        }
    },
    computed: {
        ...mapState({
                userInfo: state => state.userInfo,
                globalConfig: state => state.globalConfig,
            }),
        isFriend(){
          return this.userInfo.user_id!=this.detail.user_id && (this.detail.friend || this.globalConfig.sysInfo.runMode==1);
        }
    },
    filters: {
      sex(value) {
        let arr = ['女', '男','未知']
        return arr[value] || '未知';
      },
    },
    data() {
        return {
          detail:{},
        };
    },
    mounted() {
        this.getUserDetal();
    },  
    methods: {
        closeDialog() {
            this.$emit('close')
        },
        getUserDetal(){
          this.$api.imApi.getUserInfo({user_id:this.user_id}).then(res=>{
            if(res.code == 0){
              this.detail = res.data;
            }
          })
        },
        openChat(){
          this.closeDialog();
          this.$store.commit('openChat',this.detail.user_id)
        },
        editUser(){
          this.$emit('editUser',this.detail)
        },
        // 添加好友
        addFriend(){
          this.closeDialog();
          this.$prompt('请填写验证信息，让朋友知道你！', '添加好友', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            if(!value){
              this.$message.error('请输入验证信息');
              return false;
            }
            this.$api.friendApi.addFriend({user_id:this.detail.user_id,remark:value}).then(res=>{
              if(res.code == 0){
                this.$message.success('已发送好友申请');
              }
            })
          }).catch((error) => {
            this.$message({
              type: 'warning',
              message: error
            });       
          });
          
        },
        // 设置备注
        setNickname(){
          let friend_id=this.detail.friend.friend_id ?? '';
          if(!this.detail.friend){
            this.$message.error('该用户不是您的好友');
            return false;
          }
          this.closeDialog();
          let nickname=this.detail.friend.nickname ? this.detail.friend.nickname : this.detail.realname;
          this.$prompt('请填写备注信息', '设置备注', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: nickname
          }).then(({ value }) => {
            if(!value){
              this.$message.error('请输入备注信息');
              return false;
            }
            this.$api.friendApi.setNickname({friend_id:friend_id,nickname:value}).then(res=>{
              if(res.code == 0){
                this.$message.success('设置成功');
                this.detail.realname = value;
              }
            })
          }).catch(() => {      
          });
        }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .user-card-box {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 19999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    width: 350px;
    height: 600px;
    overflow: hidden;
    border-radius: 3px;
    .header {
      position: relative;

      .close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: white;
        transition: all 1s;
        z-index: 1;
        font-size: 20px;
      }

      .img-banner {
        width: 100%;
        height: 100%;
        background-image: url(~@/assets/img/user-card-bg.jpg);;
        background-size: 100%;
        transition: all 0.2s linear;
        cursor: pointer;
        overflow: hidden;

        img:hover {
          -webkit-transform: scale(1.1);
          transform: scale(1.1);
          -webkit-filter: contrast(130%);
          filter: contrast(130%);
        }
      }
    }

    .main {
      padding: 45px 16px 0 !important;
    }

    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: 1px solid #f5eeee;

      button {
        width: 90%;
      }
    }
  }

  .user-header {
    width: 100%;
    height: 80px;
    position: absolute;
    bottom: -40px;
    display: flex;
    flex-direction: row;

    .avatar {
      width: 100px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;

      .avatar-box {
        width: 80px;
        height: 80px;
        background-color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          height: 70px;
          width: 70px;
          border-radius: 50%;
        }
      }
    }

    .username {
      flex: auto;
      padding-top: 45px;
      font-size: 16px;
      font-weight: 400;

      span {
        margin-left: 5px;
      }

      .share {
        display: inline-flex;
        width: 50px;
        height: 22px;
        background: #ff5722;
        color: white;
        align-items: center;
        justify-content: center;
        padding: 3px 8px;
        border-radius: 20px;
        transform: scale(0.7);
        cursor: pointer;
        i {
          margin-top: 2px;
        }
        span {
          font-size: 14px;
          margin-left: 4px;
        }
      }
    }
  }

  .user-sign {
    min-height: 26px;
    border-radius: 5px;
    padding: 5px;
    line-height: 25px;
    background: #f3f5f7;
    color: #7d7d7d;
    font-size: 12px;
    margin-bottom: 20px;
    position: relative;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    position: relative;

    .sign-arrow {
      position: absolute;
      width: 0;
      height: 0;
      font-size: 0;
      border: 5px solid hsla(0, 0%, 96.9%, 0);
      border-bottom-color: #f3f5f7;
      left: 28px;
      top: -9px;
    }
  }

  .card-rows {
    .card-row {
      display: flex;
      justify-content: flex-start;
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      position: relative;
      cursor: pointer;
      color: #736f6f;

      .label {
        width:30px;
        margin-right: 20px;
        color: #cbc5c5;
        text-align: right;
      }

      .friend-remark {
        border-bottom: 1px dashed #bec3d0;
        padding-bottom: 2px;
        color: #736f6f;
        width: 60%;
        padding-right: 5px;
      }

      .el-icon-edit-outline {
        margin-left: 3px !important;
      }
    }
  }
  .footer{
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
  </style>