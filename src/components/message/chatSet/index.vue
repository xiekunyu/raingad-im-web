<template>
  <div>
          <div class="group-item">
            <div class="group-avatar">
               <el-avatar shape="square" :src="contact.avatar"></el-avatar>
            </div>
            <div class="group-content">
              <div class="group-title">{{contact.displayName}} <span>({{groupInfo.groupUserCount}})</span></div>
              <div class="group-user">群主：{{groupInfo.ownerName}}</div>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-title">群管理：</div>
            <div class="setting-option">
              <el-switch v-model="setting.manage"  :active-value="'1'" :inactive-value="'0'" @change="groupSetting"> </el-switch>
            </div>
            <div class="setting-description">
              <div class="des-title">仅群主和群管理员可以管理</div>
              <div class="des-comment">启用后，其他成员不能修改群名称，编辑公告等</div>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-title">群成员邀请：</div>
            <div class="setting-option">
              <el-switch v-model="setting.invite"  :active-value="'1'" :inactive-value="'0'"  @change="groupSetting"> </el-switch>
            </div>
            <div class="setting-description">
              <div class="des-title">允许群成员邀请</div>
              <div class="des-comment">启用后，其他成员可以邀请其他人加入群聊</div>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-title">群成员隐私：</div>
            <div class="setting-option">
              <el-switch v-model="setting.profile"  :active-value="'1'" :inactive-value="'0'"  @change="groupSetting"> </el-switch>
            </div>
            <div class="setting-description">
              <div class="des-title">允许添加群成员为好友</div>
              <div class="des-comment">启用后，成员可以互相查看资料并添加为好友或发消息</div>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-title">群禁言：</div>
            <div class="setting-option">
              <el-radio-group v-model="setting.nospeak" size="mini"  @change="groupSetting">
                <el-radio-button label="0">关闭</el-radio-button>
                <el-radio-button label="1">仅管理员可发言</el-radio-button>
                <el-radio-button label="2">仅群主可发言</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-title">转让群主：</div>
            <div class="setting-option">
              <el-button size="mini" @click="changeOwner">转让</el-button>
            </div>
          </div>
          
  </div>
</template>

<script>
export default {
  name: "chatSet",
  props: {
    contact: {
      type: Object,
      default:{}
    }
  },
  data() {
    return {
      setting:{},
      groupInfo:{}
    };
  },
  methods: {
    groupSetting(){
      this.$api.imApi.groupSettingAPI({id:this.contact.id,setting:this.setting})
    },
    changeOwner(){
      this.$emit('changeOwner',this.contact.id);
    }
  },
  created(){
    this.$api.imApi.getGroupInfoAPI({group_id:this.contact.id}).then(res=>{
      var data=res.data;
      this.groupInfo=data;
      this.setting=data.setting;
    })
  }
};
</script>
<style scoped lang="scss">
.setting-item{
  margin-bottom:20px;
  display:flex;
  justify-content: flex-start;
  .setting-title{
    text-align: right;
    width:120px;
    color:#666;
  }
  .setting-description{
    margin-left:10px;
    .des-title{
      color:#000;
      font-size:14px;
    }
    .des-comment{
      color:#999;
      font-size:12px;
    }
  }
}
.group-item{
    margin-bottom:20px;
    display:flex;
    justify-content: center;
    .group-avatar{
      margin-right:10px;
    }
    .group-content{
      .group-title{
        color:#333;
      }
      .group-user{
        color:#999;
      }
    }
}
</style>
