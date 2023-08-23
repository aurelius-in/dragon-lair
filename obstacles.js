// Bat Swarms
function createBatSwarmObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2;
            this.y += Math.sin(this.x) * 5;
        },
        draw: function(context) {
            context.fillStyle = 'black';
            context.beginPath();
            context.arc(this.x, this.y, 15, 0, Math.PI * 2);
            context.fill();

            // Add gray dots to represent individual bats
            context.fillStyle = 'gray';
            for (let i = 0; i < 5; i++) {
                let dotX = this.x + Math.cos(i * 72) * 10;
                let dotY = this.y + Math.sin(i * 72) * 10;
                context.beginPath();
                context.arc(dotX, dotY, 2, 0, Math.PI * 2);
                context.fill();
            }
        }
    };
}


// Arrows
function createArrowObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2;
            this.y += 1;
        },
        draw: function(context) {
            context.fillStyle = 'brown';
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.x - 10, this.y + 20);
            context.lineTo(this.x + 10, this.y + 20);
            context.closePath();
            context.fill();
        }
    };
}

// Lightning Strikes
function createLightningStrikeObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.y += 5;
        },
        draw: function(context) {
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, 5, 30);
        }
    };
}

Sure thing, bro! Here's the rest of the obstacle functions for your rad game:

```javascript
// Tornadoes
function createTornadoObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2;
            this.y += Math.sin(this.x) * 2;
        },
        draw: function(context) {
            context.fillStyle = 'gray';
            context.beginPath();
            context.arc(this.x, this.y, 15, 0, Math.PI * 2);
            context.fill();
        }
    };
}

// Wraiths
function createWraithObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2;
            this.y += Math.sin(this.x) * 5;
        },
        draw: function(context) {
            context.fillStyle = 'purple';
            context.beginPath();
            context.arc(this.x, this.y, 15, 0, Math.PI * 2);
            context.fill();
        }
    };
}

// Zombie Ghost Dragons
function createZombieDragonObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 1;
        },
        draw: function(context) {
            context.fillStyle = 'green';
            context.fillRect(this.x, this.y, 30, 15);
        }
    };
}

// Thunderclouds
function createThundercloudObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            // Stationary
        },
        draw: function(context) {
            context.fillStyle = 'darkgray';
            context.beginPath();
            context.arc(this.x, this.y, 20, 0, Math.PI * 2);
            context.fill();
        }
    };
}

// Fireballs
function createFireballObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 3;
            this.y += Math.sin(this.x) * 2;
        },
        draw: function(context) {
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(this.x, this.y, 10, 0, Math.PI * 2);
            context.fill();
        }
    };
}

// Export the functions if you're using modules
export {
    createArrowObstacle,
    createLightningStrikeObstacle,
    createBatSwarmObstacle,
    createTornadoObstacle,
    createWraithObstacle,
    createZombieDragonObstacle,
    createThundercloudObstacle,
    createFireballObstacle
};
