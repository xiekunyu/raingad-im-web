<template>
    <el-dialog
        title="群二维码分享"
        :visible="visible"
        :modal="true"
        width="340px"
        @close="closeDialog"
        append-to-body
        >
        <el-image :src="image" style="width:300px;height:432px;">
            <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline f-20"></i>
                <p class="ml-10 f-18">二维码生成中...</p>
            </div>
        </el-image>

        <div align="center" class="mt-20"><el-button @click="saveBase64Image">保存到电脑</el-button></div>
        <vue-canvas-poster :widthPixels="1000" :painting="painting" @success="success" @fail="fail" style="display: none;"></vue-canvas-poster>
        </el-dialog>
</template>
<script>
    import { VueCanvasPoster } from 'vue-canvas-poster'
    export default {
        components: {
            VueCanvasPoster,
        },
        props: {
            contact: {
                type: Object,
                default: () => {
                    return {}
                },
            },
            visible: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                painting: {
                    width: '500px',
                    height: '720px',
                    background: '#ffffff',
                    views: [
                    ],
                },
                image:''
            }
        },
        watch: {
            visible(val) {
                if (val) {
                    this.getGroupUserInfo();
                }
            },
        },
        methods: {
            success(src) {
                this.image=src;
            },
            fail(err) {
            },
            closeDialog() {
                this.$emit("update:visible", false);
                this.image = '';
            },
            saveBase64Image() {
                // 创建一个虚拟的链接
                var link = document.createElement('a');
                link.href = this.image;

                // 设置下载属性
                link.download = this.contact.displayName + '.png';

                // 触发点击事件进行下载
                link.click();
            },
            getGroupUserInfo() {
                this.$api.imApi.getGroupInfoAPI({group_id:this.contact.id}).then(res=>{
                    var data=res.data;
                    this.painting.views=[{
                        type: 'image',
                        url: data.avatar,
                        css: {
                            top: '40px',
                            left: '200px',
                            borderRadius: '8px',
                            width: '100px',
                            height: '100px',
                        },
                    },{
                        type: 'text',
                        text: '群聊：'+ data.name,
                        css: {
                            top: '160px',
                            left: '50px',
                            width: '400px',
                            maxLines: 1,
                            fontSize: '30px',
                            textAlign: 'center',
                            color: '#000000',
                            fontWeight: 'bloder',
                        },
                    },{
                        type: 'qrcode',
                        content: data.qrUrl,
                        css: {
                            top: '240px',
                            left: '70px',
                            color: '#000',
                            width: '360px',
                            height: '360px'
                        },
                    },{
                        type: 'text',
                        text: '该二维码7天内（'+data.qrExpire+'前）有效',
                        css: {
                            top: '640px',
                            left: '50px',
                            width: '400px',
                            maxLines: 1,
                            fontSize: '20px',
                            textAlign: 'center',
                            color: '#999',
                        },
                    }]
                })
            },
        },
    }
</script>
<style>
    .image-slot{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #f5f7fa;
        color: #909399;
    }
</style>