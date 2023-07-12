import axios from 'axios'
import cache from './cache'
import Lockr from 'lockr'
import store from '@/store'

/** 移除授权信息 */
export function removeAuth() {
    return new Promise((resolve, reject) => {
        cache.rmAxiosCache()
        delete axios.defaults.headers['authToken']
        delete axios.defaults.headers['sessionId']
        resolve(true)
    })
}

/** 注入授权信息 */
export function addAuth(adminToken, sessionId) {

    return new Promise((resolve, reject) => {
        axios.defaults.headers['authToken'] = adminToken
        axios.defaults.headers['sessionId'] = sessionId
            // store.dispatch('SystemLogoAndName')
        resolve(true)
    })
}

/** 获取授权信息 */
export function getAuth() {

    /** 全局路由触发这个方法  如果有缓存暂时在这里交与 */
    if (Lockr.get('authToken') && !axios.defaults.headers['authToken']) {
        cache.updateAxiosCache()
    }
    if (Lockr.get('authToken')) {
        return true
    }
    return false
}