<template>
    <div class="pd-20">
        <el-container>
            <el-aside width="180px">
                <div class="lz-flex group-box">
                        <div class="group-box-header">
                            <div>文件类型</div>
                        </div>
                        <div class="group-box-list">
                            <div v-for="items in fileType" :key="items.id" class="chat-item" @click="openFolder(items)" :class="active==items.id ? 'active' : ''">
                                    {{items.name}}
                            </div>
                        </div>
                    </div>
            </el-aside>
            <el-main style="padding:0">
                <div class="lz-flex group-box group-user-box">
                    <div class="group-box-header">
                        <div>文件列表</div>
                        <div>
                        </div>
                    </div>
                    <div class="group-box-list">
                        <el-scrollbar>
                            <div  class="file-list">
                                <div v-for="file in fileList" :key="file.id" class="file-item">
                                    <div class="file-img">
                                        <el-image fit="contain" class="img" :src="file.image"></el-image>
                                    </div>
                                    <div class="file-name mt-5" align="center">{{ file.name }}</div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div class="group-box-page" align="center">
                        <el-pagination
                            background
                            :total="1000"
                            layout="total, prev, pager, next , jumper">
                            </el-pagination>
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
        fileType: [
            {
                id: 0,
                name: '所有文件',
                icon: '',
            },
            {
                id: 1,
                name: '文档',
                icon: '',
            },
            {
                id: 2,
                name: '图片',
                icon: '',
            },
            {
                id: 3,
                name: '音频',
                icon: '',
            },
            {
                id: 4,
                name: '视频',
                icon: '',
            },
            {
                id: 5,
                name: '其他文件',
                icon: '',
            }
        ],
        fileList: [
        {
          id: 1,
          name: 'John Doe',
          role: '管理员',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        {
          id: 2,
          name: 'Alice Smith',
          role: '普通成员',
          image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
        {
          id: 3,
          name: 'Bob Johnson',
          role: '普通成员',
          image: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        {
          id: 4,
          name: 'Bob Johnson',
          role: '普通成员',
          image: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        {
          id: 5,
          name: 'Bob Johnson',
          role: '普通成员',
          image: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        {
          id: 6,
          name: 'Bob Johnson',
          role: '普通成员',
          image: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        {
          id: 7,
          name: 'Bob Johnson',
          role: '普通成员',
          image: 'https://randomuser.me/api/portraits/men/3.jpg',
        }
        
      ]
      }
    },
    methods: {
        openFolder(item){
            this.active = item.id
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
.file-list{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding:20px 0 20px 20px;
    .file-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        padding: 10px;
        width:160px;
        border: solid 1px #eee;
        border-radius: 8px;
        margin-right:20px;
        margin-bottom:20px;
        .file-img {
            .img {
                width: 160px;
                height: 160px;
                border-radius: 8px;
            }
        }
        .file-name {
           text-align: center;
        }
    }

}

::v-deep .el-card__body{
    padding: 0 !important;
}
</style>
  