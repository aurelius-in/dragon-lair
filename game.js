import { bg, canvas, context, perchY, perchWidth, perchHeight, screenFade, dragon, dragonImages, perch, obstacles, lifeBar, tapToFly, backgrounds, frame } from './init.js';
import { draw } from './render.js';
import { createArrowObstacle, createLightningStrikeObstacle, createBatSwarmObstacle, createTornadoObstacle, createWraithObstacle, createZombieDragonObstacle, createThundercloudObstacle, createFireballObstacle } from './obstacles.js';

let obstacleSpawnTime = 4000, topObstacle = false, obstacleY, spawnRate = 5, spawnTimer = 0, gameLoopCounter = 0, gameStarted = false, jump = 8, isFlapping = false, framesPerFlap = 4, frameOrder = [2, 3, 4, 0, 1], frameIndex = 0, jumpLock = false, flapCounter = 0;

function handleInput() {
    if (jumpLock) return;
    jumpLock = true;
    setTimeout(() => jumpLock = false, 200);
    if (!gameStarted) {
        gameStarted = true;
    }
    if (event && event.type === 'touchstart') {
        event.preventDefault();
    }
    dragon.velocity = -jump;
    dragon.y += dragon.velocity;

    // Reset the flapCounter to 0
    flapCounter = 0;

    // Hardcoded image sequence
    frame.current = "images/dragon4.png";
    setTimeout(() => frame.current = "images/dragon5.png", 150);
    setTimeout(() => frame.current = "images/dragon1.png", 300);
    setTimeout(() => frame.current = "images/dragon2.png", 450);
    setTimeout(() => {
        frame.current = "images/dragon3.png";
        isFlapping = false;
    }, 600);
}

function resetGame() { obstacles.length = 0; perch.x = 50; dragon.x = dragonStartX; dragon.y = dragonStartY; dragon.velocity = 0; gameStarted = false; frame.current = 0; backgrounds.bgX = 0; backgrounds.fgX = 0; backgrounds.bgbgX = 0; obstacleSpawnTime = 4000; endGameTime = 0; dragon.scale = 1; dragon.alpha = 1; screenFade.alpha = 0; bg.width = canvas.height * 4; }

function createObstacle() { const obstacleType = ['arrow', 'lightningStrike', 'batSwarm', 'tornado', 'wraith', 'zombieDragon', 'thundercloud', 'fireball']; const randomType = obstacleType[Math.floor(Math.random() * obstacleType.length)]; const minDistance = canvas.height * 0.1, centerDistance = canvas.height * 0.5; if (topObstacle) { obstacleY = Math.random() * (centerDistance - minDistance) + minDistance; } else { obstacleY = Math.random() * (centerDistance - minDistance) + centerDistance; } let obstacle; switch (randomType) { case 'arrow': obstacle = createArrowObstacle(canvas.width, obstacleY); break; case 'lightningStrike': obstacle = createLightningStrikeObstacle(canvas.width, obstacleY); break; case 'batSwarm': obstacle = createBatSwarmObstacle(canvas.width, obstacleY); break; case 'tornado': obstacle = createTornadoObstacle(canvas.width, obstacleY); break; case 'wraith': obstacle = createWraithObstacle(canvas.width, obstacleY); break; case 'zombieDragon': obstacle = createZombieDragonObstacle(canvas.width, obstacleY); break; case 'thundercloud': obstacle = createThundercloudObstacle(canvas.width, obstacleY); break; case 'fireball': obstacle = createFireballObstacle(canvas.width, obstacleY); break; } obstacles.push(obstacle); topObstacle = !topObstacle; obstacleSpawnTime *= 0.999; }

function collisionDetected(dragon, obstacle) {
    const brX = dragon.width * 0.05, brY = dragon.height * 0.1;
    const dca = { x: dragon.x + brX, y: dragon.y + brY, width: dragon.width - 2 * brX, height: dragon.height - 2 * brY };
    const oca = { x: obstacle.x, y: obstacle.y, width: obstacle.width, height: obstacle.height };

    return (
        dca.x < oca.x + oca.width && dca.x + dca.width > oca.x && dca.y < oca.y + oca.height &&  dca.y + dca.height > oca.y
    );
}

