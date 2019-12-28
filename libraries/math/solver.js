let Solver = {}

Solver.sim2 = function(matrix) {  // simultaneous equation, 2 unknowns. size of matrix is 2x3
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
}

Solver.simultaneousEqn = function(matrix) {  // method used: Gaussian elimination
    if(matrix[0].length!=matrix.length+1) throw 'Augmented matrix has wrong dimension. It must be in n x (n+1)';
    let temp = Matrix.reducedEchelonForm(matrix);
    let result = [];
    for(let i=0;i<temp.length;i++) result.push(temp[i][temp[i].length-1]);
    return result;
}

/**
 * 
 * @param {string} method - Either 'newton' or 'secant'
 * @param {function} fx - Function to solve f(x) = 0
 * @param {number} x0 - Initial guess
 * @param {*} optional - For Newton's method, it's the derivative function. For secant method, it's the second guess
 * @param {number} tol - Tolerance for zero
 */ 
Solver.root = function(method='newton', fx, x0=0, optional, tol=1e-7) {
    if(typeof optional != 'function') {
        method='secant'
        if(typeof optional != 'number') optional = x0+Math.random()
    }

    let count = 0;

    if(method=='newton') {
        let x1 = x0
        let dfunc = optional

        do {
            x1 = x0
            x0 = x0 - fx(x1)/dfunc(x1);

            count++;
            if(count > 1000) {
                console.warn('Exceed 1000 iterations. Cannot find a root')
                break
            }
        } while(Math.abs(fx(x0)) > tol && Math.abs(x0-x1) > tol)

    }

    if(method=='secant') {
        let x1 = optional,
            fx1 = fx(x1),
            fx0 = fx(x0)

        do {
            let c = x1
            let F = (fx1-fx0)/(x1-x0)
            x1 = x0 - fx0/F

            x0 = c
            fx0 = fx1
            fx1 = fx(x1)

            count++
            if(count > 1000) {
                console.warn('Exceed 1000 iterations. Cannot find a root')
                break
            } 
        } while(Math.abs(fx(x0)) > tol && Math.abs(x0-x1) > tol)

    }

    return x0
}

Solver.quadraticEqn = function(a,b,c,complex=false) {
    if(complex==true) {
        let sqrtD = ComplexNumber.SQRT(b*b-4*a*c);
        return [sqrtD[0].add(-b).multiply(1/2/a),sqrtD[1].add(-b).multiply(1/2/a)];
    }
    let determinant = b*b-4*a*c;
    if(determinant<0) { 
        console.warn('No real roots'); return undefined; 
    }
    else if(determinant==0) { 
        return [ -b/(2*a) ]; 
    }
    else return [(-b + Math.sqrt(determinant))/(2*a), (-b - Math.sqrt(determinant))/(2*a)];
}

Solver.cubicEqn = function(a,b,c,d,complex=false) {
    let d0 = b*b - 3*a*c,
        d1 = 2*b*b*b - 9*a*b*c + 27*a*a*d,
        result = [];
    console.log(result);
    return result;
}

Solver.ODE = function(mode='Euler',func,x0,step=1/60) {
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

export { Solver }
