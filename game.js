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
    // Update dragon's position
    dragon.velocity += 1; // Gravity
    dragon.y += dragon.velocity;

    // Update obstacles
    obstacles.forEach(obstacle => {
        obstacle.x -= 5; // Move obstacles to the left
    });

    // Generate new obstacles
    if (obstacles.length < level) {
        const height = Math.random() * 200 + 100; // Random height
        const gap = 200; // Gap between top and bottom obstacles
        obstacles.push({ x: canvas.width, y: 0, width: 50, height: height, gap: gap });
    }

    // Check collisions
    obstacles.forEach(obstacle => {
        if (
            (dragon.x < obstacle.x + obstacle.width && dragon.x + dragon.width > obstacle.x) &&
            ((dragon.y < obstacle.y + obstacle.height && dragon.y + dragon.height > obstacle.y) ||
            (dragon.y < obstacle.y + obstacle.gap + obstacle.height * 2 && dragon.y + dragon.height > obstacle.y + obstacle.gap + obstacle.height))
        ) {
            // Collision detected
            console.log('Game Over, Bro!');
            obstacles.length = 0; // Clear obstacles
            dragon.y = canvas.height * 0.5; // Reset dragon position
            dragon.velocity = 0; // Reset dragon velocity
            level = 1; // Reset level
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
