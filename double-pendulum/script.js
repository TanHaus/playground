import { Compute,Random } from '../libraries/math.js';

const GRAVITY = 9.81;
const speed = 5;
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const DPIscale = window.devicePixelRatio;
let requestID = 0;
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
        this.theta1 = theta1; this.omega1 = 0; this.alpha1 = 0;
        this.theta2 = theta2; this.omega2 = 0; this.alpha2 = 0;
        this.length = length; this.radius = radius; this.color = color;
    }
    update() {
        let sin1 = Math.sin(this.theta1), sin2 = Math.sin(this.theta2),
            cos1 = Math.cos(this.theta1), cos2 = Math.cos(this.theta2),
            A = Math.cos(this.theta1-this.theta2),
            B = Math.sin(this.theta1-this.theta2),
            angular = -GRAVITY/this.length, divide = 2-A*A;
        
        this.alpha1 = (angular*(2*sin1-A*sin2)-B*(this.omega2*this.omega2+A*this.omega1*this.omega1))/divide;
        this.alpha2 = (angular*2*(A*sin1-sin2)-B*(A*this.omega2*this.omega2+2*this.omega1*this.omega1))/-divide;
        this.omega1 += this.alpha1/60*speed; this.theta1 += this.omega1/60*speed;
        this.omega2 += this.alpha2/60*speed; this.theta2 += this.omega2/60*speed;
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
        for(let j=0;j<runSpeed;j++) pens[i].update();
        pens[i].draw();
    }
    pens[0].takeSnap();
    if(isDrawPath) drawSnaps(snaps);
    requestID = requestAnimationFrame(mainLoop);
}

function mainLoop2() {
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<pens.length;i++) {
        for(let j=0;j<runSpeed;j++) pens[i].update();
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
    //for(let i=0;i<n;i++) pens.push(new DoublePendulum(Compute.degToRad(80+i),Compute.degToRad(310+i),length,radius,colors[i]));
    for(let i=0;i<n;i++) pens.push(new DoublePendulum(Compute.degToRad(initTheta1+i),Compute.degToRad(initTheta2+i),length,radius,colors[i]));
    mainLoop();
}

window.speedUp = function(value) {
    runSpeed = value;
}

window.update = function(type,value) {
    switch(type) {
        case "theta1":
            initTheta1 = parseFloat(value);
            break;
        case "theta2":
            initTheta2 = parseFloat(value);
            break;
    }
}

window.togglePath = function() {
    isDrawPath = !isDrawPath;
}