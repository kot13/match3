'use strict';

class Splash {

    constructor() {
        this.background = game.make.sprite(0, 0, 'splash_bg');
        this.background.width = game.width;
        this.background.height = game.height;

        this.title = game.make.text(0, 0, 'Загружаемся..', {fill: 'white'});
        this.title.x = game.width / 2.0 - this.title.width / 2.0;
        this.title.y = game.height / 2.0 - this.title.height / 2.0;
    }

    preload() {
        game.add.existing(this.background);
        game.add.existing(this.title);

        game.load.script('SocketIO', '/js/lib/socket.io.js');

        game.load.script('game', 'js/game/game.js');
        game.load.script('victory', 'js/game/victory.js');
    }

    create() {
        game.state.add("Game", Game);
        game.state.add("Victory", Victory);
        game.state.add("Lose", Lose);
        setTimeout(function () {
            game.state.start("Menu");
        }, 1000);
    }
}
