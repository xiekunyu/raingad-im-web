/*
 * 返回文件大小
 * @params 数字
 * */
export function getFileSize(size) {
    let units = new Array(' B', ' KB', ' MB', ' GB', ' TB');
    let filesize = size + "B";
    for (let i = 0; size >= 1024 && i < 4; i++) {
        size /= 1024;
        filesize = size.toFixed(2) + units[i + 1];
    }
    return filesize;
}