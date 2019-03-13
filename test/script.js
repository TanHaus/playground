import { Matrix, Random, Graph, Statistics } from '../libraries/math.js';
window.canvas = document.querySelector('#myCanvas');
window.matrix = Matrix;
window.random = Random;
window.graph = Graph;

let a = [];
for(let i=0;i<500;i++) {
    a.push(Random.normal());
}
a.sort(function(a,b) { return a-b; });
function bin(list,size) {
    let start = list[0];
    let result = [];
    let count = 0;
    for(let i=0;i<a.length;i++) {
        if(list[i]<start+size) count++;
        else {
            result.push(count)
            count = 0;
            start += size;
        }
    }
    return result;
}
let yRange = [0,120];
let b = bin(a,0.5);
console.log(Statistics.mean(a));
console.log(Statistics.sd(a));
Graph.bar(b,yRange,undefined,canvas);