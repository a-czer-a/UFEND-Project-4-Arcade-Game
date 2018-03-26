// Enemies our player must avoid
const Enemy = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.x += (this.speed * dt);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    if (this.x > 500) {
        this.x -= 600;
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function (x, y) {
    this.x = x;
    this.y = y;
    this.lifes = 3;
    this.score = 0;
    this.sprite = 'images/char-cat-girl.png';
}

Player.prototype.update = function () {

};

Player.prototype.resetPosition = function () {
    //    this.x = 202;
    this.y = 390;
}

Player.prototype.addLife = function () {
    this.lifes++;
}

Player.prototype.takeLife = function () {
    if (this.lifes > 0) {
        this.lifes--;
        deleteHeartFromBoard();
    } else {
        endGame();
    }
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key) {
    switch (key) {
        case 'up':
            if (this.y > 0) {
                this.y -= 83;
            };
            break;
        case 'down':
            if (this.y < 370) {
                this.y += 83;
            };
            break;
        case 'left':
            if (this.x >= 101) {
                this.x -= 101;
            };
            break;
        case 'right':
            if (this.x <= 303) {
                this.x += 101;
            };
            break;
    };
}

const Gem = function (sprite, value) {
    // X positions: 0, 101, 202, 303, 404
    //     this.x = (101 * Math.floor(Math.random() * 4) + 0);
    this.x = ((51 - 33) + (101 * Math.floor(Math.random() * 4) + 0));
    // Y positions: 58, 141, 224
    // this.y = (58 + (83 * Math.floor(Math.random() * 3) + 0));
    this.y = ((83 + 70 - 55) + (83 * Math.floor(Math.random() * 3) + 0));
    this.sprite = sprite;
    this.value = value;
    this.spriteHeight = 66;
    this.spriteWidth = 111;
}

Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.spriteHeight, this.spriteWidth);
};


let player = new Player(202, 570);
let allEnemies = [];
let gems = [];
let extraGems = [];

function createGameEntities() {
    const bug1 = new Enemy(0, 58, 200);
    const bug2 = new Enemy(-200, 141, 150);
    const bug3 = new Enemy(0, 224, 180);
    const bug4 = new Enemy(-350, 141, 140);
    const bug5 = new Enemy(-200, 224, 250);
    const bug6 = new Enemy(-200, 58, 90);

    allEnemies.splice(0);
    allEnemies.push(bug1, bug2, bug3, bug4, bug5, bug6);

    const orangeGem = new Gem('images/gem-orange.png', 50);
    const greenGem = new Gem('images/gem-green.png', 100);
    const starGem = new Gem('images/Star.png', 200);

    gems.splice(0);
    gems.push(orangeGem, greenGem, starGem);

    player = new Player(202, 390);
}


function setupEventListeners() {
    const startGame = document.getElementById('start-game-btn');
    startGame.addEventListener('click', createGameEntities);
    addEventListenersToCanvas();
    const newGame = document.getElementById('reload-game-btn');
    newGame.addEventListener('click', reloadGame);
    addEventListenersToCanvas();
}


const keyUpEventListener = function (e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
};

function addEventListenersToCanvas() {
    document.addEventListener('keyup', keyUpEventListener);
}

function endGame() {
    document.removeEventListener('keyup', keyUpEventListener);
    allEnemies = [];
    gems = [];
    extraGems = [];
    showGameOverModal();
}

function reloadGame() {
    window.location.reload();
}

function deleteHeartFromBoard() {
    const lifes = document.getElementById('lifes');
    lifes.removeChild(lifes.lastElementChild);
}

function addHeartToBoard() {
    const lifes = document.getElementById('lifes');
    const newHeart = document.createElement('img');
    newHeart.setAttribute('src', 'images/Heart.png');
    lifes.appendChild(newHeart);
}

function showGameOverModal() {
    new Audio('audio/Jingle_Lose_01.mp3').play();
    const modal = document.getElementById('popup-window');
    modal.style.display = 'block';
    displayScoreAfterGameOver();
}


function displayScoreAfterGameOver() {
    document.getElementById('total-score').innerHTML = `${player.score}`;
}

function initializeGame() {
    setupEventListeners();
}

initializeGame();
