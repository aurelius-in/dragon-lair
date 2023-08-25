import {
    canvas, context, perchY, perchWidth, perchHeight,
    dragon, dragonImages, perch, obstacles, lifeBar, tapToFly, backgrounds, frame
} from './init.js';
import { draw } from './render.js';
import {
    createArrowObstacle, createLightningStrikeObstacle, createBatSwarmObstacle, createTornadoObstacle,
    createWraithObstacle, createZombieDragonObstacle, createThundercloudObstacle, createFireballObstacle
} from './obstacles.js';

// EndGame
let endGame = false, 
    dragonAlpha = 1,
    dragonScale = 1,
    gameLoopCounter = 0, 
    endGameTime = 0, 
    obstacleVelocity = 5, 
    obstacleSpawnTime = 4000, 
    lastObstacleTime = Date.now(), 
    topObstacle = true, 
    gameStarted = false, 
    currentFrame = frame.current, 
    gameTime = 0, 
    nonTappingFrameCounter = 0, 
    framesPerFlap = 50, 
    dragonFrame = 0, 
    obstacleHeight = 40, 
    dragonStartX = canvas.width * 0.1 - 50, 
    dragonStartY = canvas.height * 0.5, 
    gravity = 0.5, jump = -6,
    screenFadeAlpha = 0,
    imageWidth = canvas.height * 4;

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
    endGame = false;
    endGameTime = 0;
    dragonScale = 1;
    dragonAlpha = 1;
    screenFadeAlpha = 0;
    imageWidth = canvas.height * 4; // Reset image width
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

function update() {
    if (gameStarted) {
        // Update dragon's velocity and position
        dragon.velocity += gravity;
        dragon.y += dragon.velocity;

        // Update the positions only if the dragon has started flying
        backgrounds.bgbgX -= 0.05; // Slowest speed for the furthest back background
        backgrounds.bgX -= 0.1; // Slower speed for the middle background
        backgrounds.fgX -= 0.15; // Slow speed for the closest background
        perch.x -= obstacleVelocity; // Move the perch with the obstacles

        // Check if it's time to spawn a new obstacle
        gameTime += 1000 / 60; // Increment game time by frame duration
        if (gameTime >= obstacleSpawnTime) {
            createObstacle(); // Create a new obstacle
            gameTime = 0; // Reset game time
        }

        obstacles.forEach((obstacle, index) => {
            obstacle.update();
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
            }

            // Check for collision with obstacles
            const boundaryReductionX = dragon.width * 0.1;
            const boundaryReductionY = dragon.height * 0.2;

            if (
                dragon.x + boundaryReductionX < obstacle.x + obstacle.width &&
                dragon.x + dragon.width - boundaryReductionX > obstacle.x &&
                dragon.y + boundaryReductionY < obstacle.y + obstacle.height &&
                dragon.y + dragon.height - boundaryReductionY > obstacle.y
            ) {
    obstacles.splice(index, 1); // Remove collided obstacle
    lifeBar.segments--; // Decrement life bar segments
    dragonCollided = true; // Set collision state

    setTimeout(() => {
        dragonCollided = false;
    }, 1000);
}
        });

        // Check for collision with ground or ceiling
        if (dragon.y <= -canvas.height - 300 || dragon.y + dragon.height >= canvas.height + 300 ) {
            resetGame();
        }
    }

    if (!endGame && backgrounds.fgX + imageWidth <= canvas.width) {
        endGame = true;
    }

    if (endGame) {
        // Gradually increase the scale for zooming effect
        dragonScale += 0.005;

        // Gradually decrease the alpha for fading effect
        dragonAlpha -= 0.005;

        // Gradually increase the alpha for screen fade to black
        screenFadeAlpha += 0.01;

        // Restart the game after 2 seconds of black screen
        if (screenFadeAlpha >= 1) {
            setTimeout(resetGame, 2000);
        }
    }
    // Control the non-tapping animation speed
    if (!gameStarted) {
        framesPerFlap = 90; // 

        // Gradually increase framesPerFlap to slow down the animation when not tapping
        if (gameLoopCounter % 30 === 0 && framesPerFlap < 40) { // Every half second
            framesPerFlap += 2; // Increment by 2
        }
    }
}

// Game loop
function gameLoop() {
    update();
    draw();

    // Fade the "TAP TO FLY!" text
    if (tapToFly.alpha > 0) {
        tapToFly.alpha -= 0.01;
    }

    // Increment the game loop counter
    gameLoopCounter++;

    // Check if the user is tapping or not
    if (gameStarted) {
        // If tapping, update the frame based on framesPerFlap
        if (gameLoopCounter % framesPerFlap === 0) {
            currentFrame = (currentFrame + 1) % dragonImages.length;
        }
    } else {
        // If not tapping, change the frame every 60 iterations (1 second)
        if (gameLoopCounter % framesPerFlap === 0) {
            currentFrame = (currentFrame + 1) % dragonImages.length;
        }
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();

window.onload = () => {
    setTimeout(() => {
        tapToFly.alpha = 0; // Hide the text
    }, 2000);

    setTimeout(() => {
        dragon.velocity = jump; // Simulate the first tap
        dragon.y += dragon.velocity; // Update the dragon's position
    }, 2100);

    setTimeout(() => {
        dragon.velocity = jump; // Simulate the second tap
        dragon.y += dragon.velocity; // Update the dragon's position
        gameStarted = true; // Start the game
    }, 2300);
};
