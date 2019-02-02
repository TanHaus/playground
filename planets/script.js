let canvas, ctx;
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
        Draw.filledCircle(this.x,this.y,this.radius,this.color);
    }

    drawSpeed() {
        Draw.line(this.x,this.y,this.x+this.speedX*10,this.y+this.speedY*10);
    }

    static selectPlanet(mouse,evt) {
        let mousePos = mouse.getMousePositionRelative(evt);
        
        for(let i=0; i<planets.length; i++) {
            if(Draw.getDistance(planets[i],mousePos) < planets[i].radius) {
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
        Draw.line(this.x,this.y,this.x+this.forceX,this.y+this.forceY,undefined,'green');
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
        if(Collide.collideBallBall(planet,otherPlanet)) { // check if two planetss collide
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
        let mousePos = mouse.getMousePositionRelative(evt);
        this.x = mousePos.x;
        this.y = mousePos.y;
        Game.drawAll();
        //console.log('dragging');
    }
}

class Collide {
    static collideBallBox(ball,box) {
        let x = ball.x;
        let y = ball.y;
        if(x < box.x) x = box.x;
        else if(x > box.x+box.width) x = box.x+box.width;
        if(y < box.y) y = box.y;
        else if(y > box.y+box.height) y = box.y+box.height;

        return (Math.pow(ball.x-x,2)+Math.pow(ball.y-y,2) < Math.pow(ball.radius,2));
    }

    static collideBallBall(ball1, ball2) {
        let radiusSum = ball1.radius + ball2.radius;
        let distanceSquared = Math.pow((ball1.x-ball2.x),2) + Math.pow((ball1.y-ball2.y),2);
        if (distanceSquared>Math.pow(radiusSum,2)) return false;
        return true;
    }

    static collideBoxBox(box1, box2) {

    }
}

class Draw {
    static filledCircle(x,y,radius,color) {
        ctx.save();

        ctx.translate(x,y);
        ctx.beginPath();
        ctx.arc(0,0,radius,0,2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
    }

    static getDistance(obj1,obj2) {
        return Math.sqrt(Math.pow(obj1.x-obj2.x,2)+Math.pow(obj1.y-obj2.y,2));
    }

    static cross(pos,length=5,weight=2) {
        ctx.save();

        ctx.translate(pos.x,pos.y);
        ctx.beginPath();
        ctx.moveTo(-length,-length);
        ctx.lineTo(length,length);
        ctx.moveTo(-length,length);
        ctx.lineTo(length,-length);
        ctx.lineWidth = weight;
        ctx.stroke();

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

class Mouse {
    constructor(x,y,object) {
        this.x = x;
        this.y = y;
        this.object = object;
    }
    
    getMousePositionRelative(evt) {
        let rect = this.object.getBoundingClientRect();
        if(evt.type == 'touchmove'){
            this.x = evt.changedTouches.item(0).clientX - rect.left;
            this.y = evt.changedTouches.item(0).clientY - rect.top;
        } else {
            this.x = evt.clientX - rect.left;
            this.y = evt.clientY - rect.top;    
        }
        
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        }
    }
}

class Random {
    static generateRandom(min,max,signed=false) {
        let range = max-min;
        let value = min+Math.round(Math.random()*range)
        if(signed==false) return value;
        
        let a = 1;
        if(Math.random()>0.5) a = -a;
        return value*a;
    }
    
    static getRandomColor() {
        let colors = ['red', 'green', 'blue'];
        let size = colors.length;
        return colors[Random.generateRandom(0,size-1)];
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
                if(Collide.collideBallBall(planets[i],planets[j])) {
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
        let mousePos = mouse.getMousePositionRelative(evt);
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
    Draw.cross(cM);
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