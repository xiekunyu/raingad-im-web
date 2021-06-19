<template>
    <div class="chat-main">
        <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
         <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="all">
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
            <el-tab-pane label="文本" name="text">
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

    export default {
        name: "file",
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
                select:''
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
<style scoped>
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
  
</style>
