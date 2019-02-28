import {Graph} from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const w = canvas.clientWidth;
const h = canvas.clientHeight;

let solution = function(t){ return 0; },
    envelope = function(t){ return 0; };
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
    ctx.clearRect(0,0,w,h);
    Graph.drawAxis(xRange,yRange,canvas);
    delta = gamma*gamma-4*omega0*omega0;
    
    let num1 = omega0*omega0-omega*omega,
        num2 = gamma*omega;
    let C = force0/Math.sqrt(Math.pow(num1,2)+Math.pow(num2,2));
    let phase = -Math.atan2(-num2,num1);
    let transX0 = C*Math.cos(-phase);
    let transY0 = -omega*C*Math.sin(-phase);

    console.log('C = ' + C);
    if(delta==0) {
        let A = x0-transX0;
        let B = v0+gamma/2*x0-transY0;
        solution = Object.assign(function(t) {
            return C*Math.cos(omega*t-phase) + 
                   (A+B*t)*Math.exp(-gamma*t/2);
        });
        envelope = Object.assign(function(t) { return undefined; });
        console.log('delta = 0');
    } else if(delta>0) {
        let A = (v0+x0*(gamma/2+omega0)-transX0*omega0-transY0)/(2*omega0);
        let B = (x0*(omega0-gamma/2)-transX0*omega0-v0+transY0)/(2*omega0);
        let f = Math.sqrt(delta);
        solution = Object.assign(function(t) {
            return C*Math.cos(omega*t-phase) + 
                   (A*Math.exp(f*t)+B*Math.exp(-f*t))*Math.exp(-gamma*t/2);
        });
        envelope = Object.assign(function(t) { return undefined; });
        console.log('delta > 0');
    } else if(delta<0) {
        let A = x0-transX0;
        let B = (v0+gamma/2*x0-transY0)/omega0;
        let f = Math.sqrt(-delta);
        solution = Object.assign(function(t) {
            return C*Math.cos(omega*t-phase) + 
                   (A*Math.cos(f*t)+B*Math.sin(-f*t))*Math.exp(-gamma*t/2);
        });
        envelope = Object.assign(function(t) { return Math.sqrt(A*A+B*B)*Math.exp(-gamma*t/2); });
        console.log('delta < 0');
    }
    
    Graph.plotFn(solution,xRange,yRange,0.01,canvas); 
    Graph.plotFn(envelope,xRange,yRange,0.01,canvas,'orange');
}

draw();

window.updateValue = function(value,what) {
    switch(what) {
        case 'omega0':
          omega0=parseFloat(value);
          break;
        case 'gamma':
          gamma=parseFloat(value);
          break;
        case 'maxX':
          xRange[1]=parseFloat(value);
          break;
        case 'force0':
          force0=parseFloat(value);
          break;
    }
    draw();
}