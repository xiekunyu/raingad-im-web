import request from '@/utils/request'

const commonApi = {}
commonApi.loginAPI= (params) =>{
    return request({
        url: 'common/pub/login',
        method: 'post',
        data: params
    })
}

commonApi.logoutAPI =()=>{
    return request({
        url: 'common/pub/logout',
        method: 'post'
    })
}

// 绑定用户id以及初始化消息服务
commonApi.bindClientIdAPI= (params) =>{
    return request({
        url: 'common/pub/bindUid',
        method: 'post',
        data: params
    })
}

// 用户下线
commonApi.offlineAPI= (params) =>{
    return request({
        url: 'common/pub/offline',
        method: 'post',
        data: params
    })
}

// 绑定群聊id
commonApi.bindGroupAPI= (params) =>{
    return request({
        url: 'common/pub/bindGroup',
        method: 'post',
        data: params
    })
}

// 发送验证码
commonApi.sendCode= (params) =>{
    return request({
        url: 'common/pub/sendCode',
        method: 'post',
        data: params
    })
}

// 获取系统配置信息
commonApi.getSystemInfo= (data)  =>{
    return request({
        url: 'common/pub/getSystemInfo',
        method: 'post',
        data: data
    })
}

// 注册用户
commonApi.register= (data)  =>{
    return request({
        url: 'common/pub/register',
        method: 'post',
        data: data
    })
}

// 上传头像
commonApi.uploadAvatar= (data)  =>{
    return request({
        url: 'common/upload/uploadAvatar',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export default commonApi;