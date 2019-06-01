// Begin of classes
export class ComplexNumber {
    constructor(re,im) {
        this.re = re;
        this.im = im;
    }
    toString() {
        if(arguments=='polar') return ''+this.magnitude()+'e^i'+this.arg().toPrecision(6);
        if(arguments=='polorLatex') return ''+this.magnitude()+'e^{i'+this.arg().toPrecision(6)+'}';
        return ''+this.re+' + '+this.im+'i';
    }
    clone(other) {
        if(typeof other=='number') { this.re = other; this.im = 0; }
        else { this.re = other.re; this.im = other.im; }
        return this;
    }
    isEqual(other)  { return ComplexNumber.EQUAL(this,other);    }
    add(other)      { return ComplexNumber.ADD(this,other);      }
    multiply(other) { return ComplexNumber.MULTIPLY(this,other); }
    conjugate()     { return ComplexNumber.CONJUGATE(this);      }
    inverse()       { return ComplexNumber.INVERSE(this);        }
    magnitude()     { return ComplexNumber.MAGNITUDE(this);      }
    arg()           { return ComplexNumber.ARG(this);            }
    sqrt()          { return ComplexNumber.SQRT(this);           }
    cbrt()          { return ComplexNumber.CBRT(this);           }
    static CLONE(no) {
        if(typeof no=='number') return new ComplexNumber(no,0);
        return new ComplexNumber(no.re,no.im);
    }
    static EQUAL(no1,no2) {
        if(typeof no1=='number') no1 = {'re':no1,'im':0};
        if(typeof no2=='number') no2 = {'re':no2,'im':0};
        if(Math.abs(no1.re-no2.re)<no1.re*1e-12&&Math.abs(no1.im-no2.im)<no1.im*1e-12) return true;
        return false
    }
    static ADD(no1,no2) {
        if(typeof no1=='number') no1 = {'re':no1,'im':0};
        if(typeof no2=='number') no2 = {'re':no2,'im':0};
        return new ComplexNumber(no1.re+no2.re,no1.im+no2.im);
    }
    static MULTIPLY(no1,no2) {
        if(typeof no1=='number') no1 = {'re':no1,'im':0};
        if(typeof no2=='number') no2 = {'re':no2,'im':0};
        return new ComplexNumber(no1.re*no2.re - no1.im*no2.im,
                                 no1.re*no2.im + no1.im*no2.re);
    }
    static CONJUGATE(number) {
        if(typeof number=='number') return new ComplexNumber(number,0);
        return new ComplexNumber(number.re,-number.im);
    }
    static INVERSE(number) {
        if(typeof number=='number') return new ComplexNumber(1/number,0);
        let mag = number.magnitude();
        return new ComplexNumber(number.re/mag,-number.im/mag);
    }
    static MAGNITUDE(number) {
        if(typeof number=='number') return number;
        return Math.sqrt(number.re*number.re+number.im*number.im);
    }
    static ARG(number) {
        if(typeof number=='number') return Math.atan2(0,number);
        return Math.atan2(number.im,number.re);
    }
    static SQRT(number) {
        if(typeof number=='number') number = new ComplexNumber(number,0);
        let mag = Math.sqrt(number.magnitude()),
            arg = number.arg()/2,
            num1 = mag*Math.cos(arg),
            num2 = mag*Math.sin(arg);
        return [new ComplexNumber(num1,num2), new ComplexNumber(-num1,-num2)];
    }
    static CBRT(number) {
        if(typeof number=='number') number = new ComplexNumber(number,0);
        let mag = Math.cbrt(number.magnitude()),
            arg = number.arg()/3;
        return [new ComplexNumber(mag*Math.cos(arg),mag*Math.sin(arg)),
                new ComplexNumber(mag*Math.cos(arg+2*Math.PI/3),mag*Math.sin(arg+2*Math.PI/3)),
                new ComplexNumber(mag*Math.cos(arg-2*Math.PI/3),mag*Math.sin(arg-2*Math.PI/3))];
    }
    static EXP(number) {
        if(typeof number=='number') number = new ComplexNumber(number,0);
        let mag = Math.exp(number.re),
            arg = number.im;
        return new ComplexNumber(mag*Math.cos(arg),mag*Math.sin(arg));
    }
    static POW(no1,no2) {
        if(typeof no1=='number') no1 = new ComplexNumber(no1,0);
        if(typeof no2=='number') no2 = new ComplexNumber(no2,0);
        let mag = Math.pow(no1.magnitude(),no2.re)*Math.exp(-no1.arg()*no2.im),
            arg = no1.arg()*no2.re+Math.log(no1.magnitude())*no2.im;
        return new ComplexNumber(mag*Math.cos(arg),mag*Math.sin(arg));
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
        if(arguments=='latex') {
            for(let i=this.deg; i>1; i--) {
                if(this.coefficient[i]!=0) {
                    if(this.coefficient[i]!=1) result += this.coefficient[i];
                    result += 'x^{' + i + '} + ';
                }
            }
        } else {
            for(let i=this.deg; i>1; i--) {
                if(this.coefficient[i]!=0) {
                    if(this.coefficient[i]!=1) result += this.coefficient[i];
                    result += 'x^' + i + ' + ';
                }
            }
        }
        if(this.coefficient[1]!=undefined) {
            if(this.coefficient[1]!=0) {
                if(this.coefficient[1]!=1) result += this.coefficient[1];
                result += 'x + ';
            }
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
        let coefficient = [],
            deg = this.deg + other.deg;
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
    findRoot(x0) {
        let coeff = this.coefficient;
        switch(this.deg) {
        case 0:
            if(coeff[0]==0) console.warn('Infinite number of roots');
            else console.warn('No roots');
            return undefined;
        case 1:
            return -coeff[0]/coeff[1];
        case 2:
            return Solver.quadraticEqn(coeff[2],coeff[1],coeff[0]);
        case 3:
            
        default:
            console.warn('Degree is 4 and beyond. Only one root will be returned');
            return Solver.findRootEqn(function(x) { return this.eval(x); },0,function(x) { return this.diff(1).eval(x); });
        }
    }
}

export class Rational {
    constructor(numerator,denominator) {
        this.num = new Polynomial(numerator);
        this.den = new Polynomial(denominator);
    }
    eval(x) {
        let den = this.den.eval(x);
        if(Math.abs(den)>1e-30) return this.num.eval(x)/den;
        return undefined;
    }
    toString() {
        return '('+this.num.toString()+')/('+this.den.toString()+')';
    }
}

export class Set {
    constructor() {
        let temp = [], args, count = 0;
        if(arguments.length==1 && typeof arguments[0]=='object') args=arguments[0];
        else args = arguments;
        for(let i=0;i<args.length;i++) {
            if(temp.includes(args[i])==false) {
                temp.push(args[i]);
                count++;
            }
        }
        this.data = temp;
        this.length = count;
        return this;
    }
    add(element) {
        if(this.data.includes(element)==false) {
            this.data.push(element);
            this.length++;
            return element;
        }
        return undefined;
    }
    remove(element) {
        let index = this.data.indexOf(element);
        if(index==-1) return undefined;
        this.data.splice(index,1);
        this.length--;
        return element;
    }
    has(element) { return this.data.includes(element); }
    union(anotherSet) { return Set.UNION(this,anotherSet); }
    intersection(anotherSet) { return Set.INTERSECTION(this,anotherSet); }
    subset(anotherSet) { return Set.SUBSET(this,anotherSet); }
    static UNION(set1,set2) {
        let result = new Set();
        for(let i=0;i<set1.length;i++) result.add(set1.data[i]);
        for(let i=0;i<set2.length;i++) result.add(set2.data[i]);
        return result;
    }
    static INTERSECTION(set1,set2) {
        let long,short,result = new Set();
        if(set1.length>set2.length) { long=set1; short=set2; }
        else { long=set2; short=set1; }
        for(let i=0;i<short.length;i++) if(long.has(short.data[i])) result.add(short.data[i]);
        return result;
    }
    static SUBSET(set1,set2) {
        for(let i=0;i<set1.length;i++) {
            if(set2.has(set1.data[i])==false) return false;
        }
        return true;
    }
}

export class Queue {
    constructor() {
        
    }
}

// Begin of functions
export let Random = {
    integer: function(min=1,max=100,signed=false) {
        if(min>max) {
            console.warn('Min is larger than max. Their values will be swapped');
            let temp = min; min = max; max = temp;
        }
        let value = min+Math.floor(Math.random()*(max-min+1));
        if(min>0) {
            if(signed==false) return value;
            if(Math.random()>=0.5) return value;
            return -value;
        } else return value;
    },
    pickFromArray: function(members) {
        return members[Random.integer(0,members.length-1)];
    },
    normal: function(mean=0,sd=1) {  // Box-Muller transform
        let u=Math.random(),
            v=Math.random();
        return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)*sd+mean;
    },
    colorGradientArray(color1,color2,size) {
        let result = [],
            R,G,B;
        if(size==1) {
            R = Math.round(Math.sqrt(color1.red*color1.red/2+color2.red*color2.red/2));
            G = Math.round(Math.sqrt(color1.green*color1.green/2+color2.green*color2.green/2));
            B = Math.round(Math.sqrt(color1.blue*color1.blue/2+color2.blue*color2.blue/2));
            result.push('rgb('+R+','+G+','+B+')');
        } else if(size>1) {
            let length = size-1;
            for(let i=0;i<=length;i++) {
                R = Math.round(Math.sqrt(color1.red*color1.red*(1-i/length)+color2.red*color2.red*(i/length)));
                G = Math.round(Math.sqrt(color1.green*color1.green*(1-i/length)+color2.green*color2.green*(i/length)));
                B = Math.round(Math.sqrt(color1.blue*color1.blue*(1-i/length)+color2.blue*color2.blue*(i/length)));
                result.push('rgb('+R+','+G+','+B+')');
            }
        }
        return result;
    }
};

export let Calculus = {
    diff: function(func,x,dx,n) {
        if(typeof func != 'function') throw '' + func + ' is not a function';
        if(dx==undefined) {
            if(x!=0) dx = x*1e-2;
            else dx=1e-2;
        }
        if(n==undefined) n=1;
        switch(n) {
            case 0: return func(x);
            case 1: return (-func(x+2*dx)+8*func(x+dx)-8*func(x-dx)+func(x-2*dx))/(12*dx);
            case 2: return (-func(x+2*dx)+16*func(x+dx)-30*func(x)+16*func(x-dx)-func(x-2*dx))/(12*Math.pow(dx,2));
            case 3: return (-func(x+3*dx)+8*func(x+2*dx)-13*func(x+dx)+13*func(x-dx)-8*func(x-2*dx)+func(x-3*dx))/(8*Math.pow(dx,3));
            case 4: return (-func(x+3*dx)+12*func(x+2*dx)-39*func(x+dx)+ 56*func(x)-39*func(x-dx)+12*func(x-2*dx)-func(x-3*dx))/(6*Math.pow(dx,4));
            case 5: return (-func(x+4*dx)+9*func(x+3*dx)-26*func(x+2*dx)+29*func(x+dx)-29*func(x-dx)+26*func(x-2*dx)-9*func(x-3*dx)+func(x-4*dx))/(6*Math.pow(dx,5));
            case 6: return (-func(x+4*dx)+12*func(x+3*dx)-52*func(x+2*dx)+116*func(x+dx)-150*func(x)+116*func(x-dx)-52*func(x-2*dx)+12*func(x-3*dx)-func(x-4*dx))/(4*Math.pow(dx,6));
            default:
              console.warn('Numerical differentiation of order higher than 6 is not accurate');
              return Calculus.diff(function(y) { return Calculus.diff(func,y,dx,n-6); },x,dx,6);
        }
    },
    pdiff: function(func,numArgs,index,values) {
        // Numerical calculation for Partial differentiation
        // numArgs: number of arguments for the function
        // index: index of the arguments with respect to which the function is differentiated
        // values: numberical values of other arguments (excluding the ), contained in an array
        // NOTE: the function func take arguments as an array
        
        let tempFn = function(x) {
            return func();
        }
    },
    integrate: function(func,x1,x2,dx) { // method used: Simpson's 1/3 rule
        if(typeof func != 'function') throw '' + func + ' is not a function';
        if(dx==undefined) dx = (x2-x1)*1e-4;
        let result = 0;
        let index = x1;
        while(index + dx < x2) {
            result += dx/6*(func(index)+4*func(index+dx/2)+func(index+dx));
            index += dx;
        }
        dx = x2-index;
        result += dx/6*(func(index)+4*func(index+dx/2)+func(index+dx));
        return result;
    }
}

export let Optimization = {
    minima: function(func,x0=0,dfunc,accuracy=1e-15,step=0.01) {  // method used: linear regression
        if(dfunc==undefined) dfunc = function(x) { return Calculus.diff(func,x,undefined,1); }
        let count = 0,
            previous = x0+1;
        while(Math.abs(x0-previous)>accuracy&&count<1e4) {
            previous = x0;
            x0 -= dfunc(x0)*0.01;
            count++;
        }
        if(count==1e4-1) console.warn('Iteration limit is reached. Minima may not be ideal');
        return x0;
    },
    maxima: function(func,x0=0,dfunc,accuracy=1e-15,step=0.01) {  // method used: linear regression
        if(dfunc==undefined) dfunc = function(x) { return Calculus.diff(func,x,undefined,1); }
        let count = 0,
            previous = x0+1;
        while(Math.abs(x0-previous)>accuracy&&count<1e4) {
            previous = x0;
            x0 += dfunc(x0)*step;
            count++;
        }
        if(count==1e4-1) console.warn('Iteration limit is reached. Maxima may not be ideal');
        return x0;
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
    extract: function(matrix,x0,y0,x1,y1) {
        if(x1<x0 || y1<y0) throw 'Wrong indices';
        let result = [];
        for(let i=x0;i<x1;i++) {
            result.push([]);
            for(let j=y0;j<y1;j++) result[i-x0][j-y0] = matrix[i][j];
        }
        return result;
    },
    clone: function(source) {
        let destination = [];
        for(let i=0;i<source.length;i++) {
            destination.push([]);
            for(let j=0;j<source[i].length;j++) {
                destination[i].push(source[i][j]);
            }
        }
        return destination;
    },
    rowOperations: {
        swap: function(matrix,num1,num2) {
            if(Math.max(num1,num2)>matrix.length) throw 'Row index is outside the matrix dimension';
            let result = Matrix.clone(matrix);
            for(let i=0;i<result[num1].length;i++) {
                result[num1][i] = matrix[num2][i];
                result[num2][i] = matrix[num1][i];
            }
            return result;
        },
        scale: function(matrix,num,scalar) {
            if(num>matrix.length) throw 'Row index is outside the matrix dimension';
            let result = Matrix.clone(matrix);
            for(let i=0;i<result[num].length;i++) {
                result[num][i] *= scalar;
            }
            return result;
        },
        addRow: function(matrix,source,operand,scalar=1) {
            if(Math.max(source,operand)>matrix.length) throw 'Row index is outside the matrix dimension';
            let result = Matrix.clone(matrix);
            for(let i=0;i<result[source].length;i++) {
                result[source][i] += result[operand][i]*scalar;
            }
            return result;
        }
    },
    echelonForm: function(matrix) {
        let result = Matrix.clone(matrix);
        for(let i=0;i<matrix.length-1;i++) {
            for(let j=i+1;j<matrix.length;j++) result = Matrix.rowOperations.addRow(result,j,i,-result[j][i]/result[i][i]);
        }
        return result;
    },
    reducedEchelonForm: function(matrix) {
        let result = Matrix.echelonForm(matrix);
        for(let i=result.length-1;i>0;i--) {
            for(let j=i-1;j>-1;j--) result = Matrix.rowOperations.addRow(result,j,i,-result[j][i]/result[i][i]);
        }
        for(let i=0;i<result.length;i++) result = Matrix.rowOperations.scale(result,i,1/result[i][i]);
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
            if(a*n==c*m) console.warn('Infinite number of solutions');
            else console.warn('No solution found');
            return undefined;
        } else return {
            x: (m*d-n*b)/(a*d-b*c),
            y: (m*c-n*a)/(b*c-a*d),
        }
    },
    simultaneousEqn: function(matrix) {  // method used: Gaussian elimination
        if(matrix[0].length!=matrix.length+1) throw 'Augmented matrix has wrong dimension. It must be in n x (n+1)';
        let temp = Matrix.reducedEchelonForm(matrix);
        let result = [];
        for(let i=0;i<temp.length;i++) result.push(temp[i][temp[i].length-1]);
        return result;
    },
    findRootEqn: function(func,x0=0,dfunc,accuracy=1e-15) {  // method used: Newton's method
        if(dfunc==undefined) dfunc = function(x) { return Calculus.diff(func,x,undefined,1); };
        let count = 0;
        while(Math.abs(func(x0))>accuracy&&count<1e4) {
            x0 -= func(x0)/dfunc(x0);
            count++;
        }
        if(Math.abs(func(x0)>1)) {
            console.warn('No solution found');
            return undefined;
        }
        return x0;
    },
    quadraticEqn: function(a,b,c,complex=false) {
        if(complex==true) {
            let sqrtD = ComplexNumber.SQRT(b*b-4*a*c);
            return [sqrtD[0].add(-b).multiply(1/2/a),sqrtD[1].add(-b).multiply(1/2/a)];
        }
        let determinant = b*b-4*a*c;
        if(determinant<0) { console.warn('No real roots'); return undefined; }
        else if(determinant==0) { return [(-b/2/coeff[2])]; }
        else return [-b+Math.sqrt(determinant)/2/a,-b-Math.sqrt(determinant)/2/a];
    },
    cubicEqn: function(a,b,c,d,complex=false) {
        let p = c/a-b*b/3/a/a,
            q = d/a+2/27*b*b*b/a/a/a-b*c/3/a,
            sqrtD = ComplexNumber.SQRT(q*q+4*p*p*p/27),
            u1 = ComplexNumber.CBRT(sqrtD[0].add(-q).multiply(0.5)),
            u2 = ComplexNumber.CBRT(sqrtD[1].add(-q).multiply(0.5)),
            result = [];
        if(complex==true) for(let i=0;i<3;i++) result.push(u1[i].add(u2[i]).add(-b/3/a));
        else for(let i=0;i<3;i++) {
            let number = u1[i].add(u2[i]).add(-b/3/a);
            if(Math.abs(number.im)<a*1e-12) result.push(number.re); 
        }
        return result;
    },
    ODE: function(mode='Euler',func,x0,step=1/60) {
        if(mode='Euler') {
            return x0+h*func(x0);
        }
        if(mode='RK4') {
            let k1 = h*func(x0),
                k2 = h*func(x0+k1/2),
                k3 = h*func(x0+k2/2),
                k4 = h*func(x0+k3);
            return x0+(k1+k2*2+k3*2+k4)/6;
        }
        return undefined;
    }
}

export let Graph = {
    drawAxis: function(xRange,yRange,canvas) {
        let context = canvas.getContext('2d'),
            bigX = Math.max(xRange[0],xRange[1]),
            smallX = Math.min(xRange[0],xRange[1]),
            bigY = Math.max(yRange[0],yRange[1]),
            smallY = Math.min(yRange[0],yRange[1]),
            xScale = canvas.width/(bigX-smallX),
            yScale = canvas.height/(bigY-smallY);

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

        let bigX = Math.max(xRange[0],xRange[1]),
            smallX = Math.min(xRange[0],xRange[1]);
        if(step==undefined) step = (bigX-smallX)/canvas.width;
        let xSeq = [],
            ySeq = [],
            index = 0;
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
        
        let xScale = canvas.width/Math.abs(xRange[0]-xRange[1]),
            yScale = canvas.height/Math.abs(yRange[0]-yRange[1]),
            context = canvas.getContext('2d');

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
    point: function(x,y,radius,xRange,yRange,canvas,color='blue') {
        if(xRange.length != 2) throw 'Invalid xRange. xRange must contain only 2 numbers';
        if(yRange.length != 2) throw 'Invalid yRange. yRange must contain only 2 numbers';
        
        let xScale = canvas.width/Math.abs(xRange[0]-xRange[1]),
            yScale = canvas.height/Math.abs(yRange[0]-yRange[1]),
            context = canvas.getContext('2d');
        if(radius==undefined) radius = 5;

        context.save();
        context.translate(-Math.min(xRange[0],xRange[1])*xScale,Math.max(yRange[0],yRange[1])*yScale);

        context.beginPath();
        context.arc(x*xScale,-y*yScale,radius,0,Math.PI*2);
        context.fillStyle = color;
        context.fill();
        context.restore();
    },
    scatter: function(xSeq,ySeq,radius,xRange,yRange,canvas,color='blue') {
        if(xSeq.length != ySeq.length) throw 'Invalid arguments. xSeq and ySeq do not have the same length';
        if(xRange.length != 2) throw 'Invalid xRange. xRange must contain only 2 numbers';
        if(yRange.length != 2) throw 'Invalid yRange. yRange must contain only 2 numbers';
        
        let xScale = canvas.width/Math.abs(xRange[0]-xRange[1]),
            yScale = canvas.height/Math.abs(yRange[0]-yRange[1]),
            context = canvas.getContext('2d');
        if(radius==undefined) radius = 5;

        context.save();
        context.translate(-Math.min(xRange[0],xRange[1])*xScale,Math.max(yRange[0],yRange[1])*yScale);
        context.fillStyle = color;
        for(let i=0;i<xSeq.length;i++) {
            context.beginPath();
            context.arc(xSeq[i]*xScale,-ySeq[i]*yScale,radius,0,Math.PI*2);
            context.fill();
        }
        context.restore();
    },
    histogram: function(valueList,freqList,canvas) {
        if(valueList.length!=freqList.length) throw 'Value list and frequency list must have the same length';
         
    },
    bar: function(list,yRange,color,canvas) {
        if(color==undefined) color='blue';
        let colors = [];
        if(typeof color=='string') for(let i=0;i<list.length;i++) colors.push(color); else colors = color;
        let ctx = canvas.getContext('2d'),
            length = canvas.width/list.length,
            yScale = canvas.height/Math.abs(yRange[0]-yRange[1]);
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
        let result = 0,
            length = list.length;
        for(let i=0;i<length;i++) result+=list[i];
        return result;
    },
    mean: function(list) {
        let result = 0,
            length = list.length;
        for(let i=0;i<length;i++) result+=list[i];
        return result/length;
    },
    var: function(list) {
        let sumSquared = 0,
            sum = 0,
            length = list.length;
        for(let i=0;i<length;i++) {
            sumSquared += list[i]*list[i];
            sum += list[i];
        }
        sum /= length;
        return sumSquared/length - sum*sum;
    },
    sd: function(list) {
        return Math.sqrt(Statistics.var(list));
    },
    sampleVar: function(list) {  // unbiased estimate of population variance from a sample
        let sumSquared = 0,
            sum = 0,
            length = list.length;
        for(let i=0;i<length;i++) {
            sumSquared += list[i]*list[i];
            sum += list[i];
        }
        let temp = length-1;
        return sumSquared/temp - sum*sum/length/temp;
    },
    sampleSd: function(list) {
        return Math.sqrt(Statistics.sampleVar(list));
    },
    cov: function(list1,list2) {
        if(list1.length!=list2.length) throw 'Two lists don\'t have the same length';
        let xySum = 0,
            xSum = 0,
            ySum = 0,
            length = list1.length;
        for(let i=0;i<length;i++) {
            xySum += list1[i]*list2[i];
            xSum += list1[i];
            ySum += list2[i];
        }
        return (xySum-xSum*ySum/length)/length;
    },
    regression: {
        linear: function(listX,listY) {
            if(listX.length!=listY.length) throw 'Two data sets must have the same length';
            let sumX = 0,
                sumY = 0,
                sumX2 = 0,
                sumY2 = 0,
                sumXY = 0;
            for(let i=0;i<listX.length;i++) {
                sumX += listX[i];
                sumY += listY[i];
                sumX2 += listX[i]*listX[i];
                sumY2 += listY[i]*listY[i];
                sumXY += listX[i]*listY[i];
            }
            let denominator = sumX*sumX - listX.length*sumX2,
                numerator = sumX*sumY-sumXY*listX.length,
                A = (sumX*sumY-sumXY*listX.length)/denominator,
                B = (sumXY*sumX-sumX2*sumY)/denominator,
                R = -numerator/Math.sqrt(listX.length*sumX2-sumX*sumX)/Math.sqrt(listX.length*sumY2-sumY*sumY),
                R2 = R*R;
            return {'a': A, 'b': B, 'r2': R2, 'r': R};
        },
        exponential: function(listX,listY) {
            if(listX.length!=listY.length) throw 'Two data sets must have the same length';
            let listYnew = [];
            for(let i=0;i<listY.length;i++) {
                listYnew.push(Math.log(listY[i]));
            }
            let raw = Statistics.regression.linear(listX,listYnew),
                A = Math.exp(raw.b),
                B = Math.exp(raw.a);
            return {'a': A, 'b': B, 'r2': raw.r2, 'r': raw.r};
        }
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
        let magnitude = Compute.magnitude(vector.x,vector.y),
            theta0 = Math.atan2(vector.x, vector.y);
        return {
            x: magnitude*Math.cos(theta0-angle),
            y: magnitude*Math.sin(theta0-angle),
        }
    },
}

export let Signal = (function() {
    // this implementation is designed to work for real signal only, size = power of 2
    
    // a public object to store public methods. this anonymous function will return this public object
    // only fft(), ifft() and get() are exposed to public
    /* Set up nth Root of Unity for use with FFT algorithm
    * Not efficient, but constant time
    * Give exact values for some cases. Else use formula to generate
    * nRootUnity[x][y] is the first xth root of unity power to y
    * NOTE: there will be holes in the array nRootUnity
    */
    let nRootUnity = [];
    {
        let base = 1;
        for(let i=1;i<13;i++) {  // 2 → 4096
            base *= 2;
            nRootUnity[base] = [];
            nRootUnity[base][0] = new ComplexNumber(1,0);
            for(let j=1;j<base;j++) nRootUnity[base][j] = new ComplexNumber(Math.cos(2*Math.PI*j/base),Math.sin(-2*Math.PI*j/base));
        }
    }

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
        let size = timeSignal.length,
            signalEven = [],
            signalOdd = [];
        for(let i=0;i<size;i+=2) {
            signalEven.push(timeSignal[i]);
        }
        for(let i=1;i<size;i+=2) {
            signalOdd.push(timeSignal[i]);
        }
        let freqEven = FFT(signalEven),
            freqOdd = FFT(signalOdd),
            freqSignal = [];
        
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
    
    pub.ifft = function(freqSignal,fftSize) {
        let result = pub.fft(freqSignal,fftSize);
        for(let i=0;i<freqSignal.length;i++) result[i] = result[i].multiply(1/fftSize);
        return result;
    };
    
    pub.get = {
        ReArray: function(signal) {
            /* Extract the real components from a ComplexNumber array
             * INPUT: a ComplexNumber array
             * RETURN: a number array of real components
             */
            let result = [];
            for(let i=0;i<signal.length;i++) result[i] = signal[i].re;
            return result;
        },
        ImArray: function(signal) {
            /* Extract the imaginary components from a ComplexNumber array
             * INPUT: a ComplexNumber array
             * RETURN: a number array of imaginary components
             */
            let result = [];
            for(let i=0;i<signal.length;i++) result[i] = signal[i].im;
            return result;
        },
        MagnitudeArray: function(signal) {
            /* Extract the magnitudes from a ComplexNumber array
             * INPUT: a ComplexNumber array
             * RETURN: a number array of magnitudes
             */
            let result = [];
            for(let i=0;i<signal.length;i++) result[i] = Math.sqrt(signal[i].re*signal[i].re + signal[i].im*signal[i].im);
            return result;
        },
        getPhaseArray: function(signal) {
            /* Extract the phases from a ComplexNumber array
             * INPUT: a ComplexNumber array
             * RETURN: a number array of phases in radian
             */
            let result = [];
            for(let i=0;i<signal.length;i++) result[i] = Math.atan2(signal[i].im,signal[i].re);
            return result;
       },  
    };
    pub.generateFn = function(Fn,xSeq) {
        if(typeof Fn != 'function') throw '' + Fn + ' is not a function';

        let result = [];
        for(let i=0;i<xSeq.length;i++) result[i] = Fn(xSeq[i]);
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

export let Parser = {
    toPostfix: function(string) {
        let output = [],
            stack = [],
            numbers = ['0','1','2','3','4','5','6','7','8','9'],
            operators = ['+','-','*','/','^'];
        let compareOperator = function(op1,op2) {
            let order = [['+','-'],
                         ['*','/'],
                         ['^']];
            let rank1,rank2;
            for(let i=0;i<order.length;i++) {
                if(rank1==undefined&&order[i].includes(op1)) rank1 = i;
                if(rank2==undefined&&order[i].includes(op2)) rank2 = i;
                if(rank1!=undefined&&rank2!=undefined) break;
            }
            if(rank1!=rank2) return rank1>rank2;     // rank according to operator precedence
            if(rank1!=2) return true; return false;  // when the precedences are equal, return true iff op1 is left-associative
        }
        for(let i=0;i<string.length;i++) {
            if(numbers.includes(string[i])) output.push(string[i]);
            else if(operators.includes(string[i])) {
                while(stack.length!=0&&compareOperator(stack[stack.length-1],string[i])&&stack[stack.length-1]!='(') output.push(stack.pop());
                stack.push(string[i]);
            }
            else if(string[i]=='(') stack.push(string[i]);
            else if(string[i]==')') {
                while(stack[stack.length-1]!='(') output.push(stack.pop());
                stack.pop();
            }
            //console.log(output);
            //console.log(stack);
        }
        while(stack.length>0) {
            output.push(stack.pop());
        }
        return output
    }
}