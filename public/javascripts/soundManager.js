class soundManager {
    constructor() {
        this.sound = {};
        this.sound['coin'] = new Audio('sounds/money.wav');
    }

    play(type) {
        this.sound[type].play();
    }

}