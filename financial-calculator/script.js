import { Solver } from '../libraries/math.js'

let n_show = document.querySelector("#n"),
    ir_show = document.querySelector("#ir"),
    pv_show = document.querySelector("#pv"),
    pmt_show = document.querySelector("#pmt"),
    fv_show = document.querySelector("#fv");

let n = 10, ir = 0, pv = -300, pmt = 80, fv = 1000,
    accuracy = 4;

document.calculate = function(calculate_value) {
    // Retrieve and assign value to variables
    retrieve_value();
    let rate = 1 + ir,
        discount = rate**n,
        pmt_r = pmt/ir;

    switch(calculate_value) {
        case "n":
            n = Math.log((pmt_r - fv) / (pmt_r + pv))/Math.log(rate);
            break;

        case "ir":
            let c2 = n*(n-1)/2,
                c3 = c2*(n-2)/3;
            let a = c2*pv + c3*pmt,
                b = n*pv + c2*pmt,
                c = pv + fv;
            // Series expansion of ir to get a quadratic equation of ir → solve quadratic equation to get a good guess of initial value
            let result = Solver.quadraticEqn(a,b,c);
            for(let i=0; i<2; i++) {
                if(result[i]>0) ir = result[i];
            }
            // Use recursion formula to approximate the value
            let ir1 = ir, ir2 = 0,
                error = Math.pow(0.1,accuracy+3);
            while(ir1-ir2>error) {
                discount = Math.pow(1+ir1,n);
                ir2 = -(pmt*(discount-1))/(fv+discount*pv);
                discount = (1+ir2)**n;
                ir1 = -(pmt*(discount-1))/(fv+discount*pv);
            }
            ir = ir1;
            break;
            
        case "pv":
            pv = -pmt_r * (1 - 1/discount) - fv/discount;
            break;

        case "pmt":
            pmt = (-fv - pv*discount) * ir / (discount - 1);
            break;

        case "fv":
            fv = -pmt_r * (discount - 1) - pv*discount;
            break;
    }

    update_value(calculate_value);
}

let retrieve_value = function() {
    n = parseFloat(n_show.value);
    ir = parseFloat(ir_show.value)/100;
    pv = parseFloat(pv_show.value);
    pmt = parseFloat(pmt_show.value);
    fv = parseFloat(fv_show.value);
}

let update_value = function(value) {
    switch(value) {
        case "n":
            n_show.value = n.toFixed(accuracy);
            break;

        case "ir":
            ir_show.value = (ir*100).toFixed(accuracy);
            break;
            
        case "pv":
            pv_show.value = pv.toFixed(accuracy);
            break;

        case "pmt":
            pmt_show.value = pmt.toFixed(accuracy);
            break;

        case "fv":
            fv_show.value = fv.toFixed(accuracy);
            break;
    }
}