import { ComplexNumber } from "../math.js";
export class Solver {
}
Solver.sim2 = function (matrix) {
    if (matrix.length != 2 && matrix[0].length != 3 && matrix[1].length != 3)
        throw 'Matrix dimensions are not int 2x3 shape';
    let a = matrix[0][0];
    let b = matrix[0][1];
    let m = matrix[0][2];
    let c = matrix[1][0];
    let d = matrix[1][1];
    let n = matrix[1][2];
    if (a * d == b * c) {
        if (a * n == c * m)
            console.warn('Infinite number of solutions');
        else
            console.warn('No solution found');
        return undefined;
    }
    else
        return {
            x: (m * d - n * b) / (a * d - b * c),
            y: (m * c - n * a) / (b * c - a * d),
        };
};
Solver.root = function (fx, fxprime, x0 = 0, method = 'newton', tol = 1e-7) {
    let count = 0;
    if (method == 'newton') {
        let x1 = x0;
        do {
            x1 = x0;
            x0 = x0 - fx(x1) / fxprime(x1);
            count++;
            if (count > 1000) {
                console.warn('Exceed 1000 iterations. Cannot find a root');
                break;
            }
        } while (Math.abs(fx(x0)) > tol && Math.abs(x0 - x1) > tol);
        return x0;
    }
    throw 'Only newton method is supported';
};
Solver.quadraticEqn = function (a, b, c, complex = false) {
    if (complex) {
        let sqrtD = ComplexNumber.SQRT(b * b - 4 * a * c);
        return sqrtD.map(x => x.add(-b).multiply(1 / (2 * a)));
    }
    let determinant = b * b - 4 * a * c;
    if (determinant < 0) {
        console.warn('No real roots');
        return undefined;
    }
    else if (determinant == 0) {
        return [-b / (2 * a), -b / (2 * a)];
    }
    else
        return [(-b + Math.sqrt(determinant)) / (2 * a), (-b - Math.sqrt(determinant)) / (2 * a)];
};
Solver.cubicEqn = function (a, b, c, d, complex = false) {
    let d0 = b * b - 3 * a * c, d1 = 2 * b * b * b - 9 * a * b * c + 27 * a * a * d, result = [];
    console.log(result);
    return result;
};
Solver.ODE = function (mode = 'Euler', func, x0, step = 1 / 60) {
    if (mode == 'Euler') {
        return x0 + step * func(x0);
    }
    if (mode == 'RK4') {
        let k1 = step * func(x0), k2 = step * func(x0 + k1 / 2), k3 = step * func(x0 + k2 / 2), k4 = step * func(x0 + k3);
        return x0 + (k1 + k2 * 2 + k3 * 2 + k4) / 6;
    }
    throw 'Mode must be either Euler or RK4';
};
