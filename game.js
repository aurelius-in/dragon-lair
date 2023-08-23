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

// Load background, perch, and obstacle images
const bgImage = new Image();
bgImage.src = 'images/bg.png';
const perchImage = new Image();
perchImage.src = 'images/perch.png';
const obstacleImages = [];
for (let i = 1; i <= 9; i++) {
    const image = new Image();
    image.src = `images/obstacle${i}.png`;
    obstacleImages.push(image);
}

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

// Initial positions
let bgX = 0;
let fgX = 0;
let bgbgX = 0;

// Dragon object
const dragon = {
    x: dragonStartX,
    y: dragonStartY,
    width: dragonWidth,
    height: dragonHeight,
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

// Event listener for player input
window.addEventListener('click', () => {
    gameStarted = true; // Start the game
    dragon.velocity = -5; // Reduced flap strength
    currentFrame = (currentFrame + 1) % dragonImages.length; // Update the frame on tap
});
window.addEventListener('touchstart', () => {
    gameStarted = true; // Start the game
    dragon.velocity = -5; // Reduced flap strength
    currentFrame = (currentFrame + 1) % dragonImages.length; // Update the frame on tap
});

// Draw function
function draw() {
    // Draw the backgrounds
    context.drawImage(bgbgImage, bgbgX, 0, canvas.width, canvas.height);
    context.drawImage(bgbgImage, bgbgX + canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);
    context.drawImage(bgImage, bgX + canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(fgImage, fgX, 0, canvas.width, canvas.height);
    context.drawImage(fgImage, fgX + canvas.width, 0, canvas.width, canvas.height);

    // Draw perch if the game hasn't started
    if (!gameStarted) {
        context.drawImage(perchImage, dragon.x + dragon.width / 2 - 25, dragon.y + dragon.height, 50, 100);
    }

    // Draw dragon
    context.drawImage(dragonImages[currentFrame], dragon.x, dragon.y, dragon.width, dragon.height);

    // Draw obstacles using images
    obstacles.forEach(obstacle => {
        const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
        context.drawImage(randomImage, obstacle.x, obstacle.y, 35, 35);
    });
}

// Function to create obstacles
function createObstacle() {
    // Determine the position of the obstacle
    const obstacleX = canvas.width;

    // Random distance from the center, never closer than an inch from the center
    const minDistanceFromCenter = 96; // 1 inch from the center, adjust as needed
    const maxDistanceFromCenter = canvas.height / 2 - minDistanceFromCenter;
    const randomDistanceFromCenter = Math.random() * (maxDistanceFromCenter - minDistanceFromCenter) + minDistanceFromCenter;

const obstacleY = topObstacle
    ? randomDistanceFromCenter
    : canvas.height - randomDistanceFromCenter - obstacleHeight; // Use obstacleHeight

    // Create the obstacle object
   const obstacle = {
    x: obstacleX,
    y: obstacleY,
    width: obstacleWidth, // Use obstacleWidth
    height: obstacleHeight // Use obstacleHeight
};

    // Add the obstacle to the obstacles array
    obstacles.push(obstacle);

    // Alternate between top and bottom obstacles
    topObstacle = !topObstacle;

    // Reduce the spawn time for the next obstacle by 1%
    obstacleSpawnTime *= 0.99;
}

// Update function
function update() {
    // Update the background positions
    bgX -= 0.5; // Adjust speed as needed
    fgX -= 1; // Adjust speed as needed
    bgbgX -= 0.25; // Adjust speed as needed

    // Loop the backgrounds
    if (bgX <= -canvas.width) bgX = 0;
    if (fgX <= -canvas.width) fgX = 0;
    if (bgbgX <= -canvas.width) bgbgX = 0;

    if (gameStarted) {
        // Update dragon's velocity and position
        dragon.velocity += gravity;
        dragon.y += dragon.velocity;

        // Check for collision with ground or ceiling
        if (dragon.y <= 0 || dragon.y + dragon.height >= canvas.height) {
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
            // Check for collision with dragon
            if (
                dragon.x < obstacle.x + obstacle.width &&
                dragon.x + dragon.width > obstacle.x &&
                dragon.y < obstacle.y + obstacle.height &&
                dragon.y + dragon.height > obstacle.y
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

    draw();
}

// Game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop(); // Start the game loop

