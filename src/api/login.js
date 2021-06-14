import request from '@/utils/request'

export function loginAPI(params) {
    return request({
        url: 'common/pub/login',
        method: 'post',
        data: params
    })
}

export function logoutAPI() {
    return request({
        url: 'common/pub/logout',
        method: 'post'
    })
}

// 绑定用户id以及初始化消息服务
export function bindClientIdAPI(params) {
    return request({
        url: 'common/pub/bindUid',
        method: 'post',
        data: params
    })
}

// 绑定群聊id
export function bindGroupAPI(params) {
    return request({
        url: 'common/pub/bindGroup',
        method: 'post',
        data: params
    })
}