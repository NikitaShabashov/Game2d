class GameManager {
    constructor(nMup) {
        Window.spriteManager = new spriteManager();
        this.player = new player(100, 100, 64, 64);
        this.coins = [];
        this.monsters = [];
        this.moveRight = false;
        this.moveLeft = false;
        this.lastMove = 0;
        this.countMoney = 0;
        this.loaded = false;
        this.pause = false;
        this.level = nMup;
        this.initialDate = new Date;
        $.getJSON("level" + nMup + ".json", this.loadMap);
    }

    keDownHandler(e) {
        switch (e.keyCode) {
            case 87:
                this.player.onJump();
                break;
            case 32:
                this.player.onJump();
                break;
            case 68:
                this.moveRight = true;
                break;
            case 65:
                this.moveLeft = true;
                break;
        }
    }

    keUpHandler(e) {
        switch (e.keyCode) {
            case 68:
                this.moveRight = false;
                break;
            case 65:
                this.moveLeft = false;
                break;
        }
    }

    monsterMove(monster) {
        if (monster.right) {
            if (monster.x > monster.maxX) {
                monster.right = false;
                monster.speedX = 0.0;
                monster.moveLeft();
            } else {
                monster.moveRight();
            }
        } else {
            if (monster.x < monster.minX) {
                monster.right = true;
                monster.speedX = 0.0;
                monster.moveRight();
            } else {
                monster.moveLeft();
            }
        }
    }


    loadMap(json) {
        let map = [];
        let height = json['layers'][0]['height'];
        let width = json['layers'][0]['width'];
        let jsonArr = json['layers'][0]['data'];
        for (let i = 0; i < height; i++) {
            map.push([]);
            for (let j = 0; j < width; j++) {
                map[i].push(jsonArr[i * width + j])
            }
        }
        let arrCoins = [];
        let arrMonster = [];
        for (let i = 0; i < json['layers'][1]['objects'].length; i++) {
            if (json['layers'][1]['objects'][i]['gid'] != undefined) {
                //Coins!
                arrCoins.push(new money(json['layers'][1]['objects'][i]['x'] + 20, json['layers'][1]['objects'][i]['y'] - 50, 30, 50));
            } else if (json['layers'][1]['objects'][i]['ellipse'] != undefined) {
                //Player start point!
                Window.manager.player.x = json['layers'][1]['objects'][i]['x'];
                Window.manager.player.y = json['layers'][1]['objects'][i]['y'];
            } else {
                arrMonster.push(new monster(json['layers'][1]['objects'][i]['x'], json['layers'][1]['objects'][i]['y'], 64, 64, json['layers'][1]['objects'][i]['x'] + json['layers'][1]['objects'][i]['polyline'][1]['x']));
            }
        }
        Window.manager.coins = arrCoins;
        Window.manager.monsters = arrMonster;
        Window.manager.countMoney = arrCoins.length;
        Window.mapManager = new mapManager(map, width, height);
        Window.manager.physicsManager = new physicsManager(Window.mapManager);
        Window.manager.physicsManager.addObject(Window.manager.player);
        Window.manager.loaded = true;
    }


    onDie() {
        if (this.pause === true) {
            return;
        }
        this.pause = true;
        document.getElementById('loseGame').style.visibility = "visible";
        document.getElementById('loseTryAgain').onclick = () => {
            Window.SuperManager.loadGame(this.level);
        };
        document.getElementById('loseRecords').onclick = () => {
            SuperManager.openRecordMenu(this.level);
        };

    }

    onWin() {
        if (this.coins.length!==0){
            return;
        }
        this.pause = true;

        let currentDate = new Date;
        let timer = new Date(currentDate - this.initialDate);
        Window.SuperManager.addRecord(timer.getSeconds(),this.level);

        document.getElementById('winGame').style.visibility = "visible";
        if (this.level>=4){
            document.getElementById('winNextLevel').style.visibility = "hidden";
        }else{
            document.getElementById('winNextLevel').style.visibility = "inherit";
        }
        document.getElementById('winNextLevel').onclick = () => {
            Window.SuperManager.loadGame(parseInt(this.level)+1);
        };
        document.getElementById('winRecords').onclick = () => {
            SuperManager.openRecordMenu(this.level);
        };
    }


    draw() {
        if (this.loaded != true) {
            return;
        }
        if (this.pause === true) {
            //this.onPause();
            this.camX = 348 - this.player.x;
            this.camY = 312 - this.player.y;
            Window.spriteManager.drawStop(this.player, this.camX, this.camY, this.lastMove);
            ctx.save();
            ctx.translate(this.camX, this.camY);
            Window.spriteManager.drawAll(this.coins, this.monsters, this.player.x, this.player.y);
            ctx.restore();
            return;
        }

        this.camX = 348 - this.player.x;
        this.camY = 312 - this.player.y;
        if (this.moveRight) {
            this.player.moveRight();
            Window.spriteManager.drawObject(this.player, this.camX, this.camY, true);
            this.lastMove = 0;
        }
        else if (this.moveLeft) {
            this.player.moveLeft();
            Window.spriteManager.drawObject(this.player, this.camX, this.camY, false);
            this.lastMove = 1;
        }
        else {
            this.player.dontMove();
            Window.spriteManager.drawStop(this.player, this.camX, this.camY, this.lastMove);
        }

        for (let i in this.monsters) {
            this.monsterMove(this.monsters[i]);
        }
        Window.spriteManager.drawMoneyMenu(this.countMoney-this.coins.length,this.countMoney);
        ctx.save();
        ctx.translate(this.camX, this.camY);
        Window.spriteManager.drawAll(this.coins, this.monsters, this.player.x, this.player.y);
        ctx.restore();
        this.physicsManager.onTick(this.coins, this.monsters);

    }


    removeCoin(n) {
        this.coins.splice(n, 1);
        Window.SuperManager.sounds.play('coin');
    }


}
