
//玩家主控
var GControls={};
GControls.Poker=Class.create(JControls.Object,{
    pokerNumber:null
    ,value:null
    ,seNumber:null
    ,imageData:null
    ,isHidePoker:true
    ,isSelected:null
    ,initialize:function ($super,imageName){
        $super();
        this.setSize(Game.PokerSize);
        this.value = imageName;
        this.imageData=ResourceData.Images[imageName];
        this.pokerNumber=this.imageData.num;
        this.seNumber=this.imageData.se;
        this.isSelected=false;
    }
    ,beginShow:function($super){
        $super();
        if(this.isHidePoker)this.setBGImage(ResourceData.Images.BeiMian);
        else this.setBGImage(this.imageData);
    }
    ,onClick:function(){
        console.log('toSelectPoker',this.parent.toSelectPoker);
        console.log('isSelected',this.isSelected);
        if(this.parent.toSelectPoker){
            this.isSelected=!this.isSelected;
            JMain.JForm.show();
            return true;
        }
        return false;
    }
});
GControls.GrabButton=Class.create(JControls.Button,{
    score:null
    ,initialize:function ($super,  argP, argWH,score) {
        $super( argP, argWH);
        this.score=score;
        if(this.score&&this.score<=Game.MaxScore) this.BGColorAlpha = 0.5;
    }
    ,onClick:function(){

        if( this.score > 0 && this.score <= Game.MaxScore ){
             return false;
        }

        if ( this.score > Game.MaxScore ) {
                 
            Game.MaxScore = this.score;

        }

        this.BGColorAlpha = 0.5;
        Game.LandlordNum = Game.User.seat;
        Game.GrabTime++;
        Game.BtnPanel.visible = false;
        JMain.JForm.show();
        // Game.Grab(this.score);
         // 准备就绪
        let landlord_data = '{"type":"landlord","score":"'+ this.score+'"}';
        console.log("玩家抢分:" + landlord_data);
        Game.Socket.send(landlord_data);


        return true;
    }
});
GControls.NumberButton = Class.create(JControls.Button, {
    number: null
    , initialize: function ($super, argP, argWH, number) {
        $super(argP, argWH);
        this.number = number;
    }
    , onClick: function () {

        for (let i = 0; i < App.RoomPanel.Label.length; i++) {
            if (App.RoomPanel.Label[i].text == '') {
                App.RoomPanel.Label[i].text = this.number.toString();
                break;
            }
        }
        JMain.JForm.show();

        let roomid = '';
        for (let i = 0; i < App.RoomPanel.Label.length; i++) {
            let text = App.RoomPanel.Label[i].text;
            if (text == '') {
                return false;
            }
            roomid = roomid + text;
        }

        console.log(roomid);
        let data = {
            roomid: roomid
        }
        Game.Roomid = roomid;

        Http.post('/check', data, function (res) {
            console.log(res);
            if (res.status == true) {
                Game.Roomid = res.rooms.roomid;
                Game.init();
            }else{
                for (let i = App.RoomPanel.Label.length - 1; i >= 0; i--) {
                    App.RoomPanel.Label[i].text = '';
                }
                JMain.JForm.show();
            }
        })

        return true;
    }
});

GControls.UserPanel=Class.create(JControls.Object,{
    pokerPanelNum:null
    ,hidePoker:null
    ,density:null
    ,toSelectPoker:null
    ,initialize:function ($super,argP, argWH,num,density){
        $super(argP, argWH);
        this.pokerPanelNum=num;
        //this.hidePoker=hidePoker;
        if(density!=null)this.density=density;
        else this.density=20;
    }
    ,beginShow:function($super){

        let pokers = [];

        switch (this.pokerPanelNum ) {
            case 0:
                pokers = Game.Landlord.Poker.sort(sortNumber);
                break;
            case 1:
                pokers = Game.User.Poker.sort(sortNumber);
                break;
            case 4:
                pokers = Game.Last.Poker.sort(sortNumber);
                break;
            default:
                break;
        }

        let poker_length = pokers.length;

        for(let i = 0; i < poker_length; i++){
            let x = 0,y= 0;
            let w = Game.PokerSize.width + ( poker_length - 1 ) * this.density;
            
            x = ( this.size.width - w ) / 2.0 + i * this.density;
            if ( this.toSelectPoker && pokers[i].isSelected ) {
                y = -20;
            }

            pokers[i].setRelativePosition({x:x,y:y});
            pokers[i].isHidePoker = this.hidePoker ? true : false;

        }
        this.clearControls();
        this.addControlInLast(pokers);

        $super();
        function sortNumber(a, b){
            if(b.pokerNumber==a.pokerNumber)return b.seNumber- a.seNumber;
            else return b.pokerNumber-a.pokerNumber;
        }
    }
});

GControls.PokerPanel=Class.create(JControls.Object,{
    pokerPanelNum:null
    ,hidePoker:null
    ,density:null
    ,toSelectPoker:null
    ,initialize:function ($super,argP, argWH,num,density){
        $super(argP, argWH);
 
    }
    ,beginShow:function($super){

        let pokers = [];
        if (this.pokerPanelNum == 2) {
            pokers = Game.Left.Poker.sort(sortNumber);
        } else {
            pokers = Game.Right.Poker.sort(sortNumber);
        }

        let poker_length = pokers.length;

        for (let i = 0; i < poker_length; i++) {
            let x = 0, y = 0;
            let w = Game.PokerSize.width + (poker_length - 1) * this.density;

            x = (this.size.width - w) / 2.0 + i * this.density;

            pokers[i].setRelativePosition({ x: x, y: y });

            pokers[i].isHidePoker = false;

        }  
        
        this.clearControls();
        this.addControlInLast(pokers);

        $super();
        function sortNumber(a, b){
            if(b.pokerNumber==a.pokerNumber)return b.seNumber- a.seNumber;
            else return b.pokerNumber-a.pokerNumber;
        }
    }
});

module.exports = GControls;
// window.GControls = GControls;