import {IntcodeRunner} from "../intcode/IntcodeRunner";
import {flattenPoint, Grid, P} from "../util/Grid";
import {logAndPushSolution} from "../util/SolutionHandler";
import * as assert from "assert";

export const input = `109,424,203,1,21102,11,1,0,1106,0,282,21102,18,1,0,1106,0,259,2102,1,1,221,203,1,21102,1,31,0,1106,0,282,21101,0,38,0,1106,0,259,21001,23,0,2,22101,0,1,3,21101,1,0,1,21102,57,1,0,1106,0,303,2101,0,1,222,21002,221,1,3,20102,1,221,2,21101,259,0,1,21101,0,80,0,1105,1,225,21102,1,83,2,21101,0,91,0,1105,1,303,1202,1,1,223,20102,1,222,4,21101,259,0,3,21101,225,0,2,21102,1,225,1,21101,118,0,0,1106,0,225,21002,222,1,3,21101,179,0,2,21102,1,133,0,1105,1,303,21202,1,-1,1,22001,223,1,1,21101,0,148,0,1105,1,259,1202,1,1,223,21001,221,0,4,20101,0,222,3,21102,1,19,2,1001,132,-2,224,1002,224,2,224,1001,224,3,224,1002,132,-1,132,1,224,132,224,21001,224,1,1,21102,1,195,0,105,1,109,20207,1,223,2,21002,23,1,1,21102,-1,1,3,21102,214,1,0,1106,0,303,22101,1,1,1,204,1,99,0,0,0,0,109,5,2101,0,-4,249,21201,-3,0,1,21202,-2,1,2,22101,0,-1,3,21101,0,250,0,1106,0,225,22101,0,1,-4,109,-5,2106,0,0,109,3,22107,0,-2,-1,21202,-1,2,-1,21201,-1,-1,-1,22202,-1,-2,-2,109,-3,2106,0,0,109,3,21207,-2,0,-1,1206,-1,294,104,0,99,21202,-2,1,-2,109,-3,2105,1,0,109,5,22207,-3,-4,-1,1206,-1,346,22201,-4,-3,-4,21202,-3,-1,-1,22201,-4,-1,2,21202,2,-1,-1,22201,-4,-1,1,21201,-2,0,3,21101,343,0,0,1105,1,303,1106,0,415,22207,-2,-3,-1,1206,-1,387,22201,-3,-2,-3,21202,-2,-1,-1,22201,-3,-1,3,21202,3,-1,-1,22201,-3,-1,2,21201,-4,0,1,21101,384,0,0,1106,0,303,1105,1,415,21202,-4,-1,-4,22201,-4,-3,-4,22202,-3,-2,-2,22202,-2,-4,-4,22202,-3,-2,-3,21202,-4,-1,-2,22201,-3,-2,1,21202,1,1,-4,109,-5,2105,1,0`;
let nb1 = 0;
const grid = new Grid<string>()

const mem = input.split(',').map(Number);
for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
        if (is1(j, i)) {
            nb1++;
            grid.setRc(j, i, '#');
        } else {
            grid.setRc(j, i, '.');
        }
    }
}
// part1
export const solutions: number[] = [];
logAndPushSolution(nb1, solutions);
assert.deepEqual(solutions[solutions.length - 1], 131)
console.assert(flattenPoint(P(20, 25), 4) == 250020);
console.log(grid.asImage(el => el ?? '-'));

// Part2

function is1(row: number, col: number) {
    let is1 = false;
    const ir = new IntcodeRunner([...mem], [col, row], {
        doOutput(output: number): void {
            is1 = !!output;
        }, getInput(): number {
            throw 'invalid state';
            // return 0;
        }
    });
    ir.run();
    return is1;
}

let squareNotFound = true;
let startX = 50;
let startY = 0;

function updateStartXY() {
    let nbTries = 0;
    startY++;
    while (!is1(startY, startX)) {
        if (nbTries++ > 1000) {
            throw 'bad state x' + startX + 'y' + startY;
        }
        grid.setRc(startY, startX, '.');
        startY++;
    }
    grid.setRc(startY, startX, '#');
    while (is1(startY, startX + 1)) {
        grid.setRc(startY, startX + 1, '#');
        startX++;
    }
    if (!is1(startY, startX)) {
        throw 'invalid state'
    }
    grid.setRc(startY, startX + 1, '.');
}

let lastShowTime = 0;
while (squareNotFound) {
    squareNotFound = false;
    updateStartXY();
    console.log('next', startY, startX);
    if (!is1(startY, startX)) {
        throw 'invalid state'
    }
    if (startX > 500) {
        // console.log(grid.asImage(el => el ?? '-'));
        // throw 'invalid state'
    }
    if (!is1(startY + 99, startX - 99)) {
        grid.setRc(startY + 99, startX - 99, '.');
        squareNotFound = true;
    } else {
        grid.setRc(startY + 99, startX - 99, '#');
    }
    const newTime = Date.now();
    if (newTime - lastShowTime > 60) {
        // console.log(grid.asImage(el => el ?? '-'));
        lastShowTime = newTime;
    }
    console.log('next', startY, startX);
}
console.log(flattenPoint(P(startY, startX - 99), 4));