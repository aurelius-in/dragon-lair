const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let score = 0;

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


const dragon = {
    x: canvas.width * 0.1,
    y: canvas.height * 0.5,
    width: 180, // Updated width to match dragon image
    height: 180, // Updated height to match dragon image
    velocity: 0
};

const obstacles = [];
let gameTime = 0;
const levelDuration = 20000; // 20 seconds
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

// Dragon's starting position
const dragonStartX = 50;
const dragonStartY = 200;

// Initialize dragon
let dragon = {
    x: dragonStartX,
    y: dragonStartY,
    width: 180,
    height: 180,
    velocity: 0
};

function draw() {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw perch if the game hasn't started
    if (!gameStarted) {
        context.fillStyle = 'green';
        context.fillRect(dragon.x, dragon.y + dragon.height, 50, 100); // Taller perch
    }

    // Draw dragon
    context.drawImage(
        dragonImages[currentFrame],
        dragon.x,
        dragon.y,
        dragon.width,
        dragon.height
    );

    // Draw obstacles
    obstacles.forEach(obstacle => {
        context.fillStyle = 'green';
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw score
    context.font = "100px sans-serif";
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.textAlign = "center";
    context.fillText(score, canvas.width / 2, canvas.height / 2);
}

function update() {
    // Only update obstacles and dragon if the game has started
    if (gameStarted) {
        // Update dragon's position
        dragon.velocity += gravity; // Apply gravity
        dragon.y += dragon.velocity; // Update y position

        // Check for collision with ground
        if (dragon.y + dragon.height > canvas.height) {
            // Reset dragon to starting position
            dragon.x = dragonStartX;
            dragon.y = dragonStartY;
            dragon.velocity = 0;
            gameStarted = false; // Reset game state
            currentFrame = 0; // Reset animation frame
        }

        // Update obstacles
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= obstacleSpeed; // Move obstacle to the left

            // Check for collision with dragon
            if (
                dragon.x < obstacle.x + obstacle.width &&
                dragon.x + dragon.width > obstacle.x &&
                dragon.y < obstacle.y + obstacle.height &&
                dragon.y + dragon.height > obstacle.y
            ) {
                // Reset dragon to starting position
                dragon.x = dragonStartX;
                dragon.y = dragonStartY;
                dragon.velocity = 0;
                gameStarted = false; // Reset game state
                currentFrame = 0; // Reset animation frame
            }

            // Remove off-screen obstacles and create new ones
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                createObstacle(); // Function to create a new obstacle
            }
        });
    }

    draw(); // Draw the updated game state
}
    
// Event listener for player input
window.addEventListener('click', () => {
    gameStarted = true; // Start the game
    dragon.velocity = -5; // Reduced flap strength
});
window.addEventListener('touchstart', () => {
    gameStarted = true; // Start the game
    dragon.velocity = -5; // Reduced flap strength
});

// Game loop
setInterval(update, 1000 / 60);
