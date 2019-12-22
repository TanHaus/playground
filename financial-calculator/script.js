import { Solver } from '../libraries/math.js'

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
            let calc_fv = r => (r==0) ? pv + pmt*n + fv : pv*(1+r)**n + pmt/r*((1+r)**n - 1) + fv
            let derivative_fv = r => (r==0) ? pv*n + pmt*n*(n-1)/2 : pv*n*(1+r)**(n-1) + pmt/r**2*(n*(1+r)**(n-1)*r-(1+r)**n+1)

            ir = Solver.root('newton', calc_fv, 0.1, derivative_fv)
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
    let cf0 = parseFloat(data_table.rows[1].cells[1].firstElementChild.value)
    let CFs = [], freqs = []

    for(let i=1; i<=cf_rows; i++) {
        let row = data_table.rows[i+1]
        CFs.push(parseFloat(row.cells[1].firstElementChild.value))
        freqs.push(parseFloat(row.cells[2].firstElementChild.value))
    }

    return Solver.npv(cf0, CFs, freqs, r)
}

document.calc_npv = function() {
    let r = parseFloat(document.querySelector('#cf_ir').value)/100
    let npv = npv_function(r)
    document.querySelector('#show_npv').innerHTML = '$ ' + npv.toFixed(4)
}

document.calc_irr = function() {
    let cf0 = parseFloat(data_table.rows[1].cells[1].firstElementChild.value)
    let CFs = [], freqs = []

    for(let i=1; i<=cf_rows; i++) {
        let row = data_table.rows[i+1]
        CFs.push(parseFloat(row.cells[1].firstElementChild.value))
        freqs.push(parseFloat(row.cells[2].firstElementChild.value))
    }

    let irr = Solver.irr(cf0, CFs, freqs)
    
    document.querySelector('#show_irr').textContent = (irr*100).toFixed(4) + '%'
}

