
var Game={
        Ws: "ws://127.0.0.1:7070"//上线改为外网IP
        ,Socket : null
        , Clients: null
        , Roomid: null//当前局数
        , Ju: null//当前局数
        , User: null//当前用户
        , Left: null//左边用户
        , Right: null//右边用户
        , Config: null//游戏配置
        , Panel: null//房间面板
        , BtnPanel: null//按钮面板
        , Poker: null//扑克
        , Landlord: null//地主
        , LandlordNum: null//地主编号
        , BeginNum: null//发牌开始编号
        , DealerNum: null//当前操作编号
        , MaxScore: null//抢牌最高分
        , GrabTime: null//抢牌次数
        , DealingHandle: null//发牌句柄
        , DealingNum: null//已发牌数
        , PokerSize: { width: 105, height: 120 }//扑克牌大小
        , Last: null//上一次出牌
        , LastWin: null//上一把赢家
        , LastHandNum: null//标示谁出的最后一手牌
        , LastHandPokerType: null//最后一手牌类型
        , ToPlay: null//已抢完地主，出牌中
        , State: ['等待', '准备', '开始', '选分', '进行', '出牌', '离开', '离线']
        , PokerTypes: {//扑克牌类型
                "1": { weight: 1, allNum: 1, minL: 5, maxL: 12 }
                , "11": { weight: 1, allNum: 2, minL: 3, maxL: 10 }
                , "111": { weight: 1, allNum: 3, minL: 1, maxL: 6 }
                , "1111": { weight: 2, allNum: 4, minL: 1, maxL: 1 }
                , "1112": { weight: 1, zcy: "111", fcy: "1", fcyNum: 1, allNum: 4, minL: 1, maxL: 5 }
                , "11122": { weight: 1, zcy: "111", fcy: "11", fcyNum: 1, allNum: 5, minL: 1, maxL: 4 }
                , "111123": { weight: 1, zcy: "1111", fcy: "1", fcyNum: 2, allNum: 6, minL: 1, maxL: 1 }
                , "11112233": { weight: 1, zcy: "1111", fcy: "11", fcyNum: 2, allNum: 8, minL: 1, maxL: 1 }
                , "12": { weight: 3, allNum: 2, minL: 1, maxL: 1 }
        }

};

//创建房间
Game.init = function () {
        console.log('Game.init');
        // 创建websocket
        Game.Socket = new WebSocket(Game.Ws);

        Game.Socket.onclose = function () {
                console.log("连接关闭");
        }

        Game.Socket.onerror = function () {
                console.log("出现错误");
        }

        // 当socket连接打开时
        Game.Socket.onopen = Game.onOpen;

        // 当有消息时根据消息类型显示不同信息
        Game.Socket.onmessage = Game.onMessage;

        Game.User = {};
        Game.Left = {};
        Game.Right = {};
        Game.Last = {};
        Game.Landlord = {};
        Game.Config = {};

        
};

