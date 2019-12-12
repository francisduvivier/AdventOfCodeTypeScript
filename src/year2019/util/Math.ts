export function hasNbDigits(value: number, nbDigits: number): boolean {
    value = Math.abs(value);
    return value >= Math.pow(10, nbDigits - 1) && value < Math.pow(10, nbDigits);
}

export function isRound(val: number, precision = 6) {
    return Math.round(val * Math.pow(10, precision)) === Math.round(val) * Math.pow(10, precision);
}

export function same(first: number, second: number, precision = 6) {
    return Math.round(first * Math.pow(10, precision)) === Math.round(second * Math.pow(10, precision));
}

export function findLCM(...vals: number[]) {
    let remaining = vals;
    while (remaining.length > 1) {
        remaining = [findLCM2(remaining[0], remaining[1]), ...remaining.slice(2)]
    }
    return remaining[0];
}

function findLCM2(val1: number, val2: number) {
    const biggest = val2 > val1 ? val2 : val1;
    const smallest = val2 > val1 ? val1 : val2;
    let currMultiple = biggest;
    while (!isRound(currMultiple / smallest)) {
        currMultiple += biggest;
    }
    return currMultiple;
}