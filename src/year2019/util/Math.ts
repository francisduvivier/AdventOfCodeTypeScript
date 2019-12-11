export function hasNbDigits(value: number, nbDigits: number): boolean {
    value = Math.abs(value);
    return value >= Math.pow(10, nbDigits - 1) && value < Math.pow(10, nbDigits);
}

export function transPose<T>(layers: T[][]): T[][] {
    return layers[0].map((_, index) => {
        return layers.map(layer => layer[index]);
    });
}