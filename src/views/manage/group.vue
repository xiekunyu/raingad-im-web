<template>
    <div class="pd-20">
        <el-container>
            <el-aside width="400px">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>群聊列表</span>
                        <el-button style="float: right; padding: 3px 0" type="text">创建群聊</el-button>
                    </div>
                    <div class="lz-flex group-box">
                        <div class="group-box-list">11</div>
                        <div class="group-box-page" align="center">
                            <el-pagination
                                background
                                :total="1000"
                                :current-page="value"
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
                        <el-button style="float: right; padding: 3px 0" type="text">创建群聊</el-button>
                    </div>
                    <div class="lz-flex group-box">
                        <div class="group-box-list">11</div>
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
        currentPage4: 4
      }
    }
  }
</script>
<style scoped lang="scss">
.group-box{
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
    .group-box-list{
        flex:1;
    }
    .group-box-page{
        padding-top:10px;
        height: 33px;
        line-height: 33px;
    }
}
.item{
    padding: 10px;
    border-bottom: solid 1px #e6e6e6;
}
</style>
  