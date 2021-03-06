'use strict';

class Game {
    constructor() {
        this.background = pgame.make.sprite(0, 0, 'game_bg');
        this.background.width = pgame.width;
        this.background.height = pgame.height;

        this.players = new Map();
        this.animations = {
            'gem1': 'klubok',
            'gem2': 'win', // ?
            'enemyGem2': 'lay',
            'gem3': 'mimi', // ?
            'gem4': 'stay', // ?
            'gem5': 'win', // ?
            'enemyGem5': 'hurt',
        }
    }

    preload() {
        pgame.add.existing(this.background);
    }

    create() {
        this.initNetwork();

        this.socket.emit('joinNewPlayer', JSON.stringify({
            name: userName,
            skin: skin
        }));

        this.message = pgame.add.text(0, 0, 'Ожидаем второго котика', {fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4});
        this.message.x = pgame.width / 2.0 - this.message.width / 2.0;
        this.message.y = 30;

        this.messageEnergy = pgame.add.text(220, 3, '', {fill: '#19ff19', align: 'left', fontSize: 14});
        this.messageMimimi = pgame.add.text(220, 23, '', {fill: '#ffc0cb', align: 'left', fontSize: 14});
        this.messageEnemyEnergy = pgame.add.text(345, 3, '', {fill: '#19ff19', align: 'left', fontSize: 14});
        this.messageEnemyMimimi = pgame.add.text(345, 23, '', {fill: '#ffc0cb', align: 'left', fontSize: 14});
    }

    update() {

    }

    initNetwork() {
        this.socket = io.connect(window.location.host, {path: '/ws/', transports: ['websocket']});
        this.socket.on('playerDisconnected', (msg) => this.onPlayerDisconnected(msg));
        this.socket.on('start', (state) => this.onStart(state));
        this.socket.on('win', (playerId) => this.onWin(playerId));
        this.socket.on('boardUpdate', (state) => this.onBoardUpdate(state));
    }

    onStart(stateJson) {
        let state = JSON.parse(stateJson);
        for (let key in state.players) {
            if (key === this.socket.id) {
                this.player = new Player(
                    pgame,
                    state.players[key].id,
                    state.players[key].name,
                    state.players[key].skin,
                    state.players[key].energy,
                    state.players[key].mimimi,
                    10,
                    40
                );
            } else {
                this.enemy = new Enemy(
                    pgame,
                    state.players[key].skin,
                    state.players[key].energy,
                    state.players[key].mimimi,
                    600,
                    40
                );
            }
        }

        if (this.player === undefined || this.enemy === undefined) {
            log('Not init players');
            return;
        }

        let barConfig = {
            x: 110,
            y: 10,
            bar: {
                color: '#19ff19'
            },
            width: 200,
            height: 10
        };
        this.myEnergyBar = new HealthBar(pgame, barConfig);

        barConfig = {
            x: 490,
            y: 10,
            bar: {
                color: '#19ff19'
            },
            width: 200,
            height: 10
        };
        this.enemyEnergyBar = new HealthBar(pgame, barConfig);

        barConfig = {
            x: 110,
            y: 30,
            bar: {
                color: '#ffc0cb'
            },
            width: 200,
            height: 10
        };
        this.myMimimiBar = new HealthBar(pgame, barConfig);
        this.myMimimiBar.setPercent(0);

        barConfig = {
            x: 490,
            y: 30,
            bar: {
                color: '#ffc0cb'
            },
            width: 200,
            height: 10
        };
        this.enemyMimimiBar = new HealthBar(pgame, barConfig);
        this.enemyMimimiBar.setPercent(0);

        this.setCurrentUser(state);

        this.board = new Board(pgame, this.socket, 70, 330, 7, 7);
        this.board.fill(state.board);
    }

    onPlayerDisconnected(playerId) {
        log('Disconnected player, id: ' + playerId);

        if (this.players.has(playerId)) {
            this.players.get(playerId).sprite.kill();
            this.players.delete(playerId);
        }
    }

    onWin(playerId) {
        if (playerId === this.socket.id) {
            pgame.state.start("Victory");
        } else {
            pgame.state.start("Lose");
        }
    }

    onBoardUpdate(stateJson) {
        let state = JSON.parse(stateJson);
        this.setCurrentUser(state);

        for (let key in state.players) {
            if (key === this.socket.id) {
                this.myEnergyBar.setPercent(state.players[key].energy);
                this.myMimimiBar.setPercent(state.players[key].mimimi);
                if (state.players[key].state !== '') {
                    pgame.state.states.Game.player.setState(this.animations[state.players[key].state]);
                }
                let diffEnenrgy = state.players[key].diffEnergy;
                let difMimimi = state.players[key].diffMimimi;
                this.messageEnergy.setText(diffEnenrgy === 0 ? '' : (diffEnenrgy > 0 ? '+' + diffEnenrgy : diffEnenrgy));
                this.messageMimimi.setText(difMimimi === 0 ? '' : (difMimimi > 0 ? '+' + difMimimi : difMimimi));
            } else {
                this.enemyEnergyBar.setPercent(state.players[key].energy);
                this.enemyMimimiBar.setPercent(state.players[key].mimimi);
                if (state.players[key].state !== '') {
                    pgame.state.states.Game.enemy.setState(this.animations[state.players[key].state]);
                }
                let diffEnenrgy = state.players[key].diffEnergy;
                let difMimimi = state.players[key].diffMimimi;
                this.messageEnemyEnergy.setText(diffEnenrgy === 0 ? '' : (diffEnenrgy > 0 ? '+' + diffEnenrgy : diffEnenrgy));
                this.messageEnemyMimimi.setText(difMimimi === 0 ? '' : (difMimimi > 0 ? '+' + difMimimi : difMimimi));
            }
        }

        this.board.refill(state.board, state.newGems);
    }

    setCurrentUser(state) {
        currentPlayer = state.currentPlayer;
        if (currentPlayer === this.socket.id) {
            this.message.setText('Котик, ходи!');
            this.message.x = pgame.width / 2.0 - this.message.width / 2.0;

            setTimeout(function () {
                pgame.state.states.Game.player.setState('stay');
            }, 1000);
        } else {
            this.message.setText('Ходит другой котик');
            this.message.x = pgame.width / 2.0 - this.message.width / 2.0;

            setTimeout(function () {
                pgame.state.states.Game.enemy.setState('stay');
            }, 1000);
        }
    }
}