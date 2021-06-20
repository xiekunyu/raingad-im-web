<template>
    <div class="chat-main">
        <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
         <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="all">
                <div class="el-tab-body-list">
                    <el-scrollbar style="height:100%;">
                        <ChatItem :data="items"></ChatItem>
                         <ChatItem :data="items"></ChatItem>
                          <ChatItem :data="items"></ChatItem>
                    </el-scrollbar>
                </div>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="文本" name="text">
                <div class="el-tab-body-list">
                    <el-scrollbar style="height:100%;">
                        
                    </el-scrollbar>
                </div>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="图片" name="image">
                <div class="el-tab-body-list">
                    <el-scrollbar style="height:100%;">
                        不就是一个文盲
                    </el-scrollbar>
                </div>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="文件" name="file">
                <div class="el-tab-body-list">
                    <el-scrollbar style="height:100%;">
                        不就是一个文盲
                    </el-scrollbar>
                </div>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ChatItem from "./chatItem";
    export default {
        name: "file",
        components: {
            ChatItem
        },
        props:{
            contactsId:{
                type:String,
                default:false//定义参数默认值
            },
        },
        data() {
            return {
                websocket: null,
                activeName: 'all',
                input3:'',
                select:'',
                items:{
                    avatar:'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
                    displayName:'管理员',
                    content:'http://im-img.gzydong.club/media/images/talks/60c1be090a0f1CpBf8qMZ6NzvczF8_550x281.png',
                    sendTime:1601234567,
                    fileSize:'26545',
                    type:'file',
                    fileName:'测试文件.docx'
                }
            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        },
        created() {
        
        }
    }
</script>
<style scoped  lang="scss">
.chat-main{
    margin: -20px -5px;
}
.el-tab-body-list{
    height:400px;

}

.input-with-select{
    width:250px;
}
.el-select .el-input {
    width: 130px;
  }
.el-dialog >>> .el-dialog__body{
padding: 15px;
}

.chat-list-item{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;;
    .chat-list-avatar{
        width:40px;
        margin-right:10px;
    }
    .chat-list-body{
        flex:auto;
        .chat-list-title{
            color:#666;
            margin-bottom:5px;
            .time{
                font-size:12px;
                color:#ccc;
                margin-left:20px;
            }
        }
        .chat-list-content{
            padding:5px 10px;
            color:#909399;
            background-color: #f4f4f5;
        }
    }
}
  
</style>
