import request from '@/utils/request'

const friendApi = {}

// 获取好友申请列表
friendApi.getApplyList= (params) =>{
    return request({
        url: 'enterprise/friend/index',
        method: 'post',
        data: params
    })
}

// 添加好友
friendApi.addFriend =(params)=>{
    return request({
        url: 'enterprise/friend/add',
        method: 'post',
        data: params
    })
}

// 删除好友
friendApi.delFriend= (params) =>{
    return request({
        url: 'enterprise/friend/del',
        method: 'post',
        data: params
    })
}

// 接受或者拒绝好友申请
friendApi.acceptFriend= (params) =>{
    return request({
        url: 'enterprise/friend/update',
        method: 'post',
        data: params
    })
}

// 设置还有备注
friendApi.setNickname= (params) =>{
    return request({
        url: 'enterprise/friend/setNickname',
        method: 'post',
        data: params
    })
}

// 获取系统消息数量
friendApi.getApplyMsg= (params) =>{
    return request({
        url: 'enterprise/friend/getApplyMsg',
        method: 'post',
        data: params
    })
}



export default friendApi;