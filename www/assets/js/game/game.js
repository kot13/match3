'use strict';

class Game {
    constructor() {
        this.players = new Map();
    }

    preload() {

    }

    create() {
        this.initNetwork();

        this.socket.emit('joinNewPlayer', userName);
        log('Ожидаем второго игрока');
    }

    initNetwork() {
        this.socket = io.connect(window.location.host, {path: '/ws/', transports: ['websocket']});
        this.socket.on('playerDisconnected', (msg) => this.onPlayerDisconnected(msg));
        this.socket.on('start', (players) => this.onStart(players));
        this.socket.on('win', (playerId) => this.onWin(playerId));
    }

    onStart(players) {
        log(players);
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
}