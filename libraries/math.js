export let Random = {
    generateInt: function(min,max,signed=false) {
        if(min==undefined) min = 1;
        if(max==undefined) max = 100;
        if(min>max) throw 'Invalid parameters. Min is larger than max';

        let value = min+Math.round(Math.random()*(max-min));
        if(min>0) {
            if(signed==false) return value;
            if(Math.random()>0.5) return value;
            return -value;
        } else return value;
    },
    generateColor: function(colors) {
        if(colors==undefined) colors = ['red', 'green', 'blue'];
        return colors[Random.generateInt(0,colors.length-1)];
    },
    normal: function(mean,sd) {
        let u=Math.random();
        let v=Math.random();
        if(mean==undefined) mean=0;
        if(sd==undefined) sd=1;
        return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)*sd+mean;
    }
};

export class ComplexNumber {
    constructor(re,im) {
        this.re = re;
        this.im = im;
    }
    toString() {
        return '' + this.re + ' + ' + this.im + 'i';
    }
    clone(other) {
        this.re = other.re;
        this.im = other.im;
        return this;
    }
    isEqual(other) {
        if(this.re==other.re && this.im==other.im) return true;
        return false;
    }
    add(other) {
        return ComplexNumber.ADD(this,other);
    }
    multiply(other) {
        return ComplexNumber.MULTIPLY(this,other);
    }
    scale(scalar) {
        return new ComplexNumber(this.re*scalar,this.im*scalar);
    }
    static CLONE(no) {
        return new ComplexNumber(no.re,no.im);
    }
    static EQUAL(no1,no2) {
        if(no1.re==no2.re && no1.im==no2.im) return true;
        return false
    }
    static ADD(no1,no2) {
        return new ComplexNumber(no1.re+no2.re,
                                 no1.im+no2.im);
    }
    static MULTIPLY(no1,no2) {
        return new ComplexNumber(no1.re*no2.re - no1.im*no2.im,
                                 no1.re*no2.im + no1.im*no2.re);
    }
}

export class Polynomial {
    constructor(coeff) {
        let temp;
        if(typeof coeff == 'object') temp = coeff; else temp = arguments;
        this.deg = temp.length - 1;
        this.coefficient = [];
        for(let i=0; i<temp.length; i++) {
            this.coefficient[i] = temp[i];
        }
    }
    toString() {
        let result = '';
        for(let i=this.deg; i>1; i--) {
            if(this.coefficient[i]!=1) result += this.coefficient[i];
            result += 'x^' + i + ' + ';
        }
        if(this.coefficient[1]!=undefined) {
            if(this.coefficient[1]!=1) result += this.coefficient[1];
            result += 'x + ';
        }
        result += this.coefficient[0];
        return result;
    }
    eval(x) {
        let result = 0;
        for(let i = this.deg; i>0; i--) {
            result = (result + this.coefficient[i]) * x;
        }
        result = result + this.coefficient[0];
        return result;
    }
    add(other) {
        let coefficient = [];
        for(let i = 0; i<=this.deg; i++) {
            coefficient[i] = this.coefficient[i];
        }
        for(let i = 0; i<=other.deg; i++) {
            if(coefficient[i]==undefined) coefficient[i] = other.coefficient[i];
            else coefficient[i] += other.coefficient[i];
        }
        return new Polynomial(coefficient);
    }
    multiply(other) {
        let coefficient = [];
        let deg = this.deg + other.deg;
        for(let i = this.deg; i>=0; i--) {
            for(let j = other.deg; j>=0; j--) {
                let index = deg-(i+j);
                if(coefficient[index]==undefined) coefficient[index] = this.coefficient[i]*other.coefficient[j];
                else coefficient[index] += this.coefficient[i]*other.coefficient[j];
            }
        }
        return new Polynomial(coefficient);
    }
    plot(canvas,xRange,yRange,color,step) {
        let poly = this;
        Graph.plotFn(function(x) { return poly.eval(x) },xRange,yRange,step,canvas,color);
    }
    diff(n = 1) {
        let coefficient = [];
        for(let i=this.deg; i>0; i--) {
            coefficient[this.deg-i] = this.coefficient[i]*i;
        }
        n--;
        if(this.deg==0) return new Polynomial(0);
        if(n==0) return new Polynomial(coefficient);
        return new Polynomial(coefficient).diff(n);
    }
}

