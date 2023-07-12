import store from '@/store'
import Lockr from 'lockr'
import axios from 'axios'

const cache = {
    /**
     * 载入全部登陆信息
     */
    loadingCache: function() {
        if (Lockr.get('authToken') && !axios.defaults.headers['authToken']) {
            /** 将用户信息放入缓存 */
            const userInfo = Lockr.get('UserInfo')
            if (userInfo) {
                store.commit('SET_USERINFO', userInfo)
            }
        }
        store.commit('SET_APPNAME', Lockr.get('systemName'))
        store.commit('SET_APPLOGO', Lockr.get('systemLogo'))
    },
    /**
     * 请求和更新登录缓存
     */
    updateAxiosCache: function() {
        axios.defaults.headers['authToken'] = Lockr.get('authToken')
        axios.defaults.headers['sessionId'] = Lockr.get('sessionId')
    },
    updateAxiosHeaders: function() {
        axios.defaults.headers['authToken'] = Lockr.get('authToken')
        axios.defaults.headers['sessionId'] = Lockr.get('sessionId')
    },
    /**
     * 移除登录信息
     * @param {*}
     */
    rmAxiosCache: function() {
        Lockr.rm('authToken');
        Lockr.rm('sessionId')
    }
}

export default cache