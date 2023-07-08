import request from '@/utils/request'
const groupApi = {};

/**
 * 群聊列表
 * @param {*} data
 */
groupApi.getGroupList = (data) => {
    return request({
        url: "/manage/Group/index",
        method: "post",
        data: data,
    });
};

// 添加群成员
groupApi.addGroupUser = (data) => {
    return request({
        url: "/manage/Group/addGroupUser",
        method: "post",
        data: data,
    });
};

// 删除群成员
groupApi.delGroupUser = (data) => {
    return request({
        url: "/manage/Group/delGroupUser",
        method: "post",
        data: data,
    });
};

// 更换群主
groupApi.changeOwner = (data) => {
    return request({
        url: "/manage/Group/changeOwner",
        method: "post",
        data: data,
    });
};

// 设置管理员
groupApi.setManager = (data) => {
    return request({
        url: "/manage/Group/setManager",
        method: "post",
        data: data,
    });
};

// 解散群聊
groupApi.delGroup = (data) => {
    return request({
        url: "/manage/Group/del",
        method: "post",
        data: data,
    });
};



export default groupApi;