export class Rational {
    constructor(numerator,denominator) {
        this.num = new Polynomial(numerator);
        this.den = new Polynomial(denominator);
    }
}

export let Calculus = {
    diff: function(func,x,dx,n) {
        if(typeof func != 'function') throw '' + func + ' is not a function';
        if(dx==undefined) {
            if(x!=0) dx = x*1e-2;
            else dx=1e-2;
        }
        if(n==undefined) n=1;
        if(n==0) return func(x);
        if(n==1) return (-func(x+2*dx)+8*func(x+dx)-8*func(x-dx)+func(x-2*dx))/(12*dx);
        if(n==2) return (-func(x+2*dx)+16*func(x+dx)-30*func(x)+16*func(x-dx)-func(x-2*dx))/(12*Math.pow(dx,2));

        if(n==3) return (-func(x+3*dx)+8*func(x+2*dx)-13*func(x+dx)+13*func(x-dx)-8*func(x-2*dx)+func(x-3*dx))/(8*Math.pow(dx,3));
        if(n==4) return (-func(x+3*dx)+12*func(x+2*dx)-39*func(x+dx)+ 56*func(x)-39*func(x-dx)+12*func(x-2*dx)-func(x-3*dx))/(6*Math.pow(dx,4));

        if(n==5) return (-func(x+4*dx)+9*func(x+3*dx)-26*func(x+2*dx)+29*func(x+dx)-29*func(x-dx)+26*func(x-2*dx)-9*func(x-3*dx)+func(x-4*dx))/(6*Math.pow(dx,5));
        if(n==6) return (-func(x+4*dx)+12*func(x+3*dx)-52*func(x+2*dx)+116*func(x+dx)-150*func(x)+116*func(x-dx)-52*func(x-2*dx)+12*func(x-3*dx)-func(x-4*dx))/(4*Math.pow(dx,6));

        while(n>6) {
            console.warn('Numerical differentiation of order higher than 6 is not accurate');
            return Calculus.diff(function(y) { return Calculus.diff(func,y,dx,n-6); },x,dx,6);
        }
    },
    integrate: function(func,x1,x2,dx) {
        if(typeof func != 'function') throw '' + func + ' is not a function';
        if(dx==undefined) dx = (x2-x1)*1e-5;
        let result = 0;
        let index = x1;
        while(index + dx < x2) {
            result += func(index)*dx;
            index += dx;
        }
        result += func(index)*(x2-index);
        return result;
    }
}

export let Matrix = {
    multiply: function(matrix1,matrix2) {
        if(matrix1[0].length!=matrix2.length) throw 'Incompatible matrix dimensions';
        let result = [];
        for(let i=0;i<matrix1.length;i++) {
            result.push([]);
            for(let k=0;k<matrix2[0].length;k++)  {
                let sum = 0;
                for(let j=0;j<matrix1[0].length;j++) sum += matrix1[i][j]*matrix2[j][k];
                result[i][k] = sum;
            }
        }
        return result;
    },
    add: function(matrix1,matrix2) {
        if(matrix1.length!=matrix2.length) throw 'Incompatible matrix dimensions';
        let result = [];
        for(let i=0;i<matrix1.length;i++) {
            result.push([]);
            for(let j=0;j<matrix1[0].length;j++) result[i][j] = matrix1[i][j] + matrix2[i][j];
        }
        return result;
    },
    scale: function(matrix,scalar) {
        let result = [];
        for(let i=0;i<matrix.length;i++) {
            result.push([]);
            for(let j=0;j<matrix.length;j++) result[i][j] = matrix[i][j] * scalar;
        }
        return result;
    },
    small: function(matrix,x0,y0,x1,y1) {
        if(x1<x0 || y1<y0) throw 'Wrong indices';
        let result = [];
        for(let i=x0;i<x1;i++) {
            result.push([]);
            for(let j=y0;j<y1;j++) result[i-x0][j-y0] = matrix[i][j];
        }
        return result;
    }
}

