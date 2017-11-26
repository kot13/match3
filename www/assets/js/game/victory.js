'use strict';

class Victory {
    constructor() {
        this.background = pgame.make.sprite(0, 0, 'menu_bg');
        this.background.width = pgame.width;
        this.background.height = pgame.height;
    }

    preload() {
        pgame.add.existing(this.background);
    }

    create() {
        this.message = pgame.add.text(0, 0, 'Ты топовый мурлыка!', {fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4});
        this.message.x = pgame.width / 2.0 - this.message.width / 2.0;
        this.message.y = pgame.height / 2.0 - this.message.height / 2.0;
    }
}