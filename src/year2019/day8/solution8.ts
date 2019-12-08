import {calcTimesElem, sumFrom} from "../util/MapReduce";
import input from './input';

const w = 25;
const h = 6;

function calcPart1(layers: number[][]) {
    const nbZeroDigits = layers.map(layer => calcTimesElem(layer, 0));
    const minsZerosIndex = nbZeroDigits.indexOf(Math.min(...nbZeroDigits));
    const nb1s = calcTimesElem(layers[minsZerosIndex], 1);
    const nb2s = calcTimesElem(layers[minsZerosIndex], 2);
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

const TRANSPARANT = 2;

function calcColor(layerColorsForPixel: number[]) {
    for (let color of layerColorsForPixel) {
        if (color != TRANSPARANT) {
            return color;
        }
    }
    return TRANSPARANT;
}

function transPose(layers: number[][]) {
    return layers[0].map((_, index) => {
        return layers.map(layer => layer[index]);
    });
}

function calcFinalColors(layers: number[][]) {
    const pixelBundels = transPose(layers);
    return pixelBundels.map(calcColor);
}

export const solutions: number[] = [];
// Part 1
const layers = splitIntoLayers(input, w, h);

const part1 = calcPart1(layers);
console.log("Part 1: ", part1);
solutions.push(part1);
// Part 2
console.log("Part 2: ");
const part2Colors = calcFinalColors(layers);

function loggable(str: string) {
    return str.replace(/1/g, '\u25A0').replace(/0/g, ' ');
}

let rowStrings: string[] = splitIntoRows(part2Colors, w).map(row => sumFrom(row, '')).map(loggable);
const NBCOLORS = 3;
solutions.push(Number.parseInt(sumFrom(part2Colors, ''), NBCOLORS));
console.log(rowStrings.join('\n'));