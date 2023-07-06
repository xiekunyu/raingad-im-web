import request from '@/utils/request'
const configApi = {};
// 设置配置
configApi.setConfig= (data) => {
    return request({
        url: 'manage/config/setConfig',
        method: 'post',
        data: data
    })
}

// 获取配置
configApi.getConfig = (data) => {
    return request({
        url: 'manage/config/getConfig',
        method: 'post',
        data: data
    })
}

// 获取所有配置
configApi.getAllConfig = (data)=>{
    return request({
        url: 'manage/config/getAllConfig',
        method: 'post',
        data: data
    })
}

// 获取邀请链接
configApi.getInviteLink=(data)=>{
    return request({
        url: 'manage/config/getInviteLink',
        method: 'post',
        data: data
    })
}

// 发送测试邮件
configApi.sendTestEmail = (data) => {
    return request({
        url: 'manage/config/sendTestEmail',
        method: 'post',
        data: data
    })
}

export default configApi;