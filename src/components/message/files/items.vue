<template>
    <el-container style="height:100%">
        <el-header class="file-header">
            <div class="file-header-title">文件列表</div>
            <div class="file-header-search">
                <el-input
                placeholder="请输入关键字搜索"
                prefix-icon="el-icon-search"
                style="width: 300px"
                @keyup.enter.native="getFileList"
                v-model="params.keywords">
                <el-button slot="append" icon="el-icon-search" @click="getFileList"></el-button>
                </el-input>
            </div>
        </el-header>
        <el-container>
            <el-aside width="150px" class="lz-flex group-box">
                <div class="group-box-list">
                    <div v-for="items in fileType" :key="items.id" class="chat-item" @click="openFolder(items)" :class="params.cate==items.id ? 'active' : ''">
                            {{items.name}}
                    </div>
                </div>
            </el-aside>
            <el-main class="lz-flex group-box group-user-box no-padding">
                <div class="group-box-list" v-if="fileList.length">
                    <el-scrollbar>
                        <div  class="file-list">
                            <el-tooltip v-for="(file,index) in fileList" :key="index"  class="item" effect="dark" placement="right">
                                <template slot="content">
                                    <p class="mb-5">名称：{{ file.name }}</p>
                                    <p>大小：{{ getFileSize(file.size) }}</p>
                                </template>
                                <div class="file-item" @dblclick="openFile(file.preview)">
                                    <div class="file-img">
                                        <el-image fit="contain" class="img" :src="file.extUrl"></el-image>
                                    </div>
                                    <div class="file-name mt-5" align="center">{{ file.name }}</div>
                                    <div class="file-opt">
                                        <el-button type="text" size="mini" @click.stop="openFile(file.preview)">查看</el-button>
                                        <el-button type="text" size="mini" @click.stop="downloadFile(file)">下载</el-button>
                                        <el-button type="text" size="mini" @click.stop="openDialog(file)">发送</el-button>
                                    </div>
                                </div>
                                
                            </el-tooltip>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="pd-40" v-else>
                    <el-empty></el-empty>
                </div>
                <div class="group-box-page" align="center" v-if="!singlePage">
                    <el-pagination
                        background
                        :hide-on-single-page="singlePage"
                        @size-change="handleChange"
                        @current-change="getFileList"
                        :current-page.sync="params.page"
                        :page-sizes="[20, 50 ,100 , 200, 300, 400,500]"
                        :page-size.sync="params.limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                        </el-pagination>
                </div>
                <ChooseDialog :visible.sync="visible" title="发送到聊天" :allUser="$store.state.allContacts" @selectChat="sendChat"></ChooseDialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import ChooseDialog from '@/components/message/chooseDialog/index';
import * as FileUtils from '@/utils/file';
import * as utils from '@/utils/index';
  export default {
    components: {
        ChooseDialog
    },
    props: {
        isAll: {
            type: Number,
            default: 0,
        },
    },
    computed:{
        getFileSize(){
            return function (size) {
                return FileUtils.getFileSize(size);
            }
            
        }
    },
    data() {
      return {
        params: {
            page: 1,
            limit: 20,
            keywords: '',
            cate: 0,
            is_all: this.isAll,
            role: 0,
        },
        visible: false,
        singlePage: true,
        total: 0,
        curFile: {},
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
        fileList: []
      }
    },
    mounted() {
        this.getFileList();
    },
    methods: {
        changeRole(role){
            this.params.role = role;
            this.getFileList();
        },
        openFolder(item){
            this.params.cate = item.id;
            this.getFileList();
        },
        getFileList(){
            this.$api.imApi.getFileList(this.params).then(res=>{
                if(res.code == 0){
                    this.fileList = res.data;
                    this.total = res.count;
                    this.singlePage = res.count <= this.params.limit ? true : false;
                    this.params.page = res.page;
                }
            })
        },
        handleChange(val) {
            this.params.limit = val;
            this.getFileList();
        },
        openFile(url){
            if(!url){
                this.$message.error('文件不存在');
                return;
            }
            this.$preview(url);
        },
        downloadFile(file){
            file.download ? window.location=file.download : '';
        },
        openDialog(item){
            this.visible = true;
            this.curFile = item;
        },
        // 发送到聊天
        sendChat(userIds){
            if (userIds.length > 5) {
                return this.$message.error("转发的人数不能超过5人！");
            }
            let user= this.$store.state.userInfo;
            this.forwardBox = false;
            let msg = {
                type: this.curFile.msg_type,
                content: this.curFile.src,
                file_name: this.curFile.name,
                file_size: this.curFile.size,
                file_id: this.curFile.file_id,
                fromUser: {
                    id: user.user_id,
                    displayName: user.realname,
                    avatar: user.avatar,
                    account: user.account
                }
            };
            var arr = [];
            userIds.forEach((item)=>{
                let toContactId = item.toString();
                let message=JSON.parse(JSON.stringify(msg));
                message.id = utils.generateRandId();
                message.status = "successd";
                message.sendTime = new Date().getTime();
                message.toContactId = toContactId;
                message.is_group = 0;
                if (toContactId.indexOf("group") != -1) {
                    message.is_group = 1;
                }
                arr.push(this.test(message));
            })
            // 批量请求
            Promise.all(arr).then(res => {
            }).catch(err => {
                console.log("error", err);
            });
            this.$message.success("发送成功！");
            this.visible = false;
         },
         // 封装循环请求
        fn(formData) {
            return new Promise((resolve, reject) => {
                this.$api.imApi.sendMessageAPI(formData)
                .then(res => {
                    if (res.code === 0) {
                    resolve(res);
                    } else {
                    this.$message.error(res.msg);
                    }
                })
                .catch(err => {});
            });
        },
        async test(formData) {
            let n = await this.fn(formData);
            return n;
        },
    }
  }
</script>
<style scoped lang="scss">
.file-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height:50px !important;
    background: #fff;
    border: solid 1px #e6e6e6;
    border-bottom: none;
    .file-header-title{
        font-weight: 700;
    }
}
.group-box{
    display: flex;
    flex-direction: column;

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
    padding:20px 0 0 20px;
}

.file-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 10px;
    width:120px;
    border: solid 1px #eee;
    border-radius: 8px;
    margin-right:20px;
    margin-bottom:20px;
    position: relative;
    overflow: hidden;
    .file-img {
        .img {
            width: 120px;
            height: 120px;
            border-radius: 8px;
        }
    }
    .file-name {
        text-align: center;
        text-overflow: ellipsis;
        width:110px;
        overflow: hidden;
        white-space: nowrap;

    }
    &:hover .file-opt{
        bottom: 0;
    }
    .file-opt{
        display: flex;
        justify-content: center;
        align-items: center;
        width:100%;
        margin-top:10px;
        position: absolute;
        bottom: -50px;
        background: #fff;
        transition: bottom 0.3s ease-out;
    }
}



    
::v-deep .el-card__body{
    padding: 0 !important;
}
</style>
  