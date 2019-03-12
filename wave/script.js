import { Graph } from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

let w = canvas.clientWidth,
    h = canvas.clientHeight,
    xRange = [0,100],
    yRange = [-100,100],
    time = 0;
canvas.width = w;
canvas.height = h;

let wave = function(A,omega,k,phi,x,t) {
    return A*Math.cos(omega*t - k*x + phi);
}

let repeat = function() {
    ctx.clearRect(0,0,w,h);
    Graph.drawAxis(xRange,yRange,canvas);
    Graph.plotFn(function(x) { return wave(50,2,1,0,x,time)+wave(20,1.4,0.85,0,x,time); },xRange,yRange,undefined,canvas,'blue');
    time += 1/60;
    requestAnimationFrame(repeat);
}
repeat();

window.update = function(type,value) {
    switch(type) {
        case 1:
    }
}