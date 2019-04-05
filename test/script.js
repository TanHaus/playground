import * as math from "../libraries/math.js";

window.math = math;
const canvas = document.querySelector('#myCanvas'),
      ctx = canvas.getContext('2d');

let w = canvas.clientWidth,
    h = canvas.clientHeight;
canvas.width = w;
canvas.height = h;

let a = [[2,1,-1,8,5],
         [-3,-1,2,-11,2],
         [-2,1,2,-3,4],
         [-2,4,-2,3,0]];

let b = [1,34,54,2,1,5,7,23,7],
    c = [345,24,14,62,3,1,45,4,2];



console.log(math.Parser.toPostfix('3+4*2/(1-5)^2^3'));

console.log(math.Solver.cubicEqn(1,5,4,3));

let test = [],
    big = 1e7;
for(let i=0;i<big;i++) {
    let value = math.Random.integer(1,50,false);
    if(test[value]==undefined) test[value] = 0;
    test[value]++;
}
console.log(test);
math.Graph.bar(test,[1,big/50*1.2],undefined,canvas);