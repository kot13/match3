'use strict';

class Player {

    constructor(phaserGame, id, name) {
        this.id   = id;
        this.name = name;
        this.game = phaserGame;
        this.anim = null;
        this.catStaySprite  = null;
    }

    preload() {
       // this.game.load.spritesheet('catstay', '/assets/images/sprites/cat/stay.png', 121, 121, 10);

    }

    create(x, y, invertSprite) {
        invertSprite = invertSprite || false;
        this.catStaySprite  = this.game.add.sprite(x, y, 'catstay');
        if (invertSprite) {
            console.log('enemysprite')
            this.catStaySprite.scale.x = -1;
           // this.catStaySprite.x = 100;
           // this.catStaySprite.y = 500;
        }
        //this.catStaySprite.scale.y *= -1;


        this.anim = this.catStaySprite.animations.add('catstay');

        this.anim.onStart.add(this.animationStarted, this);
        this.anim.onLoop.add(this.animationLooped, this);
        this.anim.onComplete.add(this.animationStopped, this);

        this.anim.play(10, true);
    }

    update(currentPlayer) {
        if ( this.anim.isPlaying) {
            //back.x -= 1;
        }
    }

    animationStarted(sprite, animation) {
        //pgame.add.text(32, 32, 'Animation started', { fill: 'white' });

    }

    animationLooped(sprite, animation) {

    if (animation.loopCount === 1) {
        //loopText =  this.game.add.text(32, 64, 'Animation looped', { fill: 'white' });
    } else {
       // loopText.text = 'Animation looped x2';
        //animation.loop = false;
    }
}

    animationStopped(sprite, animation) {
        this.game.add.text(32, 64+32, 'Animation stopped', { fill: 'white' });
    }
}