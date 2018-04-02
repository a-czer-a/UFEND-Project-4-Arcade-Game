## Description

This is project of a classic arcade game clone (like a Frogger game) accomplished as a part of Udacity Front-End Nanodegree and uses object-oriented JavaScript.

## Code Dependencies

- Game engine, basic art assets and starter code were provided by Udacity
- Sounds by [Little Robot Sound Factory](www.littlerobotsoundfactory.com) via [Open Game Art](https://opengameart.org/content/8-bit-sound-effects-library)
- Sound icon by Font Awesome
- Medal icon by Smashicons from [Flaticon](www.flaticon.com)
- Popups’ background from [#WallPapertag](https://wallpapertag.com/game-background)

## How to play

Clone this repository or download all files and open `index.html` in the browser. You can also use [GitHub live preview](https://htmlpreview.github.io/?https://github.com/a-czer-a/UFEND-Project-4-Arcade-Game/blob/master/index.html). 

Click the „Start game” button on the initial popup to set all game entities on board. To play again use buttons on popups seen after winning the game or when the game is over or reload the page.
Use arrow keys to move the player.

## Game rules

The goal of the player is to reach the water with 700 points. The player has 3 lives and can move left, right, up, and down. The enemies move at varying speeds on the paved block portion of the scene. Once the player collides with an enemy, he loses one life and is moved back to the grass area. When the player reaches the water, he scores 50 points and is moved back to the start line so he can try to reach water again and earn more points. The player wins after reaching the water with at least 700 points. 
The player can collect different gems, which disappear after a certain (random) period of time, and get extra points for that:
- 50 points for the orange gem, 
- 100 points for the green and blue gems,
- 150 points for the star,
- 300 points for the star selector.

Three gems appear when the game begins and two more with a heart giving an extra life are added when the player earns 350 points. At this time enemies start to move faster.
As soon as the player loses his last life, the game is over.


## Licence

The content of this repository is free and is licensed under a [MIT Licence](https://choosealicense.com/licenses/mit/).