//连接
Game.onOpen = function(){

        let login_data = '{"type":"login","auth":"' + Http.auth + '"}';
        console.log('onOpen', "发送数据:" + login_data);

        Game.Socket.send(login_data);  

};
//登录
Game.login = function () {

        let data = {
                roomid: Game.Roomid
        }
        console.log(data);
        Http.post('/join', data, function (res) {
                console.log(res);
                if (res.status == true) {
                        Game.Clients = res.clients;
                        for (let key in Game.Clients) {
                                let name = Base64.decode(Game.Clients[key].name);
                                Game.Clients[key].name = name;
                        }
                        let join_data = '{"type":"join","roomid":"' + Game.Roomid + '"}';
                        console.log('join', "发送数据:" + join_data);
                        Game.Socket.send(join_data);
                }

        })

};
//事件
Game.onMessage = function(e){
            if ( e.data == "null" ) { return ;}
            console.log(e);
            let data = eval("("+e.data+")");
            switch(data['type']){
                    // 服务端ping客户端
                    case 'ping':
                        Game.Socket.send('{"type":"pong"}');
                        break;
                    case 'init':
                            console.log('init');
                        //     let data = {
                        //             client_id: data['client_id']
                        //     }
                        //     Http.post('/bind', data, function (res) {
                        //             console.log(res);
                        //     })

                            break;    
                    // 登录 
                    case 'login':
                            console.log('login');
                            Game.login();
                        
                        break;
                    // 加入 更新用户列表
                    case 'join':
                            console.log('join');
                            console.log(data);
                            
                            let name = Base64.decode(data['name']);

                            if ( data['clients'] ) {
                                    Game.Roomid = Game.Roomid;
                                    Game.Config = data['config'];     
                                    Game.Ju = 1;     

                                    Game.User.uid = data['uid'];
                                    Game.User.name = name;
                                    Game.User.seat = data['seat'];
                                    Game.User.state = 1;

                                    Game.join();
                            }
                            else {

                                    for (let key in Game.Clients) {
                                            if (data['seat'] == Game.Clients[key].seat) {
                                                    Game.Clients[key].uid = data['uid'];
                                                    Game.Clients[key].name = name;
                                                    Game.Clients[key].state = 1;
                                                    break;
                                            }   
                                            
                                    }
                                    Game.flush();
                            }
                        
                        break;
                    //玩家准备
                    case 'ready':
 

                        break;
                    //开始
                    case 'begin':
                            console.log(data['name'] + "开始游戏");
                            Game.DealingNum = 1;
                            Game.User.Poker = [];
                            Game.User.pokers = data['poker'];
                            Game.begin();
                        break;
                    //抢地主
                    case 'landlord':
                            console.log(data['name'] + "开始抢地主");
                            Game.LastHandNum = data['seat'];
                            //地主已经产生
                            if (data['landlord_poker']) {
                                    Game.Landlord.Poker = data['landlord_poker'];
                            }

                            Game.LandlordNum = data['landlord_num'];
                            Game.MaxScore = data['max_score'];
                            Game.GrabTime = data['grab_time'];

                            Game.landlordPlay();

                        break;
                    //出牌
                    case 'play':
                            console.log(data['name'] + "出牌");
                            Game.LastHandNum = data['seat'];

                            if (!data['pokers'] ) {
                                    console.log("牌型不符");
                                    break;
                            }
                            Game.LastHandPokerType = data['poker_type'];
                            Game.Last.Poker = data['pokers'];
                            Game.playPoker();

                            break;
                    //下一位
                    case 'next':
                            console.log(data['name'] + "出牌");
                            Game.DealerNum = data['dealer_num'];

                            Game.next();

                            break;
                    // 用户掉线 更新用户列表
                    case 'logout':
 
                        break;
            }

};

