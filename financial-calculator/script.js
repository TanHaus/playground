import { Finance } from '../libraries/math.js'

/**
 * For TVM calculator
 */

let n_show = document.querySelector("#n"),
    ir_show = document.querySelector("#ir"),
    pv_show = document.querySelector("#pv"),
    pmt_show = document.querySelector("#pmt"),
    fv_show = document.querySelector("#fv");

let n = 10, ir = 0, pv = -5000, pmt = 100, fv = 1000,
    accuracy = 4;

let show = [n_show, ir_show, pv_show, pmt_show, fv_show]

/**
 * Retrieve and assign value to variables
 */
document.calculate = function(calculate_value) {
    retrieve_value();

    switch(calculate_value) {
        case "n":
            n = Finance.tvm('n', ir, pv, pmt, fv)
            break;

        case "ir":
            ir = Finance.tvm('ir', n, pv, pmt, fv)
            break;
            
        case "pv":
            pv = Finance.tvm('pv', n, ir, pmt, fv)
            break;

        case "pmt":
            pmt = Finance.tvm('pmt', n, ir, pv, fv)
            break;

        case "fv":
            fv = Finance.tvm('fv', n, ir, pv, pmt)
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

/**
 * For CF calculator
 */

// Keep track of number of data rows
let cf_rows = 2
let data_table = document.querySelector('#cf_data')

document.add_cf_row = function() {
    cf_rows++
   
    let index = document.createElement('span')
    index.textContent = cf_rows.toFixed(0)
    let inputCF = document.createElement('input')
    inputCF.type = 'number'
    inputCF.classList.add('CFvalue')
    inputCF.value = 0
    let inputFreq = document.createElement('input')
    inputFreq.type = 'number'
    inputFreq.classList.add('CFfreq')
    inputFreq.value = 1

    data_table.append(index, inputCF, inputFreq)
}

// Retrieve information from the CF table of data
let getData = function() {
    let CF0 = parseFloat(document.querySelector('.CF0').value)
    let CFs = document.querySelectorAll('.CFvalue')
    let Freqs = document.querySelectorAll('.CFfreq')
    let CFvalues = [], CFfreqs = []

    for(let i=0; i<CFs.length; i++) {
        CFvalues[i] = parseFloat(CFs.item(i).value)
        CFfreqs[i] = parseFloat(Freqs.item(i).value)
    }

    return [CF0, CFvalues, CFfreqs]
}

document.calc_npv = function() {
    let r = parseFloat(document.querySelector('#cf_ir').value)/100
    let [CF0, CFvalues, CFfreqs] = getData()

    let npv = Finance.npv(CF0, CFvalues, CFfreqs, r)
    
    document.querySelector('#show_npv').innerHTML = '$ ' + npv.toFixed(4)
}

document.calc_irr = function() {
    let [CF0, CFvalues, CFfreqs] = getData()

    let irr = Finance.irr(CF0, CFvalues, CFfreqs)
    
    document.querySelector('#show_irr').textContent = (irr*100).toFixed(4) + '%'
}

