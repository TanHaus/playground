import { Random, Graph } from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const state = document.querySelector('#state');
const DPIscale = window.devicePixelRatio;

let h = canvas.clientHeight*DPIscale,
    w = canvas.clientWidth*DPIscale;
canvas.width = w;
canvas.height = h;

window.onresize = function() {
    h = canvas.clientHeight*DPIscale;
    w = canvas.clientWidth*DPIscale;
    canvas.height = h;
    canvas.width = w;
    Graph.bar(list,yRange,colors,canvas);
}

let list = [],
    scale = 100,
    yRange = [0,scale],
    colors = [],
    color1 = { 'red': 52, 'green': 102, 'blue': 255 },
    color2 = { 'red': 255, 'green': 0, 'blue': 102 },
    n = 20;

window.generateRandomList = function(size) {
    ctx.clearRect(0,0,w,h);
    list = undefined;
    list = [];
    colors = undefined;
    colors = [];
    for(let i=0;i<size;i++) {
        let temp = Math.random();
        temp *= scale;
        list.push(temp);
        let factor = temp/scale;
        let red = Math.sqrt( Math.pow(color1.red*factor,2) + Math.pow(color2.red*(1-factor),2) ),
          green = Math.sqrt( Math.pow(color1.green*factor,2) + Math.pow(color2.green*(1-factor),2) ),
           blue = Math.sqrt( Math.pow(color1.blue*factor,2) + Math.pow(color2.blue*(1-factor),2) );
        colors.push('rgb('+Math.round(red)+','+Math.round(green)+','+Math.round(blue)+')');
    }
    Graph.bar(list,yRange,colors,canvas);
}

generateRandomList(n);

/*
let quicksort = (function() {
    let algo = function(lo,hi) {
        if(lo==undefined) lo=0;
        if(hi==undefined) hi=list.length;
        let p = partition(lo,hi);
        algo(lo,p);
        algo(p+1,hi);
    };
    let partition = function(lo,hi) {
        let pivot = list[Math.round((lo+hi)/2)];
        let i = lo, j=hi;
        while(true) {
            while(list[i]<pivot) i++;
            while(list[j]>pivot) j++;
            if(i>=j) return j;
            swap(i,j);
        }
    }
    return algo();
}());*/

let bubblesort = (function() {
    let i,j,count;
    let setup = function() {
        i = 0;
        j = list.length;
        count = 0;
        algo();
    }
    let algo = function() {
        if(i==j) {
            i=0;
            j--;
            if(count==0) {
                state.innerText = 'Done';
                return undefined;
            } else count=0;
        }
        if(list[i]>list[i+1]) {
            swap(i,i+1);
            count++;
        }
        i++;
        requestAnimationFrame(algo);
    }
    return setup;
}());

let normalsort = (function() {
    let a,b;
    let setup = function() {
        a = 0;
        b = 1;
        algo();
    }
    let algo = function() {
        if(b==list.length) {
            a++;
            b = a+1;
        }
        if(a==list.length-1) {
            state.innerText = 'Done';
            return undefined;
        }
        if(list[a]>list[b]) swap(a,b);
        b++;
        requestAnimationFrame(algo);
    }
    return setup;
}());

function swap(index1,index2) {
    let temp = list[index1];
    list[index1] = list[index2];
    list[index2] = temp;
    temp = colors[index1];
    colors[index1] = colors[index2];
    colors[index2] = temp;
    ctx.clearRect(0,0,w,h);
    Graph.bar(list,yRange,colors,canvas);
}

window.sort = function(algo) {
    if(state.innerText=='Working') return undefined;
    state.innerText = 'Working';
    switch(algo) {
        case 'bubblesort':
            bubblesort();
            break;
        case 'normalsort':
            normalsort();
            break;
    }
}