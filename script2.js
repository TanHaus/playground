let canvas, ctx;
let w,h;
let planets = [];
const GRAVITY = 1;

class Planet {
    constructor(x,y,speedX,speedY,mass,radius,color) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.forceX = 0;
        this.forceY = 0;
    }

    update() {
        this.speedX += this.forceX/this.mass;
        this.speedY += this.forceY/this.mass;
        this.x += this.speedX;
        this.y += this.speedY;
    }

    gravity(otherPlanet) {
        let gravity = GRAVITY * (this.mass*otherPlanet.mass)/(Math.pow(this.distance(otherPlanet),2));
        let angle = slope(otherPlanet);
        this.forceX += gravity * Math.cos(angle);
        this.forceY += gravity * Math.sin(angle);
    }

    distance(otherPlanet) {
        return Math.sqrt(Math.pow(this.x-otherPlanet.x,2)+Math.pow(this.y-otherPlanet.y,2));
    }

    slope(otherPlanet) {
        let dy = this.y - otherPlanet.y;
        let dx = this.x - otherPlanet.x;
        return Math.atan(dy/dx);
    }

    draw() {
        Draw.filledCircle(x,y,radius,color);
    }
}

class Draw {
    static filledCircle(x,y,radius,color) {
        ctx.save();

        ctx.translate(x,y);
        ctx.beginPath();
        ctx.arc(0,0,radius,0,2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
    }
}

class Game {
    static createPlanets() {

    }
}

window.onload = function init() {
    canvas = document.querySelector('#myCanvas');
    ctx = canvas.getContext('2d');
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    
    begin();
    mainloop();
}