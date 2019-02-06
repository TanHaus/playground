// Misc classes
class Draw {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    filledCircle(pointCenter,radius,color='red') {
        this.context.save();
        this.context.translate(pointCenter.x,pointCenter.y);
        this.context.beginPath();
        this.context.arc(0,0,radius,0,2*Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.restore();
    }
    line(point1,point2,weight=2,color='black') {
        this.context.save();
        this.context.translate(point1.x,point1.y);
        this.context.beginPath();
        this.context.moveTo(0,0);
        this.context.lineTo(point2.x-point1.x,point2.y-point1.y);
        this.context.lineWidth = weight;
        this.context.strokeStyle = color;
        this.context.stroke();
        this.context.restore();
    }
    filledRectangle(point,dimensions,color='red') {
        this.context.save();
        this.context.translate(point.x,point.y);
        this.context.fillStyle = color;
        this.context.fillRect(0,0,dimensions.width,dimensions.height);
        this.context.restore();
    }
    cross(pos,length=5,weight=2) {
        this.context.save();
        this.context.translate(pos.x,pos.y);
        this.context.beginPath();
        this.context.moveTo(-length,-length);
        this.context.lineTo(length,length);
        this.context.moveTo(-length,length);
        this.context.lineTo(length,-length);
        this.context.lineWidth = weight;
        this.context.stroke();
        this.context.restore();
    }
}

class Mouse {
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

// Math functions
class Random {
    static generateInt(min,max,signed=false) {
        if(min==undefined) min = 1;
        if(max==undefined) max = 100;
        if(min>max) throw 'Invalid parameters: minimum value is larger than maximum value';

        let value = min+Math.round(Math.random()*(max-min));
        if(signed==false) return value;
        if(Math.random()>0.5) return value;
        return -value;
    }

