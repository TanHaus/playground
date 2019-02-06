/* Classes that use from misc.js
 *     - ComplexNumber
 *
 */

/* Set up nth Root of Unity
 * Not efficient, but constant time
 * Give exact values for some cases. Else use formula to generate
 */
let nRootUnity = [];
let base = 1;
for(let i=1;i<14;i++) {  // 2 → 8192
    base *= 2;
    nRootUnity[base] = [];
    nRootUnity[base][0] = new ComplexNumber(1,0);
    for(let j=1;j<base;j++) {
        switch(j) {
            case base/2:
                nRootUnity[base][j] = new ComplexNumber(-1,0);
                break;
            case base/4:
                nRootUnity[base][j] = new ComplexNumber(0,-1);
                break;
            case base*3/4:
                nRootUnity[base][j] = new ComplexNumber(0,1);
                break;
            case base/8:
                nRootUnity[base][j] = new ComplexNumber(Math.SQRT1_2,-Math.SQRT1_2);
                break;
            case base*3/8:
                nRootUnity[base][j] = new ComplexNumber(-Math.SQRT1_2,-Math.SQRT1_2);
                break;
            case base*5/8:
                nRootUnity[base][j] = new ComplexNumber(-Math.SQRT1_2,Math.SQRT1_2);
                break;
            case base*7/8:
                nRootUnity[base][j] = new ComplexNumber(Math.SQRT1_2,Math.SQRT1_2);
                break;
            default:
                nRootUnity[base][j] = new ComplexNumber(Math.cos(2*Math.PI*j/base),Math.sin(-2*Math.PI*j/base));
        }
    }
}

class FFT {
    // this implementation is designed to work for real signal only, size = power of 2
    static FFT(timeSignal) {
        /* Main recursion function
         * INPUT: an array of ComplexNumber objects. Its size is a power of 2
         * Break down the signal into 2 smaller signals: Even signal and Odd signal
         * Call FFT itself on these smaller signals
         * Base case is when size = 4. Call FFT4, which has direct implementation
         * RETURN: an array of ComplexNumber objects
         */
        if(timeSignal.length==4) return FFT.FFT4(timeSignal);
        let size = timeSignal.length;
        let signalEven = [];
        let signalOdd = [];
        for(let i=0;i<size;i+=2) {
            signalEven.push(timeSignal[i]);
        }
        for(let i=1;i<size;i+=2) {
            signalOdd.push(timeSignal[i]);
        }
        let freqEven = FFT.FFT(signalEven);
        let freqOdd = FFT.FFT(signalOdd);

        let freqSignal = [];
        
        for(let i=0;i<size/2;i++) {
            freqSignal.push(freqEven[i].add(freqOdd[i].multiply(nRootUnity[size][i])));
        }
        freqSignal.push(freqEven[0].add(freqOdd[0].multiply(new ComplexNumber(-1,0))));
        for(let i=freqSignal.length-2;i>0;i--) {
            freqSignal.push(new ComplexNumber(freqSignal[i].re,-freqSignal[i].im));
        }

        return freqSignal;
    }
    static FFT2(timeSignal) {
        /* Direct implementation for fft size = 2
         * INPUT: an array of ComplexNumber ofjects of size 2
         * RETURN: an array of ComplexNumber objects of size 2
         */
        return [new ComplexNumber(timeSignal[0].re+timeSignal[1].re,0),
                new ComplexNumber(timeSignal[0].re-timeSignal[1].re,0)];
    }
    static FFT4(timeSignal) {
        /* Direct implementation for fft size = 4
         * INPUT: an array of ComplexNumber ofjects of size 4
         * RETURN: an array of ComplexNumber objects of size 4
         */
        return [new ComplexNumber(timeSignal[0].re+timeSignal[2].re+timeSignal[1].re+timeSignal[3].re,0),
                new ComplexNumber(timeSignal[0].re-timeSignal[2].re                                  ,timeSignal[3].re-timeSignal[1].re),
                new ComplexNumber(timeSignal[0].re+timeSignal[2].re-timeSignal[1].re-timeSignal[3].re,0),
                new ComplexNumber(timeSignal[0].re-timeSignal[2].re                                  ,+timeSignal[1].re-timeSignal[3].re)];
    }

    static fft(realSignal,fftSizeRef) {
        /* Main function to call from outside
         * INPUT: realSignal: an array of numbers
         *        fftSize: a number
         * This function first tests certain conditions and handle them if possible. Otherwise, throw an error
         *     - Check if the signal is an array of numbers (only first element). If not, throw an error
         *     - Check if fftSize is given. If not → fftSize = signal size
         *     - Check if fftSize is a power of 2. If not, throw an error
         *     - Check if signal is shorter than expected fftSize, do zero padding on the signal
         * This function also warps the number array into a ComplexNumber array to feed into method FFT.FFT()
         * RETURN: an array of ComplexNumber objects
         */
        if(typeof fftSizeRef != 'number') throw 'FFT size is not a number';
        if(typeof realSignal[0] != 'number') throw 'Signal is not an array of numbers';
        
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
        
        if(realSignal.length==2 && fftSize==2) return FFT.FFT2(FFT.parseReal(realSignal));
        
        if(realSignal.length==fftSize) return FFT.FFT(FFT.parseReal(realSignal));
        
        return FFT.FFT(FFT.parseReal(FFT.zeroPadding(realSignal,fftSize)));
    }
    
    static ifft(freqSignal) {
    }
    static parseReal(realSignal) {
        /* Turn a number array into a ComplexNumber array
         * INPUT: a number array
         * RETURN: a ComplexNumber array
         */
        let result = [];
        for(let i=0;i<realSignal.length;i++) {
            result.push(new ComplexNumber(realSignal[i],0));
        }
        return result;
    }
    static zeroPadding(realSignal,fftSize) {
        /* Pad zeros to a number array until its size is a power of 2
         * INPUT: a number array, a number
         * OUtPUT: a number array with size is a power of 2
         */
        let result = [];
        while(result.length<=fftSize) {
            result.push(0);
        }
        return result;
    }
    static getRealArray(signal) {
        /* Extract the real components from a ComplexNumber array
         * INPUT: a ComplexNumber array
         * RETURN: a number array of real components
         */
        let result = [];
        signal.forEach(function(complexNumber) {
            result.push(complexNumber.re);
        });
        return result;
    }
    static getComplexArray(signal) {
        /* Extract the imaginary components from a ComplexNumber array
         * INPUT: a ComplexNumber array
         * RETURN: a number array of imaginary components
         */
        let result = [];
        signal.forEach(function(complexNumber) {
            result.push(complexNumber.im);
        });
        return result;
    }
    static getMagnitudeArray(signal) {
        /* Extract the magnitudes from a ComplexNumber array
         * INPUT: a ComplexNumber array
         * RETURN: a number array of magnitudes
         */
        let result = [];
        signal.forEach(function(complexNumber) {
            result.push(Math.sqrt(complexNumber.re*complexNumber.re + complexNumber.im*complexNumber.im));
        });
        return result;
    }
    static getPhaseArray(signal) {
        /* Extract the phases from a ComplexNumber array
         * INPUT: a ComplexNumber array
         * RETURN: a number array of phases in radian
         */
        let result = [];
        signal.forEach(function(complexNumber) {
            result.push(Math.atan2(complexNumber.im,complexNumber.re));
        });
        return result;
    }
}