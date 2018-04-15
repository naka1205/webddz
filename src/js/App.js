
var App = {
    CanvasID: 'ddz',
    Size: { width: 800, height: 480 },
    URL: '',
    User:null 
}


App.init = function () {
    App.User = {
        uid: '',
        account: '',
        password: '',
        name: ''
    }
    console.log('App.init');
    // console.log(screen);
    
    // let size = { width: 800, height: 480 }
    // if ( JFunction.Detectmob() ) {
    //     size = {
    //         width: screen.width,
    //         height: screen.height
    //     }
    // }
    
    
    // App.Size = size;

    JMain.JForm = new JControls.Form(App.Size, App.CanvasID);
    JMain.JForm.clearControls();
    App.LoadPanel = new JControls.Panel({ x: App.Size.width * 0.3, y: App.Size.height * 0.5 }, { width: App.Size.width * 0.2, height: App.Size.height * 0.05 }).setBGColor(JColor.white);;
    let LoadLabel = new JControls.Label({ x: 0, y: 0 }, { width: App.Size.width * 0.1, height: App.Size.height * 0.05 }).setText('数据加载：');
    let NumLabel = new JControls.Label({ x: App.Size.width * 0.1, y: 0 }, { width: App.Size.width * 0.1, height: App.Size.height * 0.05 });
    
    App.LoadPanel.addControlInLast([LoadLabel, NumLabel]);

    App.LoadIngPanel = new JControls.Panel({ x: 0, y: App.Size.height * 0.8 }, { width: App.Size.width, height: App.Size.height * 0.1 });
    let LoadIngLabel = new JControls.Label({ x: App.Size.height * 0.01, y: 0 }, { width: App.Size.width * 0.01, height: App.Size.height * 0.1 }).setBGColor(JColor.black);

    App.LoadIngPanel.addControlInLast([LoadIngLabel]);

    JMain.JForm.addControlInLast([App.LoadPanel, App.LoadIngPanel]);

    JMain.JForm.show();

    App.loading = function (value) {
        console.log('load', value.toString() + '%');
        NumLabel.setText(value.toString() + '%');
        App.LoadIngPanel.clearControls();
        let LoadIngLabel = new JControls.Label({ x: 0, y: 0 }, { width: App.Size.width * (value / 100), height: App.Size.height * 0.1 }).setBGColor(JColor.black);

        App.LoadIngPanel.addControlInLast([LoadIngLabel]);

        JMain.JForm.show(); 
    }

    JFunction.PreLoadData(App.URL, function (value) {
        console.log('load', value);
        console.log('loading', value === 100);
        // let time = value * 100;
        let time = value * 10;
        if ( value === 100 ) {
            setTimeout('App.login()', time);
        }else{
            setTimeout('App.loading(' + value + ')', time);
        }
    });

};


App.login = function () {

    console.log('App.login');

    JMain.JForm.clearControls();
    // JMain.JForm = new JControls.Form(App.Size, App.CanvasID).setBGImage(ResourceData.Images.bg1);
    JMain.JForm.setBGImage(ResourceData.Images.bg1);

    App.BtnPanel = new JControls.Object({ x: App.Size.width * 0.3, y: App.Size.height * 0.5 }, { width: 260, height: 40 });//用于显示游戏控制按钮
    // App.BtnPanel = new JControls.Object({ x: App.Size.width * 0.3, y: App.Size.height * 0.5 }, { width:260, height: 40 }).setBGColor(JColor.red);//用于显示游戏控制按钮
    let LoginButton1 = new JControls.Button({ x: 0, y: 0 }, { width: 120, height: 40 }).setBGImage(ResourceData.Images.login1);
    let LoginButton2 = new JControls.Button({ x: 140, y: 0 }, { width: 120, height: 40 }).setBGImage(ResourceData.Images.login2);

    LoginButton1.onClick = function () {

        let users = Cookie.get('users');
        console.log(users);
        if (users && users.name) {
            let data = {
                account: users.account,
                password: users.password,
            }
            Http.post('/login', data, function (res) {
                console.log(res);
                if (res.status == true) {

                    App.User = res.user;
                    App.User.name = Base64.decode(App.User.name);
                    Cookie.set('users', res.user, 7);
                    Http.auth = res.auth;

                    if (res.user.roomid) {
                        Game.Roomid = res.user.roomid;
                        Game.init();
                    } else {
                        App.hall();
                    }

                }
            })
        } else {

            let account = Date.now();
            let data = {
                account: account,
                password: ''
            }

            Http.post('/guest', data, function (res) {
                console.log(res);
                if (res.status == true) {
                    App.User.account = res.account;
                    App.User.password = res.password;
                    App.create();
                }
            })

        }


    }

    LoginButton2.onClick = function () {
        let data = {
            account: App.User.account,
            password: App.User.password,
        }
        Http.post('/login', data, function (res) {
            console.log(res);
            if (res.status == true) {
                console.log(res.account);
            }
        })
    }

    let init_controls = [LoginButton1, LoginButton2];

    App.BtnPanel.addControlInLast(init_controls);

    JMain.JForm.addControlInLast([App.BtnPanel]);

    JMain.JForm.show();

};


