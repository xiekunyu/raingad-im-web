<template>
    <div class="pd-20">
        <el-container>
            <el-aside width="320px">
                <div class="lz-flex group-box">
                        <div class="group-box-header" v-if="!showSearch">
                            <div>群列表</div>
                            <div>
                                <el-button plain circle @click="showSearch=true" icon="el-icon-search" title="搜索"></el-button>
                                <el-button plain round @click="createChatBox=true;isAdd=true">创建群聊</el-button>
                            </div>
                        </div>
                        <div class="group-box-header" v-else>
                            <el-input
                            placeholder="请输入关键字搜索"
                            style="width: 300px"
                            @keyup.enter.native="handleChange"
                            v-model="params.keywords">
                            <el-button slot="prepend" icon="el-icon-back" @click="showSearch=false"></el-button>
                            <el-button slot="append" icon="el-icon-search" @click="handleChange"></el-button>
                            </el-input>
                        </div>
                        <div class="group-box-list">
                            <el-scrollbar>
                                <div v-for="chat in chats" :key="chat.group_id" class="chat-item"  @click="openGroup(chat)" :class="active==chat.group_id ? 'active' : ''">
                                    <div class="chat-avatar">
                                        <img :src="chat.avatar" alt="avatar">
                                    </div>
                                    <div class="chat-content">
                                        <span class="chat-name">{{ chat.name }}</span>
                                        <p class="chat-message c-999"> 创建人：{{ chat.owner_id_info.realname }}</p>
                                    </div>
                                    <div class="chat-time">
                                        {{ chat.reate_time }}
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                        <div class="group-box-page" align="center">
                            <el-pagination
                                background
                                :total="total"
                                @current-change="getGroupList"
                                :current-page.sync="params.page"
                                :page-size.sync="params.limit"
                                layout="total, prev, next , jumper">
                                </el-pagination>
                        </div>
                    </div>
            </el-aside>
            <el-main style="padding:0">
                <div class="lz-flex group-box group-user-box">
                    <div class="group-box-header">
                        <div>群成员</div>
                        <div v-if="members.length>0">
                            <el-button plain round @click="openAddUser">添加成员</el-button>
                            <el-button type="warning" plain round @click="openMessageBox">群聊监控</el-button>
                            <el-button type="danger" plain round @click="delGroup">解散群聊</el-button>
                        </div>
                    </div>
                    <div class="group-box-list">
                        <el-scrollbar>
                            <div  class="member-list" v-if="members.length>0">
                                <div v-for="member in members" :key="member.id" class="member-item">
                                    <div class="member-avatar">
                                        <img :src="member.userInfo.avatar" alt="avatar">
                                    </div>
                                    <div class="member-content">
                                        <div class="member-header">
                                            <span class="member-name">{{ member.userInfo.displayName }}</span>
                                            <el-tag type="warning"  size="mini" class="mt-3" v-if="member.role==1">群主</el-tag>
                                            <el-tag type="info" size="mini" class="mt-3" v-if="member.role==2">管理员</el-tag>
                                            <span class="member-role mt-3" v-if="member.role==3">普通成员</span>
                                        </div>
                                        <div class="member-actions">
                                            <el-dropdown @command="handleCommand(member,$event)">
                                                <el-button type="text" icon="el-icon-more"></el-button>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item  command="info">查看资料</el-dropdown-item>
                                                    <el-dropdown-item  command="setManager" v-if="member.role>1"> {{ member.role==2 ? '取消' : '设置'}}管理员</el-dropdown-item>
                                                    <el-dropdown-item  command="changeOwner" v-if="member.role>1">设置为群主</el-dropdown-item>
                                                    <el-dropdown-item  command="removeUser" v-if="member.role>1"><span class="c-red">移除成员</span></el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <el-empty description="请选择群聊"></el-empty>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </el-main>
        </el-container>
        <!-- 创建群聊 -->
        <Group :visible.sync="createChatBox" :title="dialogTitle" @manageGroup="manageGroup" :isAdd="isAdd?1:0" :userIds="userIds"></Group>
        <el-dialog
            title="消息管理器"
            :visible.sync="messageBox"
            :modal="true"
            width="800px"
            append-to-body
            >
            <ChatRecord :contact="currentChat" :key="componentKey"></ChatRecord>
        </el-dialog>
    </div>

</template>

