var JFunction = {};

JFunction.Detectmob = function () {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    }
    else {
        return false;
    }
};


JFunction.LaunchFull = function () {
    
    if (window.document.documentElement.requestFullScreen) {
        return window.document.documentElement.requestFullScreen();
    } else if (window.document.documentElement.mozRequestFullScreen) {
        return window.document.documentElement.mozRequestFullScreen();
    } else if (window.document.documentElement.webkitRequestFullScreen) {
        return window.document.documentElement.webkitRequestFullScreen();
    } else if (window.document.documentElement.msRequestFullScreen) {
        return window.document.documentElement.msRequestFullScreen();
    }
 
    // window.document.removeEventListener("touchstart", function () {
    //     alert('removeEventListener');
    // });

}

JFunction.ExitFull = function () {

    if (window.document.exitFullscreen) {
        window.document.exitFullscreen();
    } else if (window.document.mozExitFullScreen) {
        window.document.mozExitFullScreen();
    } else if (window.document.webkitExitFullscreen) {
        window.document.webkitExitFullscreen();
    } else if (window.document.msExitFullscreen) {
        window.document.msExitFullscreen();
    } 

}

JFunction.LockOrientation = function () {

    let orientation = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation || window.screen.webkitOrientation;

    let lockOrientation = window.screen.lockOrientationUniversal = window.screen.lockOrientation || window.screen.mozLockOrientation || window.screen.msLockOrientation || window.screen.webkitLockOrientation;

    if ( lockOrientation(["landscape-primary", "landscape-secondary"]) ) {
        alert( orientation.type + " " + orientation.angle);
        // orientation was locked
    } else {
        // orientation lock failed
    }

    // if (window.screen.orientation) {
    //     window.screen.orientation.lock("landscape-primary");
    //     window.screen.orientation.addEventListener("change", function (e) {
    //         alert(screen.orientation.type + " " + screen.orientation.angle);
    //     }, false);
    // } else if (window.screen.msLockOrientation) {
    //     window.screen.msLockOrientation.lock("landscape-primary");
    //     window.screen.msLockOrientation.addEventListener("change", function (e) {
    //         alert(screen.msLockOrientation.type + " " + screen.msLockOrientation.angle);
    //     }, false);
    // } else if (window.screen.mozLockOrientation) {
    //     window.screen.mozLockOrientation.lock("landscape-primary");
    //     window.screen.mozLockOrientation.addEventListener("change", function (e) {
    //         alert(screen.mozLockOrientation.type + " " + screen.mozLockOrientation.angle);
    //     }, false);
    // } else if (window.screen.webkitLockOrientation) {
    //     window.screen.webkitLockOrientation.lock("landscape-primary");
    //     window.screen.webkitLockOrientation.addEventListener("change", function (e) {
    //         alert(screen.webkitLockOrientation.type + " " + screen.webkitLockOrientation.angle);
    //     }, false);
    // }  
}

JFunction.Random = function (formNum, toNum) {
    return parseInt(Math.random() * (toNum - formNum + 1) + formNum);
};
JFunction.setLSData = function (key, jsonValue) {
    window.localStorage.setItem(key, JSON.stringify(jsonValue));
};
JFunction.getLSData = function (key) {
    return JSON.parse(window.localStorage.getItem(key));
};
JFunction.getNowTime = function () {
    let now = new Date();
    let year = now.getFullYear();       //年
    let month = now.getMonth() + 1;     //月
    let day = now.getDate();            //日
    let hh = now.getHours(); //时
    let mm = now.getMinutes();  //分
    return year + "/" + month + "/" + day + " " + hh + ":" + mm;
};
JFunction.getUserName = function () {
    let names = [
        "上官",
        "欧阳",
        "东方",
        "端木",
        "独孤",
        "司马",
        "南宫",
        "夏侯",
        "诸葛",
        "皇甫",
        "长孙",
        "宇文",
        "轩辕",
        "东郭",
        "子车",
        "东阳",
        "子言"
    ];

    let names2 = [
        "雀圣",
        "赌侠",
        "赌圣",
        "稳赢",
        "不输",
        "好运",
        "自摸",
        "有钱",
        "土豪"
    ];
    let idx = Math.floor(Math.random() * (names.length - 1));
    let idx2 = Math.floor(Math.random() * (names2.length - 1));
    return names[idx] + names2[idx2];
};

