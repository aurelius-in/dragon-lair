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
    width: 50,
    height: 50,
    velocity: 0
};

const obstacles = [];
let gameTime = 0;
const levelDuration = 20000; // 20 seconds
let obstacleSpawnTime = 5000; // 5 seconds
let lastObstacleTime = Date.now();
let topObstacle = true; // To alternate between top and bottom obstacles

function draw() {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dragon (using individual images)
    context.drawImage(
        dragonImages[currentFrame], // Current image
        dragon.x, // Destination x
        dragon.y, // Destination y
        180, // Destination width (size of the dragon images)
        180 // Destination height (size of the dragon images)
    );

    // Draw obstacles (placeholder rectangles)
    const gap = 96; // Gap between top and bottom obstacles
    obstacles.forEach(obstacle => {
        context.fillStyle = 'green';
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        context.fillRect(obstacle.x, obstacle.y + obstacle.height + gap, obstacle.width, canvas.height - (obstacle.y + obstacle.height + gap));
    });

    // Draw score
    context.font = "100px sans-serif"; // Large sans-serif font
    context.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
    context.textAlign = "center"; // Center alignment
    context.fillText(score, canvas.width / 2, canvas.height / 2); // Draw score in the center
}


function update() {
    const now = Date.now();
    const deltaTime = now - lastObstacleTime;
    gameTime += deltaTime;

    // Update dragon's position
    dragon.velocity += 1; // Gravity
    dragon.y += dragon.velocity;

    // Animate dragon
    if (gameTime % 10 === 0) { // Change frame every 10 game ticks, or whatever interval you prefer
        currentFrame = (currentFrame + 1) % dragonImages.length;
    }

    // Update obstacles
    obstacles.forEach(obstacle => {
        obstacle.x -= 5; // Move obstacles to the left
    });

    // Generate new obstacles
    if (deltaTime >= obstacleSpawnTime) {
        const x = canvas.width;
        const gap = 96; // One-inch gap, assuming 96 DPI
        const y = topObstacle ? 0 : canvas.height / 2 + gap / 2;
        const height = canvas.height / 2 - gap / 2;
        obstacles.push({ x: x, y: y, width: 50, height: height }); // Single obstacle
        lastObstacleTime = now;
        obstacleSpawnTime -= obstacleSpawnTime * 0.07; // Decrease spawn interval by 7%
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
            level = 1; // Reset level
            obstacleSpawnTime = 5000; // Reset obstacle spawn time to 5 seconds
            lastObstacleTime = now; // Reset last obstacle time
            gameTime = 0; // Reset game time
        }
    });

    draw();
}

// Event listener for player input
window.addEventListener('click', () => {
    dragon.velocity = -10; // Flap
});
window.addEventListener('touchstart', () => {
    dragon.velocity = -10; // Flap
});

// Game loop
setInterval(update, 1000 / 60);
