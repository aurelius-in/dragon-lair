import {
    canvas, context, perchY, perchWidth, perchHeight, screenFade,
    dragon, dragonImages, perch, obstacles, lifeBar, tapToFly, backgrounds, frame
} from './init.js';
import { draw } from './render.js';
import {
    createArrowObstacle, createLightningStrikeObstacle, createBatSwarmObstacle, createTornadoObstacle,
    createWraithObstacle, createZombieDragonObstacle, createThundercloudObstacle, createFireballObstacle
} from './obstacles.js';

// Input handling
function handleInput() {
    if (!gameStarted) {
        gameStarted = true; // Start the game
    }
    dragon.velocity = jump; // Use the jump constant
    dragon.y += dragon.velocity; // Update the dragon's position
    currentFrame = (currentFrame + 1) % dragonImages.length; // Update the frame on input
    framesPerFlap = Math.floor(Math.random() * 11) + 2; // Random number between 2 and 12
}
window.addEventListener('click', handleInput);
window.addEventListener('touchstart', handleInput);
window.addEventListener('keydown', (e) => { if (e.code === 'Space') handleInput(); });

// Touch, Click and Keydown Listeners
window.addEventListener('click', handleInput);
window.addEventListener('touchstart', handleInput);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        handleInput();
    }
});

// Game reset
function resetGame() {
    // Reset dragon and obstacles
    obstacles.length = 0; // Clear obstacles array
    perch.x = 50; // Reset the perch's X position
    dragon.x = dragonStartX;
    dragon.y = dragonStartY;
    dragon.velocity = 0;
    gameStarted = false;
    frame.current = 0;
    backgrounds.bgX = 0; // Reset background positions
    backgrounds.fgX = 0;
    backgrounds.bgbgX = 0;
    obstacleSpawnTime = 4000; // Reset obstacle spawn time to 4 seconds
    endGameTime = 0;
    dragon.scale = 1;
    dragon.alpha = 1;
    screenFade.alpha = 0;
    bg.width = canvas.height * 4; // Reset image width
}
function createObstacle() {
    const obstacleType = ['arrow', 'lightningStrike', 'batSwarm', 'tornado', 'wraith', 'zombieDragon', 'thundercloud', 'fireball'];
    const randomType = obstacleType[Math.floor(Math.random() * obstacleType.length)];

    const minDistance = canvas.height * 0.1; // 1 inch from the top or bottom
    const centerDistance = canvas.height * 0.5; // Center of the screen

    let obstacleY;
    if (topObstacle) {
        obstacleY = Math.random() * (centerDistance - minDistance) + minDistance;
    } else {
        obstacleY = Math.random() * (centerDistance - minDistance) + centerDistance;
    }

    let obstacle;
    switch (randomType) {
        case 'arrow':
            obstacle = createArrowObstacle(canvas.width, obstacleY);
            break;
        case 'lightningStrike':
            obstacle = createLightningStrikeObstacle(canvas.width, obstacleY);
            break;
        case 'batSwarm':
            obstacle = createBatSwarmObstacle(canvas.width, obstacleY);
            break;
        case 'tornado':
            obstacle = createTornadoObstacle(canvas.width, obstacleY);
            break;
        case 'wraith':
            obstacle = createWraithObstacle(canvas.width, obstacleY);
            break;
        case 'zombieDragon':
            obstacle = createZombieDragonObstacle(canvas.width, obstacleY);
            break;
        case 'thundercloud':
            obstacle = createThundercloudObstacle(canvas.width, obstacleY);
            break;
        case 'fireball':
            obstacle = createFireballObstacle(canvas.width, obstacleY);
            break;
    }

    // Add the obstacle to the obstacles array
    obstacles.push(obstacle);

    // Alternate between top and bottom obstacles
    topObstacle = !topObstacle;

    // Reduce the spawn time for the next obstacle by 0.1%
    obstacleSpawnTime *= 0.999;
}

function collisionDetected(dragon, obstacle) {
  // Reduce the boundary by 5% of the width and 10% of the height
  const boundaryReductionX = dragon.width * 0.05;
  const boundaryReductionY = dragon.height * 0.1;

  // Dragon's collision area
  const dragonCollisionArea = {
    x: dragon.x + boundaryReductionX,
    y: dragon.y + boundaryReductionY,
    width: dragon.width - (boundaryReductionX * 2),
    height: dragon.height - (boundaryReductionY * 2),
  };

  // Obstacle's collision area (no reduction)
  const obstacleCollisionArea = {
    x: obstacle.x,
    y: obstacle.y,
    width: obstacle.width,
    height: obstacle.height,
  };

  // Check for collision
  return (
    dragonCollisionArea.x < obstacleCollisionArea.x + obstacleCollisionArea.width &&
    dragonCollisionArea.x + dragonCollisionArea.width > obstacleCollisionArea.x &&
    dragonCollisionArea.y < obstacleCollisionArea.y + obstacleCollisionArea.height &&
    dragonCollisionArea.y + dragonCollisionArea.height > obstacleCollisionArea.y
  );
}
function update() {
  if (gameStarted) {
    dragon.update();
    obstacles.forEach((obstacle, index) => {
      obstacle.update();
      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(index, 1);
      }
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
    perch.update();
    if (obstacleSpawnTimer > obstacleSpawnRate) {
      obstacles.push(new Obstacle());
      obstacleSpawnTimer = 0;
    } else {
      obstacleSpawnTimer++;
    }
  }
  if (backgrounds.fgX + imageWidth <= canvas.width) {
    levelEnd();
  }
  if (!gameStarted) {
    framesPerFlap = 90;
    if (gameLoopCounter % 30 === 0 && framesPerFlap < 40) {
      framesPerFlap += 2;
    }
  }
}

function gameLoop() {
  update();
  draw();
  if (collisionDetected(dragon, obstacle)) {
    dragon.collided = true;
  }
  if (tapToFly.alpha > 0) {
    tapToFly.alpha -= 0.01;
  }
  gameLoopCounter++;
  if (gameStarted) {
    if (gameLoopCounter % framesPerFlap === 0) {
      currentFrame = (currentFrame + 1) % dragonImages.length;
    }
  } else {
    if (gameLoopCounter % framesPerFlap === 0) {
      currentFrame = (currentFrame + 1) % dragonImages.length;
    }
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();

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
  }, 2300);
};
