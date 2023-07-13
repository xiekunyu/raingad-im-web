<template>
    <el-container>
        <el-header class="slider-aside">
            <el-tabs v-model="activeName" tab-position="bottom" @tab-click="handleClick" class="tab-diy">
                <el-tab-pane label="所有文件" name="all"></el-tab-pane>
                <el-tab-pane label="我发送的" name="send"></el-tab-pane>
                <el-tab-pane label="我收到的" name="receive"></el-tab-pane>
            </el-tabs>
        </el-header>
        <el-main class="no-padding">
            <fileItems ref="fileItem"></fileItems>
        </el-main>
    </el-container>
</template>
<script>
import fileItems from "./items.vue";
export default {
    name: "files",
    components: {
        fileItems,
    },  
    props: {
        title: {
            type: String,
            default: "创建群聊",
        }
    },
    data() {
        return {
            selectUid: [],
            allUser: [],
            activeName: "all",
        };
    },
    methods: {
        handleClick(tab) {
          if(tab.name=="all"){
            this.$refs.fileItem.changeRole(0);
          }else if(tab.name=="send"){
            this.$refs.fileItem.changeRole(1);
          }else if(tab.name=="receive"){
            this.$refs.fileItem.changeRole(2);
          }
        },
    }
}
</script>
<style lang="scss" scoped>
.slider-aside {
    height:50px !important;
    background-color: #f9f9f9;
}
.tab-diy{
    width:250px;
    margin:0 auto;
}
::v-deep .el-tabs__nav-wrap:after{
    height:0 !important;
}
</style>