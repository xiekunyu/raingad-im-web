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

// 获取文件后缀
export function getFileExtImg(fileName) {
    var url = "https://file.lcoce.com/ext/";
    var spl = fileName.split(".");
    var exts = spl[spl.length - 1];
    var ext = exts.toUpperCase();
    if (!ext) {
        var ext = '';
    }
    return url + ext + '.png';
}

// 下载文件
export function download(src, name, type) {
    let a = document.createElement("a");
    if (type == "image") {
        a.download = name || "pic";
    } else {
        a.download = name || "file";
    }
    a.href = src;
    a.click();
}