let count = 0;
class ComplexNumber {
    constructor(re,im) {
        this.re = re;
        this.im = im;
    }
    clone(other) {
        this.re = other.re;
        this.im = other.im;
        return this;
    }
    isEqual(other) {
        if(this.re==other.re && this.im==other.im) return true;
        return false;
    }
    add(other) {
        return ComplexNumber.ADD(this,other);
    }
    multiply(other) {
        return ComplexNumber.MULTIPLY(this,other);
    }
    multiplyScalar(scalar) {
        return new ComplexNumber(this.re*scalar,this.im*scalar);
    }
    static CLONE(no) {
        return new ComplexNumber(no.re,no.im);
    }
    static EQUAL(no1,no2) {
        if(no1.re==no2.re && no1.im==no2.im) return true;
        return false
    }
    static ADD(no1,no2) {
        return new ComplexNumber(no1.re+no2.re,
                                 no1.im+no2.im);
    }
    static MULTIPLY(no1,no2) {
        return new ComplexNumber(no1.re*no2.re - no1.im*no2.im,
                                 no1.re*no2.im + no1.im*no2.re);
    }
}

// Set up nth Root of Unity. Not efficient, but constant time
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

/*for(let i=13;i<14;i++) {
    base = Math.pow(2,i);
    let temp;
    for(let j=0;j<base;j++) {
        temp = nRootUnity[base][j];
        console.log('nRootUnity['+base+']['+j+'] = new ComplexNumber('+temp.re.toFixed(53)+','+temp.im.toFixed(53)+');');
    }
}*/


class FFT {
    // this implementation is designed to work for real signal only, size = power of 2
    static FFT(timeSignal) {
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
        return [new ComplexNumber(timeSignal[0].re+timeSignal[1].re,0),
                new ComplexNumber(timeSignal[0].re-timeSignal[1].re,0)];
    }
    static FFT4(timeSignal) {
        return [new ComplexNumber(timeSignal[0].re+timeSignal[2].re+timeSignal[1].re+timeSignal[3].re,0),
                new ComplexNumber(timeSignal[0].re-timeSignal[2].re                                  ,timeSignal[3].re-timeSignal[1].re),
                new ComplexNumber(timeSignal[0].re+timeSignal[2].re-timeSignal[1].re-timeSignal[3].re,0),
                new ComplexNumber(timeSignal[0].re-timeSignal[2].re                                  ,+timeSignal[1].re-timeSignal[3].re)];
    }

    static fft(realSignal,fftSize) {
        if(Math.log2(fftSize)%1!=0) throw 'FFT size is not a power of 2';
        if(fftSize==2 && realSignal.length==2) return FFT.FFT2(FFT.parseReal(realSignal));
        let realSignal_padded;
        if((fftSize==undefined || fftSize==realSignal.length) && (Math.log2(realSignal.length)%1==0)) {
            realSignal_padded = realSignal;
        } else realSignal_padded = FFT.zeroPadding(realSignal,fftSize);
        return FFT.FFT(FFT.parseReal(realSignal_padded));
    }
    
    static ifft(freqSignal) {
    }
    static parseReal(realSignal) {
        let result = [];
        for(let i=0;i<realSignal.length;i++) {
            result.push(new ComplexNumber(realSignal[i],0));
        }
        return result;
    }
    static zeroPadding(realSignal,fftSize) {
        if(fftSize < realSignal.length) throw 'FFT size is smaller than sample size';
        let result = [];
        while(result.length<fftSize) {
            result.push(0);
        }
        return result;
    }
}