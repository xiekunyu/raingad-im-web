import request from '@/utils/request'
const userApi = {};

/**
 * 用户列表
 * @param {*} data
 */
userApi.getUserList = (data) => {
    return request({
        url: "/manage/User/index",
        method: "post",
        data: data,
    });
};

// 添加用户
userApi.addUser = (data) => {
    return request({
        url: "/manage/User/add",
        method: "post",
        data: data,
    });
};

// 修改用户
userApi.editUser = (data) => {
    return request({
        url: "/manage/User/edit",
        method: "post",
        data: data,
    });
};

// 删除用户
userApi.delUser = (data) => {
    return request({
        url: "/manage/User/del",
        method: "post",
        data: data,
    });
};

// 用户详情
userApi.getUserDetail = (data) => {
    return request({
        url: "/manage/User/detail",
        method: "post",
        data: data,
    });
};

// 修改密码
userApi.editPassword = (data) => {
    return request({
        url: "/manage/User/editPassword",
        method: "post",
        data: data,
    });
};

// 修改状态
userApi.setStatus = (data) => {
    return request({
        url: "/manage/User/setStatus",
        method: "post",
        data: data,
    });
};

// 设置角色
userApi.setRole = (data) => {
    return request({
        url: "/manage/User/setRole",
        method: "post",
        data: data,
    });
};


export default userApi;