//房间
Game.join = function(){
        console.log('Game.join');
        
        switch ( Game.User.seat ){
                case 1:
                        Game.Left = Game.Clients[2];
                        Game.Right = Game.Clients[3];
                        break;
                case 2:
                        Game.Left = Game.Clients[3];
                        Game.Right = Game.Clients[1];
                        break;
                case 3:
                        Game.Left = Game.Clients[1];
                        Game.Right = Game.Clients[2];
                        break;
        }

        // console.log(Game.User);
        // console.log(Game.Left);
        // console.log(Game.Right);

        JMain.JForm.clearControls();
        JMain.JForm.setBGImage(ResourceData.Images.bg3);

        Game.Panel = new JControls.Panel({ x: 0, y: 0 }, { width: App.Size.width, height: App.Size.height * 0.2 });//用于显示房间信息

        let RoomLabel =new JControls.Label({x:10,y:10},{width:50,height:30}).setText('房间:' ).setFontType("bold").setFontSize(20).setFontColor(JColor.red);
        let RoomIdLabel = new JControls.Label({ x: 60, y: 10 }, { width: 100, height: 30 }).setText(Game.Roomid).setFontType("bold").setFontSize(20).setFontColor(JColor.red);

        let JuLabel = new JControls.Label({ x: 10, y: 40 }, { width: 50, height: 30 }).setText('局数:').setFontType("bold").setFontSize(20).setFontColor(JColor.red);
        let GameJuLabel = new JControls.Label({ x: 60, y: 40 }, { width: 100, height: 30 }).setText(Game.Ju + '/' + Game.Config.ju ).setFontType("bold").setFontSize(20).setFontColor(JColor.red);
        
        let OutButton = new JControls.Button({ x: App.Size.width * 0.8,y:10},{width:100,height:30}).setText("退出").setBGImage(ResourceData.Images.btn);
        OutButton.onClick = function(){

                // 准备就绪
                let logout_data = '{"type":"logout","roomid":"' + Game.Roomid+'"}';
                console.log("玩家返回:"+logout_data);
                Game.Socket.send(logout_data);
                Game.outRoom();
        }

        let room_controls = [RoomLabel, RoomIdLabel, JuLabel, GameJuLabel,OutButton];

        Game.Panel.addControlInLast(room_controls);

        Game.User.Panel = new JControls.Panel({ x: App.Size.width * 0.4, y: App.Size.height * 0.8 }, { width: App.Size.width * 0.2, height: App.Size.height * 0.3 });//用于显示玩家信息
        // Game.User.Panel = new JControls.Panel({ x: App.Size.width * 0.4, y: App.Size.height * 0.8 }, { width: App.Size.width * 0.2, height: App.Size.height * 0.3 }).setBGColor(JColor.red);//用于显示玩家信息
        
        let NameLabel = new JControls.Label({ x: 0, y: 0 }, { width: App.Size.width * 0.2, height: 20 }).setText(Game.User.name).setFontType("bold").setFontSize(20).setFontColor(JColor.blue).setTextAlign('center');
        let UserLabel = new JControls.Label({ x: 0, y: 30 }, { width: App.Size.width * 0.1, height: 20 }).setText('玩家').setFontType("bold").setFontSize(20).setFontColor(JColor.blue).setTextAlign('right');
        let StateLabel = new JControls.Label({ x: App.Size.width * 0.1, y: 30 }, { width: App.Size.width * 0.1, height: 20 }).setText(Game.State[Game.User.state]).setFontType("bold").setFontSize(20).setFontColor(JColor.blue).setTextAlign('left');

        Game.User.NameLabel = NameLabel;
        Game.User.StateLabel = StateLabel;

        Game.User.Panel.addControlInLast([UserLabel,NameLabel,StateLabel]);


        Game.Left.Panel = new JControls.Panel({ x: 0, y: App.Size.height * 0.6 }, { width: App.Size.width * 0.2, height: App.Size.height * 0.4 });//用于显示左边玩家信息
        // Game.Left.Panel = new JControls.Panel({ x: 0, y: App.Size.height * 0.6 }, { width: App.Size.width * 0.2, height: App.Size.height * 0.4 }).setBGColor(JColor.blue);//用于显示左边玩家信息

        let LeftNameLabel = new JControls.Label({ x: 0, y: 0 }, { width: 160, height: 20 }).setText(Game.Left.name).setFontType("bold").setFontSize(20).setFontColor(JColor.blue).setTextAlign('center');
        let LeftUserLabel = new JControls.Label({ x: 0, y: 30 }, { width: 80, height: 20 }).setText('左玩家').setFontType("bold").setFontSize(20).setFontColor(JColor.blue).setTextAlign('right');
        
        let left_state = Game.Left.state != null ? Game.State[Game.Left.state] : '';
        let LeftStateLabel = new JControls.Label({ x: 80, y: 30 }, { width: 80, height: 20 }).setText(left_state).setFontType("bold").setFontSize(20).setFontColor(JColor.blue).setTextAlign('left');
        let LeftPokerNumLabel = new JControls.Label({ x: 10, y: 60 }, { width: 80, height: 20 }).setText('剩余扑克').setFontType("bold").setFontSize(20).setFontColor(JColor.red).setTextAlign('left');
        let LeftNumLabel = new JControls.Label({ x: 90, y: 60 }, { width: 40, height: 20 }).setText('0').setFontType("bold").setFontSize(20).setFontColor(JColor.red).setTextAlign('center');

        Game.Left.NameLabel = LeftNameLabel;
        Game.Left.StateLabel = LeftStateLabel;
        Game.Left.LeftNumLabel = LeftNumLabel;

        Game.Left.Panel.addControlInLast([LeftUserLabel, LeftNameLabel, LeftStateLabel, LeftPokerNumLabel, LeftNumLabel]);


        Game.Right.Panel = new JControls.Panel({ x: App.Size.width * 0.8, y: App.Size.height * 0.6 }, { width: App.Size.width * 0.2, height: App.Size.height * 0.4 });//用于显示右边玩家信息
        // Game.Right.Panel = new JControls.Panel({ x: App.Size.width * 0.8, y: App.Size.height * 0.6 }, { width: App.Size.width * 0.2, height: App.Size.height * 0.4 }).setBGColor(JColor.blue);//用于显示右边玩家信息

        let RightNameLabel = new JControls.Label({ x: 0, y: 0 }, { width: 160, height: 20 }).setText(Game.Right.name).setFontType("bold").setFontSize(20).setFontColor(JColor.blue).setTextAlign('center');
        let RightUserLabel = new JControls.Label({ x: 80, y: 30 }, { width: 80, height: 20 }).setText('右玩家').setFontType("bold").setFontSize(20).setFontColor(JColor.blue).setTextAlign('left');
        
        let right_state = Game.Right.state != null ? Game.State[Game.Right.state] : '';
        let RightStateLabel = new JControls.Label({ x: 0, y: 30 }, { width: 80, height: 20 }).setText(right_state).setFontType("bold").setFontSize(20).setFontColor(JColor.blue).setTextAlign('right');
        let RightPokerNumLabel = new JControls.Label({ x: 30, y: 60 }, { width: 80, height: 20 }).setText('剩余扑克').setFontType("bold").setFontSize(20).setFontColor(JColor.red).setTextAlign('left');
        let RightNumLabel = new JControls.Label({ x: 110, y: 60 }, { width: 40, height: 20 }).setText('0').setFontType("bold").setFontSize(20).setFontColor(JColor.red).setTextAlign('center');

        Game.Right.NameLabel = RightNameLabel;
        Game.Right.StateLabel = RightStateLabel;
        Game.Right.RightNumLabel = RightNumLabel;

        Game.Right.Panel.addControlInLast([RightUserLabel, RightNameLabel, RightStateLabel, RightPokerNumLabel, RightNumLabel]);

        Game.BtnPanel = new JControls.Object({ x: App.Size.width * 0.2, y: App.Size.height * 0.6 }, { width: App.Size.width * 0.6, height: 40 });//用于显示游戏控制按钮
        // Game.BtnPanel = new JControls.Object({ x: App.Size.width * 0.2, y: App.Size.height * 0.6 }, { width: App.Size.width * 0.6, height: 40 }).setBGColor(JColor.red);//用于显示游戏控制按钮
        var ReadyButton = new JControls.Button({x:0,y:0},{width:100,height:40}).setText("准备").setBGImage(ResourceData.Images.btn);
        ReadyButton.visible = false
        ReadyButton.onClick = function(){
                // 准备就绪
                let ready_data = '{"type":"ready","room_id":"'+Game.RoomId+'"}';
                console.log("玩家准备:"+ready_data);
                Game.Socket.send(ready_data);
        }

        
        Game.BtnPanel.addControlInLast([ReadyButton]);

        JMain.JForm.addControlInLast([Game.Panel,Game.BtnPanel,Game.User.Panel,Game.Left.Panel,Game.Right.Panel]);

        JMain.JForm.show();

};

