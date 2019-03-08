import { Signal, Graph, Polynomial } from '../libraries/math.js';

window.canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
let w = canvas.clientWidth;
let h = canvas.clientHeight;
canvas.height = h; canvas.width = w;
window.onresize = function() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.height = h;
    canvas.width = w;
    draw();
}

const showFn = document.querySelector('#Fn');

let xRange = [-5,5];
let yRange = [-5,5];

const polySection = document.querySelector('#poly');
const sineSection = document.querySelector('#sine');
const cosineSection = document.querySelector('#cosine');
const showError = document.querySelector('#error');

window.currentFn = polySection;
let poly;

Graph.drawAxis(xRange,yRange,canvas);

window.update = function(type,value) {
    switch(type) {
        case 'poly':
            let temp = value.split(',');
            let coeff = [];
            for(let i=0; i<temp.length; i++) {
                coeff[i] = parseFloat(temp[i]);
            }
            poly = new Polynomial(coeff);
            showFn.innerHTML = '$' + poly.toString() + '$';
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            if(isNaN(poly.eval(0))) error.innerHTML = 'There is an ERROR. Please type the coefficients correctly'; else error.innerHTML = '';
            break;
        case 'xMin':
            xRange[0] = parseFloat(value);
            break;
        case 'xMax':
            xRange[1] = parseFloat(value);
            break;
        case 'yMin':
            yRange[0] = parseFloat(value);
            break;
        case 'yMax':
            yRange[1] = parseFloat(value);
            break;
    }
    draw();
}

window.changeFn = function(type) {
    currentFn.classList.add('hidden');
    switch(type) {
        case 'poly':
            currentFn = polySection;
            currentFn.classList.remove('hidden');
            break;
        case 'sine':
            currentFn = sineSection;
            currentFn.classList.remove('hidden');
            break;
        case 'cosine':
            currentFn = cosineSection;
            currentFn.classList.remove('hidden');
            break;
    }
}

function draw() {
    ctx.clearRect(0,0,w,h);
    Graph.drawAxis(xRange,yRange,canvas);
    poly.plot(canvas,xRange,yRange,'blue',0.01);
}