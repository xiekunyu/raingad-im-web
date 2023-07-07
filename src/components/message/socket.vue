<template>
    <div>
        <audio id="chatAudio">
        <source src="../../assets/voice/notify.ogg" type="audio/ogg">
        <source src="../../assets/voice/notify.mp3" type="audio/mpeg">
        <source src="../../assets/voice/notify.wav" type="audio/wav">
        </audio>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {bindClientIdAPI,offlineAPI} from "@/api/login";
    import Lockr from 'lockr'

    export default {
        name: "socket",
        data() {
            return {
                websocket: null,
            }
        },
        methods: {
            getWsUrl(){
                let ws_host=process.env.VUE_APP_BASE_API;
                let protocol=window.location.protocol;
                let wsProtocol="ws://";
                if(process.env.NODE_ENV==='production'){
                    ws_host=window.location.host;
                }
                if(protocol=="https:"){
                    wsProtocol="wss://";
                }
                const WS_URI=wsProtocol+ws_host+"/wss";
                return WS_URI;
            },
            initWebSocket() { //初始化weosocket
                //ws地址
                const WS_URI = this.getWsUrl();
                this.websocket = new WebSocket(WS_URI);
                this.websocket.onmessage = this.websocketOnMessage;
                this.websocket.onclose = this.websocketClose;
                Vue.prototype.$websocket = this.websocket;

            },
            websocketOnMessage(e) { //数据接收
                const data = JSON.parse(e.data);
                let userInfo=Lockr.get('UserInfo');
                switch (data['type']) {
                    // 服务端ping客户端
                    case 'ping':
                        this.websocketSend({type:"pong"});
                        break;
                    // 登录 更新用户列表
                    case 'init':
                        Lockr.set('client_id',data['client_id']);
                        bindClientIdAPI({client_id: data['client_id'],user_id:userInfo.user_id}).then(res=>{
                            this.websocketSend({type:"bindUid",user_id:userInfo.user_id});
                            console.log(data['client_id'],'消息服务启动成功');
                        }).catch(error => {
                            console.log('连接失败');
                        })
                        break;
                    default:
                        this.$store.commit('catchSocketAction', data);
                        break;
                }
            },
            websocketSend(agentData) {//数据发送
                var data=JSON.stringify(agentData);
                this.websocket.send(data);
            },
            websocketClose(e) {  //关闭
                let userInfo=Lockr.get('UserInfo');
                offlineAPI({user_id:userInfo.user_id}).then(res=>{
                    console.log("connection closed (" + e.code + ")");
                })
            },
            playAudio () {
                const audio = document.getElementById('chatAudio');
                // 从头播放
                audio.currentTime = 0;
                audio.play();
            }
        },
        created() {
            this.initWebSocket()
        }
    }
</script>