export let Vector = {
    dot: function(vec1,vec2) {
        if(vec1.length!=vec2.length) throw 'Two vectors don\'t have the same length';
        let sum=0;
        for(let i=0;i<vec1.length;i++) sum += vec1[i]*vec2[i];
        return sum;
    },
    cross: function(vec1,vec2) {
        if(vec1.length!=vec2.length) throw 'Two vectors don\'t have the same length';
        if(vec1.length!=3) throw 'Only support cross product for 3-dimension vector';
        return [vec1[1]*vec2[2]-vec2[1]*vec1[2],vec1[2]*vec2[0]-vec2[2]*vec1[0],vec1[0]*vec2[1]-vec2[0]*vec1[1]];
    },
    magnitude: function(vec) {
        let sum=0;
        for(let i=0;i<vec.length;i++) sum += vec[i]*vec[i];
        return Math.sqrt(sum);
    },
    add: function(vec1,vec2) {
        if(vec1.length!=vec2.length) throw 'Two vectors don\'t have the same length';
        let result=[];
        for(let i=0;i<vec1.length;i++) result[i]=vec1[i]+vec2[i];
        return result;
    },
    scale: function(vec,scalar) {
        let result=[];
        for(let i=0;i<vec.length;i++) result[i]=vec[i]*scalar;
        return result;
    }
}

export let Solver = {
    sim2: function(matrix) {  // simultaneous equation, 2 unknowns. size of matrix is 2x3
        if(matrix.length!=2 && matrix[0].length!=3 && matrix[1].length!=3) throw 'Matrix dimensions are not int 2x3 shape'
        let a = matrix[0][0]; let b = matrix[0][1]; let m = matrix[0][2];
        let c = matrix[1][0]; let d = matrix[1][1]; let n = matrix[1][2];

        if(a*d==b*c) {
            if(a*n==c*m) throw 'Infinite number of solutions';
            else throw 'No solution found';
        } else return {
            x: (m*d-n*b)/(a*d-b*c),
            y: (m*c-n*a)/(b*c-a*d),
        }
    },
}

export let Graph = {
    drawAxis: function(xRange,yRange,canvas) {
        let context = canvas.getContext('2d');
        let bigX = Math.max(xRange[0],xRange[1]);
        let smallX = Math.min(xRange[0],xRange[1]);
        let bigY = Math.max(yRange[0],yRange[1]);
        let smallY = Math.min(yRange[0],yRange[1]);

        let xScale = canvas.width/(bigX-smallX);
        let yScale = canvas.height/(bigY-smallY);

        context.save();  // this is for normal encapsulation
        context.save();  // this is for stroke
        context.translate(-smallX*xScale,bigY*yScale);
        
        context.scale(xScale,yScale)

        context.beginPath();
        context.moveTo(smallX,0);
        context.lineTo(bigX,0);

        context.moveTo(0,smallY);
        context.lineTo(0,bigY);
        context.lineWidth *= xScale/yScale;
        
        context.restore();  // stroke won't be affected by scale()
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();
        context.restore();  // encapsulation
    },
    plotFn: function(Fn,xRange,yRange,step,canvas,color='blue'){
        if(typeof Fn != 'function') throw '' + Fn + ' is not a function';
        if(xRange.length != 2) throw 'Invalid xRange. xRange must contain only 2 numbers';
        if(yRange.length != 2) throw 'Invalid yRange. yRange must contain only 2 numbers';

        let bigX = Math.max(xRange[0],xRange[1]);
        let smallX = Math.min(xRange[0],xRange[1]);
        if(step==undefined) step = (bigX-smallX)/canvas.width;
        let xSeq = []
        let ySeq = [];
        let index = 0;
        for(let i=smallX; i<bigX; i+=step) {
            xSeq[index] = i;
            ySeq[index] = Fn(i);
            index++;
        }
        index = undefined;

        Graph.plot(xSeq,ySeq,xRange,yRange,canvas,color);
    },
    plot: function(xSeq,ySeq,xRange,yRange,canvas,color='blue'){
        if(xSeq.length != ySeq.length) throw 'Invalid arguments. xSeq and ySeq do not have the same length';
        if(xRange.length != 2) throw 'Invalid xRange. xRange must contain only 2 numbers';
        if(yRange.length != 2) throw 'Invalid yRange. yRange must contain only 2 numbers';
        
        let xScale = canvas.width/Math.abs(xRange[0]-xRange[1]);
        let yScale = canvas.height/Math.abs(yRange[0]-yRange[1]);

        let context = canvas.getContext('2d');

        context.save();  // this is for normal encapsulation
        context.save();  // this is for stroke
        context.translate(-Math.min(xRange[0],xRange[1])*xScale,Math.max(yRange[0],yRange[1])*yScale);

        context.scale(xScale,yScale)

        context.beginPath();
        context.moveTo(xSeq[0],-ySeq[0]);      // minus y-coordinate because the canvas is inverse in y direction
        for(let i=1;i<xSeq.length;i++) {
            context.lineTo(xSeq[i],-ySeq[i]);  // minus y-coordinate because the canvas is inverse in y direction
        }

        context.restore();
        context.lineWidth = 2;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
    },
    histogram: function(valueList,freqList,canvas) {
        if(valueList.length!=freqList.length) throw 'Value list and frequency list must have the same length';
         
    },
    bar: function(list,yRange,color,canvas) {
        if(color==undefined) color='blue';
        let colors = [];
        if(typeof color=='string') for(let i=0;i<list.length;i++) colors.push(color); else colors = color;
        let ctx = canvas.getContext('2d');
        let length = canvas.width/list.length;
        let yScale = canvas.height/Math.abs(yRange[0]-yRange[1]);
        ctx.save();
        ctx.translate(0,Math.max(yRange[0],yRange[1])*yScale);
        ctx.scale(1,yScale);
        for(let i=0;i<list.length;i++) {
            ctx.beginPath();
            ctx.rect(i*length,-list[i],length,list[i]);
            ctx.fillStyle = colors[i];
            ctx.fill();
        }
        ctx.restore();
    }
};

