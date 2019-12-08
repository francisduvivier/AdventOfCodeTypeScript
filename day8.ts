
const w = 25;
const h = 6;
import input from './day8/input';

function calcTimesElem(someArray: number[], searchElem: number) {
    return someArray.reduce((curr, nb) => nb == searchElem ? curr + 1 : curr, 0);
}

function calcPart1(layerWithLeastZeros: number[]) {
    const nb1s = calcTimesElem(layerWithLeastZeros, 1);
    const nb2s = calcTimesElem(layerWithLeastZeros, 2);
    return nb1s * nb2s;
}

function cp(input: number[]) {
    input = [...input];
    return input;
}

function splitIntoLayers(input: number[], w: number, h: number): number[][] {
    return splitIntoRows(input, w * h);
}

function splitIntoRows(input: number[], w: number): number[][] {
    input = cp(input);
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

function calcColor(layerColorsForPixel: number[]) {
    let firstZero = layerColorsForPixel.indexOf(0);
    let firstOne = layerColorsForPixel.indexOf(1);
    let firstNonTransparentIndex;
    if (firstOne !== -1) {
        if (firstZero !== -1) {
            firstNonTransparentIndex = Math.min(firstZero, firstOne)
        } else {
            firstNonTransparentIndex = firstOne;
        }
    } else {
        if (firstZero !== -1) {
            firstNonTransparentIndex = firstZero
        } else {
            firstNonTransparentIndex = 0;
        }
    }

    return layerColorsForPixel[firstNonTransparentIndex]
}

function calcFinalColors(layers: number[][]) {
    const pixelBundels = layers[0].map((_, index) => {
        return layers.map(layer => layer[index]);
    });
    return pixelBundels.map(calcColor);
}

// Part 1
const layers = splitIntoLayers(input, w, h);
const nbZeroDigits = layers.map(layer => calcTimesElem(layer, 0));
const minZeros = Math.min(...nbZeroDigits);
const minsZerosIndex = nbZeroDigits.indexOf(minZeros);
console.log("Part 1: ", calcPart1(layers[minsZerosIndex]));
console.log("Part 2: ");
let rowStrings : string[]= splitIntoRows(calcFinalColors(layers), w).map(row=>row.reduce((c, n)=> c+(n?'\u25A0':' '), ''));
console.log(rowStrings.join('\n'));