let gravity = 0.3;

// Gravity constant
let flapSequence = ["images/dragon4.png", "images/dragon5.png", "images/dragon1.png", "images/dragon2.png", "images/dragon3.png"];
let flapSequenceIndex = 0;
let flapStartTime = 0;

function update() {
    if (isFlapping) {
        if (gameLoopCounter - flapStartTime >= 9 * flapSequenceIndex) { // 9 frames for each image
            frame.current = flapSequence[flapSequenceIndex];
            flapSequenceIndex++;
        }
        if (flapSequenceIndex >= flapSequence.length) {
            isFlapping = false;
            flapSequenceIndex = 0;
            frame.current = "images/dragon3.png";
        }
    }
        if (gameStarted) { // Apply gravity to dragon
            dragon.velocity += gravity;
            dragon.y += dragon.velocity;

            // Update dragon
            dragon.update();

            // Update backgrounds to make the dragon appear to move forward
            backgrounds.fgX -= 0.2; // slow
            backgrounds.bgX -= 0.1; // slower
            backgrounds.bgbgX -= 0.05; // slowest


            // Update obstacles
            obstacles.forEach((obstacle, index) => {
                obstacle.x -= 1; // Obstacle speed
                obstacle.update();

                if (collisionDetected(dragon, obstacle)) {
                    if (!dragon.collided) {
                        lifeBar.segments --;
                        if (lifeBar.segments<= 0) {
                        resetGame();
                    }
                    obstacles.splice(index, 1);
                    dragon.collided = true;

                    setTimeout(() => {
                            dragon.collided = false;
                        }, 1000) 
                        
                    }
                }
            });

            // Update perch
            perch.x -= 1; // Set the speed to match the obstacle speed
            perch.update();


            // Create new obstacles
            if (gameLoopCounter % 100 === 0) { // Every 100 frames
                createObstacle();
            }
        }
    }

    if (backgrounds.fgX + bg.width<= canvas.width) {
    levelEnd();
}
    // Check for level end condition
        if (backgrounds.fgX + bg.width <= canvas.width) {
            levelEnd();
        }
    
}

// Level end animation
function levelEnd() {
    let startTime = Date.now();
    let duration = 5000; // 5 seconds
    let initialScale = dragon.scale;
    let initialAlpha = dragon.alpha;
    let initialX = dragon.x;

    function animateEnd() {
        let currentTime = Date.now();
        let elapsedTime = currentTime - startTime;
        let progress = elapsedTime / duration;

        if (progress < 1) {
            dragon.scale = initialScale - (initialScale - 0.1) * progress;
            dragon.alpha = initialAlpha - (initialAlpha - 0.5) * progress;
            dragon.x = initialX + (canvas.width / 2 - initialX) * progress;
            requestAnimationFrame(animateEnd);
        } else {
            screenFade.alpha = 1;
            setTimeout(resetGame, 2000);
        }
    }
    animateEnd();
}

if (!gameStarted) {
    framesPerFlap = 90;

    if (gameLoopCounter % 30 === 0 && framesPerFlap < 40) {
        framesPerFlap += 2;
    }
}


function gameLoop() {
    update();
    draw();
    // Removed the incorrect call to collisionDetected

    if (tapToFly.alpha > 0) {
        tapToFly.alpha -= 0.01;
    }

   gameLoopCounter++;

    if (gameStarted) {
        if (gameLoopCounter % framesPerFlap === 0) {
            frame.current = (frame.current + 1) % dragonImages.length;
        }
    } else {
        if (gameLoopCounter % framesPerFlap === 0) {
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
    }, 2300) 
    
};

// Lock screen orientation to landscape
screen.orientation.lock('landscape');

// Hide the URL bar
window.scrollTo(0, 1);

// Add these lines at the end of your game.js file
window.addEventListener('click', handleInput);
window.addEventListener('touchstart', handleInput, { passive: false });
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleInput();
});
