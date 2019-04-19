import { Graph } from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas'),
      ctx = canvas.getContext('2d'),
      DPIscale = window.devicePixelRatio;

let w = canvas.clientWidth*DPIscale,
    h = canvas.clientHeight*DPIscale;
canvas.height = h; canvas.width = w;

window.onresize = function() {
    w = canvas.clientWidth*DPIscale;
    h = canvas.clientHeight*DPIscale;
    canvas.height = h;
    canvas.width = w;
}

let n = 1001,
    t = 0,
    speed = 3;

let wave = function(x,t,A0,d,l,n,omega) {
    let sum=0; const c = 3e8;
    for(let i=-(n-1)/2;i<n/2;i++) {
        let dist = x-d/n*i,
        r = Math.sqrt(dist*dist+l*l);
    sum += A0/Math.sqrt(n*2*Math.PI*r)*Math.cos(omega/(2*Math.PI*c)*r-omega*t);
    }
    return sum;
}

let repeat = function() {
    ctx.clearRect(0,0,w,h);
    Graph.plotFn(function(x) { return wave(x,t,5,1e-5,100,n,0.1); }, [-1e4,1e4], [-10,10],undefined,canvas,'blue');
    t+=1/60*speed;
    requestAnimationFrame(repeat);
}
repeat();
console.log(wave(-100000,t,5,1e-4,5,n,1e4))