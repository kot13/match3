'use strict';

class Menu {
    constructor() {
        this.background = pgame.make.sprite(0, 0, 'splash_bg');
        this.background.width = pgame.width;
        this.background.height = pgame.height;
        this.selectedCat = skin;
    }

    preload() {
        pgame.add.existing(this.background);
    }

    create() {
        this.initCarousel();

        this.locateButton('Ввести имя', pgame.height / 2.0 + 200, function () {
            userName = prompt('Введите своё имя', 'Гость');
        });

        this.locateButton('Играть', pgame.height / 2.0 + 260, function () {
            if (this.selectedCat === 'cat_lock') {
                return;
            }
            skin = this.selectedCat;
            pgame.state.start('Game');
        });
    }

    locateButton(title, y, callback) {
        let button = pgame.add.text(0, 0, title, {fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4});
        button.stroke = 'rgba(0,0,0,0)';
        button.strokeThickness = 4;
        button.x = pgame.width / 2.0 - button.width / 2.0;
        button.y = y;

        let onOver = function (target) {
            target.fill = '#FEFFD5';
            target.stroke = 'rgba(200,200,200,0.5)';
            button.useHandCursor = true;
        };

        let onOut = function (target) {
            target.fill = 'white';
            target.stroke = 'rgba(0,0,0,0)';
            button.useHandCursor = false;
        };

        button.inputEnabled = true;
        button.events.onInputUp.add(callback, this);
        button.events.onInputOver.add(onOver, this);
        button.events.onInputOut.add(onOut, this);
    }

    initCarousel() {
        let self = this;
        let cats = [];
        cats.push(pgame.add.sprite(0, 0, 'cat_gray'));
        cats.push(pgame.add.sprite(0, 0, 'cat_ginger'));
        cats.push(pgame.add.sprite(0, 0, 'cat_lock'));
        cats.push(pgame.add.sprite(0, 0, 'cat_lock'));
        cats.push(pgame.add.sprite(0, 0, 'cat_lock'));

        let totalCats = cats.length;
        let prime = 0;
        let animationSpeed = 200;

        //initial setup; all cats on the right side; anchor set to mid;
        cats.forEach(function (cat) {
            cat.anchor.setTo(0.5, 0.5);
            cat.x = pgame.width + 150;
            cat.y = pgame.height / 2;
            cat.inputEnabled = true;
            cat.events.onInputDown.add(clickListener, this);
        });

        //initial position of cats on stage based on the selected cat-gray
        function setToPosition(prime) {
            cats[prime].x = pgame.width / 2;

            //check if there is another cat-gray available to display on the right side; if yes then position it
            if (prime<(totalCats-1)) {
                cats[prime + 1].x = pgame.width / 2 + 67 + 75;
                cats[prime + 1].scale.setTo(0.5,0.5);
            }

            //check if there is another cat-gray available to display on the left side; if yes then position it
            if (prime > 0) {
                cats[prime - 1].x = pgame.width / 2 - 67 - 75;
                cats[prime - 1].scale.setTo(0.5,0.5);
            }
        }

        //set initial state
        setToPosition(prime);

        //predefined x positions for the 3 visible cards
        let xleft = pgame.width / 2 - 67 - 75;
        let xprime = pgame.width / 2;
        let xright = pgame.width / 2 + 67 + 75;

        //move to next cat-gray
        function nextCat() {
            //move prime left
            pgame.add.tween(cats[prime]).to( { x: xleft}, animationSpeed, null, true);
            pgame.add.tween(cats[prime].scale).to( { x: 0.5 , y: 0.5}, animationSpeed, null, true);
            //move right to prime
            if (prime < totalCats-1) {
                pgame.add.tween(cats[prime+1]).to( { x: xprime}, animationSpeed, null, true);
                pgame.add.tween(cats[prime+1].scale).to( { x: 1 , y: 1}, animationSpeed, null, true);
            }
            //move new to right
            if (prime < totalCats-2) {
                cats[prime+2].x = pgame.width + 150;
                cats[prime+2].scale.setTo(0.5,0.5);
                pgame.add.tween(cats[prime+2]).to( { x: xright}, animationSpeed, null, true);
            }
            //move left out
            if (prime>0) {
                cats[prime-1].scale.setTo(0.5,0.5);
                pgame.add.tween(cats[prime-1]).to( { x: -150}, animationSpeed, null, true);
            }
            prime++;
        }

        //move to previous cat-gray
        function previousCat() {
            //move prime left
            pgame.add.tween(cats[prime]).to( { x: xright}, animationSpeed, null, true);
            pgame.add.tween(cats[prime].scale).to( { x: 0.5 , y: 0.5}, animationSpeed, null, true);
            //move left to prime
            if (prime > 0 ) {
                pgame.add.tween(cats[prime-1]).to( { x: xprime}, animationSpeed, null, true);
                pgame.add.tween(cats[prime-1].scale).to( { x: 1 , y: 1}, animationSpeed, null, true);
            }
            //move new to left
            if (prime > 1) {
                cats[prime-2].x = - 150;
                cats[prime-2].scale.setTo(0.5,0.5);
                pgame.add.tween(cats[prime-2]).to( { x: xleft}, animationSpeed, null, true);
            }
            //move right out
            if (prime < (totalCats-1)) {
                cats[prime+1].scale.setTo(0.5,0.5);
                pgame.add.tween(cats[prime+1]).to( { x: pgame.width + 150}, animationSpeed, null, true);
            }
            prime--;
        }

        //click on cat-gray listener
        function clickListener (el) {
            self.selectedCat = el.key;
            let clickedPos = cats.indexOf(el);
            if (clickedPos > prime) {
                //move to left
                nextCat();
            } else if (clickedPos < prime) {
                //move to right
                previousCat();
            }
        }
    }
}
