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
  context.drawImage(backgrounds.bgbgImage, backgrounds.bgbgX, 0, backgrounds.height * 4, backgrounds.height);
  context.drawImage(backgrounds.bgImage, backgrounds.bgX, 0, backgrounds.height * 4, backgrounds.height);
  context.drawImage(backgrounds.fgImage, backgrounds.fgX, 0, backgrounds.height * 4, backgrounds.height);

  // Draw perch
  context.drawImage(perch.image, perch.x, perch.y, perch.width, perch.height);

  // Draw dragon with scaling and fading
  context.save();
  context.globalAlpha = dragon.alpha;
  context.translate(dragon.x + dragon.width / 2, dragon.y + dragon.height / 2);
  context.scale(dragon.scale, dragon.scale);
  context.translate(-(dragon.x + dragon.width / 2), -(dragon.y + dragon.height / 2));

  if (!gameStarted) {
    context.drawImage(dragon.start, dragon.x, dragon.y, dragon.width, dragon.height);
  } else {
    if (isFlapping) {
      context.drawImage(dragon.image, dragon.x, dragon.y, dragon.width, dragon.height);
    } else {
      context.drawImage(dragon.drop, dragon.x, dragon.y, dragon.width, dragon.height);
    }
  }

  context.restore();

  // Draw obstacles
  obstacles.forEach(obstacle => {
    obstacle.draw(context);
  });

  // Draw the life bar
  for (let i = 0; i < lifeBar.segments; i++) {
    let color = 'green';
    if (lifeBar.segments <= 2) {
      color = 'red';
    }
    context.fillStyle = color;
    context.fillRect(10 + i * 35, 10, 35, 30);
  }

  // Draw the "TAP TO FLY!" text
  if (tapToFly.alpha > 0) {
    context.fillStyle = `rgba(255, 255, 255, ${tapToFly.alpha})`;
    context.font = '40px sans-serif';
    context.textAlign = 'center';
    context.fillText('TAP TO FLY!', canvas.width / 2, canvas.height / 2);
  }

  // Draw black fade overlay
  context.fillStyle = `rgba(0, 0, 0, ${screenFade.alpha})`;
  context.fillRect(0, 0, canvas.width, canvas.height);
}
