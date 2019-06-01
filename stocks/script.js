import { Graph, Random, Statistics } from '../libraries/math.js';

const canvas = document.querySelector('#myCanvas'),
    ctx = canvas.getContext('2d'),
    DPIscale = window.devicePixelRatio;
let w = canvas.clientWidth*DPIscale,
    h = canvas.clientHeight*DPIscale;
canvas.width = w;
canvas.height = h;

let getData = function(symbol,key,from,to) {
    let jsonURL;
    if(['MSFT','AAPL','SPY','INX','AMD','INTC'].includes(symbol)) { jsonURL = symbol+'.json'; console.warn('Using stored data. Last updated on 29 May 2019'); }
    else { jsonURL = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol='+symbol+'&apikey='+key; console.warn('Using data from Alpha Advantage'); }
    let series = {};
    return fetch(jsonURL)
    .then((response) => response.json())
    .then(data => { 
        series.symbol = symbol;
        series.data = [];
        series.values = [];
        series.returns = [];

        let start,end;
        if(from==undefined) start = 0; else start = new Date(from).getTime();
        if(to==undefined) end = Date.now(); else end = new Date(to).getTime();

        for(let date in data['Weekly Adjusted Time Series']) {
            let value,returnVal,time;
            value = parseFloat(data['Weekly Adjusted Time Series'][date]['5. adjusted close']);
            if(series.data.length!=0) returnVal = (value - series.data[series.data.length-1]['value'])/series.data[series.data.length-1]['value']; else returnVal = 0;
            time = new Date(date).getTime();

            if(start<=time && time<=end) {
                series.data.push({
                    'date': time,
                    'value': value,
                    'return': returnVal
                });
                series.values.push(value);
                series.returns.push(returnVal);
            }
        }
        return series;
    });
}

let getBeta = function(symbol,key,from,to) {
    return Promise.all([getData('SPY',key,from,to),
                        getData(symbol,key,from,to)])
    .then(([SP500,data]) => {
        let max1 = Math.max(...SP500.returns)*1.1,
            min1 = Math.min(...SP500.returns)*1.1,
            max2 = Math.max(...data.returns)*1.1,
            min2 = Math.min(...data.returns)*1.1;
        let xRange = [-0.1,0.1],
            yRange = [-0.1,0.1];
        Graph.drawAxis(xRange,yRange,canvas);
        Graph.scatter(SP500.returns,data.returns,2,xRange,yRange,canvas,color);
        console.log(symbol+' '+Statistics.cov(SP500.returns,data.returns)/Statistics.var(SP500.returns));
    });
}

let scatter = function(symbol1,symbol2,key,from,to,xRange,yRange,color) {
    return Promise.all([getData(symbol1,key,from,to),
                        getData(symbol2,key,from,to)])
    .then(([data1,data2]) => {
    let max1 = Math.max(...SP500.returns)*1.1,
        min1 = Math.min(...SP500.returns)*1.1,
        max2 = Math.max(...data.returns)*1.1,
        min2 = Math.min(...data.returns)*1.1;
    let xRange = [-0.1,0.1],
        yRange = [-0.1,0.1];
    Graph.drawAxis(xRange,yRange,canvas);
    Graph.scatter(SP500.returns,data.returns,2,xRange,yRange,canvas,color);
    })
}
let plotStock

getBeta('MSFT','UEZMRXSX1GHEVH84','2010-01-31',undefined,'black');
getBeta('AAPL','UEZMRXSX1GHEVH84','2010-01-31',undefined,'blue');
getBeta('AMD','UEZMRXSX1GHEVH84','2010-01-31',undefined,'yellow');
getBeta('INTC','UEZMRXSX1GHEVH84','2010-01-31',undefined,'red');
//getBeta('MSFT','hello','blue');
//getData('AAPL','hello','2000-01-31');