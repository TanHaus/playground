let canvas,ctx,w,h,graph;

    window.onload = function init() {
        canvas = document.querySelector('#myCanvas');
        ctx = canvas.getContext('2d');
        w = canvas.clientWidth;
        h = canvas.clientHeight;

        let pow = 512;
        let f = 0.1

        let xRange = [0,pow];
        let yRange = [-1,65];

        let xSeq = Signal.generatexSeq(xRange,1);
        let signal = Signal.generateFn(function(x){return Math.sin(f*x)},xSeq);
        Graph.plot(xSeq,signal,xRange,yRange,canvas);
    
        let freq = Signal.get.MagnitudeArray(Signal.fft(signal,pow));
        Graph.plot(xSeq,freq,xRange,yRange,canvas,'red');
    }

function updatef(value) {
    ctx.clearRect(0,0,w,h);

    let pow = 512;
    let f = value;

    let xRange = [0,pow];
    let yRange = [-1,65];

    let xSeq = Signal.generatexSeq(xRange,1);
    let signal = Signal.generateFn(function(x){return Math.sin(f*x)},xSeq);
    Graph.plot(xSeq,signal,xRange,yRange,canvas);

    let freq = Signal.get.MagnitudeArray(Signal.fft(signal,pow));
    Graph.plot(xSeq,freq,xRange,yRange,canvas,'red');
}