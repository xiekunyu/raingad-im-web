<template>
    <div class="pd-20">
        <el-container>
            <el-aside width="360px">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>群聊列表</span>
                        <el-button style="float: right; padding: 3px 0" type="text">创建群聊</el-button>
                    </div>
                    <div class="lz-flex group-box">
                        <div class="group-box-list">
                            <el-scrollbar>
                                <div v-for="chat in chats" :key="chat.id" class="chat-item">
                                    <div class="chat-avatar">
                                        <img :src="chat.avatar" alt="avatar">
                                    </div>
                                    <div class="chat-content">
                                        <span class="chat-name">{{ chat.name }}</span>
                                        <p class="chat-message">{{ chat.message }}</p>
                                    </div>
                                    <div class="chat-time">
                                        {{ chat.time }}
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                        <div class="group-box-page" align="center">
                            <el-pagination
                                background
                                :total="1000"
                                layout="total, prev, next , jumper">
                                </el-pagination>
                        </div>
                    </div>
                </el-card>
            </el-aside>
            <el-main style="padding:0">
                <el-card class="box-card ml-20">
                    <div slot="header" class="clearfix">
                        <span>群聊成员</span>
                        <el-button style="float: right; padding: 3px 0" type="text">解散群聊</el-button>
                    </div>
                    <div class="lz-flex group-box">
                        <div class="group-box-list">
                            <el-scrollbar>
                                <div  class="member-list pd-20">
                                    <div v-for="member in members" :key="member.id" class="member-item">
                                        <div class="member-avatar">
                                            <img :src="member.avatar" alt="avatar">
                                        </div>
                                        <div class="member-content">
                                            <div class="member-header">
                                                <span class="member-name">{{ member.name }}</span>
                                                <span class="member-role">{{ member.role }}</span>
                                            </div>
                                            <div class="member-actions">
                                            <el-tooltip content="更多操作" placement="top">
                                                <el-button type="text" icon="el-icon-more"></el-button>
                                            </el-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        value: false,
        currentPage4: 4,
        chats: [
            {
            id: 1,
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            message: '创建者：张三  群成员：28人',
            time: '10:30 AM'
            },
            {
            id: 2,
            name: 'Alice Smith',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            message: '创建者：张三  群成员：28人',
            time: '11:00 AM'
            },
            {
            id: 3,
            name: 'Bob Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            message: '创建者：张三  群成员：28人',
            time: '11:30 AM'
            },
            {
            id: 4,
            name: 'Bob Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            message: '创建者：张三  群成员：28人.',
            time: '11:30 AM'
            },
            {
            id: 5,
            name: 'Bob Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            message: '创建者：张三  群成员：28人.',
            time: '11:30 AM'
            },
            {
            id: 6,
            name: 'Bob Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            message: '创建者：张三  群成员：28人.',
            time: '11:30 AM'
            },
            {
            id: 7,
            name: 'Bob Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            message: '创建者：张三  群成员：28人.',
            time: '11:30 AM'
            },
            {
            id: 8,
            name: 'Bob Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            message: '创建者：张三  群成员：28人.',
            time: '11:30 AM'
            }
        ],
        members: [
        {
          id: 1,
          name: 'John Doe',
          role: '管理员',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        {
          id: 2,
          name: 'Alice Smith',
          role: '普通成员',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
        {
          id: 3,
          name: 'Bob Johnson',
          role: '普通成员',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        {
          id: 4,
          name: 'Bob Johnson',
          role: '普通成员',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        {
          id: 5,
          name: 'Bob Johnson',
          role: '普通成员',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        {
          id: 6,
          name: 'Bob Johnson',
          role: '普通成员',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        {
          id: 7,
          name: 'Bob Johnson',
          role: '普通成员',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        }
        
      ]
      }
    }
  }
</script>
<style scoped lang="scss">
.group-box{
    display: flex;
    flex-direction: column;
    height: calc(100vh - 160px);
    .group-box-list{
        flex:1;
        overflow: auto;
    }
    .group-box-page{
        padding-top:15px;
        height: 48px;
        line-height: 48px;
    }
}
.chat-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    &:hover{
        background: #f5f5f5;
    }
    .chat-avatar {
        margin-right: 10px;
        img {
            width: 40px;
            height: 40px;
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
.member-list{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
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
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }
        .member-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            .member-header {
                display: flex;
                align-items: center;
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

::v-deep .el-card__body{
    padding: 0 !important;
}
</style>
  