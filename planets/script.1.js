//
let canvas, draw;
let w,h;

//
let planets = [];
const GRAVITY = 6.67408e-11;
let mouse;
let selectedPlanet;
let requestID;
let gameState = 0;
let cM = {x: 0, y:0,};
let control = 'range';
let restitution = 1;
let timeScale = 1e10;

class Planet {
    constructor(x,y,speedX,speedY,mass,radius,color) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.accelX = 0;
        this.accelY = 0;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.forceX = 0;
        this.forceY = 0;
    }

    update() {
        this.accelX  = (this.forceX/3600)/this.mass   // force is in unit kg m s-2 → account for 60fps
        this.accelY  = (this.forceY/3600)/this.mass
        this.speedX += this.accelX/60*timeScale;      // time = 1/60s
        this.speedY += this.accelY/60*timeScale;
        this.x      += this.speedX/60*timeScale;
        this.y      += this.speedY/60*timeScale;
    }

    gravity(other) {
        let gravity = -GRAVITY * (this.mass*other.mass)/Compute.distance(this,other);
        let angle = this.slope(other);
        this.forceX += gravity * Math.cos(angle);
        this.forceY += gravity * Math.sin(angle);
    }

    slope(otherPlanet) {
        let dy = this.y - otherPlanet.y;
        let dx = this.x - otherPlanet.x;
        return Math.atan2(dy,dx);
    }

    draw() {
        draw.filledCircle(this.this.radius,this.color);
    }

    drawSpeed() {
        draw.line(this,{x:this.x+this.speedX*10,y:this.y+this.speedY*10});
    }

    static selectPlanet(mouse,evt) {
        let mousePos = mouse.getRelativePosition(evt);
        
        for(let i=0; i<planets.length; i++) {
            if(Compute.distance(planets[i],mousePos) < planets[i].radius) {
                selectedPlanet = planets[i];
                let form = document.querySelector('#control > form');
                form.elements['x'].value              = selectedPlanet.x;
                form.elements['y'].value              = selectedPlanet.y;
                form.elements['speedMagnitude'].value = selectedPlanet.speedMagnitude();
                form.elements['speedAngle'].value     = Math.atan2(-selectedPlanet.speedY,selectedPlanet.speedX);
                form.elements['color'].value          = selectedPlanet.color;
                break;
            }
        }
    }

    drawForce() {
        draw.line(this,{x:this.x+this.forceX,y:this.y+this.forceY},undefined,'green');
    }

    resetForce() {
        this.forceX = 0;
        this.forceY = 0;
    }

    speedMagnitude() {
        return Math.sqrt(Math.pow(this.speedX,2)+Math.pow(this.speedY,2));
    }

    forceMagnitude() {
        return Math.sqrt(Math.pow(this.forceX,2)+Math.pow(this.forceY,2));
    }

    toString() {
        return 'x: ' + this.x + '\ny: ' + this.y;
    }

    resolveCollidePlanet(other) {
        let planet = this;

        // check if two balls collide
        if(Collide.detectBallBall(planet,other)) { 
            // get the normal direction
            let alpha = planet.slope(other);

            // resolve speed into the direction of normal
            let planetSpeedRotated = Planet.rotateSpeedAxis(planet,alpha);
            let otherSpeedRotated  = Planet.rotateSpeedAxis(other,alpha);

            let eqnSolved = Collide.resolve1D(planet.mass,planetSpeedRotated.speedX,other.mass,otherSpeedRotated.speedX,restitution);

            planetSpeedRotated.speedX = eqnSolved.x;
            otherSpeedRotated.speedX  = eqnSolved.y;

            // get the speed back to original speed
            planetSpeedRotated  = Planet.rotateSpeedAxis(planetSpeedRotated,-alpha);  
            otherSpeedRotated = Planet.rotateSpeedAxis(otherSpeedRotated,-alpha);

            planet.speedX = planetSpeedRotated.speedX;       planet.speedY = planetSpeedRotated.speedY;
            other.speedX  = otherSpeedRotated.speedX;      other.speedY  = otherSpeedRotated.speedY;
        }
    }

    getEnergy() {
        let energy = 0;
        let planet = this;
        energy += 0.5 * planet.mass * (Math.pow(planet.speedX,2)+Math.pow(planet.speedY,2)); // kinertic energy
        planets.forEach(function(other){
            if(planet!==other) energy += -GRAVITY * (planet.mass*other.mass)/Compute.distance(planet,other); // gravitational potential energy
        });
        return energy;
    }

    static rotateSpeedAxis(ball,theta) {
        let result = Compute.rotateVector({x:ball.speedX,y:ball.speedY},theta);
        return {
            speedX: result.x,
            speedY: result.y,
        }
    }

    dragPlanet(mouse,evt) {
        let mousePos = mouse.getRelativePosition(evt);
        this.x = mousePos.x;
        this.y = mousePos.y;
        Game.drawAll();
    }
}

