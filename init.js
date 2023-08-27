// Initialize canvas and context
let canvas;
let context;

// Initialize other game variables
let dragon;
let obstacles;
let perch;
let lifeBar;
let backgrounds;

export function initializeGame() {
  canvas = document.getElementById('game');
  context = canvas.getContext('2d');

  // Initialize dragon properties
  dragon = {
    x: 50,
    y: 200,
    velocity: 0,
    image: new Image(),
    frames: ['dragon1.png', 'dragon2.png'],
    drop: 'dragon_drop.png',
    collided: false
  };

  // Initialize obstacles
  obstacles = [];

  // Initialize perch
  perch = {
    x: 0,
    y: 0,
    image: new Image()
  };

  // Initialize life bar
  lifeBar = {
    segments: 3,
    image: new Image()
  };

  // Initialize backgrounds
  backgrounds = {
    fgX: 0,
    bgX: 0,
    width: 800,
    fgImage: new Image(),
    bgImage: new Image()
  };
}

// Getter functions to access variables
export function getCanvas() {
  return canvas;
}

export function getContext() {
  return context;
}

export function getDragon() {
  return dragon;
}

export function getObstacles() {
  return obstacles;
}

export function getPerch() {
  return perch;
}

export function getLifeBar() {
  return lifeBar;
}

export function getBackgrounds() {
  return backgrounds;
}