JFunction.PreLoadData = function (url, callback) {
    let loadedNum = 0;//已加载资源数量
    let resourceNum = 0;//资源数量
    let postAction = function () { };//资源加载完成后的回调函数
    function load() {
        let value = Math.round(parseFloat(loadedNum / resourceNum) * 100);
        if (value <= 100) {
            callback(value);
        }
 
    }
    function imageLoadPost() {//每成功加载一个图片执行一次
        loadedNum++;
        load();
        if (loadedNum >= resourceNum) {//全部图片文件加载完后，继续加载声音
            loadedNum = 0;
            resourceNum = 0;
            loadAudio()
        }
    }
    function audioLoadPost() {//每成功加载一个声音执行一次
        loadedNum++;
        load();
        if (loadedNum >= resourceNum) {//全部声音文件加载完后，执行回调函数
            postAction()
        }
    }
    function loadImage() {//加载图片
        for (let m2 in ResourceData.Images) resourceNum++;
        if (resourceNum == 0) {
            imageLoadPost();
        } else {
            for (let m2 in ResourceData.Images) {
                ResourceData.Images[m2].data = new Image();
                ResourceData.Images[m2].data.src =  url + ResourceData.Images[m2].path;
                ResourceData.Images[m2].data.onload = function () {
                    imageLoadPost();
                }
                ResourceData.Images[m2].data.onerror = function () {
                    // alert("资源加载失败！")
                    console.log('资源加载失败！');
                    // console.log(ResourceData.Images[m2]);
                    return;
                }
            }
        }

    }
    function loadAudio() {//加载声音
        for (let m1 in ResourceData.Sound) resourceNum++;
        if (resourceNum == 0) {
            audioLoadPost();
        } else {
            for (let m1 in ResourceData.Sound) {
                ResourceData.Sound[m1].data = new Audio();
                let playMsg = ResourceData.Sound[m1].data.canPlayType('video/ogg');//测试浏览器是否支持该格式声音
                if ("" != playMsg) {
                    ResourceData.Sound[m1].data.src = url + ResourceData.Sound[m1].path + ResourceData.Sound[m1].soundName + ".ogg";
                } else {
                    ResourceData.Sound[m1].data.src = url + ResourceData.Sound[m1].path + ResourceData.Sound[m1].soundName + ".mp3";
                }
                ResourceData.Sound[m1].data.addEventListener("canplaythrough", function () {
                    audioLoadPost();
                }, false);
                ResourceData.Sound[m1].data.addEventListener("error", function () {
                    alert("资源加载失败！")
                    return;
                }, false);
            }
        }
    }
    loadImage();
    return {
        done: function (f) {
            if (f) postAction = f;
        }
    }
};

//获取图片数据
JFunction.getImageData = function (_context, _point, _size) {
    return _context.getImageData(_point.x, _point.y, _size.width, _size.height);
};
//通过图片数据绘制图片
JFunction.drawImageData = function (_context, _imgdata, _point, _dPoint, _dSize) {
    if (!_dPoint) _dPoint = { x: 0, y: 0 };
    if (!_dSize) _dSize = { width: _imgdata.width, height: _imgdata.height };
    _context.putImageData(_imgdata, _point.x, _point.y, _dPoint.x, _dPoint.y, _dSize.width, _dSize.height);
};
//颜色反转
JFunction.invert = function (_imgData) {
    let imageData = _imgData;
    for (let i = 0; i < imageData.data.length; i += 4) {
        let red = imageData.data[i], green = imageData.data[i + 1], blue = imageData.data[i + 2], alpha = imageData.data[i + 3];
        imageData.data[i] = 255 - red;
        imageData.data[i + 1] = 255 - green;
        imageData.data[i + 2] = 255 - blue;
        imageData.data[i + 3] = alpha;
    }
    return imageData;
};
//灰色
JFunction.changeToGray = function (_imgData) {
    let imageData = _imgData;
    for (let i = 0; i < imageData.data.length; i += 4) {
        let wb = parseInt((imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3);
        imageData.data[i] = wb;
        imageData.data[i + 1] = wb;
        imageData.data[i + 2] = wb;
    }
    return imageData;
};
//加红
JFunction.changeToRed = function (_imgData) {
    let imageData = _imgData;
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] += 50;
        if (imageData.data[i] > 255) imageData.data[i] = 255;

    }
    return imageData;
};
//图片旋转
JFunction.rotate = function (_context, _imageData, angle) {
    let returnData = _context.createImageData(_imageData.width, _imageData.height);
    let w, h, i, j, newPoint, x, y;
    let centerX = _imageData.width / 2.0;
    let centerY = _imageData.height / -2.0;
    let PI = 3.14159;
    for (h = 0; h < returnData.height; h++) {
        for (w = 0; w < returnData.width; w++) {
            i = (_imageData.width * h + w) * 4;
            newPoint = GetNewPoint({ x: w, y: h * -1 });
            x = parseInt(newPoint.x);
            y = parseInt(newPoint.y);
            if (x >= 0 && x < _imageData.width && -y >= 0 && -y < _imageData.height) {
                j = (_imageData.width * -y + x) * 4;
                returnData.data[i] = _imageData.data[j];
                returnData.data[i + 1] = _imageData.data[j + 1];
                returnData.data[i + 2] = _imageData.data[j + 2];
                returnData.data[i + 3] = _imageData.data[j + 3];
            }
        }
    }
    return returnData;
    function GetNewPoint(_point) {
        let l = (angle * PI) / 180;
        let newX = (_point.x - centerX) * Math.cos(l) - (_point.y - centerY) * Math.sin(l);
        let newY = (_point.x - centerX) * Math.sin(l) + (_point.y - centerY) * Math.cos(l);
        return { x: newX + centerX, y: newY + centerY };
    }
};
//高亮整个图片
JFunction.highLight = function (_imgData, n) {
    let imageData = _imgData;
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = (imageData.data[i] + n) > 255 ? 255 : (imageData.data[i] + n);
        imageData.data[i + 1] = (imageData.data[i + 1] + n) > 255 ? 255 : (imageData.data[i + 1] + n);
        imageData.data[i + 2] = (imageData.data[i + 2] + n) > 255 ? 255 : (imageData.data[i + 2] + n);
    }
    return imageData;
};

module.exports = JFunction;
// window.JFunction = JFunction;