class Configuration {
    static SunEarth() {

    }
    static Binary() {

    }
    static Circular() {
        planets = [];
        let mass1 = 5.972e24;
        let mass2 = 7.348e22;
        planets.push(new Planet(w/2,h/2,0,0,mass1,20,'green')); // Earth
        planets.push(new Planet(w/2+100,h,0,circularSpeed,mass2,10,'red'));
    }
}

class Game {
    static updatePlanets(planets) {
        planets.forEach(function(planet) {
            planet.resetForce();
        });
        for(let i=0; i<planets.length; i++) {
            for(let j=0; j<i; j++) {
                planets[i].gravity(planets[j]);
                planets[j].gravity(planets[i]);
                if(Collide.detectBallBall(planets[i],planets[j])) {
                    planets[i].resolveCollidePlanet(planets[j]);
                }
            }
        }
        if(gameState==1) planets.forEach(function(planet) {
            planet.update();
        });
    }

    static drawPlanets(planets) {
        planets.forEach(function(planet) {
            planet.draw();
            planet.drawSpeed();
            planet.drawForce();
        });
    }

    static addPlanet() {
        canvas.addEventListener('mousedown', Game.processPlanet);
        let instruction = document.querySelector('#instruction');
        instruction.innerHTML = '<p>Click where you want the new planet to be at</p>';
    }

    static movePlanet() {
        selectedPlanet = undefined;
        canvas.addEventListener('mousemove', processMouseMove);

        function processMouseMove(evt){
            selectedPlanet.dragPlanet(mouse,evt);
            canvas.addEventListener('mouseup', processMouseUp);
        }

        function processMouseUp(evt){
            canvas.removeEventListener('mousemove', processMouseMove);
            canvas.removeEventListener('mouseup', processMouseUp);
        }
    }

    static processPlanet(evt) {
        let mousePos = mouse.getRelativePosition(evt);
        planets.push(new Planet(mousePos.x,mousePos.y,0,0,1,20,'black'));
        let instruction = document.querySelector('#instruction');
        instruction.innerHTML = '';
        Game.drawAll();
        canvas.removeEventListener('mousedown', Game.processPlanet);
    }

    static resume() {
        Game.drawAll();

        if(gameState == 0) {
            Game.setGameState(1);
            Game.mainloop();
        }
    }

    static stop() {
        cancelAnimationFrame(requestID);
        Game.setGameState(0);
    }

    static mainloop() {
        Game.updatePlanets(planets);
        
        Game.drawAll();

        requestID = requestAnimationFrame(Game.mainloop);
    }

    static drawAll() {
        canvas.getContext('2d').clearRect(0,0,w,h);
        updateCM();
        Game.drawPlanets(planets);
        drawCM();
        printVariables(planets);
    }

    static reset() {
        planets = [];
        Game.setGameState(0);
        Game.drawAll();
    }

