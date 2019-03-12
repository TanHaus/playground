import { Graph,Polynomial,Calculus } from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

let w = canvas.clientWidth,
    h = canvas.clientHeight,
    xRange = [-6,6],
    yRange = [-2,2],
    taylor;
canvas.width = w;
canvas.height = h;

let makeTaylor = function(Fn,x,n) {
    if(typeof Fn != 'function') throw ''+Fn+' is not a function';
    let coefficient = [];
    for(let i=0; i<=n; i++) {
        coefficient[i] = Calculus.diff(Fn,x,undefined,i);
    }
    taylor = new Polynomial(coefficient);
}
let x0 = 0;
makeTaylor(Math.exp,x0,7);
console.log(taylor);

let draw = function() {
    ctx.clearRect(0,0,w,h);
    Graph.drawAxis(xRange,yRange,canvas);
    Graph.plotFn(function(x) { return taylor.eval(x-x0); },xRange,yRange,undefined,canvas,'blue');
}
draw();

window.update = function(type,value) {
    switch(type) {
        case 1:
    }
}