Game.flush = function(){
        console.log('Game.flush');
        console.log(Game.Clients);

        for (let key in Game.Clients) {
                if ( Game.User.seat == key ) {
                        Game.User.name = Game.Clients[key].name;
                        Game.User.state = Game.Clients[key].state;

                        Game.User.NameLabel.text = Game.User.name;
                        Game.User.StateLabel.text = Game.State[Game.User.state];
                } else if (Game.Left.seat == key ) {
                        Game.Left.name = Game.Clients[key].name;
                        Game.Left.state = Game.Clients[key].state;

                        Game.Left.NameLabel.text = Game.Left.name;
                        Game.Left.StateLabel.text = Game.State[Game.Left.state];

                } else if (Game.Right.seat == key ) {
                        Game.Right.name = Game.Clients[key].name;
                        Game.Right.state = Game.Clients[key].state;

                        Game.Right.NameLabel.text = Game.Right.name;
                        Game.Right.StateLabel.text = Game.State[Game.Right.state];

                }
 
        }

        JMain.JForm.show();
        return;
};

Game.begin = function(){
        console.log('Game.begin');
        console.log(Game.PokerSize);
        
        Game.Landlord.PokerPanel = new GControls.UserPanel({ x: App.Size.width * 0.25, y: 10 }, { width: App.Size.width * 0.50, height: App.Size.height * 0.25 }, 0, App.Size.width * 0.15);
        // Game.Landlord.PokerPanel = new GControls.UserPanel({ x: App.Size.width * 0.25, y: 10 }, { width: App.Size.width * 0.50, height: App.Size.height * 0.25 }, 0, App.Size.width * 0.15).setBGColor(JColor.blue);

        Game.User.PokerPanel = new GControls.UserPanel({ x: App.Size.width * 0.15, y: App.Size.height * 0.75 }, { width: App.Size.width * 0.7, height: App.Size.height * 0.25 }, 1, App.Size.width * 0.03);
        Game.Left.PokerPanel = new GControls.PokerPanel({ x: App.Size.width * 0.01, y: App.Size.height * 0.3 }, { width: App.Size.width * 0.2, height: App.Size.height * 0.25 }, 2, App.Size.width * 0.01);
        Game.Right.PokerPanel = new GControls.PokerPanel({ x: App.Size.width * 0.79, y: App.Size.height * 0.3 }, { width: App.Size.width * 0.2, height: App.Size.height * 0.25 }, 3, App.Size.width * 0.01);

        Game.Last.PokerPanel = new GControls.UserPanel({ x: App.Size.width * 0.25, y: App.Size.height * 0.3 }, { width: App.Size.width * 0.5, height: App.Size.height * 0.25 }, 4, App.Size.width * 0.03);

        Game.User.PokerPanel.hidePoker = true;//hidePoker为false，显示扑克正面

        Game.Last.PokerPanel.hidePoker = false;

        Game.Left.PokerPanel.hidePoker = true;
        Game.Right.PokerPanel.hidePoker = true;
        Game.Landlord.PokerPanel.hidePoker = true;

        // Game.Last.PokerPanel.setBGColor(JColor.red);

        JMain.JForm.addControlInLast([Game.User.PokerPanel, Game.Landlord.PokerPanel, Game.Left.PokerPanel, Game.Right.PokerPanel, Game.Last.PokerPanel]);
        Game.User.PokerPanel.toSelectPoker = false;
        Game.ToPlay = false;

        let pokers = [0,0,0];
        Game.Landlord.Poker = pokers.map(function (item, index) {
                // console.log(item);    
                // console.log(index);   
                return new GControls.Poker(item);
        });
        
        // for (let i = 0; i < 3; i++) {
        //         Game.Landlord.Poker[i] = new GControls.Poker(Game.Landlord.Poker[i]);
        // }

        Game.Right.Poker = [0];
        Game.Right.PokerNum = 0;
        Game.Right.Poker[0] = new GControls.Poker(Game.Right.Poker[0]);

        Game.Left.Poker = [0];
        Game.Left.PokerNum = 0;
        Game.Left.Poker[0] = new GControls.Poker(Game.Left.Poker[0]);

        Game.Last.Poker = [];
        
        Game.LastWin = 0;
        Game.BeginNum = 0;
        Game.dealing();
};

