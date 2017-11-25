'use strict';

let pgame;
let userName;

class Main {
    constructor(width, height, contanerName) {
        pgame = new Phaser.Game(widtgh, height, Phaser.AUTO, contanerName, {
            preload: () => this.preload(), create: () => this.create(), render: () => this.render()
        });
    }

    preload() {
        pgame.time.desiredFps = 60;
        pgame.time.advancedTiming = true;

        pgame.load.script('splash', 'assets/js/game/splash.js');
        pgame.load.image('splash_bg', 'assets/images/splash_bg.jpg');
    }

    create() {
        pgame.state.add('Splash', Splash);
        pgame.state.start('Splash');
    }

    render() {
        pgame.debug.cameraInfo(pgame.camera, 32, 32);
    }
}
