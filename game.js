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

let perchX = 50; // Adjust as needed
const perchY = canvas.height - 250; // Perch extends from the bottom
const perchWidth = 150; // Width of the perch
const perchHeight = 250; // Height of the perch

let life = 100;
let gameLoopCounter = 0; 
let endGame = false;
let endGameTime = 0;
let dragonScale = 1;
let dragonAlpha = 1;
let screenFadeAlpha = 0;

// Constants for dragon size and starting position
const dragonWidth = 150;
const dragonHeight = 150;
const dragonStartX = canvas.width * 0.1 - 50; // Move back by 50 pixels
const dragonStartY = canvas.height * 0.5;

// Constants for gravity and jump strength
const gravity = 0.5; // Increased gravity
const jump = -6; // Reduced jump strength

// Constants for obstacle size
const obstacleWidth = 40;
let obstacleHeight = 40;

let dragonFrame = 0; // Define dragonFrame
let framesPerFlap = 50; // Increase the frames per flap to slow down the animation

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
let obstacleVelocity = 5; // Adjust as needed

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
let obstacleSpawnTime = 4000; // 4 seconds
let lastObstacleTime = Date.now();
let topObstacle = true; // To alternate between top and bottom obstacles

let gameStarted = false; // Track if the game has started

function handleInput() {
    if (!gameStarted) {
        gameStarted = true; // Start the game
    }
    dragon.velocity = jump; // Use the jump constant
    dragon.y += dragon.velocity; // Update the dragon's position
    currentFrame = (currentFrame + 1) % dragonImages.length; // Update the frame on input
    framesPerFlap = Math.floor(Math.random() * 11) + 2; // Random number between 2 and 12
}

// Touch, Click and Keydown Listeners
window.addEventListener('click', handleInput);
window.addEventListener('touchstart', handleInput);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        handleInput();
    }
});

function resetGame() {
    // Reset dragon and obstacles
    obstacles.length = 0; // Clear obstacles array
    perchX = 50; // Reset the perch's X position
    dragon.x = dragonStartX;
    dragon.y = dragonStartY;
    dragon.velocity = 0;
    gameStarted = false;
    currentFrame = 0;
    bgX = 0; // Reset background positions
    fgX = 0;
    bgbgX = 0;
    life = 100; // Reset life to 100%
    obstacleSpawnTime = 4000; // Reset obstacle spawn time to 4 seconds
    endGame = false;
    endGameTime = 0;
    dragonScale = 1;
    dragonAlpha = 1;
    screenFadeAlpha = 0;
    imageWidth = canvas.height * 4; // Reset image width
}

// Draw objects
function draw() {
    // Draw the furthest back background (bgbg)
    context.drawImage(bgbgImage, bgbgX, 0, imageWidth, canvas.height);
    context.drawImage(bgbgImage, bgbgX + imageWidth, 0, imageWidth, canvas.height);

    // Draw the middle background (bg)
    context.drawImage(bgImage, bgX, 0, imageWidth, canvas.height);
    context.drawImage(bgImage, bgX + imageWidth, 0, imageWidth, canvas.height);

    // Draw the closest background (fg)
    context.drawImage(fgImage, fgX, 0, imageWidth, canvas.height);
    context.drawImage(fgImage, fgX + imageWidth, 0, imageWidth, canvas.height);

    // Draw perch
    context.drawImage(perchImage, perchX, perchY, perchWidth, perchHeight);

    // Drawing obstacles using functions from obstacles.js
    obstacles.forEach(obstacle => {
        obstacle.draw(context);
    });

    // Draw the dragon with scaling and fading
    context.save();
    context.globalAlpha = dragonAlpha;
    context.translate(dragon.x + dragon.width / 2, dragon.y + dragon.height / 2);
    context.scale(dragonScale, dragonScale);
    context.translate(-(dragon.x + dragon.width / 2), -(dragon.y + dragon.height / 2));
    context.drawImage(dragonImages[currentFrame], dragon.x, dragon.y, dragon.width, dragon.height);
    context.restore();

    // Draw the life bar border
    context.fillStyle = '#708090'; // Hex code for blue-grey border
    context.fillRect(10, 10, 400, 15);

    // Determine the fill color based on life
    let fillColor = life <= 20 ? 'red' : 'green';

    // Draw the life bar fill
    context.fillStyle = fillColor;
    context.fillRect(12, 12, (life / 100) * 396, 11);

    // Draw the "TAP TO FLY!" text
    if (tapToFlyAlpha > 0) {
        context.fillStyle = `rgba(255, 255, 255, ${tapToFlyAlpha})`; // White text with alpha for fading
        context.font = '40px sans-serif';
        context.textAlign = 'center';
        context.fillText('TAP TO FLY!', canvas.width / 2, canvas.height / 2);
    }

    // Draw black fade overlay
    context.fillStyle = `rgba(0, 0, 0, ${screenFadeAlpha})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
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
        bgbgX -= 0.05; // Slowest speed for the furthest back background
        bgX -= 0.1; // Slower speed for the middle background
        fgX -= 0.15; // Slow speed for the closest background
        perchX -= obstacleVelocity; // Move the perch with the obstacles

        // Reset positions if they go off-screen
        if (bgbgX <= -imageWidth) bgbgX = 0;
        if (bgX <= -imageWidth) bgX = 0;
        if (fgX <= -imageWidth) fgX = 0;

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
                life -= 10; // Reduce life by 10%
                if (life <= 0) {
                    resetGame(); // Reset the game if life reaches 0
                }
                obstacles.splice(index, 1); // Remove collided obstacle
            }
        });

        // Check for collision with ground or ceiling
        if (dragon.y <= -canvas.height - 300 || dragon.y + dragon.height >= canvas.height + 300 || life <= 0) {
            resetGame();
        }
    }

    if (!endGame && fgX + imageWidth <= canvas.width) {
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
    // Gradually reduce the flap speed when not tapping
    if (gameLoopCounter % framesPerFlap === 0) {
        currentFrame = (currentFrame + 1) % dragonImages.length; // Cycle through the frames
    }

    // Gradually increase framesPerFlap to slow down the animation when not tapping
    if (gameLoopCounter % 60 === 0 && framesPerFlap < 30) { // Every second
        framesPerFlap++;
    }
}

// Fade the "TAP TO FLY!" text
if (tapToFlyAlpha > 0) {
    tapToFlyAlpha -= 0.01
}

function gameLoop() {
    update();
    draw();

    // Increment the game loop counter
    gameLoopCounter++;

    // Update the current frame based on the framesPerFlap variable
    if (gameLoopCounter % framesPerFlap === 0) {
        currentFrame = (currentFrame + 1) % dragonImages.length; // Cycle through the frames
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();

window.onload = () => {
    setTimeout(() => {
        tapToFlyAlpha = 0; // Hide the text
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
