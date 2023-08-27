import {
  canvas,
  context,
  dragon,
  perch,
  obstacles,
  lifeBar,
  tapToFly,
  backgrounds
} from './init.js';
import { draw } from './render.js';

// Constants
const GRAVITY = 0.3;
const JUMP_STRENGTH = 8;
const FLAP_DURATION = 5; // 100ms for each frame, 6 frames will take 500ms

// Variables
let obstacleSpawnTime = 4000;
let gameLoopCounter = 0;
let gameStarted = false;
let jump = JUMP_STRENGTH;
let isFlapping = false;
let flapCounter = 0;

// Handle user input
function handleInput(event) {
  if (!gameStarted) {
    gameStarted = true;
    dragon.image.src = dragon.start;
  }
  dragon.velocity = -jump;
  dragon.y += dragon.velocity;
  flapCounter = 0;
  isFlapping = true;
}

function resetGame() { obstacles.length = 0; perch.x = 50; dragon.x = dragonStartX; dragon.y = dragonStartY; dragon.velocity = 0; gameStarted = false; frame.current = 0; backgrounds.bgX = 0; backgrounds.fgX = 0; backgrounds.bgbgX = 0; obstacleSpawnTime = 4000; endGameTime = 0; dragon.scale = 1; dragon.alpha = 1; screenFade.alpha = 0; bg.width = canvas.height * 4; }

function createObstacle() { const obstacleType = ['arrow', 'lightningStrike', 'batSwarm', 'tornado', 'wraith', 'zombieDragon', 'thundercloud', 'fireball']; const randomType = obstacleType[Math.floor(Math.random() * obstacleType.length)]; const minDistance = canvas.height * 0.1, centerDistance = canvas.height * 0.5; if (topObstacle) { obstacleY = Math.random() * (centerDistance - minDistance) + minDistance; } else { obstacleY = Math.random() * (centerDistance - minDistance) + centerDistance; } let obstacle; switch (randomType) { case 'arrow': obstacle = createArrowObstacle(canvas.width, obstacleY); break; case 'lightningStrike': obstacle = createLightningStrikeObstacle(canvas.width, obstacleY); break; case 'batSwarm': obstacle = createBatSwarmObstacle(canvas.width, obstacleY); break; case 'tornado': obstacle = createTornadoObstacle(canvas.width, obstacleY); break; case 'wraith': obstacle = createWraithObstacle(canvas.width, obstacleY); break; case 'zombieDragon': obstacle = createZombieDragonObstacle(canvas.width, obstacleY); break; case 'thundercloud': obstacle = createThundercloudObstacle(canvas.width, obstacleY); break; case 'fireball': obstacle = createFireballObstacle(canvas.width, obstacleY); break; } obstacles.push(obstacle); topObstacle = !topObstacle; obstacleSpawnTime *= 0.999; }

function collisionDetected(dragon, obstacle) {
    const brX = dragon.width * 0.05, brY = dragon.height * 0.1;
    const dca = { x: dragon.x + brX, y: dragon.y + brY, width: dragon.width - 2 * brX, height: dragon.height - 2 * brY };
    const oca = { x: obstacle.x, y: obstacle.y, width: obstacle.width, height: obstacle.height };

    return (
        dca.x < oca.x + oca.width && dca.x + dca.width > oca.x && dca.y < oca.y + oca.height &&  dca.y + dca.height > oca.y
    );
}
// Update function
function update() {
  if (isFlapping) {
    if (flapCounter % FLAP_DURATION === 0) {
      dragon.image.src = dragon.frames[flapCounter / FLAP_DURATION];
    }
    flapCounter++;
    if (flapCounter >= FLAP_DURATION * dragon.frames.length) {
      isFlapping = false;
      dragon.image.src = dragon.drop;
      flapCounter = 0;
    }
  }
  if (gameStarted) {
    // Apply gravity to dragon
    dragon.velocity += GRAVITY;
    dragon.y += dragon.velocity;

    // Update dragon
    dragon.update();

    // Update backgrounds to make the dragon appear to move forward
    backgrounds.fgX -= 0.2; // slow
    backgrounds.bgX -= 0.1; // slower
    backgrounds.bgbgX -= 0.05; // slowest

    // Update obstacles
    obstacles.forEach((obstacle, index) => {
      obstacle.x -= 1; // Obstacle speed
      obstacle.update();

      if (collisionDetected(dragon, obstacle)) {
        if (!dragon.collided) {
          lifeBar.segments--;
          if (lifeBar.segments <= 0) {
            resetGame();
          }
          obstacles.splice(index, 1);
          dragon.collided = true;

          setTimeout(() => {
            dragon.collided = false;
          }, 1000);
        }
      }
    });

    // Update perch
    perch.x -= 1; // Set the speed to match the obstacle speed
    perch.update();

    // Create new obstacles
    if (gameLoopCounter % 100 === 0) { // Every 100 frames
      createObstacle();
    }
  }

  // Removed the duplicate level end condition check
  if (backgrounds.fgX + bg.width <= canvas.width) {
    levelEnd();
  }
}

// Level end animation
function levelEnd() {
    let startTime = Date.now();
    let duration = 5000; // 5 seconds
    let initialScale = dragon.scale;
    let initialAlpha = dragon.alpha;
    let initialX = dragon.x;

    function animateEnd() {
        let currentTime = Date.now();
        let elapsedTime = currentTime - startTime;
        let progress = elapsedTime / duration;

        if (progress < 1) {
            dragon.scale = initialScale - (initialScale - 0.1) * progress;
            dragon.alpha = initialAlpha - (initialAlpha - 0.5) * progress;
            dragon.x = initialX + (canvas.width / 2 - initialX) * progress;
            requestAnimationFrame(animateEnd);
        } else {
            screenFade.alpha = 1;
            setTimeout(resetGame, 2000);
        }
    }
    animateEnd();
}

function gameLoop() {
    update();
    draw();

    if (tapToFly.alpha > 0) {
        tapToFly.alpha -= 0.01;
    }

    gameLoopCounter++;

    // Removed the duplicate frame updating code
    // as it's already handled in the update function

    requestAnimationFrame(gameLoop);
}

window.onload = () => {
    setTimeout(() => {
        tapToFly.alpha = 0;
    }, 2000);

    setTimeout(() => {
        dragon.velocity = jump;
        dragon.y += dragon.velocity;
    }, 2100);

    setTimeout(() => {
        dragon.velocity = jump;
        dragon.y += dragon.velocity;
        gameStarted = true;
    }, 2300) 
    
};

// Lock screen orientation to landscape
screen.orientation.lock('landscape');

// Hide the URL bar
window.scrollTo(0, 1);

// Add these lines at the end of your game.js file
window.addEventListener('click', (e) => handleInput(e));
window.addEventListener('touchstart', (e) => handleInput(e), { passive: false });
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') handleInput(e);
});

// Initialize the game loop
gameLoop();
