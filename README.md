# webddz
===============
## 介绍

技术栈：javascript + canvas + websocket + webpack3

这个项目的部分底层代码来自一个单机斗地主，开发这个项目也是由于看到源码封装了大部分CANVAS的API，让我对学习使用CANVAS产生了很强的学习动力。
本人也是第一次从零开始开发游戏客户端，再构思了几天后，想好了代码架构设计开始动手，断断续续开发了2个多月的时间。现已完成了用户登录、创建玩家、创建房间、进入房间、抢地主、发牌、出牌、比牌等一系功能模块，服务端使用了PHP的WORKERMAN框架，数据库采用MYSQL。

这个项目只是客户端，可以点击查看[服务端](https://github.com/naka1205/gameworker)

未完成：退出房间、用户积分、出牌完成、游戏结算、断线重连、第三方登录、聊天

目前由于各种原因，项目已停止开发。希望对一些新手学习或者你对这种架构开发游戏比较有兴趣，能给到帮助！

线上预览：https://ddz.oyoula.com

使用前请确保开发环境下安装了NODEJS，并安装了WEBPACK3

初始化：
~~~
npm install --save-dev webpack
npm install --save-dev webpack-dev-server
npm install --save-dev html-webpack-plugin file-loader url-loader babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-env
~~~
预览：
~~~
npm run server
~~~
打包：
~~~
npm run build
~~~

