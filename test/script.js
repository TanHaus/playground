import { Matrix, Solver, Calculus, Statistics, Parser, Optimization, ComplexNumber } from "../libraries/math.js"

window.Matrix = Matrix;

let a = [[2,1,-1,8,5],
         [-3,-1,2,-11,2],
         [-2,1,2,-3,4],
         [-2,4,-2,3,0]];

let b = [1,34,54,2,1,5,7,23,7],
    c = [345,24,14,62,3,1,45,4,2];



console.log(Parser.toPostfix('3+4*2/(1-5)^2^3'));

console.log(ComplexNumber.CBRT(3));
console.log(ComplexNumber.POW(new ComplexNumber(2,3),new ComplexNumber(4,3)));