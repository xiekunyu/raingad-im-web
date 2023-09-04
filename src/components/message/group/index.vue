<template>
    <el-dialog
        :title="title"
        :visible="visible"
        :modal="true"
        :width="width"
        @open="openDialog"
        @close="closeDialog"
        append-to-body
        >
        <div class="mb-20" v-show="isAdd">
            群聊名称：<el-input v-model="groupName" placeholder="请输入群聊名称" style="width:300px"></el-input> <span class="ml-10 c-999"> （必填项）</span>
        </div>
        <el-transfer
            filterable
            :titles="createChatTitles"
            filter-placeholder="请输入关键词"
            v-model="selectUid"
            :props="defaultProps"
            :data="allUser"
        >
        </el-transfer>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="manageGroup">确 定</el-button>
        </span>
        </el-dialog>
</template>
<script>
export default {
    name: "manageGroup",
    props: {
        title: {
            type: String,
            default: "创建群聊",
        },
        visible: {
            type: Boolean,
            default: false,
        },
        userIds: {
            type: Array,
            default: () => [],
        },
        isAdd: {
            type: Number,
            default: 0,
        },
        width: {
            type: String,
            default: '612px',
        },
        groupId:{
            type: String,
            default: '',
        }
    },
    data() {
        return {
            createChatTitles: ["用户列表", "已选用户"],
            selectUid: [],
            allUser: [],
            groupName: "",
            defaultProps: {
                key: "user_id",
                label: "realname",
                pinyin: "name_py"
            },
        };
    },
    mounted() {
        
    },
    methods: {
        openDialog() {
            let params={};
            if(this.userIds.length>0){
                params.user_ids = this.userIds;
            }
            if(this.groupId && this.isAdd==2){
                params.group_id = this.groupId;
            }
            this.getAllUser(params);
        },
        closeDialog() {
            this.$emit("update:visible", false);
            this.selectUid = [];
        },
        manageGroup() {
            switch(this.isAdd){
                case 0:
                    // 添加成员
                    if (this.selectUid.length < 1) {
                        this.$message.error("请选择要添加的成员");
                        return;
                    }
                    break;
                case 1:
                    // 创建群聊
                    if (this.selectUid.length < 2) {
                        this.$message.error("群聊人数不能少于2人");
                        return;
                    }
                    if(this.groupName == "" || this.groupName.length<2 || this.groupName.length>20) {
                        this.$message.error("请输入正确的群聊名称");
                        return;
                    }
                    break;
                case 2:
                    if (this.selectUid.length != 1) {
                        this.$message.error("只能选择一位成员！");
                        return;
                    }
                    break;
            }
            this.$emit("manageGroup", this.selectUid,this.isAdd,this.groupName);
        },
        // 获取所有人员列表
        getAllUser(data) {
            this.$api.imApi.getAllUserAPI(data).then(res => {
                const data = res.data;
                this.allUser = data;
            });
        },
    },
};
</script>