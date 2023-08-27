// Initialize canvas and context
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// Initialize dragon properties
const dragon = {
  x: 50,
  y: canvas.height / 2,
  width: 50,
  height: 50,
  velocity: 0,
  image: new Image(),
  frames: ['frame1.png', 'frame2.png'],
  alpha: 1,
  scale: 1,
  collided: false
};

// Initialize perch properties
const perch = {
  x: 200,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  image: new Image()
};

// Initialize obstacles
const obstacles = [];

// Initialize life bar
const lifeBar = {
  segments: 3,
  image: new Image()
};

// Initialize tap to fly text
const tapToFly = {
  alpha: 1
};

// Initialize screen fade
const screenFade = {
  alpha: 0
};

// Initialize backgrounds
const backgrounds = {
  bgImage: new Image(),
  fgImage: new Image(),
  bgbgImage: new Image(),
  bgX: 0,
  fgX: 0,
  bgbgX: 0,
  width: 0,
  height: 0
};

// Function to load an image
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Initialize the game
export function initializeGame() {
  // Load images, set initial positions, etc.
}

// Getters for other modules to access these variables
export function getCanvas() {
  return canvas;
}

export function getContext() {
  return context;
}

export function getDragon() {
  return dragon;
}

export function getPerch() {
  return perch;
}

export function getObstacles() {
  return obstacles;
}

export function getLifeBar() {
  return lifeBar;
}

export function getTapToFly() {
  return tapToFly;
}

export function getScreenFade() {
  return screenFade;
}

export function getBackgrounds() {
  return backgrounds;
}
