'use strict';

class Game {
    constructor() {
        this.background = pgame.make.sprite(0, 0, 'splash_bg');
        this.background.width = pgame.width;
        this.background.height = pgame.height;

        this.players = new Map();
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
        log('Ожидаем второго игрока');

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
                    state.players[key].tiredness,
                    state.players[key].mimimi
                );
                this.player.create(10, 40);
            } else {
                this.enemy = new Enemy(
                    pgame,
                    state.players[key].skin,
                    state.players[key].tiredness,
                    state.players[key].mimimi
                );
                this.enemy.create(600, 40, true);
            }
        }

        if (this.player === undefined || this.enemy === undefined) {
            log('Not init players');
            return;
        }
        currentPlayer = state.currentPlayer;
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
            alert('You victory');
        } else {
            alert('You lose');
        }
    }

    onBoardUpdate(stateJson) {
        let state = JSON.parse(stateJson);
        currentPlayer = state.currentPlayer;

        log(currentPlayer);

        for (let key in state.players) {
            if (key === this.socket.id) {
                this.myEnergyBar.setPercent();
                this.myMimimiBar.setPercent();
            } else {
                this.enemyEnergyBar.setPercent();
                this.enemyMimimiBar.setPercent();
            }
        }

        this.board.refill(state.board, state.newGems);
    }
}