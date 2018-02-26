class object {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.MaxAnimationTick = 16;
        this.animationTick = 0;
        this.height = height;
        this.width = width;
        this.jumps=2;
    }

    getType(){
        return this.type;
    }

    nextTick(){
        this.animationTick=(this.animationTick+1)%this.MaxAnimationTick;
    }

    getTick(){
        return Math.round(this.animationTick/4)%4;
    }

    getNextX() {
        return this.x + this.speedX;
    }

    getNextY() {
        return this.y + this.speedY;
    }

    addGravity() {
        this.speedY += gravity;
    }

    nextYPoint() {
        this.y+=this.speedY;
    }


    nextXPoint() {
        this.x+=this.speedX;
    }

    renewJumps(){
        this.jumps=2;
    }

}

class player extends object {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type="player";
    }

    onJump(){
        if (this.jumps>0){
            this.jumps--;
            this.speedY=this.speedY-jumpBoost;
        }
    }

    moveRight(){
        if (this.speedX+moveBoost<maxSpeed){
            this.speedX=this.speedX+moveBoost;
        }
    }

    moveLeft(){
        if (this.speedX-moveBoost>-maxSpeed){
            this.speedX=this.speedX - moveBoost;
        }
    }

    //торможение
    dontMove(){
        if (Math.abs(this.speedX)-moveBoost > moveBoost){
            if (this.speedX>0) this.speedX=this.speedX-moveBoost;
            else this.speedX=this.speedX + moveBoost;
        }else{
            this.speedX=0.0;
        }
    }


}

class money extends object {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.MaxAnimationTick = 24;
        this.type="coin";
    }

    getTick(){
        return Math.round(this.animationTick/6)%6;
    }

}

class monster extends object {
    constructor(x, y, width, height,maxX) {
        super(x, y, width, height);
        this.type="monster";
        this.MaxAnimationTick = 24;
        this.maxX=maxX;
        this.minX=x;
        this.right=true;
    }
    getTick(){
        return Math.round(this.animationTick/6)%4;
    }

    moveRight(){
        if (this.speedX+monsterBoost<monstermaxSpeed){
            this.speedX=this.speedX+monsterBoost;
        }
    }

    moveLeft(){
        if (this.speedX-monsterBoost>-monstermaxSpeed){
            this.speedX=this.speedX - monsterBoost;
        }
    }


}