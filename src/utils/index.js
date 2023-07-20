/**
 * 对象深拷贝
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
    return JSON.parse(JSON.stringify(source))
}

/**
 * 获取粘贴时的纯文本
 * @param e
 * @returns {string}
 */
export function getPlainText(e) {
    function uniform(str) {
        const _str = supportIE(str).replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const arr = _str.split(/\r\n|\r|\n/)
        if (arr) {
            return arr.map(item => {
                if (item.length > 0) {
                    return '<div>' + item + '</div>'
                }
                return '<div><br></div>'
            }).join('')
        }
        return _str
    }
    let innerText = ''
    const TAB = ' '.repeat(2)
    e.preventDefault()
    if (e.clipboardData) {
        innerText = (e.originalEvent || e).clipboardData.getData('text/plain').replace(/\t/g, TAB)
        document.execCommand('insertHtml', false, uniform(innerText))
    } else if (window.clipboardData) {
        innerText = window.clipboardData.getData('Text').replace(/\t/g, TAB)
        if (document.selection) {
            document.selection.createRange().pasteHTML(uniform(innerText))
        } else if (window.getSelection) {
            const sel = window.getSelection()
            const range = sel.getRangeAt(0)
                // 创建临时元素，使得TextRange可以移动到正确的位置
            const tempEl = document.createElement('span')
            tempEl.innerHTML = '&#FEFF;'
            range.deleteContents()
            range.insertNode(tempEl)
            const textRange = document.body.createTextRange()
            textRange.moveToElementText(tempEl)
            tempEl.parentNode.removeChild(tempEl)
            textRange.pasteHTML(uniform(innerText))
            textRange.collapse(false)
            textRange.select()
        }
    }
    return uniform(innerText)
}

/**
 * IE中的p标签转换成div
 * @param str
 * @returns {*}
 */
export function supportIE(str) {
    return str.replace(/<(\/?)p>/g, '<$1div>')
}

/**
 * contenteditable 光标定位到最后
 * @param target
 * */
export function keepCursorEnd(target) {
    // 非IE浏览器
    if (window.getSelection) {
        // 解决Firefox不获取焦点无法定位问题
        target.focus()
            // 创建range对象
        const range = window.getSelection()
            // 选择target下所有子内容
        range.selectAllChildren(target)
            // 光标移至最后
        range.collapseToEnd()
    } else if (document.selection) { // IE浏览器
        // 创建range对象
        const range = document.selection.createRange()
            // 定位到target
        range.moveToElementText(target)
            // 光标移至最后
        range.collapse(false)
        range.select()
    }
}

/**
 * 将base64图片数据转换成Blob
 * @param image
 * @returns {Blob}
 */
export function base64toBlob(image) {
    const bytes = window.atob(image.split(',')[1])
    const array = []
    for (let i = 0; i < bytes.length; i++) {
        array.push(bytes.charCodeAt(i))
    }
    return new Blob([new Uint8Array(array)], { type: 'image/png' })
}

/**
 * 计算图片宽高及比率
 * @param imageTrueW 图片实际宽
 * @param imageTrueH 图片实际高
 * @param showAreaW 展示区宽度
 * @param showAreaH 展示区高度
 * */
export function calcImageSize(imageTrueW, imageTrueH, showAreaW, showAreaH) {
    let [width, height, ratio] = [0, 0, 0]
    // 图片真实宽大于真实高
    if (imageTrueW > imageTrueH) {
        if (imageTrueW >= showAreaW) { // 真实宽大于或等于展示区最大宽
            const imageRatioH = imageTrueH * (showAreaW / imageTrueW)
                // 按展示区最大宽与实际宽比率换算后，高度大于显示高度时
            if (imageRatioH >= showAreaW) {
                width = imageTrueW * (showAreaH / imageTrueH)
                height = showAreaH
                ratio = imageTrueH / showAreaH
            } else {
                width = showAreaW
                height = imageRatioH
                ratio = imageTrueW / showAreaW
            }
        } else {
            width = imageTrueW
            height = imageTrueH
            ratio = 1
        }
    } else { // 图片真实宽小于或等于真实高
        if (imageTrueH >= showAreaH) { // 真实高大于或等于展示区最大高
            width = imageTrueW * (showAreaH / imageTrueH)
            height = showAreaH
            ratio = imageTrueH / showAreaH
        } else {
            width = imageTrueW
            height = imageTrueH
            ratio = 1
        }
    }
    return {
        width,
        height,
        ratio
    }
}

