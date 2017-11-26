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
        if (this.game.state.current !== 'Game') {
            return;
        }
        this.state = state;
        if (this.sprite) {
            this.sprite.kill();
        }
        this.sprite = this.game.add.sprite(this.x, this.y, this.skin + '_' + state);
        this.sprite.scale.x = -1;
        this.anim = this.sprite.animations.add(this.skin + '_' + state);
        let loop = true;
        switch (state) {
            case 'stay':
            case 'lay':
            case 'klubok':
                loop = true;
                break;
            case 'die':
                loop = false;
                break;
            case 'win':
            case 'mimi':
            case 'hurt':
                loop = false;
                this.anim.onComplete.add(this.animationStopped, this);
                break;
        }
        this.anim.play(10, loop);
    }

    animationStopped(sprite, animation) {
        let self = this;
        setTimeout(function () {
            self.setState('stay');
        }, 1000);
    }
}