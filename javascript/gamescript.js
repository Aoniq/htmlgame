let ctx, canvasHeight, canvasWidth;
canvasHeight = 600;
canvasWidth = 800;
const fps = 120;
const interval = 1000 / fps;
const sprites = [];

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
        console.log(timestamp);
        requestAnimationFrame(gameloop);
    })();
}

function init() {
    const canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    createSprites();
    start();
}

function createSprites() {
    rocket = new Sprite(10, 500, 5, 0, 50, 50, 'image/rocket.png'); // Maak de raket
    sprites.push(rocket);

    for (let i = 0; i < 5; i++) {
        const posX = Math.random() * canvasWidth; // Willekeurige X-positie
        const posY = -50 - Math.random() * 200; // Willekeurige Y-positie boven het canvas
        const speedX = 0; // Snelheid horizontaal (nul voor recht naar beneden)
        const speedY = 1 + Math.random() * 3; // Willekeurige verticale snelheid
        const width = 50; // Breedte van de sprite
        const height = 50; // Hoogte van de sprite
        const url = 'image/meteor.png'; // URL van het meteorietbeeld

        const sprite = new RotatingSprite(posX, posY, speedX, speedY, width, height, url);
        sprites.push(sprite);
    }
}

function update() {
    for (const sprite of sprites) {
        sprite.update();
        if (sprite !== rocket && sprite.Y > canvasHeight) {
            sprite.Y = -50;
            sprite.X = Math.random() * canvasWidth;
        } else if (sprite === rocket && sprite.X > canvasWidth) {
            sprite.X = -50;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (const sprite of sprites) {
        sprite.draw();
    }
}