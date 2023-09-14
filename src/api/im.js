import request from '@/utils/request'

const imApi = {}
/**
 * 获取聊天联系人列表
 * @param {*} data
 */
imApi.getContactsAPI= (data)  =>{
    return request({
        url: 'enterprise/im/getContacts',
        method: 'post',
        data: data
    })
}

/**
 * 发送聊天消息
 * @param {*} data
 */
imApi.sendMessageAPI= (data)  =>{
    return request({
        url: 'enterprise/im/sendMessage',
        method: 'post',
        data: data
    })
}

/**
 * 转发聊天消息
 * @param {*} data
 */
imApi.forwardMessageAPI= (data)  =>{
    return request({
        url: 'enterprise/im/forwardMessage',
        method: 'post',
        data: data
    })
}

/**
 * 发送webrtc音视频消息
 * @param {*} data
 */
imApi.sendToMsg= (data)  =>{
    return request({
        url: 'enterprise/im/sendToMsg',
        method: 'post',
        data: data
    })
}

/**
 * 发送聊天消息
 * @param {*} data
 */
imApi.forwardMessageAPI= (data)  =>{
    return request({
        url: 'enterprise/im/forwardMessage',
        method: 'post',
        data: data
    })
}
/**
 * 发送图片或文件消息
 * @param {*} data
 */
imApi.sendFileAPI= (data)  =>{
    return request({
        url: 'common/upload/uploadFile',
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
imApi.getMessageListAPI= (data)  =>{
    return request({
        url: 'enterprise/im/getMessageList',
        method: 'post',
        data: data
    })
}

/**
 * 修改消息为已读
 * @param {*} data
 */
imApi.setMsgIsReadAPI= (data)  =>{
    return request({
        url: 'enterprise/im/setMsgIsRead',
        method: 'post',
        data: data
    })
}

/**
 * 撤回消息
 * @param {*} data
 */
imApi.undoMessageAPI= (data)  =>{
    return request({
        url: 'enterprise/im/undoMessage',
        method: 'post',
        data: data
    })
}

/**
 * 撤回消息
 * @param {*} data
 */
imApi.removeMessageAPI= (data)  =>{
    return request({
        url: 'enterprise/im/removeMessage',
        method: 'post',
        data: data
    })
}


/**
 * 设置
 * @param {*} data
 */
imApi.settingAPI= (data)  =>{
    return request({
        url: 'enterprise/im/setting',
        method: 'post',
        data: data
    })
}

/**
 * 修改群组名称
 * @param {*} data
 */
imApi.editGroupNameAPI= (data)  =>{
    return request({
        url: 'enterprise/group/editGroupName',
        method: 'post',
        data: data
    })
}

/**
 * 获取群成员列表
 * @param {*} data
 */
imApi.groupUserListAPI= (data)  =>{
    return request({
        url: 'enterprise/group/groupuserlist',
        method: 'post',
        data: data
    })
}

/**
 * 获取群成员列表
 * @param {*} data
 */
imApi.getAllUserAPI= (data)  =>{
    return request({
        url: 'enterprise/group/getAllUser',
        method: 'post',
        data: data
    })
}

/**
 * 创建群聊
 * @param {*} data
 */
imApi.addGroupAPI= (data)  =>{
    return request({
        url: 'enterprise/group/add',
        method: 'post',
        data: data
    })
}


/**
 * 设置管理员
 * @param {*} data
 */
imApi.setManagerAPI= (data)  =>{
    return request({
        url: 'enterprise/group/setManager',
        method: 'post',
        data: data
    })
}


/**
 * 设置管理员
 * @param {*} data
 */
imApi.removeUserAPI= (data)  =>{
    return request({
        url: 'enterprise/group/removeUser',
        method: 'post',
        data: data
    })
}

/**
 * 添加群成员
 * @param {*} data
 */
imApi.addGroupUserAPI= (data)  =>{
    return request({
        url: 'enterprise/group/addGroupUser',
        method: 'post',
        data: data
    })
}

/**
 * 移除群成员
 * @param {*} data
 */
imApi.removeGrouprAPI= (data)  =>{
    return request({
        url: 'enterprise/group/removeGroup',
        method: 'post',
        data: data
    })
}


/**
 * 设置公告
 * @param {*} data
 */
imApi.setNoticeAPI= (data)  =>{
    return request({
        url: 'enterprise/group/setNotice',
        method: 'post',
        data: data
    })
}

/**
 * 群聊设置
 * @param {*} data
 */
imApi.groupSettingAPI= (data)  =>{
    return request({
        url: 'enterprise/group/groupSetting',
        method: 'post',
        data: data
    })
}

/**
 * 群聊基本信息
 * @param {*} data
 */
imApi.getGroupInfoAPI= (data)  =>{
    return request({
        url: 'enterprise/group/groupInfo',
        method: 'post',
        data: data
    })
}

/**
 * 转让群主
 * @param {*} data
 */
imApi.changeOwnerAPI= (data)  =>{
    return request({
        url: 'enterprise/group/changeOwner',
        method: 'post',
        data: data
    })
}


/**
 * 设置消息免打扰
 * @param {*} data
 */
imApi.isNoticeAPI= (data)  =>{
    return request({
        url: 'enterprise/im/isNotice',
        method: 'post',
        data: data
    })
}

/**
 * 设置消息免打扰
 * @param {*} data
 */
imApi.setChatTopAPI= (data)  =>{
    return request({
        url: 'enterprise/im/setChatTop',
        method: 'post',
        data: data
    })
}

/**
 * 获取用户资料
 * @param {*} data
 */
imApi.getUserInfo= (data)  =>{
    return request({
        url: 'enterprise/im/getUserInfo',
        method: 'post',
        data: data
    })
}

/**
 * 获取文件
 * @param {*} data
 */
imApi.getFileList= (data)  =>{
    return request({
        url: 'enterprise/files/index',
        method: 'post',
        data: data
    })
}

// 上传头像
imApi.updateUserInfo= (data)  =>{
    return request({
        url: 'enterprise/im/updateUserInfo',
        method: 'post',
        data: data
    })
}

// 修改账户
imApi.editAccount= (data)  =>{
    return request({
        url: 'enterprise/im/editAccount',
        method: 'post',
        data: data
    })
}

// 修改密码
imApi.editPassword= (data)  =>{
    return request({
        url: 'enterprise/im/editpassword',
        method: 'post',
        data: data
    })
}

// 搜索用户
imApi.searchUser= (data)  =>{
    return request({
        url: 'enterprise/im/searchUser',
        method: 'post',
        data: data
    })
}
export default imApi;