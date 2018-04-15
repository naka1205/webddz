var Cookie = {
    expires: 365,
    path: '/',
    secure: true,
    raw: true,
    json: true
};

Cookie.encode = function (value) {
    return Cookie.raw ? value : encodeURIComponent(value);
}

Cookie.decode = function (value) {
    return Cookie.raw ? value : decodeURIComponent(value);
}

Cookie.stringifyValue = function (value) {
    return Cookie.encode(Cookie.json ? JSON.stringify(value) : String(value));
}

Cookie.parseValue = function (value) {
    return Cookie.encode(Cookie.json ? JSON.parse(value) : String(value));
}

//设置cookie  
Cookie.set = function (key, value, days) {
    let d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + Cookie.stringifyValue(value) + "; " + expires;

}
//获取cookie  
Cookie.get = function (key) {
    let name = key + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return Cookie.parseValue(c.substring(name.length, c.length));
    }
    return "";
}
//清除cookie    
Cookie.clear = function (key) {
    Cookie.set(key, "", -1);
}

module.exports = Cookie;
// window.Cookie = Cookie;