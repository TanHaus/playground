class Draw {
    static filledCircle(pointCenter,radius,color='red',context=ctx) {
        context.save();
        context.translate(pointCenter.x,pointCenter.y);
        context.beginPath();
        context.arc(0,0,radius,0,2*Math.PI);
        context.fillStyle = color;
        context.fill();
        context.restore();
    }
    static line(point1,point2,weight=2,color='black',context=ctx) {
        context.save();
        context.translate(point1.x,point1.y);
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(point2.x-point1.x,point2.y-point1.y);
        context.lineWidth = weight;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
    }
    static filledRectangle(point,dimensions,color='red',context=ctx) {
        context.save();
        context.translate(point.x,point.y);
        context.fillStyle = color;
        context.fillRect(0,0,dimensions.width,dimensions.height);
        context.restore();
    }
}

class Random {
    static generateRandom(min,max,signed=false) {
        let value = min+Math.round(Math.random()*(max-min))
        if(signed==false) return value;
        if(Math.random()>0.5) return value;
        return -value;
    }
    static getRandomColor() {
        let colors = ['red', 'green', 'blue'];
        return colors[Random.generateRandom(0,colors.length-1)];
    }
}

class Mouse {
    constructor(x,y,object) {
        this.x = x;
        this.y = y;
        this.object = object;
    }
    getRelativeMousePos(evt) {
        let rect = this.object.getBoundingClientRect();
        this.x = evt.clientX - rect.left;
        this.y = evt.clientY - rect.top;    
        return {
            x: this.x,
            y: this.y,
        }
    }
}