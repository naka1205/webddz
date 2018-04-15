
window.ResourceData = require('./js/ResourceData');
window.Prototype = require('./js/Prototype');
window.Class = require('./js/Class');
window.Object = require('./js/Object');
window.JMain = require('./js/JMain');
window.JColor = require('./js/JColor');
window.JFunction = require('./js/JFunction');
window.JControls = require('./js/JControls');
window.GControls = require('./js/GControls');

window.Http = require('./js/Http');
window.Cookie = require('./js/Cookie');
window.Base64 = require('./js/Base64');

window.Game = require('./js/Game');
window.App = require('./js/App');


let size = { width: 1280, height: 720 }

size = {
    width: window.innerWidth,
    height: window.innerHeight
}

if (JFunction.Detectmob()) {
    size = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
}

// JFunction.LaunchFull(window.document.documentElement);

App.Size = size;
Game.PokerSize = { width: App.Size.width * 0.12, height: App.Size.height * 0.24 };

App.init();

window.onresize = function () {
    console.log("窗口发生改变了哟！");
}
