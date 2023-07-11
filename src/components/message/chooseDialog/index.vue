<template>
    <el-dialog
      :title="title"
      :visible="visible"
      :modal="true"
      @close="closeDialog"
      :width="width"
      append-to-body
    >
      <el-transfer
        filterable
        :titles="createChatTitles"
        filter-placeholder="请输入关键词"
        v-model="selectUid"
        :props="contactsProps"
        :data="allUser"
      >
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="comfirmChat">确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
export default {
    name: "manageGroup",
    props: {
        title: {
            type: String,
            default: "选择聊天",
        },
        visible: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: '612px',
        },
        allUser: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            createChatTitles: ["用户列表", "已选用户"],
            selectUid: [],
            contactsProps: {
                key: "id",
                label: "realname"
            },
        };
    },
    mounted() {
        
    },
    methods: {
        closeDialog() {
            this.$emit("update:visible", false);
            this.selectUid = [];
        },
        comfirmChat() {
            if(this.selectUid.length === 0) {
                this.$message.error("请选择聊天对象");
                return;
            }
            this.$emit("selectChat", this.selectUid);
        }
    },
};
</script>