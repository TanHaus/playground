import { Signal, Graph, Polynomial } from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas'),
      ctx = canvas.getContext('2d'),
      DPIscale = window.devicePixelRatio;

let w = canvas.clientWidth*DPIscale,
    h = canvas.clientHeight*DPIscale;
canvas.height = h; canvas.width = w;
window.onresize = function() {
    w = canvas.clientWidth*DPIscale;
    h = canvas.clientHeight*DPIscale;
    canvas.height = h;
    canvas.width = w;
    draw();
}

const showFn = document.querySelector('#Fn');

let xRange = [-5,5];
let yRange = [-5,5];

const polySection = document.querySelector('#poly');
const cosineSection = document.querySelector('#cosine');
const genericSection = document.querySelector('#generic');
const showError = document.querySelector('#error');

window.currentFn = polySection;
let poly;

Graph.drawAxis(xRange,yRange,canvas);

window.update = function(type) {
    let temp;
    switch(type) {
        case 'poly':
            temp = document.querySelector('#polyCoeff').value.split(',');
            let coeff = [];
            for(let i=0; i<temp.length; i++) {
                coeff[i] = parseFloat(temp[temp.length-i-1]);
            }
            poly = new Polynomial(coeff);
            if(isNaN(poly.eval(0))) {
                error.innerHTML = 'There is an ERROR. Please type the coefficients correctly';
                showFn.innerText = '';
            } else {
                error.innerHTML = '';
                katex.render(poly.toString('latex'),showFn);
            }
            break;
        case 'xRange':
            temp = document.querySelector('#xRange').value.split(',');
            if(temp.length!=2) throw 'Range of x must contain only 2 numbers';
            xRange[0] = parseFloat(temp[0]);
            xRange[1] = parseFloat(temp[1]);
            break;
        case 'yRange':
            temp = document.querySelector('#yRange').value.split(',');
            if(temp.length!=2) throw 'Range of x must contain only 2 numbers';
            yRange[0] = parseFloat(temp[0]);
            yRange[1] = parseFloat(temp[1]);
            break;
    }
}

window.changeFn = function(type) {
    currentFn.classList.add('hidden');
    switch(type) {
        case 'poly':
            currentFn = polySection;
            break;
        case 'cosine':
            currentFn = cosineSection;
            break;
        case 'generic':
            currentFn = genericSection;
    }
    currentFn.classList.remove('hidden');
}

window.draw = function(type) {
    ctx.clearRect(0,0,w,h);
    update('xRange'); update('yRange');
    Graph.drawAxis(xRange,yRange,canvas);
    switch(type) {
        case 'poly':
            poly.plot(canvas,xRange,yRange,'blue',0.01);
            break;
        case 'generic':
            Graph.plotFn(new Function('x', 'return '+document.querySelector('#genericExpression').value+';'),xRange,yRange,undefined,canvas);
            break;
    }

}