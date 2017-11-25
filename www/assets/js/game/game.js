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

        this.socket.emit('joinNewPlayer', userName);
        log('Ожидаем второго игрока');
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
        log(state.players, state.board);

        this.player = new Player(pgame, this.socket.id, userName);
        this.enemy = new Player(pgame, this.socket.id, 'ENEMY');

        this.player.create(10, 40);
        this.enemy.create(600, 40, true);

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
        this.board.refill(state.board,state.newGems);
    }
}