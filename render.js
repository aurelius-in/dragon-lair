import {
  bgbgX,
  bgX,
  fgX,
  dragonImages,
  currentFrame,
  obstacles,
  canvas,
  context,
  bgbgImage,
  bgImage,
  fgImage,
  perchImage,
  perchX,
  perchY,
  perchWidth,
  perchHeight,
  dragon,
  dragonAlpha,
  dragonScale,
  life,
  tapToFlyAlpha,
  screenFadeAlpha
} from './init.js';

// Draw objects
export function draw() {
    // Draw the furthest back background (bgbg)
    context.drawImage(bgbgImage, bgbgX, 0, imageWidth, canvas.height);
    context.drawImage(bgbgImage, bgbgX + imageWidth, 0, imageWidth, canvas.height);

    // Draw the middle background (bg)
    context.drawImage(bgImage, bgX, 0, imageWidth, canvas.height);
    context.drawImage(bgImage, bgX + imageWidth, 0, imageWidth, canvas.height);

    // Draw the closest background (fg)
    context.drawImage(fgImage, fgX, 0, imageWidth, canvas.height);
    context.drawImage(fgImage, fgX + imageWidth, 0, imageWidth, canvas.height);

    // Draw perch
    context.drawImage(perchImage, perchX, perchY, perchWidth, perchHeight);

    // Drawing obstacles using functions from obstacles.js
    obstacles.forEach(obstacle => {
        obstacle.draw(context);
    });

    // Draw the dragon with scaling and fading
    context.save();
    context.globalAlpha = dragonAlpha;
    context.translate(dragon.x + dragon.width / 2, dragon.y + dragon.height / 2);
    context.scale(dragonScale, dragonScale);
    context.translate(-(dragon.x + dragon.width / 2), -(dragon.y + dragon.height / 2));
    context.drawImage(dragonImages[currentFrame], dragon.x, dragon.y, dragon.width, dragon.height);
    context.restore();

    // Draw the life bar border
    context.fillStyle = '#708090';
    context.fillRect(10, 10, 400, 15);

    // Determine the fill color based on life
    let fillColor = life <= 20 ? 'red' : 'green';

    // Draw the life bar fill
    context.fillStyle = fillColor;
    context.fillRect(12, 12, (life / 100) * 396, 11);

    // Draw the "TAP TO FLY!" text
    if (tapToFlyAlpha > 0) {
        context.fillStyle = `rgba(255, 255, 255, ${tapToFlyAlpha})`;
        context.font = '40px sans-serif';
        context.textAlign = 'center';
        context.fillText('TAP TO FLY!', canvas.width / 2, canvas.height / 2);
    }

    // Draw black fade overlay
    context.fillStyle = `rgba(0, 0, 0, ${screenFadeAlpha})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
}
