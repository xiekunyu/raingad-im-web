<template>
  <div class="webrtc-box" v-show="status">
    <audio id="music1">
        <source src="//im.file.raingad.com/static/voice/calling.mp3">
      </audio>
      <audio id="music2">
        <source src="//im.file.raingad.com/static/voice/guaduan.mp3">
      </audio>
    <video v-show="localStream && is_video" class="localvideo" ref="localvideo" autoplay playsinline  muted></video>
    <video v-show="remoteStream && is_video" class="remotevideo" ref="remotevideo" autoplay playsinline></video>
    <div>
      <div class="call-user" v-if="caller">
        <img class="avatar" v-if="status!=2 || !is_video" :src="caller.avatar" alt="">
        <div class="text"> 
          <b v-if="!is_video && status==2">{{caller.displayName}}</b>
          <span v-if="status!=2">
            <span v-if="isReceived"> {{caller.displayName}} 正在请求与您{{is_video ? '视频' : '语音'}}通话</span>
            <span v-else>您正对 <b>{{caller.displayName}}</b> 发起{{is_video ? '视频' : '语音'}}通话</span>   
          </span>
        </div>
        <div class="call-time" v-if="callTime && status==2">
					  {{setCallTime()}}
				  </div>
      </div>
      <div class="calling-button">
        <div class="button" v-if="caller && status==3" >
          <img class="image" src="https://im.file.raingad.com/static/image/jieting.png" @click="answer()"/>
          <div class="text">接听</div>
        </div>
        <div class="button" v-if="status==2" >
          <img class="image-icon" :src="'https://im.file.raingad.com/static/image/voice'+(voiceStatus ? '' : '-off')+'.png'" @click="switchVoice()"/>
        </div>
        <div class="button" v-if="caller && status!=0" >
          <img class="image" src="https://im.file.raingad.com/static/image/guaduan.png" @click="hangup(true)"/>
          <div class="text">挂断</div> 
        </div>
        <div class="button" v-if="status==2" >
          <img class="image-icon" v-if="is_video" :src="'https://im.file.raingad.com/static/image/camera'+(videoStatus ? '' : '-off')+'.png'" @click="switchVideo()"/>
          <div class="image-icon" v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "webrtc",
  props: {
    contact: {
      type: Object,
      default: {},
    },
    userInfo: {
      type: Object,
      default: {},
    },
    config: {
      type: Object,
      default: {},
    },
    alias:{
      type:String,
      default:'raingad'
    }
  },
  data() {
    return {
      pc: null,           //peer实例
      status: 0,          //状态0，默认，1：拨号中，2通话中，3来电中
      localVideo: "",    //本地视频的DOM
      remoteVideo: "",   //远程视频的DOM
      remoteStream: null, // 远端视频流
      localStream: null,  // 本地视频流
      caller: null,       //来电用户
      is_video: 1,        //是否为视频通话
      isReceived: false,  //是否为接听者
      videoStatus: true,  //视频开启状态
      voiceStatus: true,  //语音开启状态
      cutdown: 40,        //拨号超时
      timer: null,         //计时器
      offerParams:{},
      callTime:0, //通话时间
      timerIntervalId:null,  //通话计时器
    };
  },
  mounted() {
    this.localVideo = this.$refs.localvideo;
    this.remoteVideo = this.$refs.remotevideo; 
  },
  methods: {
    // 初始化webrtc
    initPeer(stream){
        let opt = this.config;
        let config = {
            'iceServers': [{
                'urls': ['stun:stun.xten.com', 'stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302',
                  'stun:stun2.l.google.com:19302', 'stun:stun3.l.google.com:19302', 'stun:stun4.l.google.com:19302'
                ]
              },{
                  'urls': (opt.stun ?? '') ? [opt.stun] : ['stun:stun.callwithus.com'], // 自己搭建服务器地址
                  "username": opt.stunUser ?? null,
                  "credential": opt.stunPass ?? null
              }
            ],
          };
        this.pc = new RTCPeerConnection(config);
        // 接收视频流
        this.pc.ontrack = (event) => {
          if(this.localVideo){
            this.remoteStream = event.streams[0];
            this.remoteVideo.srcObject = event.streams[0];
          }
        };
        this.localStream = stream;
        stream.getTracks().forEach((track) => {
          this.pc.addTrack(track, stream);
        });
        this.localVideo.srcObject = this.localStream;
    },
    // 初始化本地媒体
    initLocalStream(call_id, is_video) {
      this.offerParams = is_video ? {
				  offerToRecieveAudio: 1,
				  offerToRecieveVideo: 1
				} : {
				  offerToRecieveAudio: 1,
				  offerToRecieveVideo: 0
			  }
      let video=is_video==1 ? true : false;
      var getUserMedias = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedias({ video: video, audio: {echoCancellation: true} }, (stream) => {
        this.initPeer(stream);
        // 拨打电话
        if (call_id) {
          // 发起通话请求
          this.$emit('message',{event:'calling'});
          // 拨打中
          this.status = 1;
          // 计时器，如果一段时间没有接听则自动挂断
          this.timer = setInterval(() => {
            this.cutdown--;
            if (this.cutdown == 0) {
              this.hangup(true);
            }
          }, 1000)
        // 接听电话
        } else {
          // 初始化完成后告诉对方已经接听电话
          this.$emit('message',{ event: 'acceptRtc',code:904});
          this.startTime();
        }
      },(err) => {
        this.hangup(true);
        let text= is_video==1 ? '视频' : '语音';
        this.$message.error('请连接'+text+'设备，并开启'+text+'权限');
      });
    },
    // 拨打电话
    called(is_video) {
      // 如果状态不为0则不允许拨打电话
      if (this.status || this.caller) {
        return false;
      }
      this.is_video = is_video;
      this.caller = this.contact;
      this.initLocalStream(true, is_video);
      this.playMusicCall('state');
    },
    // 接听电话
    answer() {
        this.status = 2;
        this.initLocalStream(false, this.is_video);
        this.playMusicCall('close');
    },
    // 处理接收到的消息
    // 开始通话计时
    startTime() {
      this.timerIntervalId=setInterval(()=>{
        this.callTime++
      },1000)
      },
    // 设置通话时间
    setCallTime(){
      let time=this.callTime;
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time - (hours * 3600)) / 60);
      const seconds = time - (hours * 3600) - (minutes * 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    // 挂断电话
    hangup(btn) {
      clearInterval(this.timer);
      clearInterval(this.timerIntervalId);
      // 如果不再通话中才需要取消播放铃声
      if(this.status!=2){
        this.playMusicCall('close');
      }
      // 通话取消
      let code=902;
      // 通话中挂断
      if(this.status==2 ){
        code=906
        // 拒绝挂断
      }else if(this.status==3 ){
        code=903
        //对方忙线中
      }else if(this.status==4 ){
        code=907
      }
      if (this.status) {
        this.status = 0;         //重置通话状态
        this.closeLocalMedia();  //关闭本地媒体
        this.remoteStream=null;  //关闭远程媒体
        this.playMusicHandup();  // 播放挂断音
        this.isReceived = false; //重置是否为接听者
        this.caller = null;      //重置通话对象
        this.voiceStatus=true;
        this.videoStatus=true;
      }
      this.$emit('message',{event:'hangup',code:code,isbtn:btn,callTime:this.callTime});
      //重置通话时间
      this.callTime=0; 
    },
    // 关闭本地媒体
    closeLocalMedia() {
      if (this.localStream && this.localStream.getTracks()) {
        this.localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      this.localStream = null;
    },
    // 静音
    switchVoice() {
      if (this.localStream == null) {
        alert('请打开音视频');
        return false;
      }
      const tracks = this.localStream.getTracks();
      if (this.voiceStatus) {
        tracks.forEach(track => {
          if (track.kind === 'audio') {
            track.enabled = false
          }
        });
        this.voiceStatus = false;
      } else {
        tracks.forEach(track => {
          if (track.kind === 'audio') {
            track.enabled = true
          }
        });
        this.voiceStatus = true;
      }
    },
    // 临时开、关视频
    switchVideo() {
      if (this.localStream == null) {
        alert('请打开音视频');
        return false;
      }
      const tracks = this.localStream.getTracks();
      if (this.videoStatus) {
        tracks.forEach(track => {
          if (track.kind === 'video') {
            track.enabled = false
          }
        });
        this.videoStatus = false;
      } else {
        tracks.forEach(track => {
          if (track.kind === 'video') {
            track.enabled = true
          }
        });
        this.videoStatus = true;
      }
    },
    webrtcAction(msg){
      let e=msg.extends;
      switch (e.event) {
        case "calling":
          // 来电了
          this.caller = msg.fromUser;
          this.is_video = parseInt(e.type);
          this.status = 3;
          this.isReceived = true;
          this.playMusicCall('state');
          break;
        case "hangup":
          this.hangup(false);
          break;
        case "busy":
          this.status=4;
            this.hangup(false);
          break;
        case "acceptRtc": //已经接听，创建offer并发送
          this.status = 2;
          clearInterval(this.timer);
          this.startTime();
          this.playMusicCall('close');
          this.createOffer();
          // 创建offer需要监听ice流
          this.onicecandidate();
          break;
        case "turndown":
          break;
        case "answer":
          //同步answer信息...
          this.pc.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp:  e.sdp
          }));
          break;	
        case "iceCandidate":
          setTimeout(() => {
            // 添加ice完成通话连接
            if (typeof(e.iceCandidate) === 'object') {
              this.pc.addIceCandidate(new RTCIceCandidate(e.iceCandidate));
            } else {
              this.pc.addIceCandidate(new RTCIceCandidate(JSON.parse(e.iceCandidate)));
            }
          },100)
          break;
        case "offer":
          this.pc.setRemoteDescription(new RTCSessionDescription({
            type: 'offer',
            sdp: e.sdp
          }));
          this.createAnswer()
          break;
        
      }
    },
    // 创建offer-sdp
    createOffer() {
      this.pc.createOffer(this.offerParams).then((offer) => {
        this.pc.setLocalDescription(offer);
        // 发送offer请求
          this.$emit('message',{
            event: 'offer',
            sdp: offer.sdp
          });
      });
    },
    // 创建应答sdp
    createAnswer() {
      this.pc.createAnswer(this.offerParams).then((answer) => {
        this.pc.setLocalDescription(answer);
        // 发送回答请求
        this.$emit('message',{
          event: 'answer',
          sdp: answer.sdp
        });
        this.onicecandidate();
      });
    },
    onicecandidate(){
      this.pc.onicecandidate = (event) => {
          var iceCandidate = event.candidate;
          if (iceCandidate) {
            // 发送请求
            this.$emit('message',{
              event: 'iceCandidate',
              iceCandidate: JSON.parse(JSON.stringify(iceCandidate))
            });
          }
        };
    },
    // 播放响铃
    playMusicCall(type) {
      var audio = document.getElementById("music1");
      if(type === "close"){
        return audio.pause(); // 暂停
      } 
      if (type === "state") {
        audio.loop = true;
      }else {
        audio.loop = false;
      }
      if (audio.paused) {
        audio.play(); // 播放
      } else {
        audio.pause(); // 暂停
      }
    },
    // 播放挂断音
    playMusicHandup() {
      var audio = document.getElementById("music2");
      audio.play(); // 播放
    }
  }

};
</script>
<style scoped lang="scss">
.webrtc-box{
  background: #fff;
  padding:20px 5px 10px;
  border-radius: 6px;
  width:300px;
  max-height:600px;
  position: fixed;
  right:20px;
  bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index:99999;
  .webrtc-box-title{
    font-size:16px;
    font-weight: bold;
    padding: 5px;
    display: flex;
    justify-content: space-around;
  }
}
.localvideo{
    width:300px;
    height:200px;
}
.remotevideo{
    width:300px;
    height:200px;
}
.calling-button{
  display: flex;
  justify-content: space-around;
  padding: 20px;
  .button{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .image{
      width:60px;
      height:60px;
      margin-bottom: 10px;
    }
    .image-icon{
      width:30px;
      height:30px;
      margin-bottom: 10px;
    }
  }
}
.call-user{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .avatar{
    width:60px;
    height:60px;
    object-fit: contain;
    border-radius: 50%;
    overflow: hidden;
  }
  .text{
    font-size:16px;
    margin-top:15px;
  }
}
.call-time{
  color:#999;
  font-size: 24px;
  text-align: center;
}
</style>
  