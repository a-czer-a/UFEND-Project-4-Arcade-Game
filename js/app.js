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
};

Player.prototype.update = function () {
    this.checkCollisions();
};

Player.prototype.resetPosition = function () {
    this.y = 390;
};

Player.prototype.checkCollisions = function () {
    for (let i = 0; i < allEnemies.length; i++) {
        let enemy = allEnemies[i];
        if (this.collisionBetween(player, enemy)) {
            new Audio('audio/Shoot_01.mp3').play();
            this.resetPosition();
            this.takeLife();
        };
    }
};

Player.prototype.collisionBetween = function (player, enemy) {
    if (this.y === enemy.y) {
        if ((enemy.x + 30 >= this.x - 20) && (enemy.x - 30 <= this.x + 20)) {
            return true;
        } else {
            return false;
        }
    }
};

Player.prototype.updateScore = function (value) {
    this.score += value;
    this.winGame();
};

Player.prototype.addLife = function () {
    this.lives++;
};

Player.prototype.takeLife = function () {
    if (this.lives > 0) {
        this.lives--;
        deleteHeartFromBoard();
    } else {
        this.looseGame();
    }
};

Player.prototype.winGame = function () {
    if (player.x > 58 && player.score >= 700) {
        showWinGameModal();
        removeEventListenersFromCanvas();
    }
};

Player.prototype.looseGame = function () {
    showGameOverModal();
    removeEventListenersFromCanvas();
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
    addExtraGems();
};

Gem.prototype.removeFromCanvas = function () {
    this.x = -200;;
};


// -------------------------------------

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
    const bug7 = new Enemy(-400, 58, 100);


    allEnemies.splice(0);
    allEnemies.push(bug1, bug2, bug3, bug4, bug5, bug6, bug7);

    const orangeGem = new Gem('images/gem-orange.png', 50);
    const greenGem = new Gem('images/gem-green.png', 100);
    const starGem = new Gem('images/Star.png', 150);

    gems.splice(0);
    gems.push(orangeGem, greenGem, starGem);

    player = new Player(202, 390);
    addEventListenersToCanvas();
}

function addExtraGems() {
    const heart = new Gem('images/Heart.png', 0);
    const blueGem = new Gem('images/gem-blue.png', 100);
    const selectorStar = new Gem('images/Star-selector.png', 300);
    if (player.score >= 350 && extraGems.length === 0) {
        extraGems.push(heart, blueGem, selectorStar);
        allEnemies.forEach(function (enemy) {
            enemy.speed += 30;
        })
    }
}

function setupEventListeners() {
    const startGameButton = document.getElementById('start-game-btn');
    startGameButton.addEventListener('click', startGame);
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
    //    allEnemies = [];
    //    gems = [];
    //    extraGems = [];
}


function startGame() {
    hideOverlay();
    hideModal('popup-window-with-instructions');
    createGameEntities();
}

function reloadGameAfterGameOver() {
    hideModal('popup-window');
    resetGame();
    createGameEntities();

    //    window.location.reload();
}

function reloadGameAfterWinning() {
    hideModal('popup-window-for-winning');
    resetGame();
    createGameEntities();
}

function resetGame() {
    player.lives = 3;
    player.score = 0;
    updateScoreOnBoard();
    allEnemies = [];
    allEnemies.forEach(function (enemy) {
        enemy.speed -= 30;
    });
    gems = [];
    extraGems = [];
    clearHeartsAfterPreviousGame();
    addHeartToBoard();
    addHeartToBoard();
    addHeartToBoard();
}

function updateScoreOnBoard() {
    score.innerHTML = `Score: ${player.score}`;
}

function deleteHeartFromBoard() {
    const lives = document.getElementById('lives');
    lives.removeChild(lives.lastElementChild);
}

function clearHeartsAfterPreviousGame() {
    const lives = document.getElementById('lives');
    lives.innerHTML = "";
}

function addHeartToBoard(num) {
    const lives = document.getElementById('lives');
    const newHeart = document.createElement('img');
    newHeart.setAttribute('src', 'images/Heart.png');
    lives.appendChild(newHeart);
}

function showGameOverModal() {
    new Audio('audio/Jingle_Lose_01.mp3').play();
    const modal = document.getElementById('popup-window');
    modal.style.display = 'block';
    displayScoreAfterGame();
}

function showWinGameModal() {
    new Audio('audio/Jingle_Achievement.mp3').play()
    const winModal = document.getElementById('popup-window-for-winning');
    winModal.style.display = 'block';
}

function showInstructionModal() {
    const instructions = document.getElementById('popup-window-with-instructions');
    window.onscroll = function () {
        instructions.style.top = document.body.scrollTop;
    };
    instructions.style.display = 'block';
    instructions.style.top = document.body.scrollTop;
}

function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function displayScoreAfterGame() {
    document.getElementById('total-score').innerHTML = `${player.score}`;
}

function initializeGame() {
    setupEventListeners()
    showInstructionModal();
}