//创建角色
App.create = function () {
    console.log('App.create');

    JMain.JForm.clearControls();
    JMain.JForm.setBGImage(ResourceData.Images.bg2);

    App.CreatePanel = new JControls.Panel({ x: App.Size.width * 0.3, y: App.Size.height * 0.3 }, { width: App.Size.width * 0.6, height: App.Size.height * 0.6 });//用于显示房间信息
    // App.CreatePanel = new JControls.Panel({ x: App.Size.width * 0.2, y: App.Size.height * 0.3 }, { width: App.Size.width * 0.6, height: App.Size.height * 0.6 }).setBGColor(JColor.red);//用于显示房间信息

    App.User.name = JFunction.getUserName();

    let CreateLabel = new JControls.Label({ x: 0, y: 0 }, { width: 100, height: 40 }).setText(App.User.name);
    let ChangeButton = new JControls.Button({ x: 100, y: 0 }, { width: 40, height: 40 }).setText('更换');

    ChangeButton.onClick = function () {
        App.User.name = JFunction.getUserName();
        console.log(App.User.name);
        CreateLabel.setText(App.User.name);
        JMain.JForm.show();
    }
    let CreateButton = new JControls.Button({ x: 80, y: 200 }, { width: 100, height: 40 }).setText("确认");

    CreateButton.onClick = function () {

        let data = {
            account: App.User.account,
            password: App.User.password,
            name: Base64.encode(App.User.name)
        }
        Http.post('/register', data, function (res) {
            console.log(res);
            if (res.status == true) {
                
                App.User = res.user;
                App.User.name = Base64.decode(App.User.name);
                Cookie.set('users', res.user, 7);
                Http.auth = res.auth;
                App.hall();
            }
        })
    }

    let create_controls = [CreateLabel, ChangeButton, CreateButton];

    App.CreatePanel.addControlInLast(create_controls);

    JMain.JForm.addControlInLast([App.CreatePanel]);

    JMain.JForm.show();
};


