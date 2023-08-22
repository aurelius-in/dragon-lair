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

function draw() {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw perch if the game hasn't started
    if (!gameStarted) {
        context.fillStyle = 'green';
        context.fillRect(dragon.x + dragon.width, dragon.y + dragon.height - 50, 50, 50); // Perch
    }

    // Animate dragon only if ascending (velocity is negative) and game started
    if (gameStarted && dragon.velocity < 0 && gameTime % 3 === 0) {
        currentFrame = (currentFrame + 1) % dragonImages.length;
    }

    // Draw dragon without rotation
    context.drawImage(
        dragonImages[currentFrame],
        dragon.x,
        dragon.y,
        180,
        180
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
    const now = Date.now();
    const deltaTime = now - lastObstacleTime;
    gameTime += deltaTime;

    // Update dragon's position
    dragon.velocity += 0.3; // Reduced gravity
    dragon.y += dragon.velocity * 0.4; // Slowed down the dragon

    // Update obstacles
    obstacles.forEach(obstacle => {
        obstacle.x -= 5; // Move obstacles to the left
    });

    // Generate new obstacles
    if (deltaTime >= obstacleSpawnTime) {
        const x = canvas.width;
        const gap = 96; // One-inch gap, assuming 96 DPI
        const y = topObstacle ? 0 : canvas.height / 2 + gap / 2;
        const height = canvas.height / 2 - gap / 2; // Extend to 1 inch from the center
        obstacles.push({ x: x, y: y, width: 50, height: height }); // Single obstacle
        lastObstacleTime = now;
        obstacleSpawnTime -= obstacleSpawnTime * 0.05; // Decrease spawn interval by 5%
        topObstacle = !topObstacle; // Alternate between top and bottom obstacles.
        score++;
    }

    // Check collisions
    obstacles.forEach(obstacle => {
        if (
            dragon.x < obstacle.x + obstacle.width &&
            dragon.x + dragon.width > obstacle.x &&
            dragon.y < obstacle.y + obstacle.height &&
            dragon.y + dragon.height > obstacle.y
        ) {
            // Collision detected
            console.log('Game Over, Bro!');
            obstacles.length = 0; // Clear obstacles
            dragon.y = canvas.height * 0.5; // Reset dragon position
            dragon.velocity = 0; // Reset dragon velocity
            obstacleSpawnTime = 5000; // Reset obstacle spawn time to 5 seconds
            lastObstacleTime = now; // Reset last obstacle time
            gameTime = 0; // Reset game time
        }
    });
    }
    draw();
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
