const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const DPIscale = window.devicePixelRatio;

let w,h,
    xOffset,yOffset,
    X0,Y0;

let x,y;
let oX = 5,
    oY = 6;
let pX = Math.PI/3,
    pY = Math.PI/4;
  
window.resize = function() {
  w = canvas.clientWidth*DPIscale;
  h = canvas.clientHeight*DPIscale;
  xOffset = w/2;
  yOffset = h/2;
  canvas.width = w;
  canvas.height = h;
  X0 = Math.min(w,h)/3;
  Y0 = X0;
  draw();
}

resize();
draw();
window.onresize = resize;

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
  ctx.lineWidth = Math.min(w,h)/200;
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
