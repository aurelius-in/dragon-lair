// Internal variables
let _canvas;
let _context;
let _dragon = {
  collided: false,
  alpha: 1,
  scale: 1,
  x: 50, // Placeholder, will be updated
  y: 50, // Placeholder, will be updated
  width: 150,
  height: 150,
  velocity: 0,
  image: null, // Placeholder, will be updated
  drop: null,  // Placeholder, will be updated
  start: null, // Placeholder, will be updated
  frames: [
    'images/dragon3.png',
    'images/dragon4.png',
    'images/dragon5.png',
    'images/dragon1.png',
    'images/dragon2.png',
    'images/dragon3.png'
  ]
};
let _perch = {
  x: 50,
  y: 50, // Placeholder, will be updated
  width: 150,
  height: 250
};
let _perchY = 0; // Placeholder, will be updated
let _tapToFly = { alpha: 1 };
let _frame = { current: 0 };
let _screenFade = { alpha: 0 };
let _backgrounds = {
  bgbgX: 0,
  bgX: 0,
  fgX: 0,
  height: 0 // Placeholder, will be updated
};
let _lifeBar = { segments: 10 };
let _obstacles = [];

// Export getter functions
export function getCanvas() { return _canvas; }
export function getContext() { return _context; }
export function getDragon() { return _dragon; }
export function getPerch() { return _perch; }
export function getPerchY() { return _perchY; }
export function getTapToFly() { return _tapToFly; }
export function getFrame() { return _frame; }
export function getScreenFade() { return _screenFade; }
export function getBackgrounds() { return _backgrounds; }
export function getLifeBar() { return _lifeBar; }
export function getObstacles() { return _obstacles; }

// Function to load images
export async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

// Initialize everything once the window is loaded
window.addEventListener('load', async function() {
  const canvasElement = document.getElementById('game');
  if (!canvasElement) {
    console.error('Canvas element not found.');
    return;
  }
  _canvas = canvasElement;
  _context = _canvas.getContext('2d');
  _canvas.width = window.innerWidth;
  _canvas.height = window.innerHeight;

  _dragon.image = await loadImage('images/dragon3.png').catch(console.error);
  _dragon.drop = await loadImage('images/dragon3.png').catch(console.error);
  _dragon.start = await loadImage('images/dragon2.png').catch(console.error);
  _perchY = _canvas.height - 250;
  _backgrounds.height = _canvas.height;
});
