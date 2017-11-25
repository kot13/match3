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
        pgame.load.script('HealthBar', 'assets/js/lib/health-bar.js');
        pgame.load.script('menu', 'assets/js/game/menu.js');
        pgame.load.script('game', 'assets/js/game/game.js');
        pgame.load.script('player', 'assets/js/game/player.js');
        pgame.load.script('enemy', 'assets/js/game/enemy.js');
        pgame.load.script('board', 'assets/js/game/board.js');

        pgame.load.image('gem1', 'assets/images/klubok.png');
        pgame.load.image('gem2', 'assets/images/valera.png');
        pgame.load.image('gem3', 'assets/images/morda.png');
        pgame.load.image('gem4', 'assets/images/ryba.png');
        pgame.load.image('gem5', 'assets/images/lapa.png');

        pgame.load.image('cat_gray','assets/images/cat1.png');
        pgame.load.image('cat_ginger','assets/images/cat2.png');
        pgame.load.image('cat_lock','assets/images/cat-lock.png');

        pgame.load.spritesheet('cat_gray_stay', '/assets/images/sprites/cat-gray/stay.png', 273, 237, 17);
        pgame.load.spritesheet('cat_ginger_stay', '/assets/images/sprites/cat-ginger/stay.png', 273, 237, 17);
    }

    create() {
        pgame.state.add('Menu', Menu);
        pgame.state.add('Game', Game);

        setTimeout(function () {
            pgame.state.start('Menu');
        }, 1000);
    }
}
