// Declare global variables
let canvas, ctx;
let w,h;
let vOffset = 50, hOffset = 100;
let pendulum;
let gravity = 9.81;
let requestID;
let gameState = 0;
let timer;

class Pendulum {
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
        let showTimer = document.querySelector('#timer');
        showTimer.innerHTML = 'Timer: 0';
    }

    stop() {
        this.ifCounting = false;
        let showTimer = document.querySelector('#timer');
        showTimer.innerHTML = 'Timer: ' + timer.getTime().toFixed(5);
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
        if(pendulum===undefined) pendulum = new Pendulum(Pendulum.degToRad(angle),50,20,200);
        else pendulum = new Pendulum(Pendulum.degToRad(angle),pendulum.mass,pendulum.moInertia,pendulum.length);
        
        // set the sliders to correct value
        let form = document.querySelector('form');
        form.elements['mass'].value = pendulum.mass;
        form.elements['moInertia'].value = pendulum.moInertia;
        form.elements['penLength'].value = pendulum.length;
        form.elements['theta0'].value = Pendulum.radToDeg(pendulum.theta0);

        if(gameState==0) {
            gameState = 1;
            ctx.clearRect(0,0,w,h);
            pendulum.draw();
            Game.mainloop();
        }
    }

    static mainloop() {
        ctx.clearRect(0,0,w,h);
        pendulum.update();
        pendulum.draw();
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
            pendulum.mass = parseInt(value);
            break;
        case 'moInertia':
            pendulum.moInertia = parseInt(value);
            break;
        case 'length':
            pendulum.length = parseInt(value);
            ctx.clearRect(0,0,w,h);
            pendulum.draw();
            break;
    }
    show();
}

function resizeCanvas() {
    let documentWidth = document.documentElement.clientWidth;
    let documentHeight = document.documentElement.clientHeight;
    
    if(documentWidth>=1000) {
        canvas.width = documentWidth/2;
        canvas.height = documentHeight*0.9;
    } else {
        canvas.width = documentWidth;
        canvas.height = documentHeight*0.5;
    }

    w = canvas.clientWidth;
    h = canvas.clientHeight;
    hOffset = w/2;
    vOffset = h/3;
}

function show() {
    let variables = document.querySelector('#variables');
    variables.innerHTML = '<tbody>'+
                            '<tr>   <th>Angular position (rad)</th>   <td>'+pendulum.theta.toExponential(2)+'</td>    </tr>'+
                            '<tr>   <th>Angular velocity (rad/s)</th>   <td>'+pendulum.thetaSpeed.toExponential(2)+'</td>    </tr>'+
                            '<tr>   <th>Angular acceleration (rad/s2)</th>   <td>'+pendulum.thetaAccel.toExponential(2)+'</td>    </tr>'+
                            '<tr>   <th>Mass</th>   <td>'+pendulum.mass+'</td>   </tr>'+
                            '<tr>   <th>Moment of Inertia</th>   <td>'+pendulum.moInertia+'</td>   </tr>'+
                            '<tr>   <th>Length</th>   <td>'+pendulum.length+'</td>   </tr>'+
                          '</tbody>';
    let monitor = document.querySelector('#monitor');
    monitor.children[1].children[0].innerHTML = 'Period (small oscillation): '+pendulum.getSimplePeriod().toFixed(5);
    
    let showTimer = document.querySelector('#timer');
    if(timer.getTime()%1==0 && timer.getTime()!=0) showTimer.innerHTML = 'Timer: ' + timer.getTime().toFixed();
}