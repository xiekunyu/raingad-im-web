import request from '@/utils/request'

/**
 * 获取聊天联系人列表
 * @param {*} data
 */
export function getContactsAPI(data) {
    return request({
        url: 'im/getContacts',
        method: 'post',
        data: data
    })
}

/**
 * 发送聊天消息
 * @param {*} data
 */
 export function sendMessageAPI(data) {
    return request({
        url: 'im/sendMessage',
        method: 'post',
        data: data
    })
}

/**
 * 发送图片或文件消息
 * @param {*} data
 */
 export function sendFileAPI(data) {
    return request({
        url: 'upload/uploadFile',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 获取聊天记录
 * @param {*} data
 */
 export function getMessageListAPI(data) {
    return request({
        url: 'im/getMessageList',
        method: 'post',
        data: data
    })
}

/**
 * 修改消息为已读
 * @param {*} data
 */
 export function setMsgIsReadAPI(data) {
    return request({
        url: 'im/setMsgIsRead',
        method: 'post',
        data: data
    })
}

/**
 * 设置
 * @param {*} data
 */
 export function settingAPI(data) {
    return request({
        url: 'im/setting',
        method: 'post',
        data: data
    })
}

/**
 * 修改群组名称
 * @param {*} data
 */
 export function editGroupNameAPI(data) {
    return request({
        url: 'im/editGroupName',
        method: 'post',
        data: data
    })
}
