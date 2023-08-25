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
export const perch = { x: 50 };
export const perchY = canvas.height - 250;
export const perchWidth = 150;
export const perchHeight = 250;

// Dragon
export const dragon = {collided: false, alpha: 1, scale: 1, x: perch.x, y: perchY - 125, width: 150, height: 150, velocity: 0, update: function() {}};
export const dragonImages = [];
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= (i === 1 ? 4 : 3); j++) {
        const char = String.fromCharCode(96 + j);
        const image = new Image();
        image.src = `images/dragon${i}${char}.png`;
        dragonImages.push(image);
    }
}

// Fading intro text
export const tapToFly = { alpha: 1 };

// End of game
export const frame = {current: 0}; // Corrected export
export const screenFade = { alpha: 0};
export const bg = {width: canvas.height * 4};

// Obstacles
export const obstacles = [];

//Background 
export const backgrounds = {
    bgbgX: 0,
    bgX: 0,
    fgX: 0
};

// Life Bar
export const lifeBar = { segments: 10 };
