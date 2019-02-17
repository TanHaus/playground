import { Draw, Mouse, Collide } from '../libraries/misc.js';
import { Random, Compute } from '../libraries/math.js';

// General elements
const canvas = document.querySelector("#myCanvas");
let w,h;          // global width and height of the canvas
let sizeFactor = 0.5;
let margin = 10;

// Game elements
let numberOfBalls = 10;
let balls = [];
let numberOfBullets = 5;
let bullets = [];
let minRadius = 10;
let maxRadius = 40;
let restitution = 0.9;

class Player {
    constructor(x,y,width,height,color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        Draw.filledRectangle(this.x,this.y,this.width,this.height,this.color,canvas);
    }

    moveMouse(mouse,evt) {
        // move the player with mouse position. account for the rectangle shape
        let mousePos = mouse.getRelativePosition(evt);
        this.x = mousePos.x - this.width/2;
        this.y = mousePos.y - this.height/2;
    }

    fire(evt) {
        // fire bullet based on the event triggered
        if(numberOfBullets>0) {
            switch(evt.code) {
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    bullets.push(new Bullet(this,evt.code));
                    numberOfBullets--;
                    break;
                default:
            }
        }
    }
}

class Ball {
    constructor(x,y,radius,color,speedX,speedY,mass=1) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.mass = mass;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.resolveCollideWall();
    }

    draw() {
        Draw.filledCircle(this.x,this.y,this.radius,this.color,canvas);
    }

    resolveCollideWall() {
        if(this.x<this.radius) {
            this.x = this.radius;
            this.speedX *= -restitution;
        }
        if(this.x>w-this.radius) {
            this.x = w-this.radius;
            this.speedX *= -restitution;
        }
        
        if(this.y<this.radius) {
            this.y = this.radius;
            this.speedY *= -restitution;
        }
        if(this.y>h-this.radius) {
            this.y = h-this.radius;
            this.speedY *= -restitution;
        }
    }

    resolveCollideBall(other) {
        let ball = this;

        // check if two balls collide
        if(Collide.detectBallBall(ball,other)) { 
            // get the normal direction
            let alpha = ball.getAngle(other);

            // resolve speed into the direction of normal
            let ballSpeedRotated  = Ball.rotateSpeedAxis(ball,alpha);
            let otherSpeedRotated = Ball.rotateSpeedAxis(other,alpha);

            let eqnSolved = Collide.resolve1D(ball.mass,ballSpeedRotated.speedX,other.mass,otherSpeedRotated.speedX,restitution);

            ballSpeedRotated.speedX  = eqnSolved.x;
            otherSpeedRotated.speedX = eqnSolved.y;

            // get the speed back to original speed
            ballSpeedRotated  = Ball.rotateSpeedAxis(ballSpeedRotated,-alpha);  
            otherSpeedRotated = Ball.rotateSpeedAxis(otherSpeedRotated,-alpha);

            ball.speedX  = ballSpeedRotated.speedX;       ball.speedY  = ballSpeedRotated.speedY;
            other.speedX = otherSpeedRotated.speedX;      other.speedY = otherSpeedRotated.speedY;

            // to avoid problems with high speed collision
            ball.x  += ball.speedX;      ball.y  += ball.speedY;  
            other.x += other.speedX;     other.y += other.speedY;
        }
    }

    getAngle(other) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        return Math.atan2(dy,dx);
    }

    static rotateSpeedAxis(ball,theta) {
        let speedMag = Compute.magnitude(ball.speedX,ball.speedY);
        let theta0 = Math.atan2(ball.speedY, ball.speedX);
        return {
            speedX: speedMag*Math.cos(theta0-theta),
            speedY: speedMag*Math.sin(theta0-theta),
        }
    }

    resolveCollideBullet(bulletArray) {
        let ball = this;
        bulletArray.forEach(function(bullet) {
            if(Collide.detectBallBox(ball,bullet)) {
                ball.remove(balls);
                bullet.remove(bullets);
            }
        });
    }

    remove(ballArray) {
        let index = ballArray.indexOf(this);
        ballArray.splice(index,1);
        numberOfBalls--;
    }
}

class Bullet {
    constructor(playerName, direction) {
        // speed is only describe magnitude. Given the direction (from which key was pressed), speed will be updated with direction
        // short and long dimension. Given the direction (from which key was press), the actual dimensions will be updated
        this.speed = 5;
        this.short = 15;
        this.long = 30;
        this.color = 'black';
        this.direction = direction;

        switch(direction) {
            case 'ArrowUp':
                this.speedX = 0;
                this.speedY = -this.speed;
                this.width = this.short;
                this.height = this.long;
                break;
            case 'ArrowDown':
                this.speedX = 0;
                this.speedY = this.speed;
                this.width = this.short;
                this.height = this.long;
                break;
            case 'ArrowLeft':
                this.speedX = -this.speed;
                this.speedY = 0;
                this.width = this.long;
                this.height = this.short;
                break;
            case 'ArrowRight':
                this.speedX = this.speed;
                this.speedY = 0;
                this.width = this.long;
                this.height = this.short;
                break;
        }
        // the bullet is created at the center of the player
        this.x = playerName.x + playerName.width/2 - this.width/2;
        this.y = playerName.y + playerName.height/2 - this.height/2;
    }

