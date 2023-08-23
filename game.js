import {
    createArrowObstacle,
    createLightningStrikeObstacle,
    createBatSwarmObstacle,
    createTornadoObstacle,
    createWraithObstacle,
    createZombieDragonObstacle,
    createThundercloudObstacle,
    createFireballObstacle
} from './obstacles.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load perch
const perchImage = new Image();
perchImage.src = 'images/perch.png';

const perchX = 50; // Adjust as needed
const perchY = canvas.height - 250; // Perch extends from the bottom
const perchWidth = 150; // Width of the perch
const perchHeight = 250; // Height of the perch

// Constants for dragon size and starting position
const dragonWidth = 150;
const dragonHeight = 150;
const dragonStartX = canvas.width * 0.1 - 50; // Move back by 50 pixels
const dragonStartY = canvas.height * 0.5;

// Constants for gravity and jump strength
const gravity = 0.2; // Reduce gravity
const jump = -4; // Reduce jump strength

// Constants for obstacle size
const obstacleWidth = 25;
const obstacleHeight = 25;

// Load the images
const bgImage = new Image();
bgImage.src = 'images/bg.png';
const fgImage = new Image();
fgImage.src = 'images/fg.png';
const bgbgImage = new Image();
bgbgImage.src = 'images/bgbg.png';

// Start flying before tapping
let tapToFlyAlpha = 1;

// Initial positions
let bgX = 0;
let fgX = 0;
let bgbgX = 0;

// Calculate the width based on the canvas height and 4:1 aspect ratio
const imageWidth = canvas.height * 4;

// Dragon player object
const dragon = {
    x: perchX, // Adjust as needed
    y: perchY - 125, // Dragon sits on top of the perch
    width: 150,
    height: 150,
    velocity: 0
};

// Gravity and obstacle speed
const obstacleSpeed = 5; // Adjust as needed

// Create an array to hold the dragon images and load them
const dragonImages = [];
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= (i === 1 ? 4 : 3); j++) {
        const char = String.fromCharCode(96 + j);
        const image = new Image();
        image.src = `images/dragon${i}${char}.png`;
        dragonImages.push(image);
    }
}

let currentFrame = 0; // Current frame being displayed
const obstacles = [];
let gameTime = 0;
let obstacleSpawnTime = 5000; // 5 seconds
let lastObstacleTime = Date.now();
let topObstacle = true; // To alternate between top and bottom obstacles

let gameStarted = false; // Track if the game has started

window.addEventListener('touchstart', () => {
    if (!gameStarted) {
        gameStarted = true; // Start the game
        dragon.velocity = jump; // Use the jump constant
        dragon.y += dragon.velocity; // Update the dragon's position
    }
    currentFrame = (currentFrame + 1) % dragonImages.length; // Update the frame on tap
});

// Draw function
function draw() {
    // Draw the bgbg image first (furthest back)
    context.drawImage(bgbgImage, bgbgX, 0, imageWidth, canvas.height);
    context.drawImage(bgbgImage, bgbgX + imageWidth, 0, imageWidth, canvas.height);

    // Draw the bg image (middle)
    context.drawImage(bgImage, bgX, 0, imageWidth, canvas.height);
    context.drawImage(bgImage, bgX + imageWidth, 0, imageWidth, canvas.height);

    // Draw the fg image (closest)
    context.drawImage(fgImage, fgX, 0, imageWidth, canvas.height);
    context.drawImage(fgImage, fgX + imageWidth, 0, imageWidth, canvas.height);

    // Draw perch
    context.drawImage(perchImage, perchX, perchY, perchWidth, perchHeight);

    // Drawing obstacles using functions from obstacles.js
    obstacles.forEach(obstacle => {
        obstacle.draw(context);
    });

    // Draw dragon
    context.drawImage(dragonImages[currentFrame], dragon.x, dragon.y, dragon.width, dragon.height);
 
// Draw the "TAP TO FLY!" text
if (tapToFlyAlpha > 0) {
  context.fillStyle = `rgba(255, 255, 255, ${tapToFlyAlpha})`; // White text with alpha for fading
  context.font = '40px sans-serif';
  context.textAlign = 'center';
  context.fillText('TAP TO FLY!', canvas.width / 2, canvas.height / 2);
}
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

    // Reduce the spawn time for the next obstacle by 1%
    obstacleSpawnTime *= 0.99;
}

function update() {
    if (gameStarted) {
        // Update dragon's velocity and position
        dragon.velocity += gravity;
        dragon.y += dragon.velocity;

        // Update the positions only if the dragon has started flying
        if (gameStarted) {
            bgbgX -= 0.05; // Slowest movement for the furthest back
            bgX -= 0.06; // Almost as slow as bgbg
            fgX -= 0.07; // Slow but not quite as slowly as bg
            perchX -= obstacleSpeed; // Move the perch with the obstacles

            // Reset positions if they go off-screen
            if (bgbgX <= -imageWidth) bgbgX = 0;
            if (bgX <= -imageWidth) bgX = 0;
            if (fgX <= -imageWidth) fgX = 0;
        }

        // Check for collision with ground or ceiling
if (dragon.y <= -canvas.height * 0.1 || dragon.y + dragon.height >= canvas.height * 1.2) {
    // Reset dragon and obstacles
    dragon.x = dragonStartX;
    dragon.y = dragonStartY;
    dragon.velocity = 0;
    gameStarted = false;
    currentFrame = 0;
    obstacles.length = 0; // Clear obstacles array
}
        // Check if it's time to spawn a new obstacle
        gameTime += 1000 / 60; // Increment game time by frame duration
        if (gameTime >= obstacleSpawnTime) {
            createObstacle(); // Create a new obstacle
            gameTime = 0; // Reset game time
            obstacleSpawnTime *= 0.99; // Reduce spawn time by 1%
        }

        // Check for collision with obstacles
        obstacles.forEach((obstacle, index) => {
            // Reduce the dragon's boundary box
            const boundaryReductionX = dragon.width * 0.1;
            const boundaryReductionY = dragon.height * 0.2;

            // Check for collision with dragon
            if (
                dragon.x + boundaryReductionX < obstacle.x + obstacle.width &&
                dragon.x + dragon.width - boundaryReductionX > obstacle.x &&
                dragon.y + boundaryReductionY < obstacle.y + obstacle.height &&
                dragon.y + dragon.height - boundaryReductionY > obstacle.y
            ) {
                // Reset dragon and obstacles
                dragon.x = dragonStartX;
                dragon.y = dragonStartY;
                dragon.velocity = 0;
                gameStarted = false;
                currentFrame = 0;
                obstacles.length = 0; // Clear obstacles array
            }

            // Move obstacle to the left
            obstacle.x -= obstacleSpeed;

            // Remove off-screen obstacles
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
            }
        });
    }
    // Fade the "TAP TO FLY!" text
  if (tapToFlyAlpha > 0) {
    tapToFlyAlpha -= 0.01
  }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

// Add this code to the end of your file
window.onload = () => {
  setTimeout(() => {
    tapToFlyAlpha = 0; // Hide the text
  }, 2000);

  setTimeout(() => {
    dragon.velocity = jump; // Simulate the first tap
  }, 2100);

  setTimeout(() => {
    dragon.velocity = jump; // Simulate the second tap
    gameStarted = true; // Start the game
  }, 2300);
};