    static setGameState(value) {
        gameState = value;
        if(gameState==0) document.querySelector('#gameState').innerHTML = 'Game state: Stopped';
        else if(gameState==1) document.querySelector('#gameState').innerHTML = 'Game state: Started';
    }
}

window.onload = function init() {
    canvas = document.querySelector('#myCanvas');
    w = canvas.clientWidth;
    h = canvas.clientHeight;

    mouse = new Mouse(10,10,canvas);
    draw = new Draw(canvas);
    
    canvas.addEventListener('mousedown', function(evt){
        Planet.selectPlanet(mouse,evt);
    });
    
    let form = document.querySelector('#control > form');
    form.elements['x'].max = w;
    form.elements['y'].max = h;
    form.elements['speedAngle'].max = Math.PI;
    form.elements['speedAngle'].min = -Math.PI;
}

function updateCM(list=planets) {
    cM.x = 0;
    cM.y = 0;
    let totalMass = 0;
    list.forEach(function(planet) {
        cM.x += planet.mass*planet.x;
        cM.y += planet.mass*planet.y;
        totalMass += planet.mass;
    });
    cM.x = cM.x/totalMass;
    cM.y = cM.y/totalMass;
}

function drawCM() {
    draw.cross(cM);
}

function update(value,type) {
    let magnitude,angle;
    switch(type) {
        case 'x': 
            selectedPlanet.x = parseInt(value);
            break;
        case 'y':
            selectedPlanet.y = parseInt(value);
            break;
        case 'mass':
            selectedPlanet.mass = parseInt(value);
            break;
        case 'speedMagnitude':
            magnitude = parseFloat(value);
            angle = Math.atan2(selectedPlanet.speedY,selectedPlanet.speedX);
            selectedPlanet.speedX = magnitude*Math.cos(angle);
            selectedPlanet.speedY = magnitude*Math.sin(angle);
            break;
        case 'speedAngle':
            magnitude = selectedPlanet.speedMagnitude();
            angle = parseFloat(-value);
            selectedPlanet.speedX = magnitude*Math.cos(angle);
            selectedPlanet.speedY = magnitude*Math.sin(angle);
            break;
        case 'color':
            selectedPlanet.color = value;
            break;
        case 'gravity':
            GRAVITY = Math.pow(Math.E, parseFloat(value));
            document.querySelector('#gravity').innerHTML = 'Gravity: ' + GRAVITY.toFixed(2);
            break;
    }
    Game.updatePlanets(planets);
    Game.drawAll();
}

function switchControl() {
    let form = document.querySelector('#control > form');
    for(let i=0; i<form.elements.length; i++) {
        if(form.elements[i].type==control) {
            if(control=='range') {
                form.elements[i].type='number';
            } else if(control=='number') {
                form.elements[i].type='range';
            }
        }
    }

    if(control=='range') {
        control='number';
        form.elements['switch'].value = 'Switch to exact value';
    } else if(control=='number') {
        control='range';
        form.elements['switch'].value = 'Switch to slider';
    }
}

function printVariables(listPlanet) {
    let table = document.querySelector('#variables');
    let size = listPlanet.length;
    table.innerHTML = '<thead><tr>'+
                        '<th>Index</th>'+
                        '<th>x    </th>'+
                        '<th>y    </th>'+
                        '<th>Mass </th>'+
                        '<th>Force</th>'+
                        '<th>Energy</th>'+
                      '</tr></thead><tbody>';
    for(let i=0; i<size; i++) {
        table.innerHTML += '<tr>'+
                                '<td>'+(i+1)                      +'</td>'+
                                '<td>'+Math.round(listPlanet[i].x)+'</td>'+
                                '<td>'+Math.round(listPlanet[i].y)+'</td>'+
                                '<td>'+listPlanet[i].mass         +'</td>'+
                                '<td>'+listPlanet[i].forceMagnitude().toExponential(2)+'</td>'+
                                '<td>'+listPlanet[i].getEnergy().toExponential(2)+'</td>'+
                            '</tr>';
    }
    table.innerHTML += '</tbody>';
}