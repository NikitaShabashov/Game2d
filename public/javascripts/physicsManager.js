class physicsManager {
    constructor(map) {
        this.map = map;
        this.player;
    }

    addObject(obj) {
        switch (obj.getType()) {
            case "player":
                this.player = obj;
                break;
            case "monster":
                this.monsters.push(obj);
                break;
            case "coin":
                this.coins.push(obj);
                break;
        }
    }

    getDistance(x, y, x1, y1) {
        return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
    }

    //если блок, то остановится
    checkPoint(obj, x, y, down) {
        if (this.map.getRigidBody(x, y + obj.speedY) !== 0) {
            obj.speedY = 0;
            if (down) obj.renewJumps();
        }

        if (this.map.getRigidBody(x + obj.speedX, y) !== 0) {
            obj.speedX = 0;
        }
    }


    diagonaleCheck(obj,x,y){
        if (this.map.getRigidBody(x + obj.speedX, y +  obj.speedY) !== 0) {
            obj.speedX = 0;
            obj.speedY = 0;
        }
    }

//взаимодейsевие s монеткой
    playerCheckMoneyCollision(player, coins) {
        for (let n in coins) {
            if (this.getDistance(player.x + 15, player.y, coins[n].x, coins[n].y) < player.width / 2) {
                Window.manager.removeCoin(n);
            }
        }
    }

    checkMonsterCollision(x, y, monster, kill) {
        if (this.getDistance(x, y, monster.x, monster.y) < monster.width / 2) {
            if (kill) {
                this.player.speedY -= 4;
                return true;
            } else {
                Window.manager.onDie();
                return false;
            }
        }
    }

    checkMonsters(obj, monsters) {
        for (let i = 0; i < monsters.length; i++) {
            this.checkMonsterCollision(obj.x - 25., obj.y, monsters[i], false);
            this.checkMonsterCollision(obj.x + 25., obj.y, monsters[i], false);

            if (this.checkMonsterCollision( obj.x, obj.y + 25., monsters[i], true)) {
                monsters.splice(i, 1);
                return;
            }
        }
    }


    checkWin(obj){
        if (this.map.getBlock(obj.x, obj.y) > 1) {
            Window.manager.onWin();
        }
    }

    checkCollisison(obj) {
        obj.addGravity();
        this.checkPoint(obj, obj.x - 25., obj.y - 25., false);
        this.checkPoint(obj, obj.x - 25., obj.y + 25., true);
        this.checkPoint(obj, obj.x + 25., obj.y - 25., false);
        this.checkPoint(obj, obj.x + 25., obj.y + 25., true);

        this.diagonaleCheck(obj, obj.x - 25., obj.y - 25.);
        this.diagonaleCheck(obj, obj.x - 25., obj.y + 25.);
        this.diagonaleCheck(obj, obj.x + 25., obj.y - 25.);
        this.diagonaleCheck(obj, obj.x + 25., obj.y + 25.);
        obj.nextXPoint();
        obj.nextYPoint();
    }


    onTick(coins, monsters) {
        this.checkCollisison(this.player);
        this.checkWin(this.player);
        for (let i in monsters) {
            this.checkCollisison(monsters[i]);
        }
        if (this.player.y > 1000){
            Window.manager.onDie();
        }
        this.checkMonsters(this.player,monsters);
        this.playerCheckMoneyCollision(this.player, coins);
    }

}