    static generateColor() {
        let colors = ['red', 'green', 'blue'];
        return colors[Random.generateInt(0,colors.length-1)];
    }
}

class ComplexNumber {
    constructor(re,im) {
        this.re = re;
        this.im = im;
    }
    clone(other) {
        this.re = other.re;
        this.im = other.im;
        return this;
    }
    isEqual(other) {
        if(this.re==other.re && this.im==other.im) return true;
        return false;
    }
    add(other) {
        return ComplexNumber.ADD(this,other);
    }
    multiply(other) {
        return ComplexNumber.MULTIPLY(this,other);
    }
    multiplyScalar(scalar) {
        return new ComplexNumber(this.re*scalar,this.im*scalar);
    }
    static CLONE(no) {
        return new ComplexNumber(no.re,no.im);
    }
    static EQUAL(no1,no2) {
        if(no1.re==no2.re && no1.im==no2.im) return true;
        return false
    }
    static ADD(no1,no2) {
        return new ComplexNumber(no1.re+no2.re,
                                 no1.im+no2.im);
    }
    static MULTIPLY(no1,no2) {
        return new ComplexNumber(no1.re*no2.re - no1.im*no2.im,
                                 no1.re*no2.im + no1.im*no2.re);
    }
}

class Solver {
    static sim2(matrix) {  // simultaneous equation, 2 unknowns. size of matrix is 2x3
        if(matrix.length!=2 && matrix[0].length!=3 && matrix[1].length!=3) throw 'Matrix dimensions are not int 2x3 shape'
        let a = matrix[0][0]; let b = matrix[0][1]; let m = matrix[0][2];
        let c = matrix[1][0]; let d = matrix[1][1]; let n = matrix[1][2];

        if(a*d==b*c) {
            if(a*n==c*m) throw 'Infinite number of solutions';
            else throw 'No solution found';
        } else return {
            x: (m*d-n*b)/(a*d-b*c),
            y: (m*c-n*a)/(b*c-a*d),
        }
    }
}

class Graph {
    constructor(xRange,yRange,canvas) {
        this.xRange = xRange;
        this.yRange = yRange;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    plot(points,color='blue'){
        let xScale = canvas.clientWidth/(this.xRange.max-this.xRange.min);
        let yScale = canvas.clientHeight/(this.yRange.max-this.yRange.min);

        this.context.save();  // this is for normal encapsulation
        this.context.save();  // this is for stroke
        this.context.translate(-this.xRange.min*xScale,this.yRange.max*yScale);
        
        this.context.scale(xScale,yScale)

        this.context.beginPath();
        this.context.moveTo(points[0].x,-points[0].y);  // minus y-coordinate because the canvas is inverse in y direction
        for(let i=1;i<points.length;i++) {
            this.context.lineTo(points[i].x,-points[i].y);  // minus y-coordinate because the canvas is inverse in y direction
        }

        this.context.restore();
        this.context.lineWidth = 2;
        this.context.strokeStyle = color;
        this.context.stroke();
        this.context.restore();
    }
    plotFn(Fn,color='blue'){
        this.plot(Graph.applyFunction(Graph.generateX(this.xRange.min,this.xRange.max,(this.xRange.max-this.xRange.min)/100),Fn));
    }
    drawAxis() {
        let xScale = canvas.clientWidth/(this.xRange.max-this.xRange.min);
        let yScale = canvas.clientHeight/(this.yRange.max-this.yRange.min);

        this.context.save();  // this is for normal encapsulation
        this.context.save();  // this is for stroke
        this.context.translate(-this.xRange.min*xScale,this.yRange.max*yScale);
        
        this.context.scale(xScale,yScale)

        this.context.beginPath();
        this.context.moveTo(this.xRange.min,0);
        this.context.lineTo(this.xRange.max,0);

        this.context.moveTo(0,this.yRange.min);
        this.context.lineTo(0,this.yRange.max);
        this.context.lineWidth *= xScale/yScale;
        
        this.context.restore();  // stroke won't be affected by scale()
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'black';
        this.context.stroke();
        this.context.restore();  // encapsulation
    }
    static generateX(min,max,step) {
        if(max<min) throw 'Invalid arguments. Maximum value is smaller than minimum value';
        if(max==min) throw 'Invalid arguments. Maximum value is equal minimum value';
        if(step>max-min) throw 'Invalid arguments. Step size is larger than the range';

        let result = [];
        for(let i=min;i<=max;i+=step) {
            result.push(i);
        }
        return result;
    }
    static getFnSeq(Xseq,Fn) {
        if(typeof Fn!='function') throw ''+Fn+' is not a function';
        let result = [];
        Xseq.forEach(function(xValue) {
            result.push(Fn(xValue));
        });
        return result;
    }
    static applyFunction(xSeq,Fn) {
        if(typeof Fn!='function') throw ''+Fn+' is not a function';
        let result = [];
        xSeq.forEach(function(object) {
            result.push({x:object,y:Fn(object)});
        });
        return result;
    }
    static applySequence(xSeq,ySeq) {
        if(xSeq.length!=ySeq.length) throw 'Invalid arguments. xSeq and ySeq do not have the same length';
        let result = [];
        for(let i=0;i<xSeq.length;i++) {
            result.push({x:xSeq[i],y:ySeq[i]});
        }
        return result;
    }
}

// 2D physics
class Object2D {
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

class CollideDetect {
    static ballBox(ball,box) {
        let x = ball.x;
        let y = ball.y;
        if(x < box.x) x = box.x;
        else if(x > box.x+box.width) x = box.x+box.width;
        if(y < box.y) y = box.y;
        else if(y > box.y+box.height) y = box.y+box.height;

        return (Math.pow(ball.x-x,2)+Math.pow(ball.y-y,2) < Math.pow(ball.radius,2));
    }

    static boxBall(box,ball) {
        return CollideDetect.ballBox(ball,box);
    }

    static ballBall(ball1, ball2) {
        let radiusSum = ball1.radius + ball2.radius;
        let distanceSquared = Math.pow((ball1.x-ball2.x),2) + Math.pow((ball1.y-ball2.y),2);
        if (distanceSquared>Math.pow(radiusSum,2)) return false;
        return true;
    }

    static boxBox(box1, box2) {

    }
}