export let Statistics = {
    sum: function(list) {
        let result = 0;
        for(let i=0;i<list.length;i++) result+=list[i];
        return result;
    },
    mean: function(list) {
        return Statistics.sum(list)/list.length;
    },
    var: function(list) {
        let sumSquared = 0,
            sum = 0;
        for(let i=0;i<list.length;i++) {
            sumSquared += list[i]*list[i];
            sum += list[i];
        }
        sumSquared /= list.length;
        sum /= list.length;
        return sumSquared - sum*sum;
    },
    sd: function(list) {
        return Math.sqrt(Statistics.var(list));
    }
}

export let Compute = {
    magnitude: function(x,y) {
        return Math.sqrt(x*x+y*y);
    },
    degToRad: function(degree) {
        return degree*Math.PI/180;
    },
    radToDeg: function(rad) {
        return rad/Math.PI*180;
    },
    distance: function(point1,point2) {
        return Compute.magnitude(point1.x-point2.x,point1.y-point2.y);
    },
    rotateVector: function(vector,angle) {
        let magnitude = Compute.magnitude(vector.x,vector.y);
        let theta0 = Math.atan2(vector.x, vector.y);
        return {
            x: magnitude*Math.cos(theta0-angle),
            y: magnitude*Math.sin(theta0-angle),
        }
    },
}

/* Set up nth Root of Unity for use with FFT algorithm
 * Not efficient, but constant time
 * Give exact values for some cases. Else use formula to generate
 * nRootUnity[x][y] is the first xth root of unity power to y
 * NOTE: there will be holes in the array nRootUnity
 *
 */

