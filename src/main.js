import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import UserCard from '@/components/message/user/index'
Vue.use(UserCard)
import Preview from '@/components/message/preview/index.js'
Vue.use(Preview)
import LemonIMUI from 'lemon-imui';
import 'lemon-imui/dist/index.css';
Vue.use(ElementUI, { size: 'small' })
Vue.use(LemonIMUI);
import router from './router'

import store from './store'
Vue.use(store);

import Clipboard from 'v-clipboard'
Vue.use(Clipboard)


Vue.config.productionTip = false

import './directive/index'
import '@/permission' // 权限控制

import packageData from '../package.json' // 全局数据
Vue.prototype.$packageData = packageData;

import LemonMessageVoice from "./components/message/messageType/voice";
import LemonMessageVideo from "./components/message/messageType/video";
import LemonMessageWebrtc from "./components/message/messageType/webrtc";
Vue.component(LemonMessageVideo.name, LemonMessageVideo);
Vue.component(LemonMessageVoice.name, LemonMessageVoice);
Vue.component(LemonMessageWebrtc.name, LemonMessageWebrtc);
import Api from "@/api/index.js"
Vue.prototype.$api = Api

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})