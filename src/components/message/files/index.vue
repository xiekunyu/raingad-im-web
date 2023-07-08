<template>
    <el-container>
        <el-aside width="200px" class="slider-aside">Aside</el-aside>
        <el-main>Main</el-main>
    </el-container>
</template>
<script>
export default {
    name: "manageGroup",
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
        };
    },
    mounted() {
        
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.slider-aside {
    background-color: #efefef;
}
</style>