Game.dealing = function(){//发牌
        console.log('Game.dealing');
        // console.log(Game.User.Poker);
        if(Game.DealingHandle)clearTimeout(Game.DealingHandle);
        console.log(Game.User.pokers);
        if(Game.BeginNum >= 17) {//已发完牌

                Game.User.PokerPanel.hidePoker = false;

                Game.Left.PokerNum = 17;
                Game.Right.PokerNum = 17;
                
                Game.MaxScore = 0;
                Game.GrabTime = 0;
                Game.LastHandNum = 0;
                Game.landlordPlay();//抢地主

        }else{
                let index = Game.User.pokers[Game.BeginNum];
                Game.User.Poker.push(new GControls.Poker(index));

                Game.BeginNum++;
                Game.DealingHandle = setTimeout(Game.dealing, 50);
                JMain.JForm.show();
        }
};

Game.landlordPlay = function(){
        console.log('Game.landlordPlay');
        if(Game.GrabTime == 3 && Game.MaxScore == 0 ){//没有人抢地主
                Game.over();
                return;
        }

        if( Game.MaxScore == 3 || ( Game.MaxScore > 0 && Game.GrabTime ==3 ) ){//地主已产生

                Game.Landlord.PokerPanel.clearControls();

                let landlord_poker = [];
                for (let i = 0; i < Game.Landlord.Poker.length; i++) {
                        landlord_poker[i] = Game.Landlord.Poker[i];
                        Game.Landlord.Poker[i] = new GControls.Poker(Game.Landlord.Poker[i]);
                }

                Game.Landlord.PokerPanel.hidePoker = false;
                Game.DealerNum = Game.LastHandNum;

                switch(Game.LastHandNum){
                        case  Game.User.seat:

                                for (let i = 0; i < landlord_poker.length; i++) {
                                        let poker = new GControls.Poker(landlord_poker[i]);
                                        poker.hidePoker = true;
                                        Game.User.Poker.push(poker);
                                }
                                Game.Left.PokerNum = 17;
                                Game.Right.PokerNum = 17;
                                Game.Left.StateLabel.text = Game.State[4];
                                Game.Right.StateLabel.text = Game.State[4];
                                Game.LastHandNum = 0;
        
                                Game.ToPlay = true;
                                Game.play();

                                break;
                        case Game.Left.seat:
                                Game.Left.PokerNum = 20;
                                Game.Right.PokerNum = 17;
                                Game.Left.StateLabel.text = Game.State[5];
                                Game.Right.StateLabel.text = Game.State[4];
                                break;
                        case Game.Right.seat:
                                Game.Left.PokerNum = 17;
                                Game.Right.PokerNum = 20;
                                Game.Left.StateLabel.text = Game.State[4];
                                Game.Right.StateLabel.text = Game.State[5];
                                break;
                }
                Game.Left.LeftNumLabel.text = Game.Left.PokerNum;
                Game.Right.RightNumLabel.text = Game.Right.PokerNum;
                JMain.JForm.show();
                return;
        }

        let hand_num = 0;
        if (Game.GrabTime == 0 && Game.LastHandNum == 0 && Game.LastWin == 0 ) {
                hand_num = 1;
        }else{
                hand_num = Game.LastHandNum + 1;
                if ( hand_num > 3 ) {
                        hand_num = 1;
                }
        }

        switch(hand_num){
                case Game.User.seat:

                        Game.BtnPanel.clearControls();
                        let Button1 = new GControls.GrabButton({ x: 0, y: 0 }, { width: 91, height: 46 }, 1).setBGImage(ResourceData.Images.onef);
                        let Button2 = new GControls.GrabButton({ x: 110, y: 0 }, { width: 91, height: 46 }, 2).setBGImage(ResourceData.Images.twof);
                        let Button3 = new GControls.GrabButton({ x: 220, y: 0 }, { width: 91, height: 46 }, 3).setBGImage(ResourceData.Images.threef);
                        let Button4 = new GControls.GrabButton({ x: 330, y: 0 }, { width: 91, height: 46},0).setBGImage(ResourceData.Images.bq);
                        Game.BtnPanel.addControlInLast([Button1,Button2,Button3,Button4]);
                        Game.BtnPanel.visible=true;
                        
                        Game.Left.StateLabel.text = Game.State[4];
                        Game.Right.StateLabel.text = Game.State[4];
                        break;
                case Game.Left.seat:
                        
                        Game.Left.StateLabel.text = Game.State[3];
                        Game.Right.StateLabel.text = Game.State[4];
                        break;
                case Game.Right.seat:
                        
                        Game.Left.StateLabel.text = Game.State[4];  
                        Game.Right.StateLabel.text = Game.State[3];
                        break;
        }

        Game.Left.LeftNumLabel.text = Game.Left.PokerNum;
        Game.Right.RightNumLabel.text = Game.Right.PokerNum;
        JMain.JForm.show();
        return;
};

