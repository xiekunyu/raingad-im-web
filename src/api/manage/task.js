import request from '@/utils/request'
const taskApi = {};

/**
 * 进程列表
 * @param {*} data
 */
taskApi.getTaskList = (data) => {
    return request({
        url: "/admin/Task/getTaskList",
        method: "post",
        data: data,
    });
};
/**
 * 启动全部进程
 * @param {*} data
 */
taskApi.startTask = (data) => {
    return request({
        url: "/admin/Task/startTask",
        method: "post",
        data: data,
    });
};
/**
 * 停止全部进程
 * @param {*} data
 */
taskApi.stopTask = (data) => {
    return request({
        url: "/admin/Task/stopTask",
        method: "post",
        data: data,
    });
};
/**
 * 获取进程日志
 * @param {*} data
 */
taskApi.getTaskLog = (data) => {
    return request({
        url: "/admin/Task/getTaskLog",
        method: "post",
        data: data,
    });
};
/**
 * 清除进程日志
 * @param {*} data
 */
taskApi.clearTaskLog = (data) => {
    return request({
        url: "/admin/Task/clearTaskLog",
        method: "post",
        data: data,
    });
};

export default taskApi;