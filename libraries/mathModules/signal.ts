import { ComplexNumber } from "../math";

// this implementation is designed to work for real signal only, size = power of 2

// a public object to store public methods. this anonymous function will return this public object
// only fft(), ifft() and get() are exposed to public
/* Set up nth Root of Unity for use with FFT algorithm
* Not efficient, but constant time
* Give exact values for some cases. Else use formula to generate
* nRootUnity[x][y] is the first xth root of unity power to y
* NOTE: there will be holes in the array nRootUnity
*/

let nRootUnity: ComplexNumber[][] = []
let base = 1;
for(let i=1;i<13;i++) {  // 2 → 4096
    base *= 2;
    nRootUnity[base] = [];
    nRootUnity[base][0] = new ComplexNumber(1,0);
    for(let j=1;j<base;j++) nRootUnity[base][j] = new ComplexNumber(Math.cos(2*Math.PI*j/base),Math.sin(-2*Math.PI*j/base));
}

let FFT = function(timeSignal: ComplexNumber[]): ComplexNumber[] {
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
    
    for(let i=0; i<size/2; i++) {
        freqSignal.push(freqEven[i].add(freqOdd[i].multiply(nRootUnity[size][i])));
    }
    freqSignal.push(freqEven[0].add(freqOdd[0].multiply(new ComplexNumber(-1,0))));
    for(let i=freqSignal.length-2; i>0; i--) {
        freqSignal.push(new ComplexNumber(freqSignal[i].re, -freqSignal[i].im));
    }

    return freqSignal;
}

let FFT2 = function(timeSignal: ComplexNumber[]) {
    /* Direct implementation for fft size = 2
     * INPUT: an array of ComplexNumber ofjects of size 2
     * RETURN: an array of ComplexNumber objects of size 2
     */
    return [new ComplexNumber(timeSignal[0].re+timeSignal[1].re,0),
            new ComplexNumber(timeSignal[0].re-timeSignal[1].re,0)];
}

let FFT4 = function(timeSignal: ComplexNumber[]) {
    /* Direct implementation for fft size = 4
     * INPUT: an array of ComplexNumber ofjects of size 4
     * RETURN: an array of ComplexNumber objects of size 4
     */
    return [new ComplexNumber(timeSignal[0].re+timeSignal[2].re+timeSignal[1].re+timeSignal[3].re,0),
            new ComplexNumber(timeSignal[0].re-timeSignal[2].re                                  ,timeSignal[3].re-timeSignal[1].re),
            new ComplexNumber(timeSignal[0].re+timeSignal[2].re-timeSignal[1].re-timeSignal[3].re,0),
            new ComplexNumber(timeSignal[0].re-timeSignal[2].re                                  ,+timeSignal[1].re-timeSignal[3].re)];
}

let parseReal = function(realSignal: number[]) {
    /* Turn a number array into a ComplexNumber array
     * INPUT: a number array
     * RETURN: a ComplexNumber array
     */
    let result = [];
    for(let i=0; i<realSignal.length; i++) {
        result.push(new ComplexNumber(realSignal[i], 0));
    }
    return result;
}

let zeroPadding = function(realSignal: number[], fftSize: number) {
    /* Pad zeros to a number array until its size is a power of 2
     * INPUT: a number array, a number
     * OUtPUT: a number array with size is a power of 2
     */
    let result = Array.from(realSignal)
    while(result.length<=fftSize) result.push(0);
    return result;
}

export class Signal {
    static fft = function(realSignal: number[], fftSizeRef: number) {
        /* 
        Main function to call from outside
        INPUT: realSignal: an array of numbers
               fftSize: a number
        This function first tests certain conditions and handle them if possible. Otherwise, throw an error
            - Check if the signal is an array of numbers (only first element). If not, throw an error
            - Check if fftSize is given. If not → fftSize = signal size
            - Check if fftSize is a power of 2. If not, throw an error
            - Check if signal is shorter than expected fftSize, do zero padding on the signal
        This function also warps the number array into a ComplexNumber array to feed into method FFT.FFT()
        RETURN: an array of ComplexNumber objects
        */
        
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
    }
    
    static ifft = function(freqSignal: ComplexNumber[], fftSize: number) {
        let result = Signal.fft(freqSignal,fftSize);
        for(let i=0;i<freqSignal.length;i++) result[i] = result[i].multiply(1/fftSize);
        return result;
    };
    
    static get = {
        ReArray: function(signal: ComplexNumber[]) {
            /* 
            Extract the real components from a ComplexNumber array
            INPUT: a ComplexNumber array
            RETURN: a number array of real components
            */
            let result = [];
            for(let i=0;i<signal.length;i++) result[i] = signal[i].re;
            return result;
        },
        ImArray: function(signal: ComplexNumber[]) {
            /* 
            Extract the imaginary components from a ComplexNumber array
            INPUT: a ComplexNumber array
            RETURN: a number array of imaginary components
            */
            let result = [];
            for(let i=0;i<signal.length;i++) result[i] = signal[i].im;
            return result;
        },
        MagnitudeArray: function(signal: ComplexNumber[]) {
            /* 
            Extract the magnitudes from a ComplexNumber array
            INPUT: a ComplexNumber array
            RETURN: a number array of magnitudes
            */
            let result = [];
            for(let i=0;i<signal.length;i++) result[i] = Math.sqrt(signal[i].re*signal[i].re + signal[i].im*signal[i].im);
            return result;
        },
        getPhaseArray: function(signal: ComplexNumber[]) {
            /*
            Extract the phases from a ComplexNumber array
            INPUT: a ComplexNumber array
            RETURN: a number array of phases in radian
            */
            let result = [];
            for(let i=0;i<signal.length;i++) result[i] = Math.atan2(signal[i].im,signal[i].re);
            return result;
       },  
    }

    static generateFn = function(Fn: Function, xSeq: number[]) {
        let result = [];
        for(let i=0;i<xSeq.length;i++) result[i] = Fn(xSeq[i]);
        return result;
    }

    static generatexSeq = function(xRange: number[], step: number) {
        let result = [];
        let bigX = Math.max(xRange[0],xRange[1]);
        let smallX = Math.min(xRange[0],xRange[1]);
        if(step==undefined) step = (bigX-smallX)/100;

        let index = 0;
        for(let i=smallX; i<bigX; i+=step) {
            result[index] = i;
            index++;
        }
        return result;
    }
}