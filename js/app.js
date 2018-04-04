const tileWidth = 101;
const tileHeight = 83;


// block: ENEMY
const Enemy = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function (dt) {
    this.x += (this.speed * dt);
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    if (this.x > 500) {
        this.x -= 600;
    }
};

// block: PLAYER
const Player = function (x, y) {
    this.x = x;
    this.y = y;
    this.lives = 3;
    this.score = 0;
    this.sprite = 'images/char-cat-girl.png';
};

Player.prototype.resetPosition = function () {
    this.y = 390;
};

Player.prototype.collisionBetween = function (player, enemy) {
    if (this.y === enemy.y) {
        if ((enemy.x + 30 >= this.x - 25) && (enemy.x - 30 <= this.x + 25)) {
            return true;
        } else {
            return false;
        }
    }
};

Player.prototype.updateScore = function (value) {
    this.score += value;
};

Player.prototype.addLife = function () {
    this.lives++;
};

Player.prototype.takeLife = function () {
    this.lives--;
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key) {
    switch (key) {
        case 'up':
            if (this.y > 0) {
                this.y -= tileHeight;
            };
            break;
        case 'down':
            if (this.y < 370) {
                this.y += tileHeight;
            };
            break;
        case 'left':
            if (this.x >= tileWidth) {
                this.x -= tileWidth;
            };
            break;
        case 'right':
            if (this.x <= 303) {
                this.x += tileWidth;
            };
            break;
    };
};


// block: GEMS
const Gem = function (sprite, value) {
    // X positions: 0, 101, 202, 303, 404
    this.x = ((51 - 33) + (tileWidth * Math.floor(Math.random() * 4) + 0));
    // Y positions: 58, 141, 224
    this.y = ((tileHeight + 70 - 55) + (tileHeight * Math.floor(Math.random() * 3) + 0));
    this.sprite = sprite;
    this.value = value;
    this.spriteHeight = 66;
    this.spriteWidth = 111;
    this.timeToHide = Math.round(Math.random() * (13 - 5)) + 5;
};

Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.spriteHeight, this.spriteWidth);
};

Gem.prototype.update = function (dt) {
    this.hideGemIfNotCollectedInTime(dt);
};

Gem.prototype.hideGemIfNotCollectedInTime = function (dt) {
    this.timeToHide -= dt;
    if (this.timeToHide <= 0) {
        this.x = -200;
    }
};

Gem.prototype.removeFromCanvas = function () {
    this.x = -200;;
};


// Block: GAME
let player = new Player(202, 390);
let allEnemies = [];
let gems = [];
let extraGems = [];


const Game = function () {};

Game.prototype.createGameEntities = function () {
    const bug1 = new Enemy(0, 58, 200);
    const bug2 = new Enemy(-200, 141, 150);
    const bug3 = new Enemy(0, 224, 180);
    const bug4 = new Enemy(-350, 141, 140);
    const bug5 = new Enemy(-200, 224, 250);
    const bug6 = new Enemy(-200, 58, 90);
    const bug7 = new Enemy(-400, 58, 100);

    allEnemies.splice(0);
    allEnemies.push(bug1, bug2, bug3, bug4, bug5, bug6, bug7);

    const orangeGem = new Gem('images/gem-orange.png', 50);
    const greenGem = new Gem('images/gem-green.png', 100);
    const starGem = new Gem('images/Star.png', 150);

    gems.splice(0);
    gems.push(orangeGem, greenGem, starGem);
};

Game.prototype.addExtraGems = function () {
    const heart = new Gem('images/Heart.png', 0);
    const blueGem = new Gem('images/gem-blue.png', 100);
    const selectorStar = new Gem('images/Star-selector.png', 300);
    if (player.score >= 350 && extraGems.length === 0) {
        extraGems.push(heart, blueGem, selectorStar);
        allEnemies.forEach(function (enemy) {
            enemy.speed += 30;
        })
    }
};

Game.prototype.start = function () {
    this.hideOverlay();
    this.hideModal('popup-window-with-instructions');
    this.createGameEntities();
};

Game.prototype.reloadAfterGameOver = function () {
    this.hideModal('popup-window');
    this.reset();
    this.createGameEntities();
};

Game.prototype.reloadAfterWinning = function () {
    this.hideModal('popup-window-for-winning');
    this.reset();
    this.createGameEntities();
};

Game.prototype.reset = function () {
    player.lives = 3;
    player.score = 0;
    this.updateScoreOnBoard();
    allEnemies = [];
    allEnemies.forEach(function (enemy) {
        enemy.speed -= 30;
    });
    gems = [];
    extraGems = [];
    this.clearHeartsAfterPreviousGame();
    this.addHeartToBoard(3);
};

Game.prototype.updateScoreOnBoard = function () {
    score.innerHTML = `Score: ${player.score}`;
};

Game.prototype.deleteHeartFromBoard = function () {
    const lives = document.getElementById('lives');
    lives.removeChild(lives.lastElementChild);
};

Game.prototype.clearHeartsAfterPreviousGame = function () {
    const lives = document.getElementById('lives');
    lives.innerHTML = '';
};

Game.prototype.addHeartToBoard = function (num) {
    while (num-- > 0) {
        const lives = document.getElementById('lives');
        const newHeart = document.createElement('img');
        newHeart.setAttribute('src', 'images/Heart.png');
        lives.appendChild(newHeart);
    }
};

Game.prototype.displayScoreAfterGame = function () {
    document.getElementById('total-score').innerHTML = `${player.score}`;
};

Game.prototype.showGameOverModal = function () {
    new Audio('audio/Jingle_Lose_01.mp3').play();
    const modal = document.getElementById('popup-window');
    modal.style.display = 'block';
    this.displayScoreAfterGame();
};

Game.prototype.showWinGameModal = function () {
    new Audio('audio/Jingle_Achievement.mp3').play()
    const winModal = document.getElementById('popup-window-for-winning');
    winModal.style.display = 'block';
};

Game.prototype.showInstructionModal = function () {
    const instructions = document.getElementById('popup-window-with-instructions');
    window.onscroll = function () {
        instructions.style.top = document.body.scrollTop;
    };
    instructions.style.display = 'block';
    instructions.style.top = document.body.scrollTop;
};

Game.prototype.hideOverlay = function () {
    document.getElementById('overlay').style.display = 'none';
};

Game.prototype.hideModal = function (modalId) {
    document.getElementById(modalId).style.display = 'none';
};

const arcade = new Game();


// Block: EVENT LISTENERS
function setupEventListeners() {
    const startGameButton = document.getElementById('start-game-btn');
    startGameButton.addEventListener('click', startNewGame);
    const newGameButton = document.getElementById('reload-game-btn');
    newGameButton.addEventListener('click', reloadGameAfterGameOver);
    const newGameAfterWinningButton = document.getElementById('reload-game-after-win-btn');
    newGameAfterWinningButton.addEventListener('click', reloadGameAfterWinning);
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

function removeEventListenersFromCanvas() {
    document.removeEventListener('keyup', keyUpEventListener);
}


// block: INITIALIZING GAME
function initializeGame() {
    setupEventListeners()
    arcade.showInstructionModal();
}

function startNewGame() {
    arcade.start();
    addEventListenersToCanvas();
}

function reloadGameAfterGameOver() {
    arcade.reloadAfterGameOver();
    addEventListenersToCanvas();

}

function reloadGameAfterWinning() {
    player.x = 202;
    arcade.reloadAfterWinning();
    addEventListenersToCanvas();
}
