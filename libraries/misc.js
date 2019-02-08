// Misc classes
let Draw = {
    filledCircle: function(x,y,radius,color='red',canvas) {
        let context = canvas.getContext('2d');
        context.save();
        context.translate(x,y);
        context.beginPath();
        context.arc(0,0,radius,0,2*Math.PI);
        context.fillStyle = color;
        context.fill();
        context.restore();
    },
    line: function(x1,y1,x2,y2,weight=2,color='black',canvas) {
        let context = canvas.getContext('2d');
        context.save();
        context.translate(x1,y1);
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(x2-x1,y2-y1);
        context.lineWidth = weight;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
    },
    filledRectangle: function(x,y,width,height,color='red',canvas) {
        let context = canvas.getContext('2d');
        context.save();
        context.translate(x,y);
        context.fillStyle = color;
        context.fillRect(0,0,width,height);
        context.restore();
    },
    cross: function(x,y,length=5,weight=2,canvas) {
        let context = canvas.getContext('2d');
        context.save();
        context.translate(x,y);
        context.beginPath();
        context.moveTo(-length,-length);
        context.lineTo(length,length);
        context.moveTo(-length,length);
        context.lineTo(length,-length);
        context.lineWidth = weight;
        context.stroke();
        context.restore();
    }
};

class Mouse {
    constructor(x,y,object) {
        this.x = x;
        this.y = y;
        this.object = object;
    }
    getRelativePosition(evt) {
        let rect = this.object.getBoundingClientRect();
        this.x = evt.clientX - rect.left;
        this.y = evt.clientY - rect.top;    
        return {
            x: this.x,
            y: this.y,
        }
    }
}

// Math functions
let Random = {
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

    generateColor: function() {
        let colors = ['red', 'green', 'blue'];
        return colors[Random.generateInt(0,colors.length-1)];
    },
};

class ComplexNumber {
    constructor(re,im) {
        this.re = re;
        this.im = im;
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
    multiplyScalar(scalar) {
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

let Solver = {
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

let Graph = (function() {
    // a public object containing public methods
    let public = {};

    // private methods
    function drawAxis() {
        let xScale = canvas.clientWidth/(this.xRange.max-this.xRange.min);
        let yScale = canvas.clientHeight/(this.yRange.max-this.yRange.min);

        context.save();  // this is for normal encapsulation
        context.save();  // this is for stroke
        context.translate(-this.xRange.min*xScale,this.yRange.max*yScale);
        
        context.scale(xScale,yScale)

        context.beginPath();
        context.moveTo(this.xRange.min,0);
        context.lineTo(this.xRange.max,0);

        context.moveTo(0,this.yRange.min);
        context.lineTo(0,this.yRange.max);
        context.lineWidth *= xScale/yScale;
        
        context.restore();  // stroke won't be affected by scale()
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();
        context.restore();  // encapsulation
    }

    // public methods
    public.plotFn = function(Fn,xRange,yRange,step,canvas,color='blue'){
        if(typeof Fn != 'function') throw '' + Fn + ' is not a function';
        if(xRange.length != 2) throw 'Invalid xRange. xRange must contain only 2 numbers';
        if(yRange.length != 2) throw 'Invalid yRange. yRange must contain only 2 numbers';

        let bigX = Math.max(xRange[0],xRange[1]);
        let smallX = Math.min(xRange[0],xRange[1]);
        if(step==undefined) step = (bigX-smallX)/100;
        let xSeq = []
        let ySeq = [];
        let index = 0;
        for(let i=smallX; i<bigX; i+=step) {
            xSeq[index] = i;
            ySeq[index] = Fn(i);
            index++;
        }
        index = undefined;

        public.plot(xSeq,ySeq,xRange,yRange,canvas,color);
    };
    public.plot = function(xSeq,ySeq,xRange,yRange,canvas,color='blue'){
        if(xSeq.length != ySeq.length) throw 'Invalid arguments. xSeq and ySeq do not have the same length';
        if(xRange.length != 2) throw 'Invalid xRange. xRange must contain only 2 numbers';
        if(yRange.length != 2) throw 'Invalid yRange. yRange must contain only 2 numbers';
        
        let xScale = canvas.clientWidth/Math.abs(xRange[0]-xRange[1]);
        let yScale = canvas.clientHeight/Math.abs(yRange[0]-yRange[1]);

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
    }

    return public;
}());

let Compute = {
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

let Signal = (function() {
    // this implementation is designed to work for real signal only, size = power of 2
    
    /* Set up nth Root of Unity for use with FFT algorithm
     * Not efficient, but constant time
     * Give exact values for some cases. Else use formula to generate
     * nRootUnity[x][y] is the first xth root of unity power to y
     * NOTE: there will be holes in the array nRootUnity
     */
    // this is private
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

    // a public object to store public methods. this anonymous function will return this public object
    // only fft(), ifft() and get() are exposed to public
    let public = {};
    
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
    public.fft = function(realSignal,fftSizeRef) {
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
    
    public.ifft = function(freqSignal) {
    };
    
    public.get = {
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
    public.generateFn = function(Fn,xSeq) {
        if(typeof Fn != 'function') throw '' + Fn + ' is not a function';

        let result = [];
        for(let i=0;i<xSeq.length;i++) {
            result[i] = Fn(xSeq[i]);
        }
        return result;
    };
    public.generatexSeq = function(xRange,step) {
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
    return public;
}());

// 2D physics
class Object2D {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.speedX;
        this.speedY;
        this.accelX;
        this.accelY;
        this.mass;
        this.forceX;
        this.forceY;
    }
    update() {
        this.accelX = this.forceX / this.mass;
        this.accelY = this.forceY / this.mass;
        this.speedX += this.accelX/60;  // frame update is after 1/60s
        this.speedY += this.accelY/60;
        this.x += this.speedX/60;
        this.y += this.speedY/60;

        return this;
    }
    draw(context=ctx) {
        return this;
    }
    resolveCollideWall(context=ctx) {
    }
    getAngle(other) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        return Math.atan2(dy,dx);
    }
}

let Collide = {
    detectBallBox: function(ball,box) {
        let x = ball.x;
        let y = ball.y;
        if(x < box.x) x = box.x;
        else if(x > box.x+box.width) x = box.x+box.width;
        if(y < box.y) y = box.y;
        else if(y > box.y+box.height) y = box.y+box.height;

        return (Math.pow(ball.x-x,2)+Math.pow(ball.y-y,2) < Math.pow(ball.radius,2));
    },

    detectBoxBall: function(box,ball) {
        return Collide.detectBallBox(ball,box);
    },

    detectBallBall: function(ball1, ball2) {
    //  return (distance squared < square of radius sum)
        return ((Math.pow((ball1.x-ball2.x),2) + Math.pow((ball1.y-ball2.y),2)) < Math.pow(ball1.radius + ball2.radius,2));
    },

    detectBoxBox: function(box1, box2) {

    },

    resolve1D: function(mass1,speed1,mass2,speed2,restitution) {
        // use formula for inelastic collision
        let mom = mass1*speed1 + mass2*speed2;
        let mass = mass1+mass2;
        let relativespeed = restitution*(speed2-speed1);
        return {
            x: ( mass2*relativespeed+mom)/(mass),
            y: (-mass1*relativespeed+mom)/(mass),
        }
    }
}