//登录大厅
App.hall = function () {
    console.log('App.hall');

    JMain.JForm.clearControls();
    JMain.JForm.setBGImage(ResourceData.Images.bg2);

    App.HallPanel = new JControls.Panel({ x: 0, y: 0 }, { width: 150, height: 20 });//用于显示玩家信息

    let UserLabel = new JControls.Label({ x: 10, y: 0 }, { width: 50, height: 20 }).setText('用户:').setFontType("bold").setFontSize(20).setFontColor(JColor.blue);
    let NameLabel = new JControls.Label({ x: 60, y: 0 }, { width: 100, height: 20 }).setText(App.User.name).setFontType("bold").setFontSize(20).setFontColor(JColor.blue);
    let GoldsLabel = new JControls.Label({ x: 10, y: 20 }, { width: 50, height: 20 }).setText('金币:').setFontType("bold").setFontSize(20).setFontColor(JColor.blue);
    let GoldsNumLabel = new JControls.Label({ x: 60, y: 20 }, { width: 100, height: 20 }).setText(App.User.golds.toString()).setFontType("bold").setFontSize(20).setFontColor(JColor.blue);


    App.HallPanel.addControlInLast([UserLabel, NameLabel, GoldsLabel, GoldsNumLabel]);

    App.BtnPanel = new JControls.Panel({ x: 0, y: 280 }, { width: App.Size.width, height: 40 });//用于显示游戏控制按钮
    let JoinButton = new JControls.Button({ x: 300, y: 0 }, { width: 100, height: 40 }).setText("加入房间").setBGImage(ResourceData.Images.btn);

    JoinButton.onClick = function () {
        JMain.JForm.clearControls();
        console.log("加入房间");
        App.RoomPanel = new JControls.Panel({ x: App.Size.width * 0.2, y: App.Size.height * 0.2 }, { width: App.Size.width * 0.6, height: App.Size.height * 0.7 }).setBGImage(ResourceData.Images.tcbg);

        let label_size = { width: App.Size.width * 0.06, height: App.Size.height * 0.06 };

        let RoomIdLabel1 = new JControls.Label({ x: App.Size.width * 0.09, y: App.Size.height * 0.18 }, label_size).setText('').setTextAlign('center');
        let RoomIdLabel2 = new JControls.Label({ x: App.Size.width * 0.16, y: App.Size.height * 0.18 }, label_size).setText('').setTextAlign('center');
        let RoomIdLabel3 = new JControls.Label({ x: App.Size.width * 0.23, y: App.Size.height * 0.18 }, label_size).setText('').setTextAlign('center');
        let RoomIdLabel4 = new JControls.Label({ x: App.Size.width * 0.30, y: App.Size.height * 0.18 }, label_size).setText('').setTextAlign('center');
        let RoomIdLabel5 = new JControls.Label({ x: App.Size.width * 0.37, y: App.Size.height * 0.18 }, label_size).setText('').setTextAlign('center');
        let RoomIdLabel6 = new JControls.Label({ x: App.Size.width * 0.44, y: App.Size.height * 0.18 }, label_size).setText('').setTextAlign('center');

        RoomIdLabel1.isSelect = true;
        RoomIdLabel2.isSelect = true;
        RoomIdLabel3.isSelect = true;
        RoomIdLabel4.isSelect = true;
        RoomIdLabel5.isSelect = true;
        RoomIdLabel6.isSelect = true;

        App.RoomPanel.Label = [RoomIdLabel1, RoomIdLabel2, RoomIdLabel3, RoomIdLabel4, RoomIdLabel5, RoomIdLabel6];
        App.RoomPanel.addControlInLast(App.RoomPanel.Label);

        let button_size = { width: App.Size.width * 0.1, height: App.Size.height * 0.1 };

        let RoomIdButton1 = new GControls.NumberButton({ x: App.Size.width * 0.1, y: App.Size.height * 0.3 }, button_size, 1).setBGImage(ResourceData.Images.join1);
        let RoomIdButton2 = new GControls.NumberButton({ x: App.Size.width * 0.2, y: App.Size.height * 0.3 }, button_size, 2).setBGImage(ResourceData.Images.join2);
        let RoomIdButton3 = new GControls.NumberButton({ x: App.Size.width * 0.3, y: App.Size.height * 0.3 }, button_size, 3).setBGImage(ResourceData.Images.join3);

        let RoomIdButton4 = new GControls.NumberButton({ x: App.Size.width * 0.1, y: App.Size.height * 0.4}, button_size, 4).setBGImage(ResourceData.Images.join4);
        let RoomIdButton5 = new GControls.NumberButton({ x: App.Size.width * 0.2, y: App.Size.height * 0.4}, button_size, 5).setBGImage(ResourceData.Images.join5);
        let RoomIdButton6 = new GControls.NumberButton({ x: App.Size.width * 0.3, y: App.Size.height * 0.4 }, button_size, 6).setBGImage(ResourceData.Images.join6);
        
        let RoomIdButton7 = new GControls.NumberButton({ x: App.Size.width * 0.1, y: App.Size.height * 0.5 }, button_size, 7).setBGImage(ResourceData.Images.join7);
        let RoomIdButton8 = new GControls.NumberButton({ x: App.Size.width * 0.2, y: App.Size.height * 0.5 }, button_size, 8).setBGImage(ResourceData.Images.join8);
        let RoomIdButton9 = new GControls.NumberButton({ x: App.Size.width * 0.3, y: App.Size.height * 0.5 }, button_size, 9).setBGImage(ResourceData.Images.join9);

        let RoomIdButton0 = new GControls.NumberButton({ x: App.Size.width * 0.4, y: App.Size.height * 0.4 }, button_size, 0).setBGImage(ResourceData.Images.join0);
        let RoomIdButton10 = new JControls.Button({ x: App.Size.width * 0.4, y: App.Size.height * 0.3 }, button_size).setBGImage(ResourceData.Images.del);
        let RoomIdButton11 = new JControls.Button({ x: App.Size.width * 0.4, y: App.Size.height * 0.5}, button_size).setBGImage(ResourceData.Images.ret);

        RoomIdButton10.onClick = function () {
            for (let i = App.RoomPanel.Label.length - 1; i >= 0; i--) {
                if (App.RoomPanel.Label[i].text != '') {
                    App.RoomPanel.Label[i].text = '';
                    break;
                }
            }
            JMain.JForm.show();
        }

        RoomIdButton11.onClick = function () {
            for (let i = App.RoomPanel.Label.length - 1; i >= 0; i--) {
                App.RoomPanel.Label[i].text = '';
            }
            JMain.JForm.show();
        }

        App.RoomPanel.Button = [RoomIdButton1, RoomIdButton2, RoomIdButton3, RoomIdButton4, RoomIdButton5, RoomIdButton6, RoomIdButton7, RoomIdButton8, RoomIdButton9, RoomIdButton0, RoomIdButton10, RoomIdButton11];
        App.RoomPanel.addControlInLast(App.RoomPanel.Button);

        JMain.JForm.addControlInLast([App.RoomPanel]);
        JMain.JForm.show();
    }

    let CreateButton = new JControls.Button({ x: 420, y: 0 }, { width: 100, height: 40 }).setText("创建房间").setBGImage(ResourceData.Images.btn);

    CreateButton.onClick = function () {
        JMain.JForm.clearControls();
        console.log("创建房间");
        Game.Config = {
            ju: 10
        }
        
        App.RoomPanel = new JControls.Panel({ x: App.Size.width * 0.1, y: App.Size.width * 0.1 }, { width: App.Size.width * 0.8, height: App.Size.height * 0.8 }).setBGImage(ResourceData.Images.tcbg);
        //选项 局数
        let JuPanel = new JControls.Panel({ x: 25, y: 80 }, { width: 520, height: 40 }).setBGImage(ResourceData.Images.input1);
        let JuButton1 = new JControls.Button({ x: 100, y: 0 }, { width: 40, height: 40 }).setBGImage(ResourceData.Images.checkbox_full);
        let JuLabel1 = new JControls.Label({ x: 150, y: 10 }, { width: 140, height: 30 }).setText("十局").setFontType("bold").setFontSize(16);
        let JuButton2 = new JControls.Button({ x: 300, y: 0 }, { width: 40, height: 40 }).setBGImage(ResourceData.Images.checkbox_void);
        let JuLabel2 = new JControls.Label({ x: 350, y: 10 }, { width: 140, height: 30 }).setText("二十局").setFontType("bold").setFontSize(16);

        JuButton1.onClick = function () {
            console.log("十局");
            Game.Config = {
                ju: 10
            }
            JuButton2.setBGImage(ResourceData.Images.checkbox_void);
            JuButton1.setBGImage(ResourceData.Images.checkbox_full);
            JMain.JForm.show();
        }
        JuButton2.onClick = function () {
            Game.Config = {
                ju: 20
            }
            console.log("二十局");
            JuButton1.setBGImage(ResourceData.Images.checkbox_void);
            JuButton2.setBGImage(ResourceData.Images.checkbox_full);
            JMain.JForm.show();
        }

        JuPanel.addControlInLast([JuButton1, JuLabel1, JuButton2, JuLabel2]);

        //按钮 确认
        let ConfirmButton = new JControls.Button({ x: App.Size.width * 0.4, y: App.Size.height * 0.7 }, { width: 107, height: 35 }).setBGImage(ResourceData.Images.confirm);

        ConfirmButton.onClick = function () {
            let data = Game.Config;
            Http.post('/create', data, function (res) {
                console.log(res);
                if (res.status == true) {
                    Game.Roomid = res.rooms.roomid;
                    Game.init();
                }
            })
        }

        App.RoomPanel.addControlInLast([JuPanel, ConfirmButton]);

        JMain.JForm.addControlInLast([App.RoomPanel]);
        JMain.JForm.show();

    }

    App.BtnPanel.addControlInLast([CreateButton, JoinButton]);

    JMain.JForm.addControlInLast([App.HallPanel, App.BtnPanel]);

    JMain.JForm.show();
};


module.exports = App;
// window.App = App;