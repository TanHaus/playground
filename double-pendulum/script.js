import { Compute,Random,Vector } from '../libraries/math.js';

const GRAVITY = 9.81,
      canvas = document.querySelector('#myCanvas'),
      ctx = canvas.getContext('2d'),
      DPIscale = window.devicePixelRatio,
      step = 1/60; // 60fps

let requestID = 0,
    mode = 'Euler';
let w = canvas.clientWidth*DPIscale,
    h = canvas.clientHeight*DPIscale,
    offsetX = w/2,
    offsetY = h/3;

canvas.width = w;
canvas.height = h;

window.onresize = function() {
    w = canvas.clientWidth*DPIscale;
    h = canvas.clientHeight*DPIscale;
    canvas.width = w;
    canvas.height = h;
    offsetX = w/2;
    offsetY = h/4;
}

let pens = [];
let runSpeed = 1,
    isDrawPath = true;
let length = h/4,
    radius = length/10;
let initTheta1 = 150,
    initTheta2 = 310;
let colors,
    color1 = { 'red': 52, 'green': 102, 'blue': 255 },
    color2 = { 'red': 255, 'green': 0, 'blue': 102 };

class DoublePendulum {
    constructor(theta1,theta2,length,radius,color='black') {
        this.theta1 = theta1; this.omega1 = 0;
        this.theta2 = theta2; this.omega2 = 0;
        this.length = length; this.radius = radius; this.color = color;
    }
    update(type) {
        let L = this.length;
        let alpha = function(omega,theta) {
            let omega1 = omega[0], omega2 = omega[1],
                theta1 = theta[0], theta2 = theta[1];
            let sin1 = Math.sin(theta1), sin2 = Math.sin(theta2),
                sin12 = Math.sin(theta1-theta2), cos12 = Math.cos(theta1-theta2),
                gl = GRAVITY/L, denominator = 2-sin12*sin12;
            let alpha1 = (gl*(cos12*sin2-2*sin1)-sin12*(omega2*omega2+cos12*omega1*omega1))/denominator,
                alpha2 = (-2*gl*(sin2-sin1)+sin12*(2*omega1*omega1+cos12*omega2*omega2))/denominator;
            return [alpha1,alpha2];
        }
        if(type=='RK4') {
        // RK4
        let v0 = [this.omega1,this.omega2],
            x0 = [this.theta1,this.theta2],
            
            dvh1 = Vector.scale(alpha(v0,x0),step),
            dxh1 = Vector.scale(v0,step),
            vh1 = Vector.add(v0,Vector.scale(dvh1,0.5)),
            xh1 = Vector.add(x0,Vector.scale(dxh1,0.5)),

            dvh2 = Vector.scale(alpha(vh1,xh1),step),
            dxh2 = Vector.scale(vh1,step),
            vh2 = Vector.add(v0,Vector.scale(dvh2,0.5)),
            xh2 = Vector.add(x0,Vector.scale(dxh2,0.5)),
            
            dvh3 = Vector.scale(alpha(vh2,xh2),step),
            dxh3 = Vector.scale(vh2,step),
            vh3 = Vector.add(v0,Vector.scale(dxh3,0.5)),
            xh3 = Vector.add(x0,Vector.scale(dxh2,0.5)),

            dvh4 = Vector.scale(alpha(vh3,xh3),step),
            dxh4 = Vector.scale(vh3,step);

        this.omega1 += (dvh1[0]+2*dvh2[0]+2*dvh3[0]+dvh4[0])/6;
        this.omega2 += (dvh1[1]+2*dvh2[1]+2*dvh3[1]+dvh4[1])/6;
        this.theta1 += (dxh1[0]+2*dxh2[0]+2*dxh3[0]+dxh4[0])/6;
        this.theta2 += (dxh1[1]+2*dxh2[1]+2*dxh3[1]+dxh4[1])/6;
        } else if(type=='Euler') {
        // Euler
        let v0 = [this.omega1,this.omega2],
            x0 = [this.theta1,this.theta2],
            a = alpha(v0,x0);
        this.omega1 += a[0]*step; this.theta1 += this.omega1*step;
        this.omega2 += a[1]*step; this.theta2 += this.omega2*step;
        }

    }
    draw() {
        let position = toPosition(this);
        ctx.save();
        ctx.translate(offsetX,offsetY);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(position.x1,-position.y1);
        ctx.lineTo(position.x2,-position.y2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(position.x1,-position.y1,this.radius,0,2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    
        ctx.beginPath();
        ctx.arc(position.x2,-position.y2,this.radius,0,2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    draw2() {
        let position = toPosition(this);
        ctx.save();
        ctx.translate(offsetX,offsetY);
        ctx.beginPath();
        ctx.arc(position.x2,-position.y2,this.radius,0,2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    takeSnap() {
        let sin1 = Math.sin(this.theta1), sin2 = Math.sin(this.theta2),
            cos1 = Math.cos(this.theta1), cos2 = Math.cos(this.theta2);
        snaps.push({x:  this.length*(sin1 + sin2),
                    y: -this.length*(cos1 + cos2),});
    }
}

let snaps = [];

function toPosition(state) {
    return {
        x1:  state.length* Math.sin(state.theta1),
        y1: -state.length* Math.cos(state.theta1),
        x2:  state.length*(Math.sin(state.theta1) + Math.sin(state.theta2)),
        y2: -state.length*(Math.cos(state.theta1) + Math.cos(state.theta2)),
    }
}

function drawSnaps(snaps) {
    ctx.save();
    ctx.translate(offsetX,offsetY);
    ctx.moveTo(snaps[0].x,-snaps[0].y);
    for(let i=1; i<snaps.length; i++) {
        ctx.lineTo(snaps[i].x,-snaps[i].y);
    }
    ctx.strokeStyle = 'whitesmoke';
    ctx.stroke();
    ctx.restore();
}

function mainLoop() {
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<pens.length;i++) {
        for(let j=0;j<runSpeed;j++) pens[i].update(mode);
        pens[i].draw();
    }
    pens[0].takeSnap();
    if(isDrawPath) drawSnaps(snaps);
    requestID = requestAnimationFrame(mainLoop);
}

function mainLoop2() {
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<pens.length;i++) {
        for(let j=0;j<runSpeed;j++) pens[i].update(mode);
        pens[i].draw2();
    }
    pens[0].takeSnap();
    if(isDrawPath) drawSnaps(snaps);
    requestID = requestAnimationFrame(mainLoop2);
}

window.showTop = function() {
    cancelAnimationFrame(requestID);
    mainLoop();
}
window.noShowTop = function() {
    cancelAnimationFrame(requestID);
    mainLoop2();
}

window.generateStart = function(n) {
    cancelAnimationFrame(requestID);
    snaps = []; pens = [];
    colors = Random.colorGradientArray(color1,color2,n);
    for(let i=0;i<n;i++) pens.push(new DoublePendulum(Compute.degToRad(initTheta1+i),Compute.degToRad(initTheta2+i),length,radius,colors[i]));
    mainLoop();
}

window.update = function(type,value) {
    switch(type) {
        case "theta1":
            initTheta1 = parseFloat(value);
            break;
        case "theta2":
            initTheta2 = parseFloat(value);
            break;
        case "mode":
            mode = value;
            break;
        case "speed":
            runSpeed = parseInt(value);
            break;
    }
}

window.togglePath = function() {
    isDrawPath = !isDrawPath;
}