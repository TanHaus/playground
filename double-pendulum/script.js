import { Compute } from '../libraries/math.js';

const GRAVITY = 9.81;
const speed = 5;
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
let requestID = 0;
let w = canvas.clientWidth,
    h = canvas.clientHeight,
    offsetX = w/2,
    offsetY = h/3;

canvas.width = w;
canvas.height = h;

window.onresize = function() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;
    offsetX = w/2;
    offsetY = h/3;
}

class DoublePendulum {
    constructor(theta1,theta2,length,radius) {
        this.theta1 = theta1; this.omega1 = 0; this.alpha1 = 0;
        this.theta2 = theta2; this.omega2 = 0; this.alpha2 = 0;
        this.length = length; this.radius = radius;
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
    
        snaps.push({x:  this.length*(sin1 + sin2),
                    y: -this.length*(cos1 + cos2),});
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
        ctx.fill();
    
        ctx.beginPath();
        ctx.arc(position.x2,-position.y2,this.radius,0,2*Math.PI);
        ctx.fill();
        ctx.restore();
    }

    draw2() {
        let position = toPosition(this);
        ctx.save();
        ctx.translate(offsetX,offsetY);
        ctx.beginPath();
        ctx.arc(position.x2,-position.y2,this.radius,0,2*Math.PI);
        ctx.fill();
        ctx.restore();
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
    ctx.stroke();
    ctx.restore();
}

function mainLoop() {
    ctx.clearRect(0,0,w,h);
    /*
    pen1.update();
    pen1.draw();
    drawSnaps(snaps);
    */
    for(let i=0;i<pens.length;i++) {
        pens[i].update();
        pens[i].draw();
    }
    drawSnaps(snaps);
    requestID = requestAnimationFrame(mainLoop);
}

function mainLoop2() {
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<pens.length;i++) {
        pens[i].update();
        pens[i].draw2();
    }
    requestID = requestAnimationFrame(mainLoop2);
}
/*
let pen1 = new DoublePendulum(Compute.degToRad(140),Compute.degToRad(1750),100,10);
mainLoop();
*/
window.showTop = function() {
    cancelAnimationFrame(requestID);
    mainLoop();
}
window.noShowTop = function() {
    cancelAnimationFrame(requestID);
    mainLoop2();
}

let pens = [];
for(let i=0;i<1;i++) {
    pens.push(new DoublePendulum(Compute.degToRad(80),Compute.degToRad(1750),100,10));
}
mainLoop();