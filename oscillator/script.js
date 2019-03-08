import {Graph} from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
let w = canvas.clientWidth,
    h = canvas.clientHeight;
const showomega0 = document.querySelector('#omega0'),
showgamma = document.querySelector('#gamma'),
showforce0 = document.querySelector('#force0'),
showmaxX = document.querySelector('#maxX');

canvas.width = w;
canvas.height = h;

window.onresize = function() {
  w = canvas.clientWidth;
  h = canvas.clientHeight;
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0,0,w,h);
  Graph.drawAxis(xRange,yRange,canvas);
  draw();
  draw2();
}

let solution = function(t){ return 0; },
    envelope = function(t){ return 0; };
let exactSol = true,
    estimatedSol = true;
let delta = 0;
let omega0 = 5,
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
        num2 = gamma*omega;
    let C = force0/Math.sqrt(Math.pow(num1,2)+Math.pow(num2,2));
    let phase = Math.atan2(-num2,num1);
    let transX0 = C*Math.cos(phase);
    let transY0 = -omega*C*Math.sin(phase);

    console.log('C = ' + C);
    if(delta==0) {
        let A = x0-transX0;
        let B = v0+gamma/2*x0-transY0;
        solution = Object.assign(function(t) {
            return C*Math.cos(omega*t+phase) + 
                   (A+B*t)*Math.exp(-gamma*t/2);
        });
        envelope = Object.assign(function(t) { return undefined; });
        console.log('delta = 0');
    } else if(delta>0) {
        let f = Math.sqrt(delta)/2;
        let A = ((x0-transX0)*(f+gamma/2)+v0-transY0)/(2*f);
        let B = ((x0-transX0)*(f-gamma/2)-v0+transY0)/(2*f);
        solution = Object.assign(function(t) {
            return C*Math.cos(omega*t+phase) + 
                   (A*Math.exp(f*t)+B*Math.exp(-f*t))*Math.exp(-gamma*t/2);
        });
        envelope = Object.assign(function(t) { return undefined; });
        console.log('delta > 0');
    } else if(delta<0) {
        let f = Math.sqrt(-delta)/2;
        let A = x0-transX0;
        let B = (transY0-v0-gamma/2*A)/f;
        solution = Object.assign(function(t) {
            return C*Math.cos(omega*t+phase) + 
                   (A*Math.cos(f*t)-B*Math.sin(f*t))*Math.exp(-gamma*t/2);
        });
        envelope = Object.assign(function(t) { return Math.sqrt(A*A+B*B)*Math.exp(-gamma*t/2); });
        console.log('delta < 0');
    }
    
    Graph.plotFn(solution,xRange,yRange,0.01,canvas); 
    Graph.plotFn(envelope,xRange,yRange,0.01,canvas,'red');
}

show();
ctx.clearRect(0,0,w,h);
Graph.drawAxis(xRange,yRange,canvas);
draw();
draw2();

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
          console.log(value);
          break;
        case 'estimatedSol':
          estimatedSol=value;
          break;
    }
    show();
    console.log(exactSol);
    ctx.clearRect(0,0,w,h);
    Graph.drawAxis(xRange,yRange,canvas);
    if(exactSol) draw();
    if(estimatedSol) draw2();
}
function draw2() {
    let x = [x0,],
    v = [v0,],
    time = [0,];
    let index = 0;
    let t = 0;
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
function show() {
    showomega0.textContent = omega0;
    showgamma.textContent = gamma;
    showforce0.textContent = force0;
    showmaxX.textContent = xRange[1].toFixed(2);
}