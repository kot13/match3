'use strict';

class Enemy {
    constructor(phaserGame, skin, energy, mimimi, x, y) {
        this.game = phaserGame;
        this.skin = skin;
        this.energy = energy;
        this.mimimi = mimimi;
        this.x = x;
        this.y = y;
        this.setState('stay');
    }

    setState(state) {
        if (this.sprite) {
            this.sprite.kill();
        }
        this.sprite = this.game.add.sprite(this.x, this.y, this.skin + '_' + state);
        this.sprite.scale.x = -1;
        this.anim = this.sprite.animations.add(this.skin + '_' + state);
        this.anim.play(10, true);
    }
}