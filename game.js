import { initializeGame } from './init.js';
import { draw } from './render.js';
import * as init from './init.js';
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

// Accessing variables from init.js
const canvas = init.getCanvas();
const context = init.getContext();
const dragon = init.getDragon();
const perch = init.getPerch();
const obstacles = init.getObstacles();
const lifeBar = init.getLifeBar();
const tapToFly = init.getTapToFly();
const screenFade = init.getScreenFade();
const backgrounds = init.getBackgrounds();

// Constants
const GRAVITY = 0.3;
const JUMP_STRENGTH = 8;
const FLAP_DURATION = 5;

// Variables
let gameStarted = false;
let isFlapping = false;
let flapCounter = 0;

initializeGame();

// Handle user input
function handleInput(event) {
  if (!gameStarted) {
    gameStarted = true;
  }
  dragon.velocity = -JUMP_STRENGTH;
  isFlapping = true;
  flapCounter = 0;
}

// Update dragon's position and state
function updateDragon() {
  dragon.velocity += GRAVITY;
  dragon.y += dragon.velocity;
  if (dragon.y >= canvas.height - 50 - dragon.height) {
    dragon.y = canvas.height - 50 - dragon.height;
    dragon.velocity = 0;
  }
  if (dragon.y <= 0) {
    dragon.y = 0;
    dragon.velocity = 0;
  }
  if (isFlapping) {
    dragon.velocity = -JUMP_STRENGTH;
    isFlapping = false;
  }
}
function createObstacle() {
  // Your obstacle-creating logic here
  console.log("Obstacle created");
}
function levelEnd() {
  // level-ending logic here
  console.log("Level ended");
}

// Main game loop
function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (isFlapping) {
    if (flapCounter % FLAP_DURATION === 0) {
      dragon.image.src = dragon.frames[flapCounter / FLAP_DURATION];
    }
    flapCounter++;
    if (flapCounter >= FLAP_DURATION * dragon.frames.length) {
      isFlapping = false;
      dragon.image.src = dragon.drop;
      flapCounter = 0;
    }
    if (Math.random() < 0.01) {
  obstacles.push(createArrowObstacle(500, 300));
}
  }
  updateDragon();
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 1;
    if (collisionDetected(dragon, obstacle)) {
      if (!dragon.collided) {
        lifeBar.segments--;
        if (lifeBar.segments <= 0) {
          resetGame();
        }
        obstacles.splice(index, 1);
        dragon.collided = true;
        setTimeout(() => {
          dragon.collided = false;
        }, 1000);
      }
    }
  });
  perch.x -= 1;
  if (Math.random() < 0.01) {
    createObstacle();
  }
  if (backgrounds.fgX + backgrounds.width <= canvas.width) {
    levelEnd();
  }
  draw();
  requestAnimationFrame(gameLoop);
}

// Event listeners
window.addEventListener('click', handleInput);
window.addEventListener('touchstart', handleInput, { passive: false });
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') handleInput(e);
});

// Initialize the game loop
window.addEventListener('load', function() {
  gameLoop();
});
