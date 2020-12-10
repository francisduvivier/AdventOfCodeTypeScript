import {calcTimesElem, splitIntoRows, sumFrom, transPose} from "../util/MapReduce";
import input from './input';
import {logAndPushSolution} from "../util/SolutionHandler";
import {Grid} from "../util/Grid";
import * as assert from "assert";

const w = 25;
const h = 6;

function calcPart1(layers: number[][]) {
    const grid = Grid.fromMatrix(layers);
    layers = grid.asArray() as number[][];
    const nbZeroDigits = layers.map(layer => calcTimesElem(layer, 0));
    const minsZerosIndex = nbZeroDigits.indexOf(Math.min(...nbZeroDigits));
    const nb1s = calcTimesElem(layers[minsZerosIndex], 1);
    const nb2s = calcTimesElem(layers[minsZerosIndex], 2);
    return nb1s * nb2s;
}

function splitIntoLayers(input: number[], w: number, h: number): number[][] {
    return splitIntoRows(input, w * h);
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

function calcFinalColors(layers: number[][]) {
    const pixelBundels = transPose(layers);
    return pixelBundels.map(calcColor);
}

export const solutions: number[] = [];
// Part 1
const layers = splitIntoLayers(input, w, h);

const part1 = calcPart1(layers);
logAndPushSolution(part1, solutions);
// Part 2
console.log("Part 2: ");
const part2Colors = calcFinalColors(layers);

const NBCOLORS = 3;
solutions.push(Number.parseInt(sumFrom(part2Colors, ''), NBCOLORS));
console.log(Grid.fromMatrix(splitIntoRows(part2Colors, w)).asImage());

assert.deepEqual(solutions, [1905, Number('5.5040855662296463e+70')]);
