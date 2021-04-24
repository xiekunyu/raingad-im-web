// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import LemonIMUI from 'lemon-imui';
import 'lemon-imui/dist/index.css';

import store from './store'
Vue.use(store);
Vue.use(ElementUI, { size: 'small' })
Vue.use(LemonIMUI);
Vue.config.productionTip = false
import '@/permission' // 权限控制
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
