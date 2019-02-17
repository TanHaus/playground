// Misc classes
export let Draw = {
    filledCircle: function(x,y,radius,color='red',canvas) {
        let context = canvas.getContext('2d');
        context.save();
        context.translate(x,y);
        context.beginPath();
        context.arc(0,0,radius,0,2*Math.PI);
        context.fillStyle = color;
        context.fill();
        context.restore();
    },
    line: function(x1,y1,x2,y2,weight=2,color='black',canvas) {
        let context = canvas.getContext('2d');
        context.save();
        context.translate(x1,y1);
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(x2-x1,y2-y1);
        context.lineWidth = weight;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
    },
    filledRectangle: function(x,y,width,height,color='red',canvas) {
        let context = canvas.getContext('2d');
        context.save();
        context.translate(x,y);
        context.fillStyle = color;
        context.fillRect(0,0,width,height);
        context.restore();
    },
    cross: function(x,y,length=5,weight=2,canvas) {
        let context = canvas.getContext('2d');
        context.save();
        context.translate(x,y);
        context.beginPath();
        context.moveTo(-length,-length);
        context.lineTo(length,length);
        context.moveTo(-length,length);
        context.lineTo(length,-length);
        context.lineWidth = weight;
        context.stroke();
        context.restore();
    }
};

export class Mouse {
    constructor(x,y,object) {
        this.x = x;
        this.y = y;
        this.object = object;
    }
    getRelativePosition(evt) {
        let rect = this.object.getBoundingClientRect();
        this.x = evt.clientX - rect.left;
        this.y = evt.clientY - rect.top;    
        return {
            x: this.x,
            y: this.y,
        }
    }
}

// 2D physics
export class Object2D {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.speedX;
        this.speedY;
        this.accelX;
        this.accelY;
        this.mass;
        this.forceX;
        this.forceY;
    }
    update() {
        this.accelX = this.forceX / this.mass;
        this.accelY = this.forceY / this.mass;
        this.speedX += this.accelX/60;  // frame update is after 1/60s
        this.speedY += this.accelY/60;
        this.x += this.speedX/60;
        this.y += this.speedY/60;

        return this;
    }
    draw(context=ctx) {
        return this;
    }
    resolveCollideWall(context=ctx) {
    }
    getAngle(other) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        return Math.atan2(dy,dx);
    }
}

export let Collide = {
    detectBallBox: function(ball,box) {
        let x = ball.x;
        let y = ball.y;
        if(x < box.x) x = box.x;
        else if(x > box.x+box.width) x = box.x+box.width;
        if(y < box.y) y = box.y;
        else if(y > box.y+box.height) y = box.y+box.height;

        return (Math.pow(ball.x-x,2)+Math.pow(ball.y-y,2) < Math.pow(ball.radius,2));
    },

    detectBoxBall: function(box,ball) {
        return Collide.detectBallBox(ball,box);
    },

    detectBallBall: function(ball1, ball2) {
    //  return (distance squared < square of radius sum)
        return ((Math.pow((ball1.x-ball2.x),2) + Math.pow((ball1.y-ball2.y),2)) < Math.pow(ball1.radius + ball2.radius,2));
    },

    detectBoxBox: function(box1, box2) {

    },

    resolve1D: function(mass1,speed1,mass2,speed2,restitution) {
        // use formula for inelastic collision
        let mom = mass1*speed1 + mass2*speed2;
        let mass = mass1+mass2;
        let relativespeed = restitution*(speed2-speed1);
        return {
            x: ( mass2*relativespeed+mom)/(mass),
            y: (-mass1*relativespeed+mom)/(mass),
        }
    }
}