const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

const w = canvas.clientWidth,
      h = canvas.clientHeight;

const xOffset = w/2,
      yOffset = h/2;

let X0 = 300,
    Y0 = 300;

let x,y;

let oX = 5,
    oY = 6;
let pX = Math.PI/3,
    pY = Math.PI/4;

function draw() {
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate(xOffset,yOffset);
    ctx.beginPath();
    
    x = X0*Math.sin(-pX);
    y = -Y0*Math.cos(-pY);
    ctx.moveTo(x,y);
    
    for(let t=0.01;t<Math.PI*2;t+=0.01) {
      x = X0*Math.sin(oX*t-pX);
      y = -Y0*Math.cos(oY*t-pY);
      ctx.lineTo(x,y);
    }
    
    ctx.stroke();
    ctx.restore();
}

function updateVal(value,type) {
    console.log('Hello');
    switch(type) {
        case 'oX':
          oX = parseFloat(value);
          break;
        case 'oY':
          oY = parseFloat(value);
          break;
        case 'pX':
          pX = parseFloat(value);
          break;
        case 'pY':
          pY = parseFloat(value);
          break;  
    }
    draw();
}

draw();