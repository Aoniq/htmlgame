class Sprite {
    constructor(posX, posY, speedX, speedY, width, height, url) {
        this.X = posX;
        this.Y = posY;
        this.speedX = speedX;
        this.speedY = speedY;
        this.width = width;
        this.height = height;
        this.url = url;
        this.img = new Image();
        if (typeof (url) != "undefined") {
            this.img.src = url;
        }
    }
    update() {
        this.X += this.speedX;
        this.Y += this.speedY;
    }

    draw() {
        ctx.drawImage(this.img, this.X, this.Y, this.width, this.height);
    }
}

class RotatingSprite extends Sprite {
    constructor(posX, posY, speedX, speedY, width, height, url) {
        super(posX, posY, speedX, speedY, width, height, url);
        this.rotation = 0; // Initialiseer rotatiehoek
        this.rotationSpeed = Math.random() * 0.1; // Willekeurige rotatiesnelheid
    }

    update() {
        super.update();
        this.rotation += this.rotationSpeed; // Update rotatiehoek
    }

    draw() {
        ctx.save(); // Bewaar de huidige tekenstatus
        ctx.translate(this.X + this.width / 2, this.Y + this.height / 2); // Verplaats naar het midden van de sprite
        ctx.rotate(this.rotation); // Draai naar de huidige rotatiehoek
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height); // Teken de sprite
        ctx.restore(); // Herstel de vorige tekenstatus
    }
}