class mapManager {
    constructor(map, width, height) {
        this.map = map;
        this.width = width;
        this.height = height;
    }

    //1 - твёрдое, другое - нет
    getRigidBody(pointX, pointY){
        let x = Math.round(pointX/blockSize);
        let y = Math.round(pointY/blockSize);
        if ((x < 0 || x >= this.width) || (y < 0 || y >= this.height)) {
            return 0;
        }
        if (this.map[y][x]!==1){
            return 0;
        }else{
            return 1;
        }
    }

    //получение id блока
    getBlock(pointX, pointY) {
        let x = Math.round(pointX/blockSize);
        let y = Math.round(pointY/blockSize);
        if ((x < 0 || x >= this.width) || (y < 0 || y >= this.height)) {
            return 0;
        }
        return this.map[y][x];
    }


}