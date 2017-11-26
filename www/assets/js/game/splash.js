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
        pgame.load.script('victory', 'assets/js/game/victory.js');
        pgame.load.script('lose', 'assets/js/game/lose.js');
        pgame.load.script('player', 'assets/js/game/player.js');
        pgame.load.script('enemy', 'assets/js/game/enemy.js');
        pgame.load.script('board', 'assets/js/game/board.js');

        pgame.load.image('gem1', 'assets/images/klubok.png');
        pgame.load.image('gem2', 'assets/images/valera.png');
        pgame.load.image('gem3', 'assets/images/morda.png');
        pgame.load.image('gem4', 'assets/images/ryba.png');
        pgame.load.image('gem5', 'assets/images/lapa.png');

        pgame.load.image('game_bg', 'assets/images/game_bg.png');
        pgame.load.image('menu_bg', 'assets/images/menu_bg.png');
        pgame.load.image('splash_win', 'assets/images/win.png');
        pgame.load.image('splash_lose', 'assets/images/lose.png');

        pgame.load.image('cat_gray','assets/images/cat1.png');
        pgame.load.image('cat_ginger','assets/images/cat2.png');
        pgame.load.image('cat_lock','assets/images/cat-lock.png');

        pgame.load.spritesheet('cat_gray_stay1', '/assets/images/sprites/cat-gray/stay.png', 273, 237, 17);
        pgame.load.spritesheet('cat_gray_klubok', '/assets/images/sprites/cat-gray/klubok.png', 277, 237, 3);
        pgame.load.spritesheet('cat_gray_lay', '/assets/images/sprites/cat-gray/lay.png', 273, 237, 10);
        pgame.load.spritesheet('cat_gray_die', '/assets/images/sprites/cat-gray/die.png', 280, 237, 9);
        pgame.load.spritesheet('cat_gray_stay', '/assets/images/sprites/cat-gray/hurt.png', 273, 237, 9);
        pgame.load.spritesheet('cat_gray_win', '/assets/images/sprites/cat-gray/win.png', 271, 237, 4);
        pgame.load.spritesheet('cat_gray_mimi', '/assets/images/sprites/cat-gray/mimi.png', 252, 237, 18);

        pgame.load.spritesheet('cat_ginger_stay', '/assets/images/sprites/cat-ginger/stay.png', 273, 237, 17);
        pgame.load.spritesheet('cat_ginger_klubok', '/assets/images/sprites/cat-ginger/klubok.png', 277, 237, 3);
        pgame.load.spritesheet('cat_ginger_lay', '/assets/images/sprites/cat-ginger/lay.png', 273, 237, 10);
        pgame.load.spritesheet('cat_ginger_die', '/assets/images/sprites/cat-ginger/die.png', 280, 237, 9);
        pgame.load.spritesheet('cat_ginger_hurt', '/assets/images/sprites/cat-ginger/hurt.png', 273, 237, 9);
        pgame.load.spritesheet('cat_ginger_win', '/assets/images/sprites/cat-ginger/win.png', 271, 237, 4);
        pgame.load.spritesheet('cat_ginger_mimi', '/assets/images/sprites/cat-ginger/mimi.png', 252, 237, 18);
    }

    create() {
        pgame.state.add('Menu', Menu);
        pgame.state.add('Game', Game);
        pgame.state.add('Lose', Lose);
        pgame.state.add('Victory', Victory);

        setTimeout(function () {
            pgame.state.start('Menu');
        }, 1000);
    }
}
