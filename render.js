import {
  canvas,
  context,
  dragon,
  perch,
  obstacles,
  lifeBar,
  tapToFly,
  screenFade,
  backgrounds,
  bgImage,
  fgImage,
  bgbgImage,
  perchImage
} from './init.js';

export function draw() {
  // Draw backgrounds
  context.drawImage(bgbgImage, backgrounds.bgbgX, 0, backgrounds.height * 4, backgrounds.height);
  context.drawImage(bgImage, backgrounds.bgX, 0, backgrounds.height * 4, backgrounds.height);
  context.drawImage(fgImage, backgrounds.fgX, 0, backgrounds.height * 4, backgrounds.height);

  // Draw perch
  context.drawImage(perchImage, perch.x, perchY, perchWidth, perchHeight);

  // Draw dragon
  if (!gameStarted) {
    context.drawImage(dragon.start, dragon.x, dragon.y, dragon.width, dragon.height);
  } else {
    if (isFlapping) {
      context.drawImage(dragon.image, dragon.x, dragon.y, dragon.width, dragon.height);
    } else {
      context.drawImage(dragon.drop, dragon.x, dragon.y, dragon.width, dragon.height);
    }
  }

  // Drawing obstacles using functions from obstacles.js
  obstacles.forEach(obstacle => {
    obstacle.draw(context);
  });

  // Draw the dragon with scaling and fading
  context.save();
  context.globalAlpha = dragon.alpha;
  context.translate(dragon.x + dragon.width / 2, dragon.y + dragon.height / 2);
  context.scale(dragon.scale, dragon.scale);
  context.translate(-(dragon.x + dragon.width / 2), -(dragon.y + dragon.height / 2));
  context.drawImage(dragon.image, dragon.x, dragon.y, dragon.width, dragon.height);  // Modified line
  context.restore();

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
