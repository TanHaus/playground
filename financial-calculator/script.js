let n_show = document.querySelector("#n"),
    ir_show = document.querySelector("#ir"),
    pv_show = document.querySelector("#pv"),
    pmt_show = document.querySelector("#pmt"),
    fv_show = document.querySelector("#fv");

let n = 10, ir = 0, pv = -5000, pmt = 100, fv = 1000,
    accuracy = 4;

document.calculate = function(calculate_value) {
    // Retrieve and assign value to variables
    //retrieve_value();
    let rate = 1 + ir,
        discount = rate**n,
        pmt_r = pmt/ir;

    switch(calculate_value) {
        case "n":
            n = Math.log((pmt_r - fv) / (pmt_r + pv))/Math.log(rate);
            break;

        case "ir":
            // Use recursion formula to approximate the value
            console.log("n = ", n, "pv = ", pv, "pmt = ", pmt, "fv = ", fv);
            let ir1 = -1, ir2 = 0,
                accuracy = 1e-7,
                count = 0;

            let function_min = r => pv*(1+r)**n*r + pmt*(1+r)**n - pmt + fv*r;
            let derivative = r => n*pv*(1+r)**(n-1) + pv*(1+r)**n + n*pmt*(1+r)**(n-1) + fv;
            let function_linear = r => Math.log(function_min(r)+1);
            let derivative_linear = r => derivative(r)/(function_min(r)+1);

            while(Math.abs(function_min(ir1)) > accuracy) {
                ir2 = ir1 - function_min(ir1)/derivative(ir1);
                ir1 = ir2 - function_min(ir2)/derivative(ir2);
                console.log("ir1 = ", ir1, " ir2 = ", ir2);

                count++;
                if(count > 1000) break;
            }
            ir = ir1;

            console.log("CONFIRM ", function_min(ir));

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

let test = function() {
    n = 10, ir = 0, pv = -5000, pmt = 80;
}