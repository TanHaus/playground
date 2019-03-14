import { Compute } from '../libraries/math.js';
import { Draw } from '../libraries/misc.js';

// Declare global variables
const canvas = document.querySelector('#myCanvas');
const DPIscale = window.devicePixelRatio;
let w,h;
let vOffset = 50, hOffset = 0.3;

let periodShow = document.querySelector('#period'),
    thetaShow = document.querySelector('#theta'),
    omegaShow = document.querySelector('#omega'),
    alphaShow = document.querySelector('#alpha'),
    massShow = document.querySelector('#mass'),
    inertiaShow = document.querySelector('#I'),
    lengthShow = document.querySelector('#length'),
    showTimer = document.querySelector('#timer');

// Game variables
let pendulum;
const GRAVITY = 9.81;
let requestID;
let gameState = 0;

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
        this.torque      = -this.mass*(GRAVITY/3600)*this.length*Math.sin(this.theta);  // gravity is m/s2 → need to divide by 60^2 to account for fps
        this.thetaAccel  = this.torque / this.moInertia;                                // torque is accounted for fps. Moment of Inertia is not dependent of fps
        this.thetaSpeed += this.thetaAccel/60;                                          // each update is at 1/60s → acceleration times time. acceleration is accounted for fps
        this.theta      += this.thetaSpeed/60;                                          // each update is at 1/60s → acceleration times time. speed is accounted for fps
    }

    draw() {
        // draw relative to the offset
        let linearPos = this.getLinearPos();
        
        let ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(hOffset,vOffset);
        
        Draw.line(0,0,linearPos.x,linearPos.y,undefined,undefined,canvas);
        Draw.filledCircle(linearPos.x,linearPos.y,20,'red',canvas);
        
        ctx.restore();
    }

    getLinearPos() {
        return {
            x: this.length * Math.sin(this.theta),
            y: this.length * Math.cos(this.theta),
        };
    }

    getSimplePeriod() {
        return 2*Math.PI*Math.sqrt(this.moInertia/(this.mass*(GRAVITY/3600)*this.length));
    }
}

class Timer {
    constructor() {
        this.count = 0;
        this.ifCounting = false;
    }

    start() {
        // when start the timer, reset count to zero, set the state to counting
        this.count = 0;
        this.ifCounting = true;
        showTimer.innerText = 0;
    }

    stop() {
        this.ifCounting = false;
        showTimer.innerText = timer.getTime().toFixed(5);
    }

    update() {
        // count per frame
        if(this.ifCounting==true) this.count++;
    }

    getTime() {
        // since fps = 60, actual time have to be divided by 60
        return this.count/60;
    }
}

class Game {
    static start(angle=45) {
        if(pendulum===undefined) pendulum = new Pendulum(Compute.degToRad(angle),50,20,200);
        else pendulum = new Pendulum(Compute.degToRad(angle),pendulum.mass,pendulum.moInertia,pendulum.length);
        
        // set the sliders to correct value
        let form = document.querySelector('form');
        form.elements['mass'].value      = pendulum.mass;
        form.elements['moInertia'].value = pendulum.moInertia;
        form.elements['penLength'].value = pendulum.length;
        form.elements['theta0'].value    = Compute.radToDeg(pendulum.theta0);

        // if game is not running, start the game
        if(gameState==0) {
            gameState = 1;
            canvas.getContext('2d').clearRect(0,0,w,h);
            pendulum.draw();
            Game.mainloop();
        }
    }

    static mainloop() {
        canvas.getContext('2d').clearRect(0,0,w,h);
        pendulum.update();
        timer.update();
        pendulum.draw();
        show();
        requestID = requestAnimationFrame(Game.mainloop);
    }

    static stop() {
        if(gameState==1) {
            gameState = 0;
            requestID = cancelAnimationFrame(requestID);
        }
    }
}

window.startGame = function(value) {
    Game.start(value);
};
window.stopGame = function() {
    Game.stop();
}

// main program
window.timer = new Timer();
resizeCanvas();
Game.start();

window.onresize = function(){
    resizeCanvas();
}

window.update = function(value,type) {
    switch(type) {
        case 'mass':
            pendulum.mass = parseInt(value);
            break;
        case 'moInertia':
            pendulum.moInertia = parseInt(value);
            break;
        case 'length':
            pendulum.length = parseInt(value);
            // redraw when game is stopped
            if(gameState==0) {
                canvas.getContext('2d').clearRect(0,0,w,h);
                pendulum.draw();
            }
            break;
    }
    // update parameters
    show();
};

function resizeCanvas() {
    w = canvas.clientWidth*DPIscale;
    h = canvas.clientHeight*DPIscale;
    canvas.width = w;
    canvas.height = h;
    hOffset = w/2;
    vOffset = h/3;
}

function show() {
    thetaShow.innerText = pendulum.theta.toExponential(2);
    omegaShow.innerText = pendulum.thetaSpeed.toExponential(2);
    alphaShow.innerText = pendulum.thetaAccel.toExponential(2);
    massShow.innerText = pendulum.mass;
    inertiaShow.innerText = pendulum.moInertia;
    lengthShow.innerText = pendulum.length;

    periodShow.innerText = pendulum.getSimplePeriod().toFixed(5);

    // when timer is counting, only show when the time is a whole number (excluding zero)
    if(timer.ifCounting==true && timer.getTime()%1==0) showTimer.innerText = timer.getTime().toFixed();
}