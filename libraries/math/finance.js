import { Solver } from '../math.js'

let Finance = {}

/**
 * Time Value of Money (TVM) solver
 * @param {string} find - Name of variable to find e.g. n, ir, pv, pmt, fv
 * @param {number[]} otherArguments - Follow this order, without the 'find' parameter: n, ir, pv, pmt, fv
 * 
 * E.g. You want to find Present value, given periods = 10, interest rate = 5, payment = 0, future value = 1000. You will write Finance.tvm('pv', 10, 5, 0, 1000)
 */
Finance.tvm = function(find, ...otherArguments){
    let n, ir, pv, pmt, fv,
        rate, discount, pmt_r
    switch(find){
        case 'n':
            [ir, pv, pmt, fv] = otherArguments

            return Math.log((pmt/ir - fv) / (pmt/ir + pv))/Math.log(1+ir);
        case 'ir':
            [n, pv, pmt, fv] = otherArguments

            let calc_fv = r => (r==0) ? pv + pmt*n + fv : pv*(1+r)**n + pmt/r*((1+r)**n - 1) + fv
            let derivative_fv = r => (r==0) ? pv*n + pmt*n*(n-1)/2 : pv*n*(1+r)**(n-1) + pmt/r**2*(n*(1+r)**(n-1)*r-(1+r)**n+1)

            return Solver.root('newton', calc_fv, 0.1, derivative_fv)
        case 'pv':
            [n, ir, pmt, fv] = otherArguments
            rate = 1 + ir
            discount = rate**n
            pmt_r = pmt/ir

            return -pmt_r * (1 - 1/discount) - fv/discount;
        case 'pmt':
            [n, ir, pv, fv] = otherArguments
            rate = 1 + ir,
            discount = rate**n;

            return (-fv - pv*discount) * ir / (discount - 1);
        case 'fv':
            [n, ir, pv, pmt] = otherArguments
            rate = 1 + ir,
            discount = rate**n,
            pmt_r = pmt/ir;
            
            return -pmt_r * (discount - 1) - pv*discount;
    }  
}

/**
 * Calculate Net Present Value
 * @param {number} cf0 - Initial cash flow
 * @param {number[]} list_cf - List of subsequent cash flows
 * @param {number[]} list_freq - List of frequencies
 * @param {number} discountRate - Discount rate
 */
Finance.npv = function(cf0, list_cf, list_freq, discountRate){
    if(list_cf.length != list_freq.length) {
        console.alert('Cashflow and Frequency lists don\'t have the same length')
        return 0
    }
    let sum = cf0
    let freq_sum = 0
    
    if(discountRate!=0) {
        for(let i=0; i<list_cf.length; i++) {
            let cf = list_cf[i],
                freq = list_freq[i]
            
            sum += cf/discountRate*(1-1/(1+discountRate)**freq) / (1+discountRate)**freq_sum
            freq_sum += freq
        }
    } else {
        for(let i=0; i<list_cf.length; i++) {
            let cf = list_cf[i],
                freq = list_freq[i]
            
            sum += cf*freq
        }
    }

    return sum

}
   
/**
 * Calculate Internal Rate of Return for a given cash flows stream. It is the rate at which NPV = 0
 * @param {number} cf0 - Initial cash flow
 * @param {number[]} list_cf - List of subsequent cash flows
 * @param {number[]} list_freq - List of frequencies
 */
Finance.irr = function(cf0, list_cf, list_freq){
    /**
     * Using secant method to solve
     */
    let npvFunction = r => Finance.npv(cf0, list_cf, list_freq, r)

    let npvDerivative = function(r) {
        let sum = 0
        let freq_sum = 0
    
        if(r!=0) {
            for(let i=0; i<list_cf.length; i++) {
                let cf = list_cf[i],
                    freq = list_freq[i]

                sum += cf/r/(1+r)**freq_sum * ( (1/r + (freq+freq_sum)/(1+r)/(1+r)**freq) - 1/r - freq_sum/(1+r) )
                freq_sum += freq
            }
        } else {
            for(let i=0; i<list_cf.length; i++) {
                let row = data_table.rows[i+1]
                let cf = list_cf[i],
                    freq = list_freq[i]
                
                sum += cf*freq*freq_sum*(1+freq_sum+freq)
                freq_sum += freq
            }
        }
    
        return sum
    }

    return Solver.root('secant', npvFunction, 0.1, 0.2)
    // Newton's method yields wrong result. Possibly because npvDerivative() is wrong

}

Finance.mirr = function(cf0, list_cf, list_freq, wacc){

}

Finance.payback = function(cf0, list_cf, list_freq){

}

Finance.discountedPayback = function(cf0, list_cf, list_freq, wacc){
    
}

export { Finance }
