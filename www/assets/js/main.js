const width = window.innerWidth;
const height = window.innerHeight;
const containerName = 'area';

let game = new Phaser.Game(width, height, Phaser.CANVAS, containerName, { preload: preload, create: create, update: update, render: render });
let socket;
let players = {};

function preload() {
    game.time.desiredFps = 60;
    game.time.advancedTiming = true;
    game.load.script('splash', 'js/game/splash.js');
    //game.load.image('splash_bg', 'assets/images/splash_bg.jpg');
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