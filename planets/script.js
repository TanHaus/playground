let canvas, ctx, draw;
let w,h;
let planets = [];
let GRAVITY = Math.pow(Math.E,5);
let mouse;
let selectedPlanet;
let requestID;
let gameState = 0;
let cM = {x: 0, y:0,};
let control = 'range';
let restitution = 1;

class Planet {
    constructor(x,y,speedX,speedY,mass,radius,color) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.forceX = 0;
        this.forceY = 0;
    }

    update() {
        this.speedX += this.forceX/this.mass;
        this.speedY += this.forceY/this.mass;
        this.x += this.speedX;
        this.y += this.speedY;
    }

    gravity(otherPlanet) {
        let gravity = -GRAVITY * (this.mass*otherPlanet.mass)/(Math.pow(this.distance(otherPlanet),2));
        let angle = this.slope(otherPlanet);
        this.forceX += gravity * Math.cos(angle);
        this.forceY += gravity * Math.sin(angle);
    }

    distance(otherPlanet) {
        return Math.sqrt(Math.pow(this.x-otherPlanet.x,2)+Math.pow(this.y-otherPlanet.y,2));
    }

    slope(otherPlanet) {
        let dy = this.y - otherPlanet.y;
        let dx = this.x - otherPlanet.x;
        return Math.atan2(dy,dx);
    }

    draw() {
        draw.filledCircle(this,this.radius,this.color);
    }

    drawSpeed() {
        draw.line(this,{x:this.x+this.speedX*10,y:this.y+this.speedY*10});
    }

    static selectPlanet(mouse,evt) {
        let mousePos = mouse.getRelativePosition(evt);
        
        for(let i=0; i<planets.length; i++) {
            if(draw.getDistance(planets[i],mousePos) < planets[i].radius) {
                selectedPlanet = planets[i];
                let form = document.querySelector('#control > form');
                form.elements['x'].value = selectedPlanet.x;
                form.elements['y'].value = selectedPlanet.y;
                form.elements['speedMagnitude'].value = selectedPlanet.speedMagnitude();
                form.elements['speedAngle'].value = Math.atan2(-selectedPlanet.speedY,selectedPlanet.speedX);
                form.elements['color'].value = selectedPlanet.color;
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

    resolveCollidePlanet(otherPlanet) {
        let planet = this;
        if(CollideDetect.collideBallBall(planet,otherPlanet)) { // check if two planetss collide
            let alpha = planet.slope(otherPlanet);  // get the normal direction
            let planetSpeedRotated = Planet.rotateSpeedAxis(planet,alpha);  // resolve speed into the direction of normal
            let otherSpeedRotated = Planet.rotateSpeedAxis(otherPlanet,alpha);

            let eqn = [[        1,             -1,                          otherSpeedRotated.speedX-planetSpeedRotated.speedX],  // solve for new normal speed
                       [planet.mass, otherPlanet.mass, planet.mass*planetSpeedRotated.speedX+otherPlanet.mass*otherSpeedRotated.speedX]];

            eqn[1][2] *= restitution;
            let eqnSolved = Planet.eqnSolver(eqn);
            planetSpeedRotated.speedX = eqnSolved.x;
            otherSpeedRotated.speedX = eqnSolved.y;

            planetSpeedRotated = Planet.rotateSpeedAxis(planetSpeedRotated,-alpha);  // get the speed back to original speed
            otherSpeedRotated = Planet.rotateSpeedAxis(otherSpeedRotated,-alpha);

            planet.speedX = planetSpeedRotated.speedX;
            planet.speedY = planetSpeedRotated.speedY;
            otherPlanet.speedX = otherSpeedRotated.speedX;
            otherPlanet.speedY = otherSpeedRotated.speedY;

            planet.x += planet.speedX;
            planet.y += planet.speedY;
            otherPlanet.x += otherPlanet.speedX;
            otherPlanet.y += otherPlanet.speedY;
        }
    }

    getEnergy() {
        let energy = 0;
        let planet = this;
        energy += 0.5 * planet.mass * (Math.pow(planet.speedX,2)+Math.pow(planet.speedY,2)); // kinertic energy
        planets.forEach(function(other){
            if(planet!==other) energy += -GRAVITY * (planet.mass*other.mass)/planet.distance(other); // gravitational potential energy
        });
        return energy;
    }

    static rotateSpeedAxis(ball,theta) {
        let speedMag = Math.sqrt(ball.speedX*ball.speedX + ball.speedY*ball.speedY);
        let theta0 = Math.atan2(ball.speedY, ball.speedX);
        return {
            speedX: speedMag*Math.cos(theta0-theta),
            speedY: speedMag*Math.sin(theta0-theta),
        }
    }

    static eqnSolver(matrix) {
        let a = matrix[0][0];
        let b = matrix[0][1];
        let m = matrix[0][2];
        let c = matrix[1][0];
        let d = matrix[1][1];
        let n = matrix[1][2];

        if(a*d==b*c) {
            if(a*n==c*m) {
                return 'Infinite number of solutions';
            } else return 'No solution found';
        } else {
            return {
                x: (m*d-n*b)/(a*d-b*c),
                y: (m*c-n*a)/(b*c-a*d),
            }
        }
    }

    dragPlanet(mouse,evt) {
        let mousePos = mouse.getRelativePosition(evt);
        this.x = mousePos.x;
        this.y = mousePos.y;
        Game.drawAll();
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
                if(CollideDetect.collideBallBall(planets[i],planets[j])) {
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
        ctx.clearRect(0,0,w,h);
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
    ctx = canvas.getContext('2d');
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    mouse = new Mouse(10,10,canvas);
    draw = new Draw(ctx);
    
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