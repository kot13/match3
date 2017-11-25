'use strict';

class Enemy {
    constructor(phaserGame, skin, energy, mimimi) {
        this.game = phaserGame;
        this.skin = skin;
        this.energy = energy;
        this.mimimi = mimimi;
        this.anim = null;
        this.catStaySprite  = null;
    }

    create(x, y, invertSprite) {
        invertSprite = invertSprite || false;
        this.catStaySprite = this.game.add.sprite(x, y, this.skin + '_stay');
        if (invertSprite) {
            this.catStaySprite.scale.x = -1;
        }

        this.anim = this.catStaySprite.animations.add(this.skin + '_stay');
        this.anim.onComplete.add(this.animationStopped, this);
        this.anim.play(10, true);
    }

    animationStopped(sprite, animation) {
        this.game.add.text(32, 64+32, 'Animation stopped', {fill: 'white'});
    }
}