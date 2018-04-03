 /* Engine.js
  * This file provides the game loop functionality (update entities and render),
  * draws the initial game board on the screen, and then calls the update and
  * render methods on the player and enemy objects (defined in your app.js).
  */

 var Engine = (function (global) {
     /* Predefine the variables we'll be using within this scope,
      * create the canvas element, grab the 2D context for that canvas
      * set the canvas elements height/width and add it to the DOM 
      */
     var doc = global.document,
         win = global.window,
         canvas = doc.createElement('canvas'),
         ctx = canvas.getContext('2d'),
         lastTime,
         reachedWater = false,
         hasWon = false;


     canvas.width = 505;
     canvas.height = 606;
     doc.body.appendChild(canvas);


     /* Kickoff point for the game loop itself
      * that  handles properly calling the update and render methods 
      */
     function main() {
         // Get time delta information required for smooth animation
         var now = Date.now(),
             dt = (now - lastTime) / 1000.0;

         update(dt);
         render();

         // Set the lastTime variable which is used to determine the time delta for the next time this function is called
         lastTime = now;

         win.requestAnimationFrame(main);
     }

     // Initial setup that should only occur once
     function init() {
         reset();
         lastTime = Date.now();
         main();
     }

     function update(dt) {
         updateEntities(dt);
         checkCollisions();
         collectGems();
         collectExtraGems();
         checkReachingWaterCondition();
         arcade.addExtraGems();
         winGame();
     }

     function checkCollisions() {
         for (let i = 0; i < allEnemies.length; i++) {
             let enemy = allEnemies[i];
             if (player.collisionBetween(player, enemy)) {
                 new Audio('audio/Shoot_01.mp3').play();
                 player.resetPosition();
                 handleLives();
             };
         }
     }

     function collectGems() {
         for (let i = 0; i < gems.length; i++) {
             if (player.y === gems[i].y - 40) {
                 if (player.x === gems[i].x - 18) {
                     player.updateScore(gems[i].value);
                     arcade.updateScoreOnBoard();
                     new Audio('audio/Collect_Point_00.mp3').play();
                     gems[i].removeFromCanvas();
                 }
             }
         }
     }

     function collectExtraGems() {
         for (let i = 0; i < extraGems.length; i++) {
             if (player.y === extraGems[i].y - 40) {
                 if (player.x === extraGems[i].x - 18) {
                     if (extraGems[i].sprite === 'images/Heart.png') {
                         arcade.addHeartToBoard(1);
                         player.addLife();
                         new Audio('audio/Pickup_02.mp3').play();
                         extraGems[i].removeFromCanvas();
                     } else {
                         new Audio('audio/Collect_Point_00.mp3').play();
                         player.updateScore(gems[i].value);
                         arcade.updateScoreOnBoard();
                         extraGems[i].removeFromCanvas();
                     }
                 }
             }
         }
     }

     function checkReachingWaterCondition() {
         if (player.y < 58 && !reachedWater) {
             reachedWater = true;
             setTimeout(addPointsAndResetPosition, 400);
         }
     }

     function addPointsAndResetPosition() {
         player.updateScore(50);
         new Audio('audio/Collect_Point_00.mp3').play();
         arcade.updateScoreOnBoard();
         player.resetPosition();
         reachedWater = false;
     }

     function handleLives() {
         if (player.lives > 0) {
             player.takeLife();
             arcade.deleteHeartFromBoard();
         } else {
             loseGame();
         }
     }

     function winGame() {
         if (player.x > 58 && player.score > 699) {
             player.x = -10;
             arcade.showWinGameModal();
             removeEventListenersFromCanvas();
         }
     }

     function loseGame() {
         arcade.showGameOverModal();
         removeEventListenersFromCanvas();
     }

     function updateEntities(dt) {
         allEnemies.forEach(function (enemy) {
             enemy.update(dt);
         });
         gems.forEach(function (gem) {
             gem.update(dt);
         });
         extraGems.forEach(function (extraGem) {
             extraGem.update(dt);
         });
     }

     function render() {
         var rowImages = [
                'images/water-block.png', // Top row is water
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
                'images/grass-block.png' // Row 2 of 2 of grass
            ],
             numRows = 6,
             numCols = 5,
             row, col;

         // Before drawing, clear existing canvas
         ctx.clearRect(0, 0, canvas.width, canvas.height)

         for (row = 0; row < numRows; row++) {
             for (col = 0; col < numCols; col++) {
                 ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
             }
         }

         renderEntities();
     }

     function renderEntities() {
         allEnemies.forEach(function (enemy) {
             enemy.render();
         });
         gems.forEach(function (gem) {
             gem.render();
         });
         extraGems.forEach(function (extraGem) {
             extraGem.render();
         });
         player.render();
     }

     function reset() {
         extraGems = [];
     }

     Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-cat-girl.png',
        'images/gem-orange.png',
        'images/gem-green.png',
        'images/gem-blue.png',
        'images/Star.png',
        'images/Heart.png',
        'images/Star-selector.png',
    ]);

     // Assign the canvas' context object to the global variable (the window object when run in a browser)
     Resources.onReady(init);
     global.ctx = ctx;

 })(this);
