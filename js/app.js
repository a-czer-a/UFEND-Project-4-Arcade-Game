// block: Enemy
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
    //    this.speed = speed;
};

Player.prototype.update = function () {
    //    this.x += (this.speed * dt);
    this.checkCollision();
};

Player.prototype.resetPosition = function () {
    //    this.x = 202;
    this.y = 390;
};

Player.prototype.checkCollision = function () {
    for (let i = 0; i < allEnemies.length; i++) {
        if (this.y === allEnemies[i].y) {
            if ((allEnemies[i].x + 30 >= this.x - 20) && (allEnemies[i].x - 30 <= this.x + 20)) {
                new Audio('audio/Shoot_01.mp3').play();
                this.resetPosition();
                this.takeLife();
            };
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
    if (this.lives > 0) {
        this.lives--;
        deleteHeartFromBoard();
    } else {
        this.finishGame();
    }
};

Player.prototype.finishGame = function () {
    document.removeEventListener('keyup', keyUpEventListener);
    allEnemies = [];
    gems = [];
    extraGems = [];
    showGameOverModal();
};

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
};


// block: GEMS
const Gem = function (sprite, value) {
    // X positions: 0, 101, 202, 303, 404
    this.x = ((51 - 33) + (101 * Math.floor(Math.random() * 4) + 0));
    // Y positions: 58, 141, 224
    this.y = ((83 + 70 - 55) + (83 * Math.floor(Math.random() * 3) + 0));
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
    // to hide gems after a random period of time
    this.timeToHide -= dt;
    if (this.timeToHide <= 0) {
        this.x = -200;
    }
};

Gem.prototype.removeFromCanvas = function () {
    this.x = -200;;
};


// 
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
    addEventListenersToCanvas();
}

function addExtraGems() {
    const heart = new Gem('images/Heart.png', 0);
    const blueGem = new Gem('images/gem-blue.png', 150);
    const selectorStar = new Gem('images/Star-selector.png', 300);
    if (player.lives === 1 && extraGems.length === 0) {
        extraGems.push(heart, blueGem, selectorStar);
    }
}

function setupEventListeners() {
    const startGame = document.getElementById('start-game-btn');
    startGame.addEventListener('click', createGameEntities);
    const newGame = document.getElementById('reload-game-btn');
    newGame.addEventListener('click', reloadGame);
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

//function endGame() {
//    document.removeEventListener('keyup', keyUpEventListener);
//    allEnemies = [];
//    gems = [];
//    extraGems = [];
//    showGameOverModal();
//}

function reloadGame() {
    window.location.reload();
}

function deleteHeartFromBoard() {
    const lives = document.getElementById('lives');
    lives.removeChild(lives.lastElementChild);
}

function addHeartToBoard() {
    const lives = document.getElementById('lives');
    const newHeart = document.createElement('img');
    newHeart.setAttribute('src', 'images/Heart.png');
    lives.appendChild(newHeart);
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
