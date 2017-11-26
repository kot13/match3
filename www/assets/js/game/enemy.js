'use strict';

class Enemy {
    constructor(phaserGame, skin, energy, mimimi, x, y) {
        this.game = phaserGame;
        this.skin = skin;
        this.energy = energy;
        this.mimimi = mimimi;
        this.x = x;
        this.y = y;
        this.state = null;
        this.setState('stay');
    }

    setState(state) {
        this.state = state;
        if (this.sprite) {
            this.sprite.kill();
        }
        this.sprite = this.game.add.sprite(this.x, this.y, this.skin + '_' + state);
        this.sprite.scale.x = -1;
        this.anim = this.sprite.animations.add(this.skin + '_' + state);
        let loop = true;
        if (state === 'die') {
            loop = false;
        }
        this.anim.play(10, loop);
    }
}