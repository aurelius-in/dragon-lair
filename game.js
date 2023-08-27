const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

import { initializeGame } from './init.js';

initializeGame();

import { draw } from './render.js';
import * as init from './init.js';

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
  // Apply gravity to dragon's vertical velocity
  dragon.velocity += GRAVITY;

  // Update dragon's vertical position based on velocity
  dragon.y += dragon.velocity;

  // Collision detection with the ground
  if (dragon.y >= canvas.height - 50 - dragon.height) {
    dragon.y = canvas.height - 50 - dragon.height;
    dragon.velocity = 0;
  }

  // Collision detection with the top of the canvas
  if (dragon.y <= 0) {
    dragon.y = 0;
    dragon.velocity = 0;
  }

  // Reset velocity if dragon is flapping
  if (isFlapping) {
    dragon.velocity = -JUMP_STRENGTH;
    isFlapping = false;
  }
}

// Main game loop
function gameLoop() {
  // Clear the canvas for the new frame
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Handle flapping animation
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
  }

  // Update game state
  updateDragon();

  // Update obstacles
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 1; // Obstacle speed
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

  // Update perch
  perch.x -= 1; // Set the speed to match the obstacle speed

  // Create new obstacles
  if (Math.random() < 0.01) {
    createObstacle();
  }

  // Check for level end condition
  if (backgrounds.fgX + backgrounds.width <= canvas.width) {
    levelEnd();
  }

  // Render the game
  draw();

  // Request next animation frame
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
