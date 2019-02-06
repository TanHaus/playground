let canvas,ctx,draw;
let mouse;
let w,h;
let balls = [];
let numberOfBalls = 10;
let showNBalls, showNBullets, showMinR, showMaxR, showRestitution;
let player, player2;
let bullets = [];
let numberOfBullets = 5;
let viewportWidth, viewportHeight;
let sizeFactor = 0.5;
let margin = 10;
let minRadius = 30;
let maxRadius = 40;
let restitution = 0.5;

class Player {
    constructor(x,y,width,height,color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        draw.filledRectangle(this,this,this.color);
    }

    moveMouse(mouse,evt) {
        let mousePos = mouse.getRelativePosition(evt);
        this.x = mousePos.x - this.width/2;
        this.y = mousePos.y - this.height/2;
    }

    moveMouseSlow(mouse) {
        let speed = 10;
        let angle = Math.atan2(this.y-mouse.y+this.height/2,this.x-mouse.x+this.width/2);
        this.x -= speed*Math.cos(angle);
        this.y -= speed*Math.sin(angle);
    }

    fire(evt) {
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

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.resolveCollideWall();
    }

    draw() {
        draw.filledCircle(this,this.radius,this.color);
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

    resolveCollideBall(otherBall) {
        let ball = this;
        if(CollideDetect.ballBall(ball,otherBall)) { // check if two balls collide
            let alpha = ball.getAngle(otherBall);  // get the normal direction
            let ballSpeedRotated = Ball.rotateSpeedAxis(ball,alpha);  // resolve speed into the direction of normal
            let otherSpeedRotated = Ball.rotateSpeedAxis(otherBall,alpha);

            let eqn = [[        1,             -1,                          otherSpeedRotated.speedX-ballSpeedRotated.speedX],  // solve for new normal speed
                       [ball.mass, otherBall.mass, ball.mass*ballSpeedRotated.speedX+otherBall.mass*otherSpeedRotated.speedX]];

            eqn[1][2] *= restitution*restitution;   // account for energy loss
            let eqnSolved = Solver.sim2(eqn);
            ballSpeedRotated.speedX = eqnSolved.x;
            otherSpeedRotated.speedX = eqnSolved.y;

            ballSpeedRotated = Ball.rotateSpeedAxis(ballSpeedRotated,-alpha);  // get the speed back to original speed
            otherSpeedRotated = Ball.rotateSpeedAxis(otherSpeedRotated,-alpha);

            ball.speedX = ballSpeedRotated.speedX;
            ball.speedY = ballSpeedRotated.speedY;
            otherBall.speedX = otherSpeedRotated.speedX;
            otherBall.speedY = otherSpeedRotated.speedY;

            ball.x += ball.speedX;
            ball.y += ball.speedY;
            otherBall.x += otherBall.speedX;
            otherBall.y += otherBall.speedY;
        }
    }

    getAngle(other) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        return Math.atan2(dy,dx);
    }

    static rotateSpeedAxis(ball,theta) {
        let speedMag = Math.sqrt(ball.speedX*ball.speedX + ball.speedY*ball.speedY);
        let theta0 = Math.atan2(ball.speedY, ball.speedX);
        return {
            speedX: speedMag*Math.cos(theta0-theta),
            speedY: speedMag*Math.sin(theta0-theta),
        }
    }

    resolveCollideBullet(bulletArray) {
        let ball = this;
        bulletArray.forEach(function(bullet) {
            if(CollideDetect.ballBox(ball,bullet)) {
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
        this.speed = 5;
        this.short = 15;
        this.long = 30;
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
        this.x = playerName.x + playerName.width/2 - this.width/2;
        this.y = playerName.y + playerName.height/2 - this.height/2;
        this.color = 'black';
    }

    draw() {
        draw.filledRectangle(this,this,this.color);
    }

    move() {
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
        let maxSpeedMagnitude = 5;

        let density = 1;
    
        for (let i = 0; i < nb; i++) {
            let preRadius = Random.generateInt(minRadius,maxRadius);
            
            ballResult.push(new Ball(Random.generateInt(preRadius,w-preRadius),
                                    Random.generateInt(preRadius,h-preRadius),
                                    preRadius,
                                    Random.generateColor(),
                                    Random.generateInt(minSpeedMagnitude, maxSpeedMagnitude, true),
                                    Random.generateInt(minSpeedMagnitude, maxSpeedMagnitude, true),
                                    density*preRadius*preRadius*preRadius));
            
            for(let j = 0; j < i; j++) {  // check if the new ball overlapse any other balls
                if(CollideDetect.ballBall(ballResult[j],ballResult[i])) {
                    ballResult.splice(i,1);
                    i--;
                }
            }            
        }
        return ballResult;
    }

    static updateBalls() {
        balls.forEach(function(ball) {
            ball.draw();
            ball.move();
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
            bullet.draw();
            bullet.move();
            bullet.resolveCollideWall();
        })
    }

    static startGame(nb=numberOfBalls) {
        balls = Game.createBalls(nb);
        Game.updateBalls();
        player.draw();
        //player2.draw();
        Game.updateBullets();
        numberOfBullets = 5;
    }
    
    static mainLoop() {
        Update.nBalls();
        Update.nBullets();
        ctx.clearRect(0,0,w,h);
        Game.updateBalls();
        player.draw();
        //player2.draw();

        Game.updateBullets();
        //player2.moveMouseSlow(mouse);
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

player = new Player(10,10,50,50,'red');
player2 = new Player(100,100,50,50,'blue');

window.onload = function init() {
    canvas = document.querySelector("#myCanvas");
    
    setCanvas(canvas);

    ctx = canvas.getContext('2d');
    mouse = new Mouse(10,10,canvas);

    draw = new Draw(ctx);
    
    canvas.addEventListener('mousemove', function(evt) {
        player.moveMouse(mouse,evt);
    });

    canvas.addEventListener('touchmove', function(evt) {
        player.moveMouse(mouse,evt);
    });

    window.addEventListener("keyup", function(evt) {
        player.fire(evt);
    });

    showNBalls = document.querySelector('#nBalls');
    showNBullets = document.querySelector('#nBullets');
    showMaxR = document.querySelector('#maxR');
    showMinR = document.querySelector('#minR');
    showRestitution = document.querySelector('#restitution');

    Game.startGame(numberOfBalls);
    Game.mainLoop();
}

window.onresize = function onresize() {
    setCanvas(canvas);
}

function setCanvas(canvas) {
    viewportWidth = document.documentElement.clientWidth;
    viewportHeight = document.documentElement.clientHeight;

    canvas.width = viewportWidth;
    canvas.height = viewportHeight*sizeFactor;

    w = canvas.width;
    h = canvas.height;
}

function changeNb(nb) {
    numberOfBalls = nb;
}

function set(value) {
    sizeFactor = value;
    setCanvas(canvas);
}

function updateMinSize(value) {
    minRadius = parseInt(value);
    showMinR.innerHTML = 'Min ball size: ' + minRadius;
}

function updateMaxSize(value) {
    maxRadius = parseInt(value);
    showMaxR.innerHTML = 'Max ball size: ' + maxRadius;
}

function updateRestitution(value) {
    restitution = parseFloat(value);
    showRestitution.innerHTML = 'Coefficient of restitution: ' + restitution;
}