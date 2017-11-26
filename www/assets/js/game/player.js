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
        this.setState('stay');
    }

    setState(state) {
        if (this.sprite) {
            this.sprite.kill();
        }
        this.catStaySprite  = this.game.add.sprite(this.x, this.y, this.skin + '_' +  state);
        this.anim = this.catStaySprite.animations.add(this.skin + '_' + state);
        this.anim.play(10, true);
    }
}