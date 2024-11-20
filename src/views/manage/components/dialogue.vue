<template>
    <div>
        <el-container>
            <el-aside width="320px">
                <div class="lz-flex group-box">
                        <div class="group-box-header" v-if="!showSearch">
                            <div>
                                <el-button type="primary" size="small" plain @click="chooseTab(1)">TA的会话</el-button>
                                <el-button type="success" size="small" plain @click="chooseTab(0)" class="ml-10">TA的联系人</el-button>
                            </div>
                            <div>
                                <el-button plain circle @click="showSearch=true" icon="el-icon-search" title="搜索"></el-button>
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
                                <div v-for="item in list" :key="item.user_id" class="chat-item"  @click="openChat(item)" :class="active==item.user_id ? 'active' : ''">
                                    <div class="chat-avatar">
                                        <img :src="item.avatar" alt="avatar">
                                    </div>
                                    <div class="chat-content">
                                        <span class="chat-name">{{ item.realname }}</span>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                        <div class="group-box-page" align="center">
                            <el-pagination
                                background
                                :total="total"
                                @current-change="getList"
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
                        <div>聊天记录</div>
                    </div>
                    <div class="group-box-list" style="padding:15px">
                        <ChatRecord :contact="currentChat" :condition="condition" :manage="true" :key="componentKey"  v-if="currentChat.user_id"></ChatRecord>
                    </div>
                </div>
            </el-main>
        </el-container>
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
    props: {
        userInfo: {
            type: Object,
            default: {} //定义参数默认值
        }
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
            hasConvo:1,
            user_id:0,
            page:1,
            limit:20,
            keywords:''
        },
        total:0,
        list: [
        ],
        condition:{}
      }
    },
    created() {
      this.getList();
    },  
    methods: {
        openChat(item) {
            this.active = item.user_id;
            this.currentChat = item;
            this.componentKey++;
            this.condition={
                user_id:this.userInfo.user_id
            }
        },
        chooseTab(val){
            // 更换tab后
            this.params.page = 1;
            this.params.hasConvo = val;
            this.getList();
        },
        getList(){
            this.params.user_id=this.userInfo.user_id;
            this.$api.messageApi.getContacts(this.params).then(res=>{
                if(res.code == 0){
                    this.list = res.data;
                    this.total = res.count;
                    this.params.page = res.page;
                }
            })
        },
        handleChange() {
            // 更换每页显示条数后，需要重新从第一页开始
            this.params.page = 1;
            this.getList();
        }
    }
  }
</script>
<style scoped lang="scss">
.group-box{
    display: flex;
    flex-direction: column;
    height: 660px;
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
::v-deep .chat-main{
    margin:0 !important;
}
</style>
  