const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const dragon = {
    x: 100,
    y: 300,
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
        obstacles.push({ x: canvas.width, y: canvas.height - height, width: 50, height: height });
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
            // TODO: Handle game over or restart level
        }
    });

    draw();
}

// Event listener for player input
window.addEventListener('click', () => {
    dragon.velocity = -10; // Flap
});

// Game loop
setInterval(update, 1000 / 60);
