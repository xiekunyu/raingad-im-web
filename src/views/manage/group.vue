<template>
    <div class="pd-20">
        <el-container>
            <el-aside width="320px">
                <div class="lz-flex group-box">
                        <div class="group-box-header">
                            <div>群列表</div>
                            <div>
                                <el-button plain round>创建群聊</el-button>
                            </div>
                        </div>
                        <div class="group-box-list">
                            <el-scrollbar>
                                <div v-for="chat in chats" :key="chat.id" class="chat-item"  @click="openGroup(chat)" :class="active==chat.id ? 'active' : ''">
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
            </el-aside>
            <el-main style="padding:0">
                <div class="lz-flex group-box group-user-box">
                    <div class="group-box-header">
                        <div>群成员</div>
                        <div>
                            <el-button plain round>更换群主</el-button>
                            <el-button type="warning" plain round>群聊监控</el-button>
                            <el-button type="danger" plain round>解散群聊</el-button>
                        </div>
                    </div>
                    <div class="group-box-list">
                        <el-scrollbar>
                            <div  class="member-list">
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
        active:0,
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
    },
    methods: {
      openGroup(item) {
        this.active = item.id;
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
                width: 40px;
                height: 40px;
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

::v-deep .el-card__body{
    padding: 0 !important;
}
</style>
  