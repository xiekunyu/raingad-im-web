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
 * 发送聊天消息
 * @param {*} data
 */
export function forwardMessageAPI(data) {
    return request({
        url: 'im/forwardMessage',
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
        url: 'group/editGroupName',
        method: 'post',
        data: data
    })
}

/**
 * 获取群成员列表
 * @param {*} data
 */
export function groupUserListAPI(data) {
    return request({
        url: 'group/groupuserlist',
        method: 'post',
        data: data
    })
}

/**
 * 获取群成员列表
 * @param {*} data
 */
export function getAllUserAPI(data) {
    return request({
        url: 'group/getAllUser',
        method: 'post',
        data: data
    })
}

/**
 * 创建群聊
 * @param {*} data
 */
export function addGroupAPI(data) {
    return request({
        url: 'group/add',
        method: 'post',
        data: data
    })
}


/**
 * 设置管理员
 * @param {*} data
 */
export function setManagerAPI(data) {
    return request({
        url: 'group/setManager',
        method: 'post',
        data: data
    })
}


/**
 * 设置管理员
 * @param {*} data
 */
export function removeUserAPI(data) {
    return request({
        url: 'group/removeUser',
        method: 'post',
        data: data
    })
}

/**
 * 添加群成员
 * @param {*} data
 */
export function addGroupUserAPI(data) {
    return request({
        url: 'group/addGroupUser',
        method: 'post',
        data: data
    })
}

/**
 * 添加群成员
 * @param {*} data
 */
export function removeGrouprAPI(data) {
    return request({
        url: 'group/removeGroup',
        method: 'post',
        data: data
    })
}


/**
 * 添加群成员
 * @param {*} data
 */
export function setNoticeAPI(data) {
    return request({
        url: 'group/setNotice',
        method: 'post',
        data: data
    })
}