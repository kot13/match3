'use strict';

class Game {

    constructor() {
        this.players = new Map();
    }

    create() {
        this.initNetwork();
    }

    update() {

    }

    initNetwork() {
        this.socket = io.connect(window.location.host, {path: "/ws/", transports: ['websocket']});
        this.socket.on('playerDisconnected', (msg)=>this.onPlayerDisconnected(msg));
        this.socket.on('win', (playerId)=>this.onWin(playerId));
    }

    initControls() {

    }

    onPlayerConnected(playerId, playerName) {
        log("connected player, id: " + playerId);
        let p = new Player(pgame, playerId, playerName);
        this.players.set(playerId, p);
    }

    onPlayerDisconnected(playerId) {
        log("disconnected player, id: " + playerId);

        if (this.players.has(playerId)) {
            this.players.get(playerId).sprite.kill();
            this.players.delete(playerId);
        }
    }

    onWin(playerId) {
        if (playerId === this.socket.id) {
            console.log("vic");
            // pgame.state.start("Victory");
        } else {
            console.log("Lose");
            // pgame.state.start("Lose");
        }
    }
}