'use strict';
class Board {

    constructor(pGame, socket, posX, posY, cols, rows) {
        this.socket = socket;
        this.gem_size = 64;
        this.match_min = 3;
        this.gems = pGame.add.group();
        this.posX = posX;
        this.posY = posY;
        this.pGame = pGame;
        this.cols = cols;
        this.rows = rows;
        this.selectedGem = null;
        this.selectedGemStartPos = {};
        this.selectedGemTween = null;
        this.tempShiftedGem = null;
        this.allowInput = null;
        this.refillEvent = null;

        this.pGame.input.addMoveCallback(this.slideGem, this);
    }

    fill(gemSet) {
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                var icon = gemSet[j][i];
                var gem = this.gems.create(this.posX + i * this.gem_size, this.posY + j * this.gem_size, icon);
                gem.name = 'gem' + i.toString() + 'x' + j.toString();
                gem.inputEnabled = true;
                gem.events.onInputDown.add(this.selectGem, this);
                gem.events.onInputUp.add(this.releaseGem, this);
                this.setGemPos(gem, i, j); // each gem has a position on the board
            }
        }

        this.allowInput = true;
    }

    refill(board, newGems) {
        let isCurrentPlayer = this.isCurrentPlayer();
        this.pGame.time.events.remove(this.refillEvent);

        if (!isCurrentPlayer) {
            this.refillEvent = this.pGame.time.events.add(100, this.refillBoard, this, board, newGems, isCurrentPlayer);
        } else {
            this.pGame.time.events.add(100, this.refillBoard, this, board, newGems, isCurrentPlayer);
        }

    }

    refillBoard(board, newGems, isCurrentPlayer) {
        var killedExists = false;
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                var gem = this.getGem(i, j);
                if (board[j][i] === '' && gem !== null) {
                    killedExists = true;
                    gem.loadTexture('wow');
                    this.pGame.time.events.add(100, this.killGem, this, gem);
                }
                else if (board[j][i] && this.getGemColor(gem) !== board[j][i]) {
                    gem.loadTexture(board[j][i]);
                }
            }
        }

        this.pGame.time.events.add(110, function (board, newGems, isCurrentPlayer, killedExists) {
            if (killedExists) {
                this.removeKilledGems();
                var dropGemDuration = this.dropGems();
                // delay board refilling until all existing gems have dropped down
                this.pGame.time.events.add(dropGemDuration * 100, this.setGems, this, board, newGems, isCurrentPlayer);
            }
        }, this, board, newGems, isCurrentPlayer, killedExists);

    }

    killGem(gem) {
        gem.kill();
    }

    setGems(board, newGems, isCurrentPlayer) {
        var maxGemsMissingFromCol = 0;

        for (var i = 0; i < this.cols; i++) {
            var gemsMissingFromCol = 0;

            for (var j = this.rows - 1; j >= 0; j--) {
                var gem = this.getGem(i, j);
                if (gem === null) {
                    gemsMissingFromCol++;
                    gem = this.gems.getFirstDead();
                    gem.reset(i * this.gem_size, -gemsMissingFromCol * this.gem_size);
                    var icon = newGems.pop();
                    gem.loadTexture(icon);
                    this.setGemPos(gem, i, j);
                    this.tweenGemPos(gem, gem.posX, gem.posY);
                }
            }
            maxGemsMissingFromCol = Math.max(maxGemsMissingFromCol, gemsMissingFromCol);
        }

        if (isCurrentPlayer) {
            this.pGame.time.events.add(maxGemsMissingFromCol * 2 * 100, this.sendBoard, this);
        }
    }

    // look for gems with empty space beneath them and move them down
    dropGems() {

        var dropRowCountMax = 0;

        for (var i = 0; i < this.cols; i++) {
            var dropRowCount = 0;

            for (var j = this.rows - 1; j >= 0; j--) {
                var gem = this.getGem(i, j);

                if (gem === null) {
                    dropRowCount++;
                }
                else if (dropRowCount > 0) {
                    this.setGemPos(gem, gem.posX, gem.posY + dropRowCount);
                    this.tweenGemPos(gem, gem.posX, gem.posY);
                }
            }

            dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
        }

        return dropRowCountMax;

    }

    getGemsData() {
        let board = [];
        for (var i = 0; i < this.cols; i++) {
            let row = [];
            for (var j = 0; j < this.rows; j++) {
                let gem = this.getGem(j, i);
                row.push(this.getGemColor(gem))
            }
            board.push(row);
        }

        return JSON.stringify({board: board});
    }

    // select a gem and remember its starting position
    selectGem(gem) {

        if (this.allowInput && this.isCurrentPlayer()) {
            this.selectedGem = gem;
            this.selectedGemStartPos.x = gem.posX;
            this.selectedGemStartPos.y = gem.posY;
        }

    }

    releaseGem() {
        if (this.tempShiftedGem === null) {
            this.selectedGem = null;
            return;
        }

        // when the mouse is released with a gem selected
        // 1) check for matches
        // 2) remove matched gems
        // 3) drop down gems above removed gems
        // 4) refill the board

        var canKill = this.isCanKill(this.selectedGem);
        canKill = this.isCanKill(this.tempShiftedGem) || canKill;

        if (!canKill) // there are no matches so swap the gems back to the original positions
        {
            var gem = this.selectedGem;

            if (gem.posX !== this.selectedGemStartPos.x || gem.posY !== this.selectedGemStartPos.y) {
                if (this.selectedGemTween !== null) {
                    this.pGame.tweens.remove(this.selectedGemTween);
                }

                this.selectedGemTween = this.tweenGemPos(gem, this.selectedGemStartPos.x, this.selectedGemStartPos.y);

                if (this.tempShiftedGem !== null) {
                    this.tweenGemPos(this.tempShiftedGem, gem.posX, gem.posY);
                }

                this.swapGemPosition(gem, this.tempShiftedGem);

                this.tempShiftedGem = null;

            }
        } else {
            this.sendBoard();
        }

        this.allowInput = true;

        this.selectedGem = null;
        this.tempShiftedGem = null;

    }

    slideGem(pointer, x, y) {
        // check if a selected gem should be moved and do it
        if (this.selectedGem && pointer.isDown) {
            var cursorGemPosX = this.getGemPos(x - this.posX);
            var cursorGemPosY = this.getGemPos(y - this.posY);

            if (this.checkIfGemCanBeMovedHere(this.selectedGemStartPos.x, this.selectedGemStartPos.y, cursorGemPosX, cursorGemPosY)) {
                if (cursorGemPosX !== this.selectedGem.posX || cursorGemPosY !== this.selectedGem.posY) {
                    // move currently selected gem
                    if (this.selectedGemTween !== null) {
                        this.pGame.tweens.remove(this.selectedGemTween);
                    }

                    this.selectedGemTween = this.tweenGemPos(this.selectedGem, cursorGemPosX, cursorGemPosY);

                    this.gems.bringToTop(this.selectedGem);

                    // if we moved a gem to make way for the selected gem earlier, move it back into its starting position
                    if (this.tempShiftedGem !== null) {
                        this.tweenGemPos(this.tempShiftedGem, this.selectedGem.posX, this.selectedGem.posY);
                        this.swapGemPosition(this.selectedGem, this.tempShiftedGem);
                    }

                    // when the player moves the selected gem, we need to swap the position of the selected gem with the gem currently in that position
                    this.tempShiftedGem = this.getGem(cursorGemPosX, cursorGemPosY);

                    if (this.tempShiftedGem === this.selectedGem) {
                        this.tempShiftedGem = null;
                    }
                    else {
                        this.tweenGemPos(this.tempShiftedGem, this.selectedGem.posX, this.selectedGem.posY);
                        this.swapGemPosition(this.selectedGem, this.tempShiftedGem);
                    }
                }
            }
        }
    }

    // gems can only be moved 1 square up/down or left/right
    checkIfGemCanBeMovedHere(fromPosX, fromPosY, toPosX, toPosY) {

        if (toPosX < 0 || toPosX >= this.cols || toPosY < 0 || toPosY >= this.rows) {
            return false;
        }

        if (fromPosX === toPosX && fromPosY >= toPosY - 1 && fromPosY <= toPosY + 1) {
            return true;
        }

        if (fromPosY === toPosY && fromPosX >= toPosX - 1 && fromPosX <= toPosX + 1) {
            return true;
        }

        return false;
    }

    // animated gem movement
    tweenGemPos(gem, newPosX, newPosY) {

        gem.y = this.posY + gem.posY * this.gem_size - 30;
        gem.x = this.posX + gem.posX * this.gem_size;
        return this.pGame.add.tween(gem).to({
            x: this.posX + newPosX * this.gem_size,
            y: this.posY + newPosY * this.gem_size
        }, 200, Phaser.Easing.Linear.None, true);

    }

    // count how many gems of the same color are above, below, to the left and right
    // if there are more than 3 matched horizontally or vertically, kill those gems
    // if no match was made, move the gems back into their starting positions
    isCanKill(gem) {

        if (gem === null) {
            return;
        }

        var canKill = false;

        // process the selected gem

        var countUp = this.countSameColorGems(gem, 0, -1);
        var countDown = this.countSameColorGems(gem, 0, 1);
        var countLeft = this.countSameColorGems(gem, -1, 0);
        var countRight = this.countSameColorGems(gem, 1, 0);

        var countHoriz = countLeft + countRight + 1;
        var countVert = countUp + countDown + 1;

        if (countVert >= this.match_min || countHoriz >= this.match_min) {
            canKill = true;
        }

        return canKill;

    }

    // count how many gems of the same color lie in a given direction
    // eg if moveX=1 and moveY=0, it will count how many gems of the same color lie to the right of the gem
    // stops counting as soon as a gem of a different color or the board end is encountered
    countSameColorGems(startGem, moveX, moveY) {

        var curX = startGem.posX + moveX;
        var curY = startGem.posY + moveY;
        var count = 0;

        while (curX >= 0 && curY >= 0 && curX < this.cols && curY < this.rows && this.getGemColor(this.getGem(curX, curY)) === this.getGemColor(startGem)) {
            count++;
            curX += moveX;
            curY += moveY;
        }

        return count;

    }

    sendBoard() {
        if (this.isCurrentPlayer()) {
            console.log('send');
            this.socket.emit('turn', this.getGemsData());
        }
    }

    isCurrentPlayer() {
        return this.socket.id === currentPlayer;
    }

    // find a gem on the board according to its position on the board
    getGem(posX, posY) {

        return this.gems.iterate("id", this.calcGemId(posX, posY), Phaser.Group.RETURN_CHILD);

    }

    // convert world coordinates to board position
    getGemPos(coordinate) {

        return Math.floor(coordinate / this.gem_size);

    }

    // the gem id is used by getGem() to find specific gems in the group
    // each position on the board has a unique id
    calcGemId(posX, posY) {

        return posX + posY * this.cols;

    }


    // since the gems are a spritesheet, their color is the same as the current frame number
    getGemColor(gem) {

        return gem.key;

    }

    setGemPos(gem, posX, posY) {

        gem.posX = posX;
        gem.posY = posY;
        gem.id = this.calcGemId(posX, posY);

    }

    // move gems that have been killed off the board
    removeKilledGems() {

        var obj = this;
        this.gems.forEach(function (gem) {
            if (!gem.alive) {
                obj.setGemPos(gem, -1, -1);
            }
        });

    }

    // swap the position of 2 gems when the player drags the selected gem into a new location
    swapGemPosition(gem1, gem2) {

        var tempPosX = gem1.posX;
        var tempPosY = gem1.posY;
        this.setGemPos(gem1, gem2.posX, gem2.posY);
        this.setGemPos(gem2, tempPosX, tempPosY);

    }
}

