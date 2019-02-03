// Declare global variables
let canvas, ctx;
let w,h;
let vOffset = 50, hOffset = 100;
let pendulumn;
let gravity = 9.81;
let documentWidth;
let requestID;
let gameState = 0;
let timer;

class Pendulumn {
    constructor(theta,mass,moInertia,length) {
        this.theta = theta;
        this.thetaSpeed = 0;
        this.thetaAccel = 0;
        this.torque = 0;
        this.theta0 = theta;
        this.mass = mass;
        this.length = length;
        this.moInertia = moInertia;
    }

    update() {
        this.torque = -this.mass * gravity/3600 * this.length * Math.sin(this.theta);  // gravity is m/s2 → need to divide by 60^2 to account for fps
        this.thetaAccel = this.torque / this.moInertia;  // torque is accounted for fps. Moment of Inertia is not dependent of fps
        this.thetaSpeed += this.thetaAccel/60;  // each update is at 1/60s → acceleration times time. acceleration is accounted for fps
        this.theta += this.thetaSpeed/60;  // each update is at 1/60s → acceleration times time. speed is accounted for fps
    }

    draw() {
        let linearPos = this.getLinearPos();
        Draw.line(hOffset,vOffset,linearPos.x+hOffset,linearPos.y+vOffset);
        Draw.filledCircle(linearPos.x+hOffset,linearPos.y+vOffset);
    }

    getLinearPos() {
        return {
            x: this.length * Math.sin(this.theta),
            y: this.length * Math.cos(this.theta),
        };
    }

    static degToRad(degree) {
        return degree*Math.PI/180;
    }
    static radToDeg(rad) {
        return rad/Math.PI*180;
    }

    getSimplePeriod() {
        return 2*Math.PI*Math.sqrt(this.moInertia/this.mass/(gravity/3600)/this.length);
    }
}

class Timer {
    constructor() {
        this.count = 0;
        this.ifCounting = false;
    }

    start() {
        this.count = 0;
        this.ifCounting = true;
    }

    stop() {
        this.ifCounting = false;
        let monitor = document.querySelector('#monitor');
        monitor.innerHTML += timer.getTime().toFixed(5) + '<br>';
    }

    update() {
        if(this.ifCounting==true) this.count++;
    }

    getTime() {
        return this.count/60;
    }
}

class Draw {
    static filledCircle(x,y,radius=20,color='red') {
        ctx.save();
        ctx.translate(x,y);
        ctx.beginPath();
        ctx.arc(0,0,radius,0,2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }
    static line(x1,y1,x2,y2,weight=2,color='black') {
        ctx.save();
        ctx.translate(x1,y1);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(x2-x1,y2-y1);
        ctx.lineWidth = weight;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
    }
}

class Game {
    static start(angle=45) {
        pendulumn = new Pendulumn(Pendulumn.degToRad(angle),100,10,100);
        
        // set the sliders to correct value
        let form = document.querySelector('form');
        form.elements['mass'].value = pendulumn.mass;
        form.elements['moInertia'].value = pendulumn.moInertia;
        form.elements['penLength'].value = pendulumn.length;
        form.elements['theta0'].value = Pendulumn.radToDeg(pendulumn.theta0);

        if(gameState==0) {
            gameState = 1;
            ctx.clearRect(0,0,w,h);
            pendulumn.draw();
            Game.mainloop();
        }
    }

    static mainloop() {
        ctx.clearRect(0,0,w,h);
        pendulumn.update();
        pendulumn.draw();
        show();
        timer.update();

        requestID = requestAnimationFrame(Game.mainloop);
    }

    static stop() {
        if(gameState==1) {
            gameState = 0;
            requestID = cancelAnimationFrame(requestID);
        }
    }
}

window.onload = function init() {
    // Set up global variables
    canvas = document.querySelector('#myCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();

    timer = new Timer();

    Game.start();
};

window.onresize = function(){
    resizeCanvas();
}

function update(value,type) {
    switch(type) {
        case 'mass':
            pendulumn.mass = parseInt(value);
            break;
        case 'moInertia':
            pendulumn.moInertia = parseInt(value);
            break;
        case 'length':
            pendulumn.length = parseInt(value);
            ctx.clearRect(0,0,w,h);
            pendulumn.draw();
            break;
    }
    show();
}

function resizeCanvas() {
    documentWidth = document.documentElement.clientWidth;
    if(documentWidth>=1000) canvas.width = documentWidth/2;
    else canvas.width = documentWidth;
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    hOffset = w/2;
    vOffset = h/3;
}

function show() {
    let variables = document.querySelector('#variables');
    variables.innerHTML = '<tbody>'+
                            '<tr>   <th>Angular position (rad)</th>   <td>'+pendulumn.theta.toExponential(2)+'</td>    </tr>'+
                            '<tr>   <th>Angular velocity (rad/s)</th>   <td>'+pendulumn.thetaSpeed.toExponential(2)+'</td>    </tr>'+
                            '<tr>   <th>Angular acceleration (rad/s2)</th>   <td>'+pendulumn.thetaAccel.toExponential(2)+'</td>    </tr>'+
                            '<tr>   <th>Mass</th>   <td>'+pendulumn.mass+'</td>   </tr>'+
                            '<tr>   <th>Moment of Inertia</th>   <td>'+pendulumn.moInertia+'</td>   </tr>'+
                            '<tr>   <th>Length</th>   <td>'+pendulumn.length+'</td>   </tr>'+
                          '</tbody>';
    let monitor = document.querySelector('#monitor');
    monitor.children[1].innerHTML = '<li>Period (simple pendulumn): '+pendulumn.getSimplePeriod().toFixed(5)+'</li>';
    if(timer.getTime()%1==0 && timer.getTime()!=0) monitor.innerHTML += timer.getTime() + '<br>';
}