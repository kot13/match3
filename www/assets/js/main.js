const width = window.innerWidth;
const height = window.innerHeight;

let game = new Phaser.Game(width, height, Phaser.CANVAS, 'area', { preload: preload, create: create, update: update, render: render });
let socket;
let players = {};

function preload() {

}

function create() {
    socket = io.connect(window.location.host, {path: '/ws/', transports: ['websocket']});

    //получаем имя игрока
    let savedName = window.localStorage.getItem('player_name');
    if (!savedName) savedName = 'guest';

    let playerName = prompt('Please enter your name', savedName);
    if (!playerName) playerName = '';
    window.localStorage.setItem('player_name', playerName);


    socket.emit('joinNewPlayer', playerName);
}

function update() {

}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
}