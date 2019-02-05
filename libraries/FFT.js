class ComplexNumber {
    constructor(re,im) {
        this.re = re;
        this.im = im;
    }
    copyFrom(other) {
        this.re = other.re;
        this.im = other.im;
        return this;
    }
    copyTo(other) {
        other.re = this.re;
        other.im = this.im;
        return this;
    }
    isEqual(other) {
        if(this.re==other.re && this.im==other.im) return true;
        return false;
    }
    add(other) {
        this.re += other.re;
        this.im += other.im;
        return this;
    }
    multiply(other) {
        let result = ComplexNumber.MULTIPLY(this,other);
        this.re = result.re;
        this.im = result.im;
        return this;
    }
    exp(real) {
        let magnitude = Math.sqrt(this.re*this.re+this.im*this.im);
        
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

class FFT {
    // this implementation is designed to work for real signal only
    constructor(signal) {
        this.signal = signal;
    }
    fft(timeSignal) {
        
    }
    static FFT(timeSignal) {
        // test if 
        return freqSignal;
    }
    static FFT2(timeSignal) {
        return [new ComplexNumber(timeSignal[0].re+timeSignal[0].re,0),
                new ComplexNumber(timeSignal[1].re-timeSignal[1].re,0)];
    }
    static FFT4(
    static IFFT(freqSignal) {
        return FFT(freqSignal);
    }
    function nRootUnity(n,pow) {
    if(pow==1) {
        switch(n) {
            case 1: return new ComplexNumber(1,0);
            case 2: return new ComplexNumber(-1,0);
            case 4: return new ComplexNumber(0,1);
            case 8: return new ComplexNumber(Math.SQRT2,Math.SQRT2);
            case 16: return new ComplexNumber();
            case 32: return new ComplexNumber();
            case 64: return new ComplexNumber();
            case 128: return new ComplexNumber();
            case 256: return new ComplexNumber();
            case 512: return new ComplexNumber();
            case 1024: return new ComplexNumber();
            case 2048: return new ComplexNumber();
            case 4096: return new ComplexNumber();
            case 8192: return new ComplexNumber();
        }
    } else return ;
}