    draw() {
        Draw.filledRectangle(this.x,this.y,this.width,this.height,this.color,canvas);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    resolveCollideWall() {
        if(this.x<-this.long || this.x>w || this.y<-this.long || this.y>h) {
            this.remove(bullets);
        }
    }

    remove(bulletList) {
        let index = bulletList.indexOf(this);
        bulletList.splice(index,1);
    }
}

class Game {
    static createBalls(nb) {
        let ballResult = [];
        
        let minSpeedMagnitude = 1;
        let maxSpeedMagnitude = 7;
        let density = 1;
    
        for (let i = 0; i < nb; i++) {
            let preRadius = Random.generateInt(minRadius,maxRadius);
            
            ballResult.push(new Ball(Random.generateInt(preRadius,w-preRadius),
                                     Random.generateInt(preRadius,h-preRadius),
                                     preRadius,
                                     Random.generateColor(),
                                     Random.generateInt(minSpeedMagnitude, maxSpeedMagnitude, true),
                                     Random.generateInt(minSpeedMagnitude, maxSpeedMagnitude, true),
                                     density*preRadius*preRadius));
            
            // check if the new ball overlapse any other balls
            // if overlapse, delete that ball. minus 1 from i to repeat that iteration
            for(let j = 0; j < i; j++) { 
                if(Collide.detectBallBall(ballResult[j],ballResult[i])) {
                    ballResult.splice(i,1);
                    i--;
                }
            }            
        }

        return ballResult;
    }

    static updateBalls() {
        balls.forEach(function(ball) {
            ball.update();
            ball.draw();
            ball.resolveCollideBullet(bullets);
        });
    }

    static ballsCollide() {
        let size = balls.length;
        for(let i = size-1; i>=0; i--) {
            for(let j = 0; j<i; j++) {
                balls[i].resolveCollideBall(balls[j]);
            }
        }
    }

    static updateBullets() {
        bullets.forEach(function(bullet) {
            bullet.update();
            bullet.draw();
            bullet.resolveCollideWall();
        })
    }

    static startGame(nb=numberOfBalls) {
        balls = Game.createBalls(nb);
        Game.updateBalls();
        player.draw();
        Game.updateBullets();
        numberOfBullets = 5;
    }
    
    static mainLoop() {
        Update.nBalls();
        Update.nBullets();
        canvas.getContext('2d').clearRect(0,0,w,h);
        player.draw();

        Game.updateBalls();
        Game.updateBullets();
        Game.ballsCollide();
        requestAnimationFrame(Game.mainLoop);
    }
}

class Update {
    static nBalls() {
        showNBalls.innerHTML = 'Number of balls is: ' + numberOfBalls; 
    }
    static nBullets() {
        showNBullets.innerHTML = 'Number of bullets is: ' + numberOfBullets;
    }
}

let player = new Player(10,10,50,50,'red');

setCanvas(canvas);

let mouse = new Mouse(10,10,canvas);

// player will move with mouse cursor
canvas.addEventListener('mousemove', function(evt) {
    player.moveMouse(mouse,evt);
});

// listen to keypress to fire bullet
window.addEventListener("keyup", function(evt) {
    player.fire(evt);
});

const showNBalls      = document.querySelector('#nBalls');
const showNBullets    = document.querySelector('#nBullets');
const showMaxR        = document.querySelector('#maxR');
const showMinR        = document.querySelector('#minR');
const showRestitution = document.querySelector('#restitution');

Game.startGame(numberOfBalls);
Game.mainLoop();


window.onresize = function onresize() {
    setCanvas(canvas);
}

function setCanvas(canvas) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight*sizeFactor;

    w = canvas.width;
    h = canvas.height;
}

window.changeNb = function (nb) {
    numberOfBalls = nb;
};

window.set = function (value) {
    sizeFactor = value;
    document.querySelector('form').elements['canvasSize'].value = sizeFactor;
    setCanvas(canvas);
};

window.updateMinSize = function (value) {
    minRadius = parseInt(value);
    showMinR.innerHTML = 'Min ball size: ' + minRadius;
}

window.updateMaxSize = function (value) {
    maxRadius = parseInt(value);
    showMaxR.innerHTML = 'Max ball size: ' + maxRadius;
}

window.updateRestitution = function (value) {
    restitution = parseFloat(value);
    showRestitution.innerHTML = 'Coefficient of restitution: ' + restitution;
}

window.startGame = function() {
    Game.startGame();
};