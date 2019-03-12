import { Graph } from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

let w = canvas.clientWidth,
    h = canvas.clientHeight,
    xRange = [0,100],
    yRange = [-100,100];
canvas.width = w;
canvas.height = h;

let wave = function(A,omega,phi,x) {
    return A*Math.cos(omega*x + phi);
}

let draw = function() {
    ctx.clearRect(0,0,w,h);
    Graph.drawAxis(xRange,yRange,canvas);
    Graph.plotFn(function(x) { return wave(50,2,0,x)+wave(20,1.4,0,x); },xRange,yRange,undefined,canvas,'blue');
}
draw();

window.update = function(type,value) {
    switch(type) {
        case 1:
    }
}