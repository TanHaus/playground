const ANGLE60 = Math.PI/3;
let iteration = 6;
let scale = 1;
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const w = canvas.clientWidth;
const h = canvas.clientHeight;

drawKoch();

function KochFull(x,y,angle,distance,iteration,scale) {
    distance *= scale;
    Koch(x,y,angle,distance,iteration,scale);
    x += distance*Math.cos(-angle);
    y += distance*Math.sin(-angle);
    if(distance < w) Koch(x,y,angle-ANGLE60*2,distance,iteration,scale);
    x += distance*Math.cos(ANGLE60*2-angle);
    y += distance*Math.sin(ANGLE60*2-angle);
    Koch(x,y,angle+ANGLE60*2,distance,iteration,scale);
}

function Koch(x,y,angle,distance,iteration,scale) {
    if(iteration==1) {
        if(x>w || y<0) return undefined;
        ctx.save();
        ctx.translate(x,y);
        
        ctx.save();
        ctx.scale(scale,scale);

        ctx.beginPath();
        ctx.moveTo(0,0);

        let distanceX = distance*Math.cos(-angle);
        let distanceY = distance*Math.sin(-angle);
        ctx.lineTo(distanceX,distanceY);

        ctx.restore();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.restore();

        return undefined;
    } else {
        let drawDistance = distance/3;
        if(drawDistance<1) iteration = 2;
        
        Koch(x,y,angle,drawDistance,iteration-1);

        let newX = drawDistance*Math.cos(-angle);
        let newY = drawDistance*Math.sin(-angle);
        Koch(x+newX,y+newY,angle+ANGLE60,drawDistance,iteration-1);
        
        newX += drawDistance*Math.cos(-angle-ANGLE60);
        newY += drawDistance*Math.sin(-angle-ANGLE60);
        Koch(x+newX,y+newY,angle-ANGLE60,drawDistance,iteration-1);
        
        newX += drawDistance*Math.cos(ANGLE60-angle);
        newY += drawDistance*Math.sin(ANGLE60-angle);
        Koch(x+newX,y+newY,angle,drawDistance,iteration-1);

        return undefined;
    }
}

function drawKoch(i,s) {
    ctx.clearRect(0,0,w,h);
    let x = 150;
    let y = 550;
    let distance = 500;
    if(i!=undefined) iteration = i;
    if(s!=undefined) scale = Math.pow(Math.E,s);
    
    ctx.font = '2rem sans-serif';
    ctx.fillText('Iteration: '+iteration,10,h-50);
    ctx.fillText('Scale: '+scale.toFixed(0),10,h-10)
    KochFull(x,y,ANGLE60,distance,iteration,scale);
}