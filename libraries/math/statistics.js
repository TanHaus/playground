let Statistics = {}

Statistics.sum = function(list) {
    let result = 0,
        length = list.length;
    for(let i=0;i<length;i++) result+=list[i];
    return result;
}

Statistics.mean= function(list) {
    let result = 0,
        length = list.length;
    for(let i=0;i<length;i++) result+=list[i];
    return result/length;
}

Statistics.var= function(list) {
    let sumSquared = 0,
        sum = 0,
        length = list.length;
    for(let i=0;i<length;i++) {
        sumSquared += list[i]*list[i];
        sum += list[i];
    }
    sum /= length;
    return sumSquared/length - sum*sum;
}

Statistics.sd= function(list) {
    return Math.sqrt(Statistics.var(list));
}

Statistics.sampleVar= function(list) {  // unbiased estimate of population variance from a sample
    let sumSquared = 0,
        sum = 0,
        length = list.length;
    for(let i=0;i<length;i++) {
        sumSquared += list[i]*list[i];
        sum += list[i];
    }
    let temp = length-1;
    return sumSquared/temp - sum*sum/length/temp;
}

Statistics.sampleSd= function(list) {
    return Math.sqrt(Statistics.sampleVar(list));
}

Statistics.cov= function(list1,list2) {
    if(list1.length!=list2.length) throw 'Two lists don\'t have the same length';
    let xySum = 0,
        xSum = 0,
        ySum = 0,
        length = list1.length;
    for(let i=0;i<length;i++) {
        xySum += list1[i]*list2[i];
        xSum += list1[i];
        ySum += list2[i];
    }
    return (xySum-xSum*ySum/length)/length;
}

Statistics.regression = {}

Statistics.regression.linear= function(listX,listY) {
    if(listX.length!=listY.length) throw 'Two data sets must have the same length';
    let sumX = 0,
        sumY = 0,
        sumX2 = 0,
        sumY2 = 0,
        sumXY = 0;
    for(let i=0;i<listX.length;i++) {
        sumX += listX[i];
        sumY += listY[i];
        sumX2 += listX[i]*listX[i];
        sumY2 += listY[i]*listY[i];
        sumXY += listX[i]*listY[i];
    }
    let denominator = sumX*sumX - listX.length*sumX2,
        numerator = sumX*sumY-sumXY*listX.length,
        A = (sumX*sumY-sumXY*listX.length)/denominator,
        B = (sumXY*sumX-sumX2*sumY)/denominator,
        R = -numerator/Math.sqrt(listX.length*sumX2-sumX*sumX)/Math.sqrt(listX.length*sumY2-sumY*sumY),
        R2 = R*R;
    return {'a': A, 'b': B, 'r2': R2, 'r': R};
}

Statistics.regression.exponential= function(listX,listY) {
    if(listX.length!=listY.length) throw 'Two data sets must have the same length';
    let listYnew = [];
    for(let i=0;i<listY.length;i++) {
        listYnew.push(Math.log(listY[i]));
    }
    let raw = Statistics.regression.linear(listX,listYnew),
        A = Math.exp(raw.b),
        B = Math.exp(raw.a);
    return {'a': A, 'b': B, 'r2': raw.r2, 'r': raw.r};
}

export { Statistics }