<script>
  import Group from '@/components/message/group/index.vue';
  import ChatRecord from '@/components/message/chatRecord/index.vue';
  import * as utils from '@/utils/index';
  export default {
    components: {
        Group,
        ChatRecord
    },  
    data() {
      return {
        componentKey:99,
        messageBox:false,
        isAdd: true,
        dialogTitle: '创建群聊',
        createChatBox:false,
        userIds:[],
        showSearch:false,
        value: false,
        active:0,
        currentChat: {},
        params:{
            page:1,
            limit:20,
            keywords:''
        },
        total:0,
        chats: [
        ],
        members: []
      }
    },
    mounted() {
      this.getGroupList();
    },  
    methods: {
        openMessageBox(){
            this.componentKey++;
            this.messageBox = true;
        },
        openGroup(item) {
            this.active = item.group_id;
            item.id='group-'+item.group_id;
            item.is_group=1;
            this.currentChat = item;
            this.getGroupUser(item.group_id);
        },
        getGroupList(){
            this.$api.groupApi.getGroupList(this.params).then(res=>{
                if(res.code == 0){
                    this.chats = res.data;
                    this.total = res.count;
                    this.params.page = res.page;
                }
            })
        },
        getGroupUser(group_id){
            this.$api.imApi.groupUserListAPI({group_id:'group-'+group_id}).then(res=>{
                if(res.code == 0){
                    this.members = res.data;
                }
            })
        },
        handleChange() {
            // 更换每页显示条数后，需要重新从第一页开始
            this.params.page = 1;
            this.getGroupList();
        },
        //   创建群聊或添加成员
        manageGroup(selectUid,isAdd,groupName){
            this.createChatBox = false;
            if(isAdd){
                this.$api.imApi.addGroupAPI({ user_ids: selectUid,name:groupName }).then(res => {
                    if (res.code == 0) {
                        this.$message.success('创建成功'); 
                        this.params.page = 1;
                        this.getGroupList();
                    }
                });
            }else{
                this.$api.groupApi.addGroupUser({ group_id:this.active, user_ids: selectUid }).then(res => {
                    if (res.code == 0) {
                        this.$message.success('添加成功'); 
                        this.getGroupUser(this.active);
                    }
                });
            }
        },
        openAddUser(){
            if(this.active==0){
                this.$message.warning('请选择群聊');
                return;
            }
            this.createChatBox = true;
            this.isAdd = false;
            this.dialogTitle = '添加成员';
            let user_ids = utils.arrayToString(this.members, "user_id");
            this.userIds = user_ids;
        },
        delGroup(){
            if(this.active==0){
                this.$message.warning('请选择群聊');
                return;
            }
            this.$confirm('确定要解散该群聊吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$api.groupApi.delGroup({ group_id:this.active }).then(res => {
                        if (res.code == 0) {
                            this.$message.success('解散成功'); 
                            this.params.page = 1;
                            this.members = [];
                            this.getGroupList();
                        }
                    });
                }).catch(() => {
                this.$message.info('已取消操作');
            });
        },
        handleCommand(item,command){
            if(command=='info'){
                this.$user(item.user_id);
            }else if(command=='setManager'){
                this.$api.groupApi.setManager({ group_id:this.active,user_id:item.user_id,role:item.role==2?3:2 }).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg); 
                        this.getGroupUser(this.active);
                    }
                });
            }else if(command=='changeOwner'){
                this.$api.groupApi.changeOwner({ group_id:this.active,user_id:item.user_id }).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg); 
                        this.getGroupUser(this.active);
                    }
                });
            }else if(command=='removeUser'){
                this.$confirm('确定要移除该成员吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$api.groupApi.delGroupUser({ group_id:this.active,user_id:item.user_id }).then(res => {
                            if (res.code == 0) {
                                this.$message.success(res.msg); 
                                this.getGroupUser(this.active);
                            }
                        });
                    }).catch(() => {
                    this.$message.info('已取消操作');
                });
            }
        }
    }
  }
</script>
<style scoped lang="scss">
.group-box{
    display: flex;
    flex-direction: column;
    height: calc(100vh - 104px);
    background: #fff;
    border:solid 1px #e6e6e6;
    .group-box-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:0 15px;
        height:60px;
        border-bottom: solid 1px #e6e6e6;
    }
    .group-box-list{
        flex:1;
        overflow: auto;
    }
    .group-box-page{
        padding-top:15px;
        height: 48px;
    }
}
.chat-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    &:hover, &.active{
        background: #f5f5f5;
    }
    .chat-avatar {
        margin-right: 10px;
        img {
            width: 44px;
            height: 44px;
            border-radius: 50%;
        }
    }
    .chat-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .chat-message {
            margin-top: 5px;
        }
        .chat-name {
            font-weight: bold;
            margin-right: 10px;
        }
    }
    .chat-time {
        font-size: 12px;
        color: #999;
    }
}

.group-user-box{
    border-left:none;
}
.member-list{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding:20px 0 20px 20px;
    .member-item {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 10px;
        width:200px;
        border: solid 1px #eee;
        border-radius: 8px;
        margin-right:20px;
        margin-bottom:20px;
        &:last-child{
            margin-right:0;
        }
        // &:nth-child(4n) {
        //      margin-right: 0;
        // }
        .member-avatar {
            margin-right: 10px;
            img {
                width: 44px;
                height: 44px;
                border-radius: 50%;
            }
        }
        .member-content {
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            .member-header {
                display: flex;
                align-items: flex-start;
                flex-direction: column;
                .member-name {
                    font-weight: bold;
                    margin-right: 10px;
                }
                .member-role {
                    font-size: 12px;
                    color: #999;
                }
            }
            .member-actions {
                display: flex;
                justify-content: flex-end;
            }
        }
    }

}

.mt-3{
    margin-top:3px;
}

::v-deep .el-card__body{
    padding: 0 !important;
}
</style>
  