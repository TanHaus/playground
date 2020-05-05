export * from './mathModules/finance.js';
export * from './mathModules/solver.js';
export * from './mathModules/statistics.js';
export const name = 'math';
export class ComplexNumber {
    /**
     * @constructor
     * @param {number} re - Real part of the complex number
     * @param {number} im - Imanginary part of the complex number
     */
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }
    toString(type = 'rect') {
        if (type == 'rect')
            return `${this.re} + ${this.im}i`;
        if (type == 'polar')
            return `${this.magnitude()}e^i${this.arg().toPrecision(6)}`;
        if (type == 'polorLatex')
            return `${this.magnitude()}e^{i${this.arg().toPrecision(6)}}`;
        throw "Type must be either 'rect', 'polar', or 'polarLatex'";
    }
    clone(other) {
        if (typeof other == 'number') {
            this.re = other;
            this.im = 0;
        }
        else {
            this.re = other.re;
            this.im = other.im;
        }
        return this;
    }
    isEqual(other) { return ComplexNumber.EQUAL(this, other); }
    add(other) { return ComplexNumber.ADD(this, other); }
    multiply(other) { return ComplexNumber.MULTIPLY(this, other); }
    conjugate() { return ComplexNumber.CONJUGATE(this); }
    inverse() { return ComplexNumber.INVERSE(this); }
    magnitude() { return ComplexNumber.MAGNITUDE(this); }
    arg() { return ComplexNumber.ARG(this); }
    sqrt() { return ComplexNumber.SQRT(this); }
    cbrt() { return ComplexNumber.CBRT(this); }
    static CLONE(number) {
        if (typeof number == 'number')
            return new ComplexNumber(number, 0);
        return new ComplexNumber(number.re, number.im);
    }
    static EQUAL(no1, no2) {
        if (typeof no1 == 'number')
            no1 = new ComplexNumber(no1, 0);
        if (typeof no2 == 'number')
            no2 = new ComplexNumber(no2, 0);
        let real = no1.re - no2.re, imaginary = no1.im - no2.re;
        if (real * real < 1e-12 &&
            imaginary < 1e-12)
            return true;
        return false;
    }
    static ADD(no1, no2) {
        if (typeof no1 == 'number')
            no1 = new ComplexNumber(no1, 0);
        if (typeof no2 == 'number')
            no2 = new ComplexNumber(no2, 0);
        return new ComplexNumber(no1.re + no2.re, no1.im + no2.im);
    }
    static MULTIPLY(no1, no2) {
        if (typeof no1 == 'number')
            no1 = new ComplexNumber(no1, 0);
        if (typeof no2 == 'number')
            no2 = new ComplexNumber(no2, 0);
        return new ComplexNumber(no1.re * no2.re - no1.im * no2.im, no1.re * no2.im + no1.im * no2.re);
    }
    static CONJUGATE(number) {
        if (typeof number == 'number')
            return new ComplexNumber(number, 0);
        return new ComplexNumber(number.re, -number.im);
    }
    static INVERSE(number) {
        if (typeof number == 'number')
            return new ComplexNumber(1 / number, 0);
        let mag = number.magnitude();
        return new ComplexNumber(number.re / mag, -number.im / mag);
    }
    static MAGNITUDE(number) {
        if (typeof number == 'number')
            return number;
        return Math.sqrt(number.re * number.re + number.im * number.im);
    }
    static ARG(number) {
        if (typeof number == 'number') {
            if (number >= 0)
                return 0;
            return Math.PI;
        }
        return Math.atan2(number.im, number.re);
    }
    static SQRT(number) {
        if (typeof number == 'number')
            number = new ComplexNumber(number, 0);
        let mag = Math.sqrt(number.magnitude()), arg = number.arg() / 2, num1 = mag * Math.cos(arg), num2 = mag * Math.sin(arg);
        return [new ComplexNumber(num1, num2), new ComplexNumber(-num1, -num2)];
    }
    static CBRT(number) {
        if (typeof number == 'number')
            number = new ComplexNumber(number, 0);
        let mag = Math.cbrt(number.magnitude()), arg = number.arg() / 3;
        return [new ComplexNumber(mag * Math.cos(arg), mag * Math.sin(arg)),
            new ComplexNumber(mag * Math.cos(arg + 2 * Math.PI / 3), mag * Math.sin(arg + 2 * Math.PI / 3)),
            new ComplexNumber(mag * Math.cos(arg - 2 * Math.PI / 3), mag * Math.sin(arg - 2 * Math.PI / 3))];
    }
    static EXP(number) {
        if (typeof number == 'number')
            number = new ComplexNumber(number, 0);
        let mag = Math.exp(number.re), arg = number.im;
        return new ComplexNumber(mag * Math.cos(arg), mag * Math.sin(arg));
    }
    static POW(no1, no2) {
        if (typeof no1 == 'number')
            no1 = new ComplexNumber(no1, 0);
        if (typeof no2 == 'number')
            no2 = new ComplexNumber(no2, 0);
        let mag = Math.pow(no1.magnitude(), no2.re) * Math.exp(-no1.arg() * no2.im), arg = no1.arg() * no2.re + Math.log(no1.magnitude()) * no2.im;
        return new ComplexNumber(mag * Math.cos(arg), mag * Math.sin(arg));
    }
}
export class Random {
}
Random.integer = function (min = 1, max = 100) {
    if (min > max) {
        console.warn('Min is larger than max. Their values will be swapped');
        let temp = min;
        min = max;
        max = temp;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};
Random.normal = function (mean = 0, sd = 1) {
    let u = Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * sd + mean;
};
Random.colorGradientArray = function (color1, color2, size) {
    let result = [], R, G, B;
    if (size == 1) {
        R = Math.round(Math.sqrt(color1.red * color1.red / 2 + color2.red * color2.red / 2));
        G = Math.round(Math.sqrt(color1.green * color1.green / 2 + color2.green * color2.green / 2));
        B = Math.round(Math.sqrt(color1.blue * color1.blue / 2 + color2.blue * color2.blue / 2));
        result.push('rgb(' + R + ',' + G + ',' + B + ')');
    }
    else if (size > 1) {
        let length = size - 1;
        for (let i = 0; i <= length; i++) {
            R = Math.round(Math.sqrt(color1.red * color1.red * (1 - i / length) + color2.red * color2.red * (i / length)));
            G = Math.round(Math.sqrt(color1.green * color1.green * (1 - i / length) + color2.green * color2.green * (i / length)));
            B = Math.round(Math.sqrt(color1.blue * color1.blue * (1 - i / length) + color2.blue * color2.blue * (i / length)));
            result.push('rgb(' + R + ',' + G + ',' + B + ')');
        }
    }
    return result;
};
;
export class Calculus {
}
Calculus.diff = function (func, x, h, n) {
    if (typeof func != 'function')
        throw '' + func + ' is not a function';
    if (h == undefined) {
        if (x != 0)
            h = x * 1e-2;
        else
            h = 1e-2;
    }
    if (n == undefined)
        n = 1;
    switch (n) {
        case 0: return func(x);
        case 1: return (-func(x + 2 * h) + 8 * func(x + h) - 8 * func(x - h) + func(x - 2 * h)) / (12 * h);
        case 2: return (-func(x + 2 * h) + 16 * func(x + h) - 30 * func(x) + 16 * func(x - h) - func(x - 2 * h)) / (12 * Math.pow(h, 2));
        case 3: return (-func(x + 3 * h) + 8 * func(x + 2 * h) - 13 * func(x + h) + 13 * func(x - h) - 8 * func(x - 2 * h) + func(x - 3 * h)) / (8 * Math.pow(h, 3));
        case 4: return (-func(x + 3 * h) + 12 * func(x + 2 * h) - 39 * func(x + h) + 56 * func(x) - 39 * func(x - h) + 12 * func(x - 2 * h) - func(x - 3 * h)) / (6 * Math.pow(h, 4));
        case 5: return (-func(x + 4 * h) + 9 * func(x + 3 * h) - 26 * func(x + 2 * h) + 29 * func(x + h) - 29 * func(x - h) + 26 * func(x - 2 * h) - 9 * func(x - 3 * h) + func(x - 4 * h)) / (6 * Math.pow(h, 5));
        case 6: return (-func(x + 4 * h) + 12 * func(x + 3 * h) - 52 * func(x + 2 * h) + 116 * func(x + h) - 150 * func(x) + 116 * func(x - h) - 52 * func(x - 2 * h) + 12 * func(x - 3 * h) - func(x - 4 * h)) / (4 * Math.pow(h, 6));
        default:
            throw 'Numerical differentiation of order higher than 6 is not supported';
    }
};
Calculus.integrate = function (func, start, end, N) {
    /*
    Based on MIT OCW Introduction to Numerical Analysis 18.330
    https://ocw.mit.edu/courses/mathematics/18-330-introduction-to-numerical-analysis-spring-2012/
    Method used: Simpson's rule
    Coefficients: 1 4 2 4 2 ... 2 4 1
    Error: forth-order for function with fifth differentiability
    */
    if (typeof func != 'function')
        throw '' + func + ' is not a function';
    if (N == undefined)
        N = 1e4;
    let h = (end - start) / N / 2;
    let result = 0;
    for (let i = 0; i < N; i++)
        result += 4 * func(start + (2 * i + 1) * h) + 2 * func(start + 2 * i * h);
    result += func(end) - func(start);
    result *= h / 3;
    return result;
};
export let Graph = {
    drawAxis: function (xRange, yRange, canvas) {
        let context = canvas.getContext('2d'), bigX = Math.max(xRange[0], xRange[1]), smallX = Math.min(xRange[0], xRange[1]), bigY = Math.max(yRange[0], yRange[1]), smallY = Math.min(yRange[0], yRange[1]), xScale = canvas.width / (bigX - smallX), yScale = canvas.height / (bigY - smallY);
        context.save(); // this is for normal encapsulation
        context.save(); // this is for stroke
        context.translate(-smallX * xScale, bigY * yScale);
        context.scale(xScale, yScale);
        context.beginPath();
        context.moveTo(smallX, 0);
        context.lineTo(bigX, 0);
        context.moveTo(0, smallY);
        context.lineTo(0, bigY);
        context.lineWidth *= xScale / yScale;
        context.restore(); // stroke won't be affected by scale()
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();
        context.restore(); // encapsulation
    },
    plotFn: function (func, xRange, yRange, step, canvas, color = 'blue') {
        if (typeof func != 'function')
            throw `${func} is not a function`;
        if (xRange.length != 2)
            throw 'Invalid xRange. xRange must contain only 2 numbers';
        if (yRange.length != 2)
            throw 'Invalid yRange. yRange must contain only 2 numbers';
        let bigX = Math.max(xRange[0], xRange[1]), smallX = Math.min(xRange[0], xRange[1]);
        if (step == undefined)
            step = (bigX - smallX) / canvas.width;
        let xSeq = [], ySeq = [], index = 0;
        for (let i = smallX; i < bigX; i += step) {
            xSeq[index] = i;
            ySeq[index] = func(i);
            index++;
        }
        Graph.plot(xSeq, ySeq, xRange, yRange, canvas, color);
    },
    plot: function (xSeq, ySeq, xRange, yRange, canvas, color = 'blue') {
        if (xSeq.length != ySeq.length)
            throw 'Invalid arguments. xSeq and ySeq do not have the same length';
        if (xRange.length != 2)
            throw 'Invalid xRange. xRange must contain only 2 numbers';
        if (yRange.length != 2)
            throw 'Invalid yRange. yRange must contain only 2 numbers';
        let xScale = canvas.width / Math.abs(xRange[0] - xRange[1]), yScale = canvas.height / Math.abs(yRange[0] - yRange[1]), context = canvas.getContext('2d');
        context.save(); // this is for normal encapsulation
        context.save(); // this is for stroke
        context.translate(-Math.min(xRange[0], xRange[1]) * xScale, Math.max(yRange[0], yRange[1]) * yScale);
        context.scale(xScale, yScale);
        context.beginPath();
        context.moveTo(xSeq[0], -ySeq[0]); // minus y-coordinate because the canvas is inverse in y direction
        for (let i = 1; i < xSeq.length; i++) {
            context.lineTo(xSeq[i], -ySeq[i]); // minus y-coordinate because the canvas is inverse in y direction
        }
        context.restore();
        context.lineWidth = 2;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
    },
    point: function (x, y, radius, xRange, yRange, canvas, color = 'blue') {
        if (xRange.length != 2)
            throw 'Invalid xRange. xRange must contain only 2 numbers';
        if (yRange.length != 2)
            throw 'Invalid yRange. yRange must contain only 2 numbers';
        let xScale = canvas.width / Math.abs(xRange[0] - xRange[1]), yScale = canvas.height / Math.abs(yRange[0] - yRange[1]), context = canvas.getContext('2d');
        if (radius == undefined)
            radius = 5;
        context.save();
        context.translate(-Math.min(xRange[0], xRange[1]) * xScale, Math.max(yRange[0], yRange[1]) * yScale);
        context.beginPath();
        context.arc(x * xScale, -y * yScale, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.restore();
    },
    scatter: function (xSeq, ySeq, radius, xRange, yRange, canvas, color = 'blue') {
        if (xSeq.length != ySeq.length)
            throw 'Invalid arguments. xSeq and ySeq do not have the same length';
        if (xRange.length != 2)
            throw 'Invalid xRange. xRange must contain only 2 numbers';
        if (yRange.length != 2)
            throw 'Invalid yRange. yRange must contain only 2 numbers';
        let xScale = canvas.width / Math.abs(xRange[0] - xRange[1]), yScale = canvas.height / Math.abs(yRange[0] - yRange[1]), context = canvas.getContext('2d');
        if (radius == undefined)
            radius = 5;
        context.save();
        context.translate(-Math.min(xRange[0], xRange[1]) * xScale, Math.max(yRange[0], yRange[1]) * yScale);
        context.fillStyle = color;
        for (let i = 0; i < xSeq.length; i++) {
            context.beginPath();
            context.arc(xSeq[i] * xScale, -ySeq[i] * yScale, radius, 0, Math.PI * 2);
            context.fill();
        }
        context.restore();
    },
    bar: function (list, yRange, canvas, color = 'blue') {
        let colors = [];
        if (typeof color == 'string')
            for (let i = 0; i < list.length; i++)
                colors.push(color);
        else
            colors = color;
        let ctx = canvas.getContext('2d'), length = canvas.width / list.length, yScale = canvas.height / Math.abs(yRange[0] - yRange[1]);
        ctx.save();
        ctx.translate(0, Math.max(yRange[0], yRange[1]) * yScale);
        ctx.scale(1, yScale);
        for (let i = 0; i < list.length; i++) {
            ctx.beginPath();
            ctx.rect(i * length, -list[i], length, list[i]);
            ctx.fillStyle = colors[i];
            ctx.fill();
        }
        ctx.restore();
    }
};
export let Compute = {
    magnitude: function (x, y) {
        return Math.sqrt(x * x + y * y);
    },
    degToRad: function (degree) {
        return degree * Math.PI / 180;
    },
    radToDeg: function (rad) {
        return rad / Math.PI * 180;
    },
    distance: function (point1, point2) {
        return Compute.magnitude(point1.x - point2.x, point1.y - point2.y);
    },
    rotateVector: function (vector, angle) {
        let magnitude = Compute.magnitude(vector.x, vector.y), theta0 = Math.atan2(vector.x, vector.y);
        return {
            x: magnitude * Math.cos(theta0 - angle),
            y: magnitude * Math.sin(theta0 - angle),
        };
    },
};
export let Parser = {
    toPostfix: function (string) {
        let output = [], stack = [], numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], operators = ['+', '-', '*', '/', '^'];
        let compareOperator = function (op1, op2) {
            let order = ['+-', '*/', '^'];
            let rank1 = 0, rank2 = 0;
            for (let i = 0; i < order.length; i++) {
                if (order[i].includes(op1))
                    rank1 = i;
                if (order[i].includes(op2))
                    rank2 = i;
            }
            if (rank1 != rank2)
                return rank1 > rank2; // rank according to operator precedence
            if (rank1 != 2)
                return true;
            return false; // when the precedences are equal, return true iff op1 is left-associative
        };
        for (let i = 0; i < string.length; i++) {
            if (numbers.includes(string[i]))
                output.push(string[i]);
            else if (operators.includes(string[i])) {
                while (stack.length != 0 && compareOperator(stack[stack.length - 1], string[i]) && stack[stack.length - 1] != '(')
                    output.push(stack.pop());
                stack.push(string[i]);
            }
            else if (string[i] == '(')
                stack.push(string[i]);
            else if (string[i] == ')') {
                while (stack[stack.length - 1] != '(')
                    output.push(stack.pop());
                stack.pop();
            }
            //console.log(output);
            //console.log(stack);
        }
        while (stack.length > 0) {
            output.push(stack.pop());
        }
        return output;
    }
};
