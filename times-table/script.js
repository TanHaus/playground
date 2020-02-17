let iteration = 6;
let scale = 1;
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const DPIscale = window.devicePixelRatio;
let w = canvas.clientWidth*DPIscale;
let h = canvas.clientHeight*DPIscale;

canvas.width = w;
canvas.height = h;


function draw() {
    ctx.clearRect(0,0,w,h);
    ctx.translate(400, 400);
    ctx.beginPath();
    ctx.moveTo(200, 0);
    for (let i = 1; i < 10; i++)  {
        ctx.lineTo(Math.cos(2*Math.PI/10*i)*200, Math.sin(2*Math.PI/10*i)*200);
    }
    ctx.closePath();
    ctx.stroke();
    
    ctx.font = '2rem sans-serif';
}

window.resize = function() {
    w = canvas.clientWidth*DPIscale;
    h = canvas.clientHeight*DPIscale;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0,0,w,h);
    draw();
}
window.onresize = resize

draw();