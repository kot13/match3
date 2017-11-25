'use strict';

class Splash {

    constructor() {
        this.background = pgame.make.sprite(0, 0, 'splash_bg');
        this.background.width = pgame.width;
        this.background.height = pgame.height;

        this.title = pgame.make.text(0, 0, 'Загружаемся..', {fill: 'white'});
        this.title.x = pgame.width / 2.0 - this.title.width / 2.0;
        this.title.y = pgame.height / 2.0 - this.title.height / 2.0;
    }

    preload() {
        pgame.add.existing(this.background);
        pgame.add.existing(this.title);

        pgame.load.script('SocketIO', 'assets/js/lib/socket-io.min.js');

        pgame.load.script('menu', 'assets/js/game/menu.js');
        pgame.load.script('game', 'assets/js/game/game.js');
        pgame.load.script('player', 'assets/js/game/player.js');
        pgame.load.script('board', 'assets/js/game/board.js');

        pgame.load.image('gem1', 'assets/images/heart.png');
        pgame.load.image('gem2', 'assets/images/gemGreen.png');
        pgame.load.image('gem3', 'assets/images/gemBlue.png');
        pgame.load.image('gem4', 'assets/images/gemRed.png');
        pgame.load.image('gem5', 'assets/images/upg_dagger.png');
        pgame.load.spritesheet('catstay', '/assets/images/sprites/cat/stay.png', 138, 121, 8);
        pgame.load.spritesheet('catstay', '/assets/images/sprites/cat/stay.png', 273, 237, 17);
    }

    create() {
        pgame.state.add('Menu', Menu);
        pgame.state.add('Game', Game);

        setTimeout(function () {
            pgame.state.start('Menu');
        }, 1000);
    }
}
