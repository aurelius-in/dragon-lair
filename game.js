const canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');

const dragon = {
    x: canvas.width * 0.1,
    y: canvas.height * 0.5,
    width: 50,
    height: 50,
    velocity: 0
};

const obstacles = [];
let level = 1;
let obstacleSpawnTime = 3000; // 3 seconds
let lastObstacleTime = 0;
let gameTime = 0;
const levelDuration = 20000; // 20 seconds

function draw() {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dragon (placeholder rectangle)
    context.fillStyle = 'red';
    context.fillRect(dragon.x, dragon.y, dragon.width, dragon.height);

    // Draw obstacles (placeholder rectangles)
    obstacles.forEach(obstacle => {
        context.fillStyle = 'green';
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        context.fillRect(obstacle.x, obstacle.y + obstacle.gap + obstacle.height, obstacle.width, canvas.height - (obstacle.y + obstacle.gap + obstacle.height));
    });
}

function update() {
    const now = Date.now();
    const deltaTime = now - lastObstacleTime;
    gameTime += deltaTime;

    // Update dragon's position
    dragon.velocity += 1; // Gravity
    dragon.y += dragon.velocity;

    // Update obstacles
    obstacles.forEach(obstacle => {
        obstacle.x -= 5; // Move obstacles to the left
    });

    // Generate new obstacles
    if (deltaTime >= obstacleSpawnTime) {
        const width = 50; // Obstacle width
        const direction = Math.random() < 0.5 ? 'top' : 'bottom'; // Random direction
        const x = canvas.width;
        const y = direction === 'top' ? 0 : canvas.height - 200; // Top or bottom of the screen

        obstacles.push({ x: x, y: y, width: width, height: 200, direction: direction }); // Single obstacle

        // Randomize spawn time between 5 and 7 seconds
        obstacleSpawnTime = (Math.random() * 2 + 5) * 1000;
        lastObstacleTime = now;
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
            obstacleSpawnTime = (Math.random() * 2 + 5) * 1000; // Reset obstacle spawn time
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
