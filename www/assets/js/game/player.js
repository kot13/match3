'use strict';

class Player {
    constructor(phaserGame, id, name, skin, energy, mimimi, x, y) {
        this.id   = id;
        this.name = name;
        this.game = phaserGame;
        this.energy = energy;
        this.mimimi = mimimi;
        this.skin = skin;
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
        this.sprite  = this.game.add.sprite(this.x, this.y, this.skin + '_' +  this.state);
        this.anim = this.sprite.animations.add(this.skin + '_' + this.state);
        let loop = true;
        if (state === 'die') {
            loop = false;
        }
        this.anim.play(10, loop);
    }
}