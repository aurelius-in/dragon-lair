import {
  bg,
  backgrounds,
  dragonImages,
  frame,
  obstacles,
  canvas,
  context,
  bgbgImage,
  bgImage,
  fgImage,
  perchImage,
  perchY,
  perchWidth,
  perchHeight,
  dragon,
  tapToFly,
  perch,
  lifeBar,
  screenFade
} from './init.js';

// Draw objects
export function draw() {
    // Draw the furthest back background (bgbg)
    context.drawImage(bgbgImage, backgrounds.bgbgX, 0, bg.width, canvas.height);
    context.drawImage(bgbgImage, backgrounds.bgbgX + bg.width, 0, bg.width, canvas.height);

    // Draw the middle background (bg)
    context.drawImage(bgImage, backgrounds.bgX, 0, bg.width, canvas.height);
    context.drawImage(bgImage, backgrounds.bgX + bg.width, 0, bg.width, canvas.height);

    // Draw the closest background (fg)
    context.drawImage(fgImage, backgrounds.fgX, 0, bg.width, canvas.height);
    context.drawImage(fgImage, backgrounds.fgX + bg.width, 0, bg.width, canvas.height);
    // Draw perch
    context.drawImage(perchImage, perch.x, perchY, perchWidth, perchHeight);

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
    context.drawImage(dragonImages[frame.current], dragon.x, dragon.y, dragon.width, dragon.height);
    context.restore();

   // Draw the life bar
    for (let i = 0; i < lifeBar.segments; i++) {
        const color = lifeBar.segments <= 2 ? 'red' : 'green';
        context.fillStyle = color;
        context.fillRect(10 + i * 35, 10, 35, 30); // Draw from left
    }
  // Draw the "TAP TO FLY!" text
if (tapToFly.alpha > 0) {
    context.fillStyle = `rgba(255, 255, 255, ${tapToFly.alpha})`; // White text with alpha for fading
    context.font = '40px sans-serif';
    context.textAlign = 'center';
    context.fillText('TAP TO FLY!', canvas.width / 2, canvas.height / 2);
}

    // Draw black fade overlay
    context.fillStyle = `rgba(0, 0, 0, ${screenFade.alpha})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
}