/** 判断输入的是电话*/
export function regexIsCRMMobile(mobile) {
    var regex = /^(\+?0?\d{2,4}\-?)?\d{6,11}$/
    if (!regex.test(mobile)) {
        return false
    }
    return true
}

// 中国手机号
export const chinaMobileRegex = /^1\d{10}$/

/** 判断输入的是邮箱*/
export function regexIsCRMEmail(email) {
    var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (!regex.test(email)) {
        return false
    }
    return true
}

/** 搜索数组*/
export function search_object(array, field, keywords) {
    if (typeof array !== 'object') {
        return false;
    } else {
        var found = [];
        for (var i = 0; array.length > i; i++) {
            if (typeof field == 'object') {
                for (var j = 0; field.length > j; j++) {
                    var field_str = field[j];
                    var str = array[i][field_str];
                    // 只需要匹配到一个即可
                    if (str.indexOf(keywords) != -1) {
                        found.push(array[i]);
                        break;
                    }
                }
            } else {
                var str = array[i][field];
                if (str.indexOf(keywords) != -1) {
                    found.push(array[i]);
                }
            }
        }
        return found;
    }
}

/** 数组转化为字符串*/
export function arrayToString(arr, field, isTrans) {
    isTrans = typeof isTrans !== 'undefined' ? isTrans : false;
    var idr = [];
    for (var i = 0; i < arr.length; i++) {
        idr.push(arr[i][field]);
    }
    if (isTrans === true) {
        return idr.join(",");
    } else {
        return idr;
    }
}


/** 删除数组中某一个值*/
export function delArrValue(arr, field, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][field] == value) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

/** 修改二位数组某个值*/
export function editArrValue(arr, field, value) {
    for (var i = 0; i < arr.length; i++) {
        arr[i]['disabled'] = false;
        if (arr[i][field] == value) {
            arr[i]['disabled'] = true;
        }
    }
    return arr;
}

export function padZero(val) {
    return val < 10 ? `0${val}` : val;
}
export function hoursTimeFormat(t) {
    const date = new Date(t);
    const nowDate = new Date();
    const Y = t => {
        return t.getFullYear();
    };
    const MD = t => {
        return `${t.getMonth() + 1}-${t.getDate()}`;
    };
    const dateY = Y(date);
    const nowDateY = Y(nowDate);

    let format;
    if (dateY !== nowDateY) {
        format = "y年m月d日 h:i";
    } else if (`${dateY}-${MD(date)}` === `${nowDateY}-${MD(nowDate)}`) {
        format = "h:i";
    } else {
        format = "m月d日 h:i";
    }
    return timeFormat(t, format);
}

// export function timeFormat(t) {
//     var time = parseInt(t / 1000);
//     return isToday(t) ? date("H:i", time) : date("Y/m/d", time);
// }

export function timeFormat(timestamp) {
    const now = new Date();
    const datetime = new Date(timestamp);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today - 24 * 60 * 60 * 1000);
    const weekStart = new Date(today - (today.getDay() - 1) * 24 * 60 * 60 * 1000);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    if ( datetime >= today) {
        return date('H:i', timestamp / 1000)
    } else if (datetime >= yesterday && datetime < today) {
        return '昨天'
    } else if (datetime >= weekStart && datetime < yesterday) {
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekday = weekdays[datetime.getDay()];
        return weekday;
    }else if (datetime >= yearStart && datetime < weekStart) {
        return date('m-d', timestamp / 1000)
    } else {
        return date('Y-m-d', timestamp / 1000)
    }
  }

