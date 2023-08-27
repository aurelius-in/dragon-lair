// Canvas and context
export const canvas = document.getElementById('game');
export const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Images
export const perchImage = new Image(); perchImage.src = 'images/perch.png';
export const bgImage = new Image(); bgImage.src = 'images/bg.png';
export const fgImage = new Image(); fgImage.src = 'images/fg.png';
export const bgbgImage = new Image(); bgbgImage.src = 'images/bgbg.png';

// Perch
export const perch = { x: 50, update: function() {} };
export const perchY = canvas.height - 250;
export const perchWidth = 150;
export const perchHeight = 250;

// Dragon
export const dragon = {
  collided: false,
  alpha: 1,
  scale: 1,
  x: perch.x,
  y: perchY - 125,
  width: 150,
  height: 150,
  velocity: 0,
  image: new Image(),
  drop: new Image(),
  start: new Image(),
  update: function() {},
  frames: [
    'images/dragon3.png',
    'images/dragon4.png',
    'images/dragon5.png',
    'images/dragon1.png',
    'images/dragon2.png',
    'images/dragon3.png'
  ]
};
dragon.image.src = 'images/dragon3.png';
dragon.drop.src = 'images/dragon3.png';
dragon.start.src = 'images/dragon3.png';  // You can change this to a different image if you want

// Fading intro text
export const tapToFly = { alpha: 1 };

// End of game
export const frame = { current: 0 };
export const screenFade = { alpha: 0 };
export const bg = { width: canvas.height * 4 };

// Obstacles
export const obstacles = [];

// Background
export const backgrounds = {
  bgbgX: 0,
  bgX: 0,
  fgX: 0,
  height: canvas.height
};

// Life Bar
export const lifeBar = { segments: 10 };
