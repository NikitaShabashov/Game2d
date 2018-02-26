class spriteManager{
    constructor(){
        this.mapSprites={};
        this.playerImg={};
        $.getJSON("imgConfig.json",this.loadMapSprites);
        $.getJSON("imgPlayerConfig.json",this.loadPlayerSprites);
    }

    drawStop(object,x,y,move){
        let img;
        if (move===0){
            img = this.playerImg[object.getType()]['right'][object.getTick()];
        }else {
            img = this.playerImg[object.getType()]['left'][object.getTick()];
        }
        ctx.drawImage(img,object.x + x,object.y + y );
    }

    //двигающая картинка
    drawObject(object,x,y,right){
        //console.log(object.x + x,object.y + y);
        if (right){
            let img = this.playerImg[object.getType()]['right'][object.getTick()];
            ctx.drawImage(img,object.x + x,object.y + y );
        }else{
            let img = this.playerImg[object.getType()]['left'][object.getTick()];
            ctx.drawImage(img,object.x + x,object.y + y);
        }
        object.nextTick();
    }


    loadMapSprites(json){
        let n;
        for(let i in json['images']){
            n = json['images'][i]['number'].toString();
            Window.spriteManager.mapSprites[n]={};
            Window.spriteManager.mapSprites[n]['img']=new Image;
            Window.spriteManager.mapSprites[n]['img'].src=json['images'][i]['img'];
        }
    }


    loadPlayerSprites(json){
        let n;
        Window.spriteManager.playerImg['player'] = {};
        Window.spriteManager.playerImg['player']['left'] = Window.spriteManager.getArrImg(json['imagesPlayer']['left'],4);
        Window.spriteManager.playerImg['player']['right'] = Window.spriteManager.getArrImg(json['imagesPlayer']['right'],4);
        Window.spriteManager.playerImg['monster'] = {};
        Window.spriteManager.playerImg['monster']['left'] =  Window.spriteManager.getArrImg(json['imagesMonster']['left'],4);
        Window.spriteManager.playerImg['monster']['right'] = Window.spriteManager.getArrImg(json['imagesMonster']['right'],4);
        Window.spriteManager.playerImg['coin'] = Window.spriteManager.getArrImg(json['imageMoney'],6);
    }


    getArrImg(jsonArr,count){
        let arr = [];
        for(let i=0;i<count;i++){
            arr.push(new Image());
            arr[i].src = jsonArr[i]['img'];
        }
        return arr;
    }

    drawCoin(coin){
        let img = this.playerImg[coin.getType()][coin.getTick()];
        ctx.drawImage(img,coin.x ,coin.y ,30,50 );
        coin.nextTick();
    }

    drawMap(fromX,fromY){
        let startI = Math.round(fromX / blockSize);
        let startj = Math.round(fromY / blockSize);
        let n = "0";
        for (let i = startI - tickToSide; i < tickToSide + startI; i++) {
            for (let j = startj - tickToSide; j < tickToSide + startj; j++) {
                n = Window.mapManager.getBlock(i*blockSize,j*blockSize).toString();
                if (n in this.mapSprites) {
                    ctx.drawImage(this.mapSprites[n]['img'], i * blockSize, j * blockSize);
                }
            }
        }
    }

    drawMoneyMenu(count,max){
        ctx.font = "30px Pacifico";
        ctx.fontFamily = "'Pacifico' ,cursive";
        ctx.fillText(count+"/"+max,40,40);
        ctx.drawImage(this.playerImg['coin'][0],10,5,30,50)
    }

    drawAll(coins,monsters,x,y){
        for(let i in coins){
            this.drawCoin(coins[i]);
        }
        this.drawMap(x,y);
        for(let i in monsters){
            this.drawObject(monsters[i],0,0,monsters[i].right);
        }
    }
}
