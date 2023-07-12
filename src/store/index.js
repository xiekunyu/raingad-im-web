import Vue from 'vue'
import Vuex from 'vuex'
import Lockr from 'lockr'
import {
    addAuth,
    removeAuth
} from '@/utils/auth'
import {
    resetRouter
} from '@/router'



Vue.use(Vuex)


const state = {
    userInfo: null, // 用户信息
    // 权限信息
    allAuth: null, // 总权限信息 默认空 调整动态路由
    socketAction: '',
    contactSync: '',
    toContactId: 0,
    unread: 0,
    allContacts: [],
    globalConfig:[], // 全局配置
    setting: {
        sendKey: "1",
        theme: "default",
        isVoice: true,
        avatarCricle: false,
        hideMessageName: false,
        hideMessageTime: false,
    }
}

const mutations = {
    SET_USERINFO: (state, userInfo) => {
        Lockr.set('UserInfo', userInfo)
        state.userInfo = userInfo
        if(userInfo.setting) {
            state.setting = userInfo.setting
        }
    },
    SET_AUTH: (state, data) => {
        const token = data.authToken
        const sessionId = data.sessionId
        Lockr.set('authToken', token)
        Lockr.set('sessionId', sessionId)
        addAuth(token, sessionId)
    },
    catchSocketAction(state, data) {
        state.socketAction = data;
    },
    updateUnread: (state, data) => {
        state.unread = parseInt(data);
    },
    initContacts: (state, data) => {
        state.allContacts = data;
    },
    openChat: (state, data) => {
        state.toContactId = data;
        state.contactSync = Math.random().toString(36).substr(-8);
    },
    updateSetting(state, data) {
        state.userInfo.setting = data;
        state.setting = data;
    },
    setGlobalConfig(state, data) {
        state.globalConfig = data;
    }
}

const actions = {
    // 登录
    Login({
        commit,
        dispatch
    }, userInfo) {
        return new Promise((resolve, reject) => {
            this.$api.commonApi.loginAPI(userInfo).then(res => {
                const data = res.data || data
                commit('SET_AUTH', data)
                commit('SET_USERINFO', data.userInfo)
                resolve(res)
            }).catch(error => {
                console.log(error);
                dispatch('LogOut')
                reject(error)
            })
        })
    },

    // 获取用户信息
    GetUserInfo({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            // adminUsersReadAPI().then(response => {
            //     // 邮件信息 走之前的逻辑
            //     commit('SET_USERINFO', response.data)
            //     resolve(response)
            // }).catch(error => {
            //     reject(error)
            // })
        })
    },

    // 登出
    LogOut({
        commit
    }) {
        return new Promise((resolve, reject) => {
            this.$api.commonApi.logoutAPI().then(() => {
                /** flush 清空localStorage .rm('authToken') 按照key清除 */
                Lockr.rm('authToken');
                Lockr.rm('sessionId');
                removeAuth()
                resetRouter()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取权限
    // getAuth({
    //     commit
    // }) {
    //     return new Promise((resolve, reject) => {
    //         adminIndexAuthListAPI().then((response) => {
    //             const data = response.data
    //             Lockr.set('authList', data)
    //             data.wkFirstModel = data.firstModel
    //             commit('SET_ALLAUTH', data)
    //             resolve(data)
    //         }).catch(error => {
    //             reject(error)
    //         })
    //     })
    // },
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})