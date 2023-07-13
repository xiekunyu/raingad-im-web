<template>
    <el-container>
        <el-header class="slider-aside">
            <el-tabs v-model="activeName" tab-position="bottom" @tab-click="handleClick" class="tab-diy">
                <el-tab-pane label="我收到的" name="receive"></el-tab-pane>
                <el-tab-pane label="我发送的" name="send"></el-tab-pane>
            </el-tabs>
        </el-header>
        <el-main class="no-padding">
            <div class="apply-list">
                <div class="apply-list-main">
                    <el-scrollbar>  
                        <div class="apply-list-item" v-for="(x,index) in list" :key="index">
                            <div class="avatar">
                                <el-avatar :src="x.create_user_info.avatar"></el-avatar>
                            </div>
                            <div class="main">
                                <div> <span class="fc-primary">{{x.create_user_info.realname}}</span> 申请添加为好友</div>
                                <div class="f-12 c-999">{{x.remark}}</div>
                            </div>
                            <div class="option">
                                <el-popconfirm title="您确定接受该好友的申请吗？" @confirm="acceptApply(x.friend_id,true)">
                                    <el-button slot="reference" type="success" circle plain icon="el-icon-check"></el-button>
                                </el-popconfirm>
                                <el-popconfirm class="ml-15" title="您确定拒绝该好友的申请吗？" @confirm="acceptApply(x.friend_id,false)">
                                    <el-button slot="reference" type="danger"  circle plain icon="el-icon-close"></el-button>
                                </el-popconfirm>
                            </div>
                        </div>
                    </el-scrollbar>  
                </div>
                <div class="apply-list-page" align="center" v-if="!singlePage">
                    <el-pagination
                        background
                        :hide-on-single-page="singlePage"
                        @size-change="handleChange"
                        @current-change="getList"
                        :current-page.sync="params.page"
                        :page-sizes="[20, 50 ,100 , 200, 300, 400,500]"
                        :page-size.sync="params.limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                        </el-pagination>
                </div>
            </div>
        </el-main>
    </el-container>
</template>
<script>
export default {
    name: "apply",
    data() {
        return {
            singlePage:true,
            total:0,
            selectUid: [],
            list: [
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
                {
                    friend_id:1,
                    create_user_info:{
                        realname:"张三",
                        avatar:this.$packageData.logo
                    },
                    remark:"我是你老大！",
                },
            ],
            activeName: "receive",
            params: {
                page: 1,
                limit: 20,
                is_mine:0
            }
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        handleClick(tab) {
          if(tab.name=="send"){
            this.params.is_mine = 1;
          }else if(tab.name=="receive"){
            this.params.is_mine = 0;
          }
          this.params.page = 1;
          this.getList();
        },
        acceptApply(id,flag){
            console.log(id,flag)
        },
        getList(){
            this.$api.friendApi.getApplyList(this.params).then(res=>{
                this.list = res.data;
                this.total = res.count;
                this.singlePage = this.total<=this.params.limit;
            })
        },
        handleChange(val) {
            this.params.limit = val;
            this.getList();
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
    width:160px;
    margin:0 auto;
}
::v-deep .el-tabs__nav-wrap:after{
    height:0 !important;
}

.apply-list{
    display: flex;
    flex-direction: column;
    height:100%;
    .apply-list-main{
        flex:1;
        overflow: auto;
        .apply-list-item{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-bottom:solid 1px #f6f6f6;
            padding:10px;
            &:hover{
                background-color: #f6f6f6;
            }
            .avatar{
                width: 40px;
                margin-right: 10px;
            }
            .main{
                flex:1;
            }
            .option{
                width: 90px;
            }
        }
    }
    .apply-list-page{
        height:50px;
    }

}

</style>