/**
 * 和PHP一样的时间戳格式化函数
 * @param {string} format 格式
 * @param {int} timestamp 要格式化的时间 默认为当前时间
 * @return {string}   格式化的时间字符串
 */

export function date(format, timestamp) {
    var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
    var pad = function(n, c) {
        if ((n = n + "").length < c) {
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var txt_ordin = { 1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st" };
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var f = {
        // Day
        d: function() { return pad(f.j(), 2) },
        D: function() { return f.l().substr(0, 3) },
        j: function() { return jsdate.getDate() },
        l: function() { return txt_weekdays[f.w()] },
        N: function() { return f.w() + 1 },
        S: function() { return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th' },
        w: function() { return jsdate.getDay() },
        z: function() { return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0 },

        // Week
        W: function() {
            var a = f.z(),
                b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                return 1;
            } else {
                if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime() / 1000));
                } else {
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },

        // Month
        F: function() { return txt_months[f.n()] },
        m: function() { return pad(f.n(), 2) },
        M: function() { return f.F().substr(0, 3) },
        n: function() { return jsdate.getMonth() + 1 },
        t: function() {
            var n;
            if ((n = jsdate.getMonth() + 1) === 2) {
                return 28 + f.L();
            } else {
                if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                    return 31;
                } else {
                    return 30;
                }
            }
        },

        // Year
        L: function() { var y = f.Y(); return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0 },
        //o not supported yet
        Y: function() { return jsdate.getFullYear() },
        y: function() { return (jsdate.getFullYear() + "").slice(2) },

        // Time
        a: function() { return jsdate.getHours() > 11 ? "pm" : "am" },
        A: function() { return f.a().toUpperCase() },
        B: function() {
            // peter paul koch:
            var off = (jsdate.getTimezoneOffset() + 60) * 60;
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
            var beat = Math.floor(theSeconds / 86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length === 1) beat = "00" + beat;
            if ((String(beat)).length === 2) beat = "0" + beat;
            return beat;
        },
        g: function() { return jsdate.getHours() % 12 || 12 },
        G: function() { return jsdate.getHours() },
        h: function() { return pad(f.g(), 2) },
        H: function() { return pad(jsdate.getHours(), 2) },
        i: function() { return pad(jsdate.getMinutes(), 2) },
        s: function() { return pad(jsdate.getSeconds(), 2) },
        //u not supported yet

        // Timezone
        //e not supported yet
        //I not supported yet
        O: function() {
            var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
            else t = "+" + t;
            return t;
        },
        P: function() { var O = f.O(); return (O.substr(0, 3) + ":" + O.substr(3, 2)) },
        //T not supported yet
        //Z not supported yet

        // Full Date/Time
        c: function() { return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P() },
        //r not supported yet
        U: function() { return Math.round(jsdate.getTime() / 1000) }
    };
    let ret = '';
    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
        if (t !== s) {
            // escaped
            ret = s;
        } else if (f[s]) {
            // a date function exists
            ret = f[s]();
        } else {
            // nothing special
            ret = s;
        }
        return ret;
    });
}


// 判断是否为今天
export function isToday(time) {
    // 获取当前日期
    const today = new Date().setHours(0, 0, 0, 0); // 将时分秒毫秒设为0
    // 判断是否是今天
    if (time >= today && time < today + 24 * 3600 * 1000) {
        return true;
    } else {
        return false;
    }
}

export function generateRandId(){
	var d = new Date().getTime();
	  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
	    var r = (d + Math.random() * 16) % 16 | 0;
	    d = Math.floor(d / 16);
	    return (c == "x" ? r : r & 0x3 | 0x8).toString(16);
	  });
	  return uuid;
}