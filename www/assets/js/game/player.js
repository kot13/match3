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
        if (this.game.state.current !== 'Game') {
            return;
        }
        this.state = state;
        if (this.sprite) {
            this.sprite.kill();
        }
        this.sprite  = this.game.add.sprite(this.x, this.y, this.skin + '_' +  this.state);
        this.anim = this.sprite.animations.add(this.skin + '_' + this.state);
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