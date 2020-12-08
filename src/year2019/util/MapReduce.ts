export function sumFrom<ARR extends (number | string), START extends (number | string)>(mArray: ARR[], start: START): START {
    return mArray.reduce((first: START, next: ARR) => {
        return <any>first + next;
    }, start);
}

export type Summable = string | number;

export function sum(mArray: number[]): number;
export function sum(mArray: string[]): string;
export function sum<T extends Summable>(mArray: T[]): T {
    if (!mArray?.length) {
        return 0 as T;
    }
    return mArray.reduce((first, next) => {
        return <any>first + next;
    });
}

export function allTruthy(values: any[]): boolean {
    for (const value of values) {
        if (!value) {
            return false;
        }
    }
    return true;
}

export function anyTruthy(values: any[]): boolean {
    for (const value of values) {
        if (value) {
            return true;
        }
    }
    return false;
}


export function calcTimesElem(someArray: number[], searchElem: number) {
    return someArray.reduce((curr, nb) => nb == searchElem ? curr + 1 : curr, 0);
}

export function transPose<T>(layers: T[][]): T[][] {
    return layers[0].map((_, index) => {
        return layers.map(layer => layer[index]);
    });
}

export function splitIntoRows(input: number[], w: number): number[][] {
    input = [...input];
    const layerSize = w;
    const nbLayers = input.length / (layerSize);
    if (nbLayers !== Math.round(nbLayers)) {
        console.error('layers is not round!', nbLayers);
    }
    const layers: number[][] = [];
    for (let i = 0; i < nbLayers; i++) {
        layers.push(input.splice(0, layerSize));
    }
    return layers;
}


export function copyMap<K, V>(map: Map<K, V>): Map<K, V> {
    const copy = new Map<K, V>();
    map.forEach((v, k) => copy.set(k, v));
    return copy;
}


export function eqSet(as, bs) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}