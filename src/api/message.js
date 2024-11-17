import request from '@/utils/request'

const messageApi = {}
/**
 * 获取消息列表
 * @param {*} data
 */
messageApi.getMessageList= (data)  =>{
    return request({
        url: 'manage/message/index',
        method: 'post',
        data: data
    })
}

/**
 * 获取联系人列表
 * @param {*} data
 */
messageApi.getContacts= (data)  =>{
    return request({
        url: 'manage/message/getContacts',
        method: 'post',
        data: data
    })
}

/**
 * 消息处理
 * @param {*} data
 */
messageApi.dealMsg= (data)  =>{
    return request({
        url: 'manage/message/dealMsg',
        method: 'post',
        data: data
    })
}

export default messageApi;