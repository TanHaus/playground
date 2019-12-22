let n_show = document.querySelector("#n"),
    ir_show = document.querySelector("#ir"),
    pv_show = document.querySelector("#pv"),
    pmt_show = document.querySelector("#pmt"),
    fv_show = document.querySelector("#fv");

let n = 10, ir = 0, pv = -5000, pmt = 100, fv = 1000,
    accuracy = 4;

let show = [n_show, ir_show, pv_show, pmt_show, fv_show]

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
            let function_f = r => (r==0) ? pv + pmt*n + fv : pv*(1+r)**n + pmt/r*((1+r)**n - 1) + fv
            let derivative_f = r => (r==0) ? pv*n + pmt*n*(n-1)/2 : pv*n*(1+r)**(n-1) + pmt/r**2*(n*(1+r)**(n-1)*r-(1+r)**n+1)
            let tol = 1e-7
            
            /*
            Implement midpoint's method. Not efficient but guarantee to find a solution
             */
            // let ir1 = 1, ir2 = -1
            // let fir1 = function_f(ir1), fir2 = function_f(ir2)
            // ensure they have opposite signs
            // while(fir1*fir2>=0){
            //     ir1 += 0.1
            //     fir1 = function_f(ir1)
            //     if(fir1*fir2<0) break
            //     ir2 -= 0.1
            //     fir2 = function_f(ir2)
            // }

            // let count = 0
            // while(Math.abs(function_f(ir1)) > tol && Math.abs(ir1-ir2) > tol) {
            //     // let m = (ir1 + ir2)/2
            //     // let fm = function_f(m)

            //     // if(fm*fir1 < 0) {
            //     //     ir = ir2 = m
            //     //     fir2 = fm
            //     // } else if(fm*fir2 < 0) {
            //     //     ir = ir1 = m
            //     //     fir1 = fm
            //     // } else {
            //     //     ir = m
            //     //     break;
            //     // }

            //     count++;
            //     if(count > 1000) break;
            // }

            // if(Math.abs(fir1) > Math.abs(fir2)) ir = ir2; else ir = ir1;

            // console.log("n = ", n, "pv = ", pv, "pmt = ", pmt, "fv = ", fv);

            /* 
            Implement Newton's method
             */
            let ir1 = 0.1+Math.random()/100, ir2 = 0.1+Math.random()/100
            let count = 0
            while(Math.abs(function_f(ir1)) > tol && Math.abs(ir1-ir2) > tol) {
                let c = ir2
                ir2 = ir1 - function_f(ir1)/derivative_f(ir1)
                ir1 = c
                console.log("ir1 = ", ir1, " ir2 = ", ir2);

                count++;
                if(count > 1000) {
                    alert('Newton\'s method fails')
                    break;
                }
            }
            ir = ir2
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

let reset_tvm = function() {
    show.forEach(function(item) {
        item.value = 0
    })
}

reset_tvm()

let cf_rows = 2
let data_table = document.querySelector('#cf_data')

document.add_cf_row = function() {
    cf_rows++
    let new_row = data_table.insertRow()
    new_row.insertCell().textContent = cf_rows.toFixed(0)
    new_row.insertCell().innerHTML = '<input type="number" value=0>'
    new_row.insertCell().innerHTML = '<input type="number" value=1>'
}

let npv_function = function(r) {
    let sum = parseFloat(data_table.rows[1].cells[1].firstElementChild.value)
    let freq_sum = 0
    
    if(r!=0) {
        for(let i=1; i<=cf_rows; i++) {
            let row = data_table.rows[i+1]
            let cf = row.cells[1].firstElementChild.value,
                freq = row.cells[2].firstElementChild.value
            if(cf=='' || freq=='') break
            sum += cf/r*(1-1/(1+r)**freq) / (1+r)**freq_sum
            freq_sum += freq
        }
    } else {
        for(let i=1; i<=cf_rows; i++) {
            let row = data_table.rows[i+1]
            let cf = row.cells[1].firstElementChild.value,
                freq = row.cells[2].firstElementChild.value
            if(cf=='' || freq=='') break
            sum += cf*freq
        }
    }

    return sum
}

let npv_derivative_function = function(r) {
    let sum = 0
    let freq_sum = 0

    if(r!=0) {
        for(let i=1; i<=cf_rows; i++) {
            let row = data_table.rows[i+1]
            let cf = row.cells[1].firstElementChild.value,
                freq = row.cells[2].firstElementChild.value
            if(cf=='' || freq=='') break
            sum += cf/r/(1+r)**freq_sum * ( (1/r + (freq+freq_sum)/(1+r)/(1+r)**freq) - 1/r - freq_sum/(1+r) )
            freq_sum += freq
        }
    } else {
        for(let i=1; i<=cf_rows; i++) {
            let row = data_table.rows[i+1]
            let cf = row.cells[1].firstElementChild.value,
                freq = row.cells[2].firstElementChild.value
            if(cf=='' || freq=='') break
            sum += cf*freq*freq_sum*(1+freq_sum+freq)
            freq_sum += freq
        }
    }

    return sum
}

document.calc_npv = function() {
    let r = parseFloat(document.querySelector('#cf_ir').value)/100
    let npv = npv_function(r)
    document.querySelector('#show_npv').innerHTML = npv.toFixed(4)
}

document.calc_irr = function() {
    /*
    Implement secant method 
     */
    let guess1 = 0.1, guess2 = 0.2
    let npv1 = npv_function(guess1), npv2 = npv_function(guess2)
    let tol = 1e-7
    let count = 0
    do {
        let c = guess2
        let F = (npv2-npv1)/(guess2-guess1)
        guess2 = guess1 - npv1/F
        // guess2 = guess1 - npv_function(guess1)/npv_derivative_function(guess1)
        guess1 = c
        npv1 = npv2
        npv2 = npv_function(guess2)
        console.log('guess2 = ', guess2)

        count++
        if(count>1000) {
            console.alert('Cannot find IRR')
            break
        }
    }while(Math.abs(npv_function(guess1))>tol && Math.abs(guess1-guess2)>tol)
    
    document.querySelector('#show_irr').textContent = (guess1*100).toFixed(4) + '%'
}