Game.grab = function (score) {
        console.log('Game.grab');

};

Game.play = function(){
        console.log('Game.play');
        switch (Game.DealerNum) {
                case Game.User.seat:
                        Game.BtnPanel.clearControls();
                        Game.User.PokerPanel.toSelectPoker = true;

                        let Button1 = new JControls.Button({ x: 0, y: 0 }, { width: 91, height: 46 }, 1).setBGImage(ResourceData.Images.cp);
                        Button1.onClick = function  () {

                                var pokers = [];
                                console.log(Game.User.Poker);
                                for (let key in Game.User.Poker ) {
                                        
                                        if (Game.User.Poker[key].isSelected) {
                                                
                                                pokers.push(Game.User.Poker[key].value);
                                        }
                                }

                                if ( pokers ) {

                                        let pokers_data = '{"type":"play","pokers":"' + pokers + '"}';
                                        console.log("玩家出牌:" + pokers_data);
                                        Game.Socket.send(pokers_data);

                                }else{
                                        console.log('牌型不符合');
                                }

                        }
                        let btn_control = [Button1];

                        Game.BtnPanel.addControlInLast(btn_control);
                        Game.BtnPanel.visible = true;
                        
                        Game.Left.StateLabel.text = Game.State[4];
                        Game.Right.StateLabel.text = Game.State[4];

                        break;
                case Game.Left.seat:

                        Game.Left.StateLabel.text = Game.State[5];
                        Game.Right.StateLabel.text = Game.State[4];
                        break;
                case Game.Right.seat:

                        Game.Left.StateLabel.text = Game.State[4];
                        Game.Right.StateLabel.text = Game.State[5];
                        break;
        }
        JMain.JForm.show();
        return;
};

