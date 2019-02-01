let canvas,ctx;
let mouse;
let w,h;
let balls = [];
let numberOfBalls = 20;

let mousePosition = {
    x: 10,
    y: 10,
};
let isFire = false;

let bullet = {
    x: 0,
    y: 0,
    width: 10,
    height: 20,
    speedX: 0,
    speedY: 0,
    color: 'black',
    orientation: 'vertical',
};

class Player {
    constructor(x,y,width,height,color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        Draw.drawFilledRectangle(this.x,this.y,this.width,this.height,this.color);
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
}

let player = new Player(10,10,50,50,'red');
let player2 = new Player(100,100,50,50,'blue');

class Ball {
    constructor(x,y,radius,color,speedX,speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.resolveCollideWall();

        //Draw.drawLine(this.x,this.y,this.x+this.speedX*10,this.y+this.speedY*10,2);
    }

    draw() {
        Draw.drawCircle(this.x,this.y,this.radius,this.color,2);
    }

    resolveCollideWall() {
        if(this.x<this.radius) {
            this.x = this.radius;
            this.speedX *= -1;
        }
        if(this.x>w-this.radius) {
            this.x = w-this.radius;
            this.speedX *= -1;
        }
        
        if(this.y<this.radius) {
            this.y = this.radius;
            this.speedY *= -1;
        }
        if(this.y>h-this.radius) {
            this.y = h-this.radius;
            this.speedY *= -1;
        }
    }

    detectCollideBall(otherBall) {
        let radiusSum = this.radius + otherBall.radius;
        let distanceSquared = Math.pow((this.x-otherBall.x),2) + Math.pow((this.y-otherBall.y),2);
        if (distanceSquared>Math.pow(radiusSum,2)) return false;
        return true;
    }

    resolveCollideBall(otherBall) {
        if(this.detectCollideBall(otherBall)) {
            let thisResolvedSpeed, otherResolvedSpeed;
            let slope = this.getSlope(otherBall);
            
            thisResolvedSpeed = this.resolveSpeed(slope);
            otherResolvedSpeed = otherBall.resolveSpeed(slope);
            console.log(thisResolvedSpeed);

            this.speedX = thisResolvedSpeed.speedNewX;
            this.speedY = thisResolvedSpeed.speedNewY;
            otherBall.speedX = otherResolvedSpeed.speedNewX;
            otherBall.speedY = otherResolvedSpeed.speedNewY;

            // swap values of the speed component parallel to the axis
            let swap = this.speedX;
            this.speedX = otherBall.speedX;
            otherBall.speedX = swap;

            thisResolvedSpeed = this.resolveSpeed(this.getSlope(otherBall));
            otherResolvedSpeed = otherBall.resolveSpeed(otherBall.getSlope(this));

            this.speedX = thisResolvedSpeed.speedNewX;
            this.speedY = thisResolvedSpeed.speedNewY;
            otherBall.speedX = otherResolvedSpeed.speedNewX;
            otherBall.speedY = otherResolvedSpeed.speedNewY;
        }
    }

    getSlope(otherBall) {
        let dx = otherBall.x - this.x;
        let dy = otherBall.y - this.y;
        return Math.atan2(dy,dx);
    }

