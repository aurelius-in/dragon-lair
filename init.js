window.addEventListener('load', function() {
  // Canvas and context
  const canvasElement = document.getElementById('game');
  if (!canvasElement) {
    console.error('Canvas element not found.');
    return;
  }
  export const canvas = canvasElement;
  export const context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Function to handle image loading
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  // Load images with error handling
  export const perchImage = await loadImage('images/perch.png').catch(console.error);
  export const bgImage = await loadImage('images/bg.png').catch(console.error);
  export const fgImage = await loadImage('images/fg.png').catch(console.error);
  export const bgbgImage = await loadImage('images/bgbg.png').catch(console.error);

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
    image: await loadImage('images/dragon3.png').catch(console.error),
    drop: await loadImage('images/dragon3.png').catch(console.error),
    start: await loadImage('images/dragon2.png').catch(console.error),
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
});
