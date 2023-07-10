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
    var extlist=['jpg','jpeg','png','bmp','gif','pdf','mp3','wav','wmv','amr','mp4','3gp','avi','m2v','mkv','mov','webp','ppt','pptx','doc','docx','xls','xlsx','pdf'];
    if(extlist.includes(ext)){
        return url + ext + '.png';
    }else{
        return url+'icon/document.svg';
    }
    
}

// 下载文件
export function download(src, name) {
    let a = document.createElement("a");
    // 判断文件的后缀
    let ext=src.split('.').pop();
    let media=['jpg','jpeg','png','bmp','gif','pdf','mp3','wav','wmv','amr','mp4','3gp','avi','m2v','mkv','mov','webp'];
    if(media.indexOf(ext) !== -1 ) {
        a.download = name || "pic";
    }else {
        a.download = name || "file";
    }
    a.href = src;
    a.click();
}