let nRootUnity = [];
let base = 1;
for(let i=1;i<13;i++) {  // 2 → 4096
    base *= 2;
    nRootUnity[base] = [];
    nRootUnity[base][0] = new ComplexNumber(1,0);
    for(let j=1;j<base;j++) {
        switch(j) {
            case base/2:
                nRootUnity[base][j] = new ComplexNumber(-1,0);
                break;
            case base/4:
                nRootUnity[base][j] = new ComplexNumber(0,-1);
                break;
            case base*3/4:
                nRootUnity[base][j] = new ComplexNumber(0,1);
                break;
            case base/8:
                nRootUnity[base][j] = new ComplexNumber(Math.SQRT1_2,-Math.SQRT1_2);
                break;
            case base*3/8:
                nRootUnity[base][j] = new ComplexNumber(-Math.SQRT1_2,-Math.SQRT1_2);
                break;
            case base*5/8:
                nRootUnity[base][j] = new ComplexNumber(-Math.SQRT1_2,Math.SQRT1_2);
                break;
            case base*7/8:
                nRootUnity[base][j] = new ComplexNumber(Math.SQRT1_2,Math.SQRT1_2);
                break;
            default:
                nRootUnity[base][j] = new ComplexNumber(Math.cos(2*Math.PI*j/base),Math.sin(-2*Math.PI*j/base));
        }
    }
}
base = undefined;  // remove value of base in case of conflict

