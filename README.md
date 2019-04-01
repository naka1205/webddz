# webddz
===============
## 介绍

技术栈：javascript + canvas + websocket + webpack3

这个项目的部分底层代码来自一个单机斗地主，开发这个项目也是由于看到源码封装了大部分CANVAS的API，让我对学习使用CANVAS产生了很强的学习动力。
本人也是第一次从零开始开发游戏客户端，再构思了几天后，想好了代码架构设计开始动手，断断续续开发了2个多月的时间。现已完成了用户登录、创建玩家、创建房间、进入房间、抢地主、发牌、出牌、比牌等一系列功能模块，服务端使用了PHP的WORKERMAN框架，数据库采用MYSQL。

这个项目只是客户端，可以点击查看[服务端](https://gitee.com/naka507/GameWorker)

未完成：开房选项、用户积分、退出房间、出牌完成、游戏结算、第三方登录、聊天、移动端适配

目前由于各种原因，项目已停止开发。希望对一些新手学习或者你对这种架构开发游戏比较有兴趣，能给到帮助！

## 游戏界面
![用户登录](http://files.oyoula.com/1.jpg "用户登录")
![创建玩家](http://files.oyoula.com/2.jpg "创建玩家")
![游戏大厅](http://files.oyoula.com/3.jpg "游戏大厅")
![创建房间](http://files.oyoula.com/4.jpg "创建房间")
![等待开始](http://files.oyoula.com/6.jpg "等待开始")
![进入房间](http://files.oyoula.com/7.jpg "进入房间")
![抢地主选分](http://files.oyoula.com/8.jpg "抢地主选分")
![选择出牌](http://files.oyoula.com/9.jpg "选择出牌")
![等待出牌](http://files.oyoula.com/10.jpg "等待出牌")

## 线上预览
测试地址：https://www.oyoula.com/ddz

## 本地开发
使用前请确保开发环境下安装了NODEJS，并安装了WEBPACK3

初始化：
~~~
npm install
npm install --save-dev webpack webpack-dev-server html-webpack-plugin file-loader url-loader babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-env
~~~
预览：
~~~
npm run server
~~~
打包：
~~~
npm run build
~~~

