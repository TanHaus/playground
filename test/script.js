class Graph {
    constructor(origin,xRange,yRange,canvas) {
        this.origin = origin;
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
        for(let i=min;i<max;i+=step) {
            result.push({x:i,y:0});
        }
        return result;
    }
    static applyFunction(xSeq,Fn) {
        if(typeof Fn!='function') throw ''+Fn+' is not a function';
        let result = [];
        xSeq.forEach(function(object) {
            result.push({x:object.x,y:Fn(object.x)});
        });
        return result;
    }
}

let canvas,ctx,w,h,graph;

window.onload = function init() {
    canvas = document.querySelector('#myCanvas');
    ctx = canvas.getContext('2d');
    w = canvas.clientWidth;
    h = canvas.clientHeight;

    graph = new Graph({x:10,y:10},{min:-20,max:10},{min:-10,max:10},canvas);
    graph.drawAxis();
    
    let seq = Graph.generateX(-10,10,0.1);
    seq = Graph.applyFunction(seq,Math.sin);
    graph.plot(seq);
    graph.plotFn(function exponential(x) {
        return Math.pow(Math.E,x);
    });
}