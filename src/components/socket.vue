<template>
    <div>
        <audio id="chatAudio">
        <!-- <source src="./assets/voice/notify.ogg" type="audio/ogg"> -->
        <source src="../assets/voice/notify.mp3" type="audio/mpeg">
        <!-- <source src="./assets/voice/notify.wav" type="audio/wav"> -->
        </audio>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {bindClientIdAPI} from "@/api/login";
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
                let WS_URI = "ws://im.raingad.com:8282";
                if(process.env.NODE_ENV==='production'){
                    var domain=document.domain;
                    var protocol=window.location.protocol;
                    var wsProtocol="ws://";
                    if(protocol=="https:"){
                        wsProtocol="wss://";
                    }
                    WS_URI=wsProtocol+domain+":8282";
                    console.log(WS_URI);
                }
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
                        this.websocket.send('{"type":"pong"}');
                        break;
                    // 登录 更新用户列表
                    case 'init':
                        Lockr.set('client_id',data['client_id']);
                        bindClientIdAPI({client_id: data['client_id'],user_id:userInfo.user_id}).then(res=>{
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
                console.log("发送消息：");
                console.log(agentData);
                this.websocket.send(agentData);
            },
            websocketClose(e) {  //关闭
                console.log("connection closed (" + e.code + ")");
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
