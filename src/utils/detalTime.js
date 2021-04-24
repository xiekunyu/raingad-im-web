/*
 * 创建时间和现在时间作对比
 * @param time 时间戳
 * 
 * */
export function beforeTime(time) {
    let way = Date.parse(new Date()) / 1000 - time;
    let r = '';
    if (way < 60) {
        r = '刚刚';
    } else if (way >= 60 && way < 3600) {
        r = Math.floor(way / 60) + '分钟前';
    } else if (way >= 3600 && way < 86400) {
        r = Math.floor(way / 3600) + '小时前';
    } else if (way >= 86400 && way < 2592000) {
        r = Math.floor(way / 86400) + '天前';
    } else if (way >= 2592000 && way < 15552000) {
        r = Math.floor(way / 2592000) + '个月前';
    } else if (time === 0 || !time) {
        r = '暂无';
    } else {
        r = dateChange('Y-m-d', time);
    }
    return r;
}

/*
 * 返回时间年月日时分秒
 * @param {date}  时间戳
 * @param {fmt}   转换格式  'yyyy-MM-dd hh:mm:ss'
 * 
 * */
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}