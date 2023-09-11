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
    import Lockr from 'lockr'

    export default {
        name: "socket",
        data() {
            return {
                is_open_socket:false,
                websocket: null,
                pingInterval:30,
                connectNum:1,
                manMade:true,
                //心跳检测
		        timeout : 30000,//多少秒执行检测
		        heartbeatInterval : null, //检测服务器端是否还活着
		        reconnectTimeOut : null, //重连之后多久再次重连
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
                this.start();

                this.is_open_socket = true;
                this.websocket.onmessage = this.websocketOnMessage;
                this.websocket.onclose = this.websocketClose;
                Vue.prototype.$websocket = this.websocket;
                this.$store.state.wsStatus = true;
            },
            websocketOnMessage(e) { //数据接收
                const data = JSON.parse(e.data);
                let userInfo=Lockr.get('UserInfo');
                let token=Lockr.get('authToken');
                switch (data['type']) {
                    // 服务端ping客户端
                    case 'ping':
                        this.websocketSend({type:"pong"});
                        break;
                    // 登录 更新用户列表
                    case 'init':
                        Lockr.set('client_id',data['client_id']);
                        this.$api.commonApi.bindClientIdAPI({client_id: data['client_id'],user_id:userInfo.user_id}).then(res=>{
                            this.websocketSend({type:"bindUid",user_id:userInfo.user_id,token:token});
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
            websocketClose(e) {  //关闭
                console.log("websocket连接关闭")
                this.is_open_socket = false;
				clearInterval(this.heartbeatInterval)
				clearInterval(this.reconnectTimeOut)
				if (this.connectNum < 3) {
					this.manMade = false
					this.reconnect();
					this.connectNum += 1
                    return;
				} else {
                    this.$store.state.wsStatus = false;
					this.connectNum = 1;
                    this.websocket = null
				}
                let userInfo=Lockr.get('UserInfo');
                this.$api.commonApi.offlineAPI({user_id:userInfo.user_id}).then(res=>{
                    console.log("connection closed (" + e.code + ")");
                })
            },
            start() {
                this.heartbeatInterval = setInterval(() => {
                    this.websocketSend({
                        "type": "ping"
                    });
                }, this.timeout)
            },
            websocketSend(agentData) {//数据发送
                var data=JSON.stringify(agentData);
                if(this.checkStatus){
                    this.websocket.send(data);
                }
            },
            checkStatus(){
                if(!this.websocket || [2,3].includes(this.websocket.readyState)){
                    console.log("未链接！")
                    return false;
                }
                return true;
            },
            close() {
                if (!this.is_open_socket) {
                    return
                }
                this.websocket.close();
            },
            reconnect(){
                console.log("正在重连...");
                //停止发送心跳
                clearInterval(this.heartbeatInterval)
                //如果不是人为关闭的话，进行重连
                if (!this.is_open_socket && this.manMade == false ) {
                    console.log("5秒后重新连接...")
                    this.reconnectTimeOut = setInterval(() => {
                        this.initWebSocket();
                    }, 5000)
                }
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