Game.playPoker = function () {
        console.log('Game.playPoker');

        Game.Last.PokerPanel.clearControls();

        Game.Last.Poker = Game.Last.Poker.map(function (item, index) {
                return new GControls.Poker(item);
        })
        // for (let i = 0; i < Game.Last.Poker.length; i++) {
        //         Game.Last.Poker[i] = new GControls.Poker(Game.Last.Poker[i]);
        // }
        Game.Last.PokerPanel.hidePoker = false;//hidePoker为false，显示扑克正面

        switch (Game.LastHandNum) {
                case Game.User.seat:
                        
                        // console.log(typeof Game.User.Poker);
                        for (var i = Game.User.Poker.length - 1; i >= 0; i--) {
                                if (Game.User.Poker[i].isSelected) {
                                        Game.User.Poker.splice(i, 1);
                                }
                        }
                        Game.BtnPanel.visible = false;
                        
                        if (Game.User.Poker.length == 0) {
                                Game.over();//牌出完，游戏结束  
                        }else{
                                //下一位出牌 
                                let dealer_num = Game.DealerNum + 1;
                                dealer_num = dealer_num >= 4 ? 1 : dealer_num;
                                let next_data = '{"type":"next","dealer_num":"' + dealer_num + '"}';
                                console.log("玩家出牌:" + next_data);
                                Game.Socket.send(next_data);
                        }

                        break;
                case Game.Left.seat:
                        Game.Left.PokerNum -= Game.Last.Poker.length;
                        Game.Left.LeftNumLabel.text = Game.Left.PokerNum;
                        
                        break;
                case Game.Right.seat:
                        Game.Right.PokerNum -= Game.Last.Poker.length;
                        Game.Right.RightNumLabel.text = Game.Right.PokerNum;
                        break;       
                default:
                        break;
        }

        JMain.JForm.show();
 
        return;
};

Game.next = function () {
        console.log('Game.next');
        switch (Game.DealerNum) {
                case Game.User.seat:

                        Game.BtnPanel.clearControls();
                        Game.User.PokerPanel.toSelectPoker = true;

                        let Button1 = new JControls.Button({ x: 0, y: 0 }, { width: 91, height: 46 }, 1).setBGImage(ResourceData.Images.cp);
                        Button1.onClick = function () {

                                var pokers = [];

                                for (let key in Game.User.Poker) {
                                        if (Game.User.Poker[key].isSelected) {
                                                pokers.push(Game.User.Poker[key].value);
                                        }
                                }

                                if (pokers) {

                                        let pokers_data = '{"type":"play","pokers":"' + pokers + '"}';
                                        console.log("玩家出牌:" + pokers_data);
                                        Game.Socket.send(pokers_data);
                                } else {
                                        console.log('牌型不符合');
                                }

                        }

                        let Button2 = new JControls.Button({ x: 110, y: 0 }, { width: 91, height: 46 }, 2).setBGImage(ResourceData.Images.bc);

                        Button2.onClick = function () {

                                //下一位出牌 
                                let dealer_num = Game.DealerNum + 1;
                                dealer_num = dealer_num >= 4 ? 1 : dealer_num;
                                let next_data = '{"type":"next","dealer_num":"' + dealer_num + '"}';
                                console.log("玩家出牌:" + next_data);
                                Game.Socket.send(next_data);

                        }

                        let btn_control = [Button1, Button2];

                        Game.BtnPanel.addControlInLast(btn_control);
                        Game.BtnPanel.visible = true;

                        Game.Left.StateLabel.text = Game.State[4];
                        Game.Right.StateLabel.text = Game.State[4];

                        break;
                case Game.Left.seat:
                        Game.Left.StateLabel.text = Game.State[5];
                        Game.Right.StateLabel.text = Game.State[4];
                        break;
                case Game.Right.seat:
                        Game.Left.StateLabel.text = Game.State[5];
                        Game.Right.StateLabel.text = Game.State[4];
                        break;
                default:
                        break;
        }

        JMain.JForm.show();        
        return;
};

Game.over = function(){
        console.log('Game.over');

};



module.exports = Game;
// window.Game = Game;