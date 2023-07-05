import request from '@/utils/request'

// 设置配置
export function setConfig(params) {
    return request({
        url: 'manage/config/setConfig',
        method: 'post',
        data: params
    })
}

// 获取配置
export function getConfig(params) {
    return request({
        url: 'manage/config/getConfig',
        method: 'post',
        data: params
    })
}

// 获取所有配置
export function getAllConfig(params) {
    return request({
        url: 'manage/config/getAllConfig',
        method: 'post',
        data: params
    })
}

// 获取邀请链接
export function getInviteLink(params) {
    return request({
        url: 'manage/config/getInviteLink',
        method: 'post',
        data: params
    })
}

// 发送测试邮件
export function sendTestEmail(params) {
    return request({
        url: 'manage/config/sendTestEmail',
        method: 'post',
        data: params
    })
}