export let Signal = (function() {
    // this implementation is designed to work for real signal only, size = power of 2
    
    // a public object to store public methods. this anonymous function will return this public object
    // only fft(), ifft() and get() are exposed to public

    let pub = {};
    
    // private methods
    function FFT(timeSignal) {
        /* Main recursion function
         * INPUT: an array of ComplexNumber objects. Its size is a power of 2
         * Break down the signal into 2 smaller signals: Even signal and Odd signal
         * Call FFT itself on these smaller signals
         * Base case is when size = 4. Call FFT4, which has direct implementation
         * RETURN: an array of ComplexNumber objects
         */
        if(timeSignal.length==4) return FFT4(timeSignal);
        let size = timeSignal.length;
        let signalEven = [];
        let signalOdd = [];
        for(let i=0;i<size;i+=2) {
            signalEven.push(timeSignal[i]);
        }
        for(let i=1;i<size;i+=2) {
            signalOdd.push(timeSignal[i]);
        }
        let freqEven = FFT(signalEven);
        let freqOdd = FFT(signalOdd);

        let freqSignal = [];
        
        for(let i=0;i<size/2;i++) {
            freqSignal.push(freqEven[i].add(freqOdd[i].multiply(nRootUnity[size][i])));
        }
        freqSignal.push(freqEven[0].add(freqOdd[0].multiply(new ComplexNumber(-1,0))));
        for(let i=freqSignal.length-2;i>0;i--) {
            freqSignal.push(new ComplexNumber(freqSignal[i].re,-freqSignal[i].im));
        }

        return freqSignal;
    };
    function FFT2(timeSignal) {
        /* Direct implementation for fft size = 2
         * INPUT: an array of ComplexNumber ofjects of size 2
         * RETURN: an array of ComplexNumber objects of size 2
         */
        return [new ComplexNumber(timeSignal[0].re+timeSignal[1].re,0),
                new ComplexNumber(timeSignal[0].re-timeSignal[1].re,0)];
    };
    function FFT4(timeSignal) {
        /* Direct implementation for fft size = 4
         * INPUT: an array of ComplexNumber ofjects of size 4
         * RETURN: an array of ComplexNumber objects of size 4
         */
        return [new ComplexNumber(timeSignal[0].re+timeSignal[2].re+timeSignal[1].re+timeSignal[3].re,0),
                new ComplexNumber(timeSignal[0].re-timeSignal[2].re                                  ,timeSignal[3].re-timeSignal[1].re),
                new ComplexNumber(timeSignal[0].re+timeSignal[2].re-timeSignal[1].re-timeSignal[3].re,0),
                new ComplexNumber(timeSignal[0].re-timeSignal[2].re                                  ,+timeSignal[1].re-timeSignal[3].re)];
    };

    function parseReal(realSignal) {
        /* Turn a number array into a ComplexNumber array
         * INPUT: a number array
         * RETURN: a ComplexNumber array
         */
        let result = [];
        for(let i=0;i<realSignal.length;i++) {
            result.push(new ComplexNumber(realSignal[i],0));
        }
        return result;
    };
    function zeroPadding(realSignal,fftSize) {
        /* Pad zeros to a number array until its size is a power of 2
         * INPUT: a number array, a number
         * OUtPUT: a number array with size is a power of 2
         */
        let result = [];
        while(result.length<=fftSize) {
            result.push(0);
        }
        return result;
    };

    // public methods
    pub.fft = function(realSignal,fftSizeRef) {
        /* Main function to call from outside
         * INPUT: realSignal: an array of numbers
         *        fftSize: a number
         * This function first tests certain conditions and handle them if possible. Otherwise, throw an error
         *     - Check if the signal is an array of numbers (only first element). If not, throw an error
         *     - Check if fftSize is given. If not → fftSize = signal size
         *     - Check if fftSize is a power of 2. If not, throw an error
         *     - Check if signal is shorter than expected fftSize, do zero padding on the signal
         * This function also warps the number array into a ComplexNumber array to feed into method FFT.FFT()
         * RETURN: an array of ComplexNumber objects
         */
        if(typeof fftSizeRef != 'number') throw 'FFT size is not a number';
        if(typeof realSignal[0] != 'number') throw 'Signal is not an array of numbers';
        
        let fftSize;
        if(fftSizeRef==undefined) {
            // If fftSize is not provided, take the fftSize to be the signal size
            // If the signal size is not a power of 2, fftSize will the the smallest power of 2 that is larger than the signal size
            fftSize = realSignal.length; 
            if(Math.log2(fftSizeRef)%1!=0) fftSize = Math.pow(2,Math.ceil(Math.log2(fftSizeRef)));
        } else {
            if(fftSizeRef<realSignal.length) throw 'fftSize is smaller than size of the signal';
            if(Math.log2(fftSizeRef)%1!=0) throw 'FFT size is not a power of 2';
            fftSize = fftSizeRef;
        }
        
        if(realSignal.length==2 && fftSize==2) return FFT2(parseReal(realSignal));
        
        if(realSignal.length==fftSize) return FFT(parseReal(realSignal));
        
        return FFT(parseReal(zeroPadding(realSignal,fftSize)));
    };
    
    pub.ifft = function(freqSignal) {
    };
    
    pub.get = {
        ReArray: function(signal) {
            /* Extract the real components from a ComplexNumber array
             * INPUT: a ComplexNumber array
             * RETURN: a number array of real components
             */
            let result = [];
            for(let i=0;i<signal.length;i++) {
                result[i] = signal[i].re;
            }
            return result;
        },
        ImArray: function(signal) {
            /* Extract the imaginary components from a ComplexNumber array
             * INPUT: a ComplexNumber array
             * RETURN: a number array of imaginary components
             */
            let result = [];
            for(let i=0;i<signal.length;i++) {
                result[i] = signal[i].im;
            }
            return result;
        },
        MagnitudeArray: function(signal) {
            /* Extract the magnitudes from a ComplexNumber array
             * INPUT: a ComplexNumber array
             * RETURN: a number array of magnitudes
             */
            let result = [];
            for(let i=0;i<signal.length;i++) {
                result[i] = Math.sqrt(signal[i].re*signal[i].re + signal[i].im*signal[i].im);
            }
            return result;
        },
        getPhaseArray: function(signal) {
            /* Extract the phases from a ComplexNumber array
             * INPUT: a ComplexNumber array
             * RETURN: a number array of phases in radian
             */
            let result = [];
            for(let i=0;i<signal.length;i++) {
                result[i] = Math.atan2(signal[i].im,signal[i].re);
            }
            return result;
       },  
    };
    pub.generateFn = function(Fn,xSeq) {
        if(typeof Fn != 'function') throw '' + Fn + ' is not a function';

        let result = [];
        for(let i=0;i<xSeq.length;i++) {
            result[i] = Fn(xSeq[i]);
        }
        return result;
    };
    pub.generatexSeq = function(xRange,step) {
        let result = [];
        let bigX = Math.max(xRange[0],xRange[1]);
        let smallX = Math.min(xRange[0],xRange[1]);
        if(step==undefined) step = (bigX-smallX)/100;

        let index = 0;
        for(let i=smallX; i<bigX; i+=step) {
            result[index] = i;
            index++;
        }
        index = undefined;
        return result;
    };

    // return the public object
    return pub;
}());