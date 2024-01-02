let ctx, canvasHeight, canvasWidth;
canvasHeight = 600;
canvasWidth = 800;
const fps = 120;
const interval = 1000 / fps;
let sprites = [];
let bullets = []; // Array to store bullets
let points = 0;
let gameRunning = false;

document.addEventListener('DOMContentLoaded', () => {
    // Check if there are points in session storage
    if (sessionStorage.getItem('points')) {
        document.getElementById('scored').style.display = 'block'; // Show the points container
        // Display the points on the page
        document.getElementById('points').innerHTML = sessionStorage.getItem('points');
    }
    sessionStorage.clear();
});

document.getElementById('startButton').addEventListener('click', () => {
    if (!gameRunning) {
        sessionStorage.clear();
        const startMenu = document.getElementById('startMenu');
        const game = document.getElementById('game');
        gameRunning = true; // Update game status


        // Add fade-out animation class to startMenu
        startMenu.classList.add('fade-out');

        // Hide the button after the animation completes
        setTimeout(() => {
            game.style.display = 'block'; // Show the game container
            startMenu.style.display = 'none';

            init(); // Start the game
        }, 200); // Change this value to match the transition duration
    }
});

let rocket; // Declaring the rocket variable

function start() {
    let volgende;

    (function gameloop(timestamp) {
        if (volgende == undefined) {
            volgende = timestamp;
        }

        const verschil = timestamp - volgende;
        if (verschil > interval) {
            volgende = timestamp - (verschil % interval);
            update();
            draw();
        }
        requestAnimationFrame(gameloop);
    })();
}

function init() {
    const canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    createSprites();
    start();
}

    // Event listener for keydown (spacebar)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        shootBullet();
    }
});
    // Event listener for mouse click
document.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        // 0 represents the left mouse button
        shootBullet();
    }
});

// Inside the createSprites function
function createSprites() {
    rocket = new Sprite(10, 500, 5, 0, 50, 50, 'image/rocket.png');
    sprites.push(rocket);

    for (let i = 0; i < 10; i++) {
        const posX = Math.random() * canvasWidth;
        const posY = -50 - Math.random() * 200;
        const speedX = 0;
        const speedY = 0.1 + Math.random() * 1; // Ensure consistent initial speed here
        const width = 50;
        const height = 50;
        const url = 'image/meteor.png';

        const sprite = new RotatingSprite(posX, posY, speedX, speedY, width, height, url);
        sprites.push(sprite);
    }
}
let keys = {};

function handleKeyDown(event) {
    keys[event.key] = true;
}

function handleKeyUp(event) {
    keys[event.key] = false;
}

function update() {
    let horizontalSpeed = 0;
    let verticalSpeed = 0;

    if (keys['ArrowLeft'] || keys['a']) {
        horizontalSpeed = -2;
    } else if (keys['ArrowRight'] || keys['d']) {
        horizontalSpeed = 2;
    }

    if (keys['ArrowUp'] || keys['w']) {
        verticalSpeed = -2;
    } else if (keys['ArrowDown'] || keys['s']) {
        verticalSpeed = 2;
    }

    // Update bullet positions
    for (const bullet of bullets) {
        bullet.update();
    }

    // Remove bullets that are off-screen
    bullets.forEach((bullet, index) => {
        if (bullet.Y + bullet.height < 0) {
            bullets.splice(index, 1);
        }
    });

    // Check for collisions between bullets and meteors
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = sprites.length - 1; j >= 0; j--) {
            const sprite = sprites[j];
            if (!sprite.destroyed && sprite !== rocket && checkCollision(bullet, sprite)) {
                points += 100; // Add points for destroying a meteor
                document.getElementById('score').innerHTML = points + " Points"; // Update points on the page
                bullets.splice(i, 1); // Remove bullet
                sprite.destroyed = true; // Mark meteor as destroyed
                break; // Exit inner loop after destroying one meteor
            }
        }
    }

    sprites = sprites.filter(sprite => !sprite.destroyed);

    // Check the count of meteors and respawn if it falls below a certain threshold
    const activeMeteors = sprites.filter(sprite => sprite !== rocket && !sprite.destroyed).length;
    const meteorThreshold = 10;

    if (activeMeteors < meteorThreshold) {
        const newMeteorsCount = meteorThreshold - activeMeteors;
        for (let i = 0; i < newMeteorsCount; i++) {
            const posX = Math.random() * canvasWidth;
            const posY = -50 - Math.random() * 200;
            const speedX = 0;
            const speedY = 0.1 + Math.random() * 1;
            const width = 50;
            const height = 50;
            const url = 'image/meteor.png';

            const sprite = new RotatingSprite(posX, posY, speedX, speedY, width, height, url);
            sprites.push(sprite);
        }
    }
    // Update rocket's speed
    rocket.speedX = horizontalSpeed;
    rocket.speedY = verticalSpeed;

    // Update rocket's position while keeping it within the canvas bounds
    rocket.X += rocket.speedX;
    rocket.Y += rocket.speedY;

    // Constrain rocket within the canvas
    rocket.X = Math.max(0, Math.min(rocket.X, canvasWidth - rocket.width));
    rocket.Y = Math.max(0, Math.min(rocket.Y, canvasHeight - rocket.height));

    // Update other sprites
    for (const sprite of sprites) {
        sprite.update();
        if (sprite !== rocket && sprite.Y > canvasHeight) {
            sprite.Y = -50;
            sprite.X = Math.random() * canvasWidth;
        }
    }

    for (const sprite of sprites) {
        if (sprite !== rocket && !sprite.destroyed && checkCollision(rocket, sprite)) {
            resetGame();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (const sprite of sprites) {
        sprite.draw();
    }

    for (const bullet of bullets) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(bullet.X, bullet.Y, bullet.width, bullet.height);
    }
}

// Function to check collision between two sprites
function checkCollision(sprite1, sprite2) {
    return (
        sprite1.X < sprite2.X + sprite2.width &&
        sprite1.X + sprite1.width > sprite2.X &&
        sprite1.Y < sprite2.Y + sprite2.height &&
        sprite1.Y + sprite1.height > sprite2.Y
    );
}
function shootBullet() {
    const bulletSpeed = 5;
    const bulletWidth = 5;
    const bulletHeight = 15;
    const bulletX = rocket.X + rocket.width / 2 - bulletWidth / 2;
    const bulletY = rocket.Y - bulletHeight;
    const bullet = new Bullet(bulletX, bulletY, 0, -bulletSpeed, bulletWidth, bulletHeight, 'blue');
    bullets.push(bullet);
}

// Inside the resetGame function
function resetGame() {
    gameRunning = false; // Update game status
    // Save points to session storage
    sessionStorage.setItem('points', points)
    
    setTimeout(() => {
    // Reload the page
    location.reload();
}, 200); // Change this value to match the transition duration


}
