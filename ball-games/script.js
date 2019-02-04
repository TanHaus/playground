let canvas,ctx;
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
        Draw.filledRectangle(this);
    }

    moveMouse(mouse,evt) {
        let mousePos = mouse.getMousePositionRelative(evt);
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

    resolveCollideBall(balls) {
        let player = this;
        balls.forEach(function(ball) {
            if(Collide.collideBallBox(ball,player)) console.log('touch!');
        });
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
        Draw.filledCircle(this);
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

    resolveCollidePlayer(player) {
        let ball = this;
        if(Collide.collideBallBox(ball,player)) {
            ball.remove();
        }
    }

    resolveCollideBall(otherBall) {
        let ball = this;
        if(Collide.collideBallBall(ball,otherBall)) { // check if two balls collide
            let alpha = ball.getAngle(otherBall);  // get the normal direction
            let ballSpeedRotated = Ball.rotateSpeedAxis(ball,alpha);  // resolve speed into the direction of normal
            let otherSpeedRotated = Ball.rotateSpeedAxis(otherBall,alpha);

            let eqn = [[        1,             -1,                          otherSpeedRotated.speedX-ballSpeedRotated.speedX],  // solve for new normal speed
                       [ball.mass, otherBall.mass, ball.mass*ballSpeedRotated.speedX+otherBall.mass*otherSpeedRotated.speedX]];

            eqn[1][2] *= restitution*restitution;   // account for energy loss
            let eqnSolved = Ball.eqnSolver(eqn);
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

    getAngle(otherBall) {
        let dx = otherBall.x - this.x;
        let dy = otherBall.y - this.y;
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

    static eqnSolver(matrix) {
        let a = matrix[0][0];
        let b = matrix[0][1];
        let m = matrix[0][2];
        let c = matrix[1][0];
        let d = matrix[1][1];
        let n = matrix[1][2];

        if(a*d==b*c) {
            if(a*n==c*m) {
                return 'Infinite number of solutions';
            } else return 'No solution found';
        } else {
            return {
                x: (m*d-n*b)/(a*d-b*c),
                y: (m*c-n*a)/(b*c-a*d),
            }
        }
    }

    resolveCollideBullet(bulletArray) {
        let ball = this;
        bulletArray.forEach(function(bullet) {
            if(Collide.collideBallBox(ball,bullet)) {
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
        Draw.filledRectangle(this);
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

class Draw {
    static filledCircle(ob) {
        ctx.save();
        
        ctx.translate(ob.x,ob.y);
        ctx.beginPath();
        ctx.arc(0,0,ob.radius,0,2*Math.PI);
        ctx.fillStyle = ob.color;
        ctx.fill();
        
        ctx.restore();
    }
    
    static filledRectangle(ob) {
        ctx.save();
    
        ctx.translate(ob.x,ob.y);
        ctx.fillStyle = ob.color;
        ctx.fillRect(0,0,ob.width,ob.height);
    
        ctx.restore();
    }

    static line(x1,y1,x2,y2,weight=2) {
        ctx.save();

        ctx.translate(x1,y1);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(x2-x1,y2-y1);
        ctx.lineWidth = weight;
        ctx.stroke();

        ctx.restore();
    }
}

class Random {
    static generateRandom(min,max,signed=false) {
        let range = max-min;
        let value = min+Math.round(Math.random()*range)
        if(signed==false) return value;
        
        let a = 1;
        if(Math.random()>0.5) a = -a;
        return value*a;
    }
    
    static getRandomColor() {
        let colors = ['red', 'green', 'blue'];
        let size = colors.length;
        return colors[Random.generateRandom(0,size-1)];
    }
}

class Mouse {
    constructor(x,y,object) {
        this.x = x;
        this.y = y;
        this.object = object;
    }
    
    getMousePositionRelative(evt) {
        let rect = this.object.getBoundingClientRect();
        if(evt.type == 'touchmove'){
            this.x = evt.changedTouches.item(0).clientX - rect.left;
            this.y = evt.changedTouches.item(0).clientY - rect.top;
        } else {
            this.x = evt.clientX - rect.left;
            this.y = evt.clientY - rect.top;    
        }
        
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        }
    }
}

class Game {
    static createBalls(nb) {
        let ballResult = [];
        
        let minSpeedMagnitude = 1;
        let maxSpeedMagnitude = 5;

        let density = 1;
    
        for (let i = 0; i < nb; i++) {
            let preRadius = Random.generateRandom(minRadius,maxRadius);
            
            ballResult.push(new Ball(Random.generateRandom(preRadius,w-preRadius),
                                    Random.generateRandom(preRadius,h-preRadius),
                                    preRadius,
                                    Random.getRandomColor(),
                                    Random.generateRandom(minSpeedMagnitude, maxSpeedMagnitude, true),
                                    Random.generateRandom(minSpeedMagnitude, maxSpeedMagnitude, true),
                                    density*preRadius*preRadius*preRadius));
            
            for(let j = 0; j < i; j++) {  // check if the new ball overlapse any other balls
                if(Collide.collideBallBall(ballResult[j],ballResult[i])) {
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
        player.resolveCollideBall(balls);
        Game.ballsCollide();
        requestAnimationFrame(Game.mainLoop);
    }
}

class Collide {
    static collideBallBox(ball,box) {
        let x = ball.x;
        let y = ball.y;
        if(x < box.x) x = box.x;
        else if(x > box.x+box.width) x = box.x+box.width;
        if(y < box.y) y = box.y;
        else if(y > box.y+box.height) y = box.y+box.height;

        return (Math.pow(ball.x-x,2)+Math.pow(ball.y-y,2) < Math.pow(ball.radius,2));
    }

    static collideBallBall(ball1, ball2) {
        let radiusSum = ball1.radius + ball2.radius;
        let distanceSquared = Math.pow((ball1.x-ball2.x),2) + Math.pow((ball1.y-ball2.y),2);
        if (distanceSquared>Math.pow(radiusSum,2)) return false;
        return true;
    }

    static collideBoxBox(box1, box2) {

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