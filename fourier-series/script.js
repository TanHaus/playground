import { Graph, Signal } from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas'),
      ctx = canvas.getContext('2d'),
      DPIscale = window.devicePixelRatio;

let w = canvas.clientWidth*DPIscale,
    h = canvas.clientHeight*DPIscale,
    xRange = [0,100],
    yRange = [-50,50],
    period = 2*Math.PI;
canvas.width = w;
canvas.height = h;

window.onresize = function() {
    w = canvas.clientWidth*DPIscale;
    h = canvas.clientHeight*DPIscale;
    canvas.width = w;
    canvas.height = h;
}

let wave = function(A,omega,phi,x) {
    return A*Math.cos(omega*x + phi);
}
let fftSize = 256;
let xSignal = Signal.generatexSeq(xRange,100/fftSize),
    ySignal = Signal.generateFn(Math.sin,xSignal),
    fSignal = Signal.get.MagnitudeArray(Signal.fft(ySignal,fftSize)),
    f2Signal = Signal.get.MagnitudeArray(Signal.ifft(fSignal,fftSize));

console.log(xSignal,ySignal,fSignal,f2Signal);
let draw = function() {
    ctx.clearRect(0,0,w,h);
    Graph.drawAxis(xRange,yRange,canvas);
    Graph.plot(xSignal,ySignal,xRange,yRange,canvas,'red');
    Graph.plot(xSignal,fSignal,xRange,yRange,canvas,'green');
    Graph.plot(xSignal,f2Signal,xRange,yRange,canvas,'blue');
}
draw();

window.update = function(type,value) {
    switch(type) {
        case 1:
    }
}