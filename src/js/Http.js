var Http = {};

Http.server = 'http://127.0.0.1:4321';//上线改为外网IP
Http.auth = '';

Http.get = function (events, callback) {
    let apiserver = Http.server + '/' + events;
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {  //200 表示相应成功 304 表示缓存中存在请求的资源  
                // 对响应的信息写在回调函数里面  

                let str = xhr.status + ' ' + xhr.responseText;
                callback(eval("(" + xhr.responseText + ")"), str);

            }
            else {
                return 'request is unsucessful ' + xhr.status;
            }
        }
    }
    xhr.open('get', apiserver, true);
    xhr.send();

};

Http.post = function (events, data, callback) {

    let apiserver = Http.server + events;
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {  //200 表示相应成功 304 表示缓存中存在请求的资源  
                // 对响应的信息写在回调函数里面  
                let str = xhr.status + ' ' + xhr.responseText;
                callback(eval("(" + xhr.responseText + ")"), str);
            }
            else {
                return 'request is unsucessful ' + xhr.status;
            }
        }
    }
    

    xhr.open('post', apiserver, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");

    if (Http.auth) {
        xhr.setRequestHeader("Auth", Http.auth);
    }
    xhr.send(Http.encode(data));

};


Http.encode = function (data) {

    let pairs = [];
    let regexp = /%20/g;

    for (let name in data) {
        let value = data[name].toString();
        let pair = encodeURIComponent(name).replace(regexp, "+") + "=" + encodeURIComponent(value).replace(regexp, "+");
        pairs.push(pair);
    }
    return pairs.join("&");

};

module.exports = Http;
// window.Http = Http;