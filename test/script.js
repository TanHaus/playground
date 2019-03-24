import { Matrix, Solver, Calculus, Statistics, Parser } from "../libraries/math.js"

window.Matrix = Matrix;

let a = [[2,1,-1,8,5],
         [-3,-1,2,-11,2],
         [-2,1,2,-3,4],
         [-2,4,-2,3,0]];
console.log(a);
console.log(Matrix.reducedEchelonForm(a));
console.log(Solver.simultaneousEqn(a));

console.log(Calculus.integrate(Math.exp,0,100));
console.log(Math.exp(100)-1);

let b = [1,34,54,2,1,5,7,23,7],
    c = [345,24,14,62,3,1,45,4,2];

console.log(Statistics.mean(b));
console.log(Statistics.var(b));
console.log(Statistics.sampleVar(b));
console.log(Statistics.cov(b,c));

console.log(Parser.toPostfix('3+4*2/(1-5)^2^3'));