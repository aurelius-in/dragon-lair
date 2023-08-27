import * as init from './init.js';

// Declare gameStarted and isFlapping if they are not imported
let gameStarted = false;
let isFlapping = false;
let imagesLoaded = false;

// Function to ensure all images are loaded
async function ensureImagesLoaded() {
  const images = [
    'images/perch.png',
    'images/bg.png',
    'images/fg.png',
    'images/bgbg.png'
  ];
  for (const src of images) {
    await init.loadImage(src).catch(console.error);
  }
  imagesLoaded = true;
}

// Call the function before drawing
ensureImagesLoaded().catch(console.error);

export function draw() {
  const canvas = init.getCanvas();
  const context = init.getContext();
  const dragon = init.getDragon();
  const perch = init.getPerch();
  const obstacles = init.getObstacles();
  const lifeBar = init.getLifeBar();
  const tapToFly = init.getTapToFly();
  const screenFade = init.getScreenFade();
  const backgrounds = init.getBackgrounds();

  if (!imagesLoaded) return;

  // Draw backgrounds
  context.drawImage(backgrounds.bgbgImage, backgrounds.bgbgX, 0);
  context.drawImage(backgrounds.bgImage, backgrounds.bgX, 0);
  context.drawImage(backgrounds.fgImage, backgrounds.fgX, canvas.height - 50);

  // Draw perch
  context.drawImage(perch.image, perch.x, perch.y);

  // Draw dragon
  context.drawImage(dragon.image, dragon.x, dragon.y);

  // Draw obstacles
  obstacles.forEach(obstacle => {
    context.drawImage(obstacle.image, obstacle.x, obstacle.y);
  });

  // Draw life bar
  for (let i = 0; i < lifeBar.segments; i++) {
    context.drawImage(lifeBar.image, 10 + i * 20, 10);
  }

  // Draw "TAP TO FLY!" text
  if (tapToFly.alpha > 0) {
    context.fillStyle = `rgba(255, 255, 255, ${tapToFly.alpha})`;
    context.font = '40px Arial';
    context.fillText('TAP TO FLY!', canvas.width / 2, canvas.height / 2);
  }

  // Draw screen fade
  context.fillStyle = `rgba(0, 0, 0, ${screenFade.alpha})`;
  context.fillRect(0, 0, canvas.width, canvas.height);
}
