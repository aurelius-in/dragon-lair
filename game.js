import {
    bg, canvas, context, perchY, perchWidth, perchHeight, screenFade,
    dragon, dragonImages, perch, obstacles, lifeBar, tapToFly, backgrounds, frame
} from './init.js';
import { draw } from './render.js';
import {
    createArrowObstacle, createLightningStrikeObstacle, createBatSwarmObstacle, createTornadoObstacle,
    createWraithObstacle, createZombieDragonObstacle, createThundercloudObstacle, createFireballObstacle
} from './obstacles.js';

let framesPerFlap = 100, gameLoopCounter = 0, gameStarted = false, jump = 8;

function handleInput() {
    if (!gameStarted) {
        gameStarted = true;
    }
    dragon.velocity = jump;
    dragon.y += dragon.velocity;
    frame.current = (frame.current + 1) % dragonImages.length;
    framesPerFlap = Math.floor(Math.random() * 11) + 2;
}
window.addEventListener('click', handleInput);
window.addEventListener('touchstart', handleInput);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') 
        handleInput();
});

function resetGame() {
    obstacles.length = 0;
    perch.x = 50;
    dragon.x = dragonStartX;
    dragon.y = dragonStartY;
    dragon.velocity = 0;
    gameStarted = false;
    frame.current = 0; // Fixed this line
    backgrounds.bgX = 0;
    backgrounds.fgX = 0;
    backgrounds.bgbgX = 0;
    obstacleSpawnTime = 4000;
    endGameTime = 0;
    dragon.scale = 1;
    dragon.alpha = 1;
    screenFade.alpha = 0;
    bg.width = canvas.height * 4;
}

// ... rest of the code ...

function gameLoop() {
    update();
    draw();
    // Removed the incorrect call to collisionDetected

    if (tapToFly.alpha > 0) {
        tapToFly.alpha -= 0.01;
    }

    gameLoopCounter++;

    if (gameStarted) {
        if (gameLoopCounter % framesPerFlap === 0) { // Fixed this line
            frame.current = (frame.current + 1) % dragonImages.length;
        }
    } else {
        if (gameLoopCounter % framesPerFlap === 0) { // Fixed this line
            frame.current = (frame.current + 1) % dragonImages.length;
        }
    }
    requestAnimationFrame(gameLoop);
}
   
gameLoop();
window.onload = () => {
    setTimeout(() => {
        tapToFly.alpha = 0;
    }, 2000);

    setTimeout(() => {
        dragon.velocity = jump;
        dragon.y += dragon.velocity;
    }, 2100);

    setTimeout(() => {
        dragon.velocity = jump;
        dragon.y += dragon.velocity;
        gameStarted = true;
    }, 2300);
};

