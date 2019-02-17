import { Signal, Graph } from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const w = canvas.clientWidth;
const h = canvas.clientHeight;
let pow = 512;
let f = 0.1

let xRange = [0,pow];
let yRange = [-1,65];

let xSeq = Signal.generatexSeq(xRange,1);
let signal = Signal.generateFn(function(x){return Math.sin(f*x)},xSeq);
Graph.plot(xSeq,signal,xRange,yRange,canvas);

let freq = Signal.get.MagnitudeArray(Signal.fft(signal,pow));
Graph.plot(xSeq,freq,xRange,yRange,canvas,'red');

window.updatef = function(value) {
    ctx.clearRect(0,0,w,h);

    let pow = 512;
    let f = value;

    let xRange = [0,pow];
    let yRange = [-1,65];

    let xSeq = Signal.generatexSeq(xRange,1);
    let signal = Signal.generateFn(function(x){return Math.sin(f*x)},xSeq);
    Graph.plot(xSeq,signal,xRange,yRange,canvas);

    let freq = Signal.get.MagnitudeArray(Signal.fft(signal,pow));
    Graph.plot(xSeq,freq,xRange,yRange,canvas,'red');
};