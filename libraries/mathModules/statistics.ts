export class Statistics {
    static sum = function(list: number[]) {
        let result = 0;
        for (let value of list) 
            result += value;
        return result;
    }
    
    static mean= function(list: number[]) {
        let result = 0
        for (let value of list) 
            result += value;
        return result/list.length;
    }
    
    static var= function(list: number[], sample: boolean = true) {
        let sumSquared = 0, sum = 0;

        for (let value of list) {
            sumSquared += value*value
            sum += value
        }
        let mean = sum/list.length
        if (sample) 
            return (sumSquared/list.length - mean*mean) * list.length / (list.length-1)
        return sumSquared/list.length - mean*mean;
    }
    
    static sd= function(list: number[], sample: boolean = true) {
        return Math.sqrt(Statistics.var(list, sample));
    }
    
    static cov= function(list1: number[], list2: number[]) {
        if(list1.length!=list2.length) throw 'Two lists don\'t have the same length';
        let xySum = 0, xSum = 0, ySum = 0

        for(let i = 0; i < list1.length; i++) {
            xySum += list1[i]*list2[i];
            xSum += list1[i];
            ySum += list2[i];
        }
        return (xySum-xSum*ySum/length)/length;
    }
    
    static regression = {
        linear: function(listX: number[], listY: number[]) {
            if(listX.length!=listY.length) throw 'Two data sets must have the same length';
            let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumXY = 0;

            for(let i=0;i<listX.length;i++) {
                sumX += listX[i];
                sumY += listY[i];
                sumX2 += listX[i]*listX[i];
                sumY2 += listY[i]*listY[i];
                sumXY += listX[i]*listY[i];
            }
            let denominator = sumX*sumX - listX.length*sumX2,
                numerator = sumX*sumY - sumXY*listX.length,
                A = (sumX*sumY - sumXY*listX.length)/denominator,
                B = (sumXY*sumX - sumX2*sumY)/denominator,
                R = -numerator/Math.sqrt(listX.length*sumX2 - sumX*sumX)/Math.sqrt(listX.length*sumY2 - sumY*sumY),
                R2 = R*R;
            return {'a': A, 'b': B, 'r2': R2, 'r': R};
        },
    
        exponential: function(listX: number[], listY: number[]) {
            if(listX.length != listY.length) throw 'Two data sets must have the same length';
            let listYnew = [];
            for(let i=0;i<listY.length;i++) {
                listYnew.push(Math.log(listY[i]));
            }
            let raw = Statistics.regression.linear(listX,listYnew),
                A = Math.exp(raw.b),
                B = Math.exp(raw.a);
            return {'a': A, 'b': B, 'r2': raw.r2, 'r': raw.r};
        }
    }    
}