    resolveSpeed(angle) {
        let magnitude = Math.sqrt(Math.pow(this.speedX,2)+Math.pow(this.speedY,2));
        let alpha = Math.atan2(this.y,this.x) - angle;
        return {
            speedNewX : magnitude * Math.cos(alpha),
            speedNewY : magnitude * Math.sin(alpha),
        }
    }
/*
    resolveCollideBall(otherBall) {
        let newSpeed = this.resolveSpeed(this.getSlope(otherBall));

        Draw.drawLine(this.x,this.y,this.x+newSpeed.speedNewX*10,otherBall.y,2);
    }*/
}

class Draw {
    static drawCircle(x,y,radius,color) {
        ctx.save();
        
        ctx.translate(x,y);
        ctx.beginPath();
        ctx.arc(0,0,radius,0,2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.restore();
    }
    
    static drawFilledRectangle(x,y,width,height,color) {
        ctx.save();
    
        ctx.translate(x,y);
        ctx.fillStyle = color;
        ctx.fillRect(0,0,width,height);
    
        ctx.restore();
    }

    static drawLine(x1,y1,x2,y2,weight=2) {
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
        this.x = evt.clientX - rect.left;
        this.y = evt.clientY - rect.top;
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        }
    }
}

class Game {
    static createBalls(nb) {
        let ballResult = [];
        
        let minRadius = 30;
        let maxRadius = 40;
        let minSpeedMagnitude = 1;
        let maxSpeedMagnitude = 5;
    
        for (let i = 0; i < nb; i++) {
            let preRadius = Random.generateRandom(minRadius,maxRadius);
            
            ballResult.push(new Ball(Random.generateRandom(preRadius,w-preRadius),
                                    Random.generateRandom(preRadius,h-preRadius),
                                    preRadius,
                                    Random.getRandomColor(),
                                    Random.generateRandom(minSpeedMagnitude, maxSpeedMagnitude, true),
                                    Random.generateRandom(minSpeedMagnitude, maxSpeedMagnitude, true)));
                            
        }
        return ballResult;
    }

    static startGame(nb) {
        balls = Game.createBalls(nb);
        Game.updateBalls();
        player.draw();
        player2.draw();
        drawBullet(bullet);
    }
    
    static mainLoop() {
        ctx.clearRect(0,0,w,h);
        Game.updateBalls();
        player.draw();
        player2.draw();
        drawBullet(bullet);
        bulletMove(bullet);
        player2.moveMouseSlow(mouse);
        Game.ballsCollide();
        requestAnimationFrame(Game.mainLoop);
    }

    static updateBalls() {
        balls.forEach(function(ball) {
            ball.draw();
            ball.move();
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
}

window.onload = function init() {
    canvas = document.querySelector("#myCanvas");
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext('2d');
    mouse = new Mouse(10,10,canvas);
    
    canvas.addEventListener('mousemove', function(evt) {
        player.moveMouse(mouse,evt);
    });

    window.addEventListener("keydown", function(evt) {
        switch(evt.code) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
                fire(evt.code);
                break;
        }
    });

    Game.startGame(numberOfBalls);
    Game.mainLoop();
}

function fire(keyCode) {
    if(!isFire) {
        bullet.x = player.x + player.width/2;
        bullet.y = player.y + player.height/2;
        switch(keyCode) {
            case "ArrowUp":
                bullet.orientation = 'vertical';
                bullet.speedY = -10;
                bullet.speedX = 0;
                break;
            case "ArrowDown":
                bullet.orientation = 'vertical';
                bullet.speedY = 10;
                bullet.speedX = 0;
                break;
            case "ArrowLeft":
                bullet.orientation = 'horizontal';
                bullet.speedX = -10;
                bullet.speedY = 0;
                break;
            case "ArrowRight":
                bullet.orientation = 'horizontal';
                bullet.speedX = 10;
                bullet.speedY = 0;
                break;
        }
        isFire = true;
    }
}



function drawBullet(bullet) {
    if(isFire) {
        if(bullet.orientation==='vertical') {
            Draw.drawFilledRectangle(bullet.x,bullet.y,bullet.width,bullet.height,bullet.color);
        } else if(bullet.orientation==='horizontal') {
            Draw.drawFilledRectangle(bullet.x,bullet.y,bullet.height,bullet.width,bullet.color);
        }
    }
}



function bulletMove(bullet) {
    bullet.x += bullet.speedX;
    bullet.y += bullet.speedY;

    bulletCollideWall(bullet);
}

function bulletCollideWall(bullet) {
    if (bullet.x<0 || bullet.x>w || bullet.y<0|| bullet.y>h) isFire=false;
}

function printInfo() {
    ctx.save();
    ctx.restore();
}