import {Graph} from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas'),
      ctx = canvas.getContext('2d'),
      canvasPen = document.querySelector('#pendulum'),
      ctxPen = canvasPen.getContext('2d'),
      DPIscale = window.devicePixelRatio;
let w = canvas.clientWidth*DPIscale,
    h = canvas.clientHeight*DPIscale;
const showomega0 = document.querySelector('#omega0'),
      showgamma = document.querySelector('#gamma'),
      showforce0 = document.querySelector('#force0'),
      showmaxX = document.querySelector('#maxX'),
      showDelta = document.querySelector('#delta');

canvasPen.style = 'position: absolute; left: 0; top:0; z-index: 0;';

window.onresize = function() {
  w = canvas.clientWidth*DPIscale;
  h = canvas.clientHeight*DPIscale;
  canvas.width = w;
  canvas.height = h;
  canvasPen.style.width = canvas.clientWidth;
  canvasPen.style.height = canvas.clientHeight;
  canvasPen.width = w;
  canvasPen.height = h;
  pendulum.resize();
  ctx.clearRect(0,0,w,h);
  Graph.drawAxis(xRange,yRange,canvas);
  draw();
  draw2();
}

let solution = function(t){ return 0; },
    envelope = function(t){ return 0; };
let exactSol = true,
    estimatedSol = true;
let delta = 0,
    omega0 = 5,
    gamma = 1,
    force0 = 0,
    omega = 7;
let x0 = 2,
    v0 = 0;
let xRange = [0,7],
    yRange = [-3,3];

function draw() {
    delta = gamma*gamma-4*omega0*omega0;
    
    let num1 = omega0*omega0-omega*omega,
        num2 = gamma*omega,
        C = force0/Math.sqrt(Math.pow(num1,2)+Math.pow(num2,2)),
        phase = Math.atan2(-num2,num1),
        transX0 = C*Math.cos(phase),
        transY0 = -omega*C*Math.sin(phase);

    if(delta==0) {
        let A = x0-transX0,
            B = v0+gamma/2*x0-transY0;
        solution = Object.assign(function(t) {
            return C*Math.cos(omega*t+phase) + 
                   (A+B*t)*Math.exp(-gamma*t/2);
        });
        envelope = Object.assign(function(t) { return undefined; });
    } else if(delta>0) {
        let f = Math.sqrt(delta)/2,
            A = ((x0-transX0)*(f+gamma/2)+v0-transY0)/(2*f),
            B = ((x0-transX0)*(f-gamma/2)-v0+transY0)/(2*f);
        solution = Object.assign(function(t) {
            return C*Math.cos(omega*t+phase) + 
                   (A*Math.exp(f*t)+B*Math.exp(-f*t))*Math.exp(-gamma*t/2);
        });
        envelope = Object.assign(function(t) { return undefined; });
    } else if(delta<0) {
        let f = Math.sqrt(-delta)/2,
            A = x0-transX0,
            B = (transY0-v0-gamma/2*A)/f;
        solution = Object.assign(function(t) {
            return C*Math.cos(omega*t+phase) + 
                   (A*Math.cos(f*t)-B*Math.sin(f*t))*Math.exp(-gamma*t/2);
        });
        envelope = Object.assign(function(t) { return Math.sqrt(A*A+B*B)*Math.exp(-gamma*t/2); });
    }
    
    Graph.plotFn(solution,xRange,yRange,0.01,canvas); 
    Graph.plotFn(envelope,xRange,yRange,0.01,canvas,'red');
}
function draw2() {
    let x = [x0,],
        v = [v0,],
        time = [0,];
    let index = 0,
        t = 0;
    while(t<xRange[1]) {
        let a = -omega0*omega0*x[index]-gamma*v[index]+force0*Math.cos(omega*time[index]);
        v.push(v[index]+a*0.01);
        x.push(x[index]+v[index+1]*0.01);
        time.push(time[index]+0.01);
        index++;
        t+=0.01;
    }
    Graph.plot(time,x,xRange,yRange,canvas,'green');
}

window.updateValue = function(value,what) {
    switch(what) {
        case 'omega0':
          omega0=parseFloat(value);
          break;
        case 'gamma':
          gamma=parseFloat(value);
          break;
        case 'maxX':
          xRange[1]=Math.exp(parseFloat(value));
          break;
        case 'force0':
          force0=parseFloat(value);
          break;
        case 'exactSol':
          exactSol=value;
          break;
        case 'estimatedSol':
          estimatedSol=value;
          break;
    }
    pendulum.reset();
    show();
    ctx.clearRect(0,0,w,h);
    Graph.drawAxis(xRange,yRange,canvas);
    if(exactSol) draw();
    if(estimatedSol) draw2();
}
function show() {
    showomega0.textContent = omega0;
    showgamma.textContent = gamma;
    showforce0.textContent = force0;
    showmaxX.textContent = xRange[1].toFixed(2);
    showDelta.innerText = (gamma*gamma-4*omega0*omega0).toFixed(2);
}

let pendulum = {
    xOffset: w/2,
    yOffset: h/3,
    length: Math.min(w,h)/3,
    radius: Math.min(w,h)/100,
    time: 0,
    theta: 0,
    toPosition: function() {
        return {x: this.length*Math.sin(this.theta), y: this.length*Math.cos(this.theta)};
    },
    draw: function() {
        ctxPen.save();
        ctxPen.translate(this.xOffset,this.yOffset);
        ctxPen.beginPath();
        ctxPen.moveTo(0,0);
        let pos = this.toPosition();
        ctxPen.lineTo(pos.x,pos.y);
        ctxPen.stroke();
        ctxPen.beginPath();
        ctxPen.arc(pos.x,pos.y,this.radius,0,2*Math.PI);
        ctxPen.fillStyle = 'red';
        ctxPen.fill();
        ctxPen.restore();
        Graph.point(this.time,solution(this.time),undefined,xRange,yRange,canvasPen,'blue');
    },
    update: function() {
        this.theta = solution(this.time);
        this.time += 1/60;
    },
    reset: function() {
        this.time = 0;
    },
    resize: function() {
        this.xOffset = w/2;
        this.yOffset = h/2;
        this.length = Math.min(w,h)/3;
        this.radius = Math.min(w,h)/100;
    }
}
function mainloop() {
    pendulum.update();
    ctxPen.clearRect(0,0,w,h);
    pendulum.draw();
    requestAnimationFrame(mainloop);
}

// main program
window.onresize();
show();
ctx.clearRect(0,0,w,h);
Graph.drawAxis(xRange,yRange,canvas);
draw();
draw2();

mainloop();

window.pendulum = pendulum;