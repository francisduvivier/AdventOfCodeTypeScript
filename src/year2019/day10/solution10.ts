import {
    input,
    PLetter,
    Solution,
    testInput1,
    testInput2,
    testInput3,
    testinput4,
    testsolution2,
    testsolution3
} from "./input";
import {logAndPushSolution} from "../util/SolutionHandler";
import * as assert from "assert";

function isRound(val: number, precision = 4) {
    return Math.round(val * Math.pow(10, precision)) === Math.round(val) * Math.pow(10, precision);
}

function between(val: number, first: number, second: number) {
    return val >= first && val <= second || val <= first && val >= second;
}

function same(first: number, second: number, precision = 4) {
    return Math.round(first * Math.pow(10, precision)) === Math.round(second * Math.pow(10, precision));
}

assert.deepEqual(same(1, 2), false);
assert.deepEqual(same(5, 5.001), false);
assert.deepEqual(same(5, 5.00001), true);

class Point {
    readonly col: number;
    readonly row: number;
    readonly friends: Set<Point> = new Set();
    readonly invisibles: Set<Point> = new Set();

    constructor(row: number, column: number) {
        this.row = row;
        this.col = column;
    }

    get solution(): Solution {
        return {
            col: this.col,
            row: this.row,
            friends: this.friends.size
        }
    }

    isFriend(other: Point, matrix: PLetter[][]): boolean {
        if (this === other) {
            return false;
        }
        if (this.friends.has(other)) {
            return true;
        }
        if (this.invisibles.has(other)) {
            return false;
        }

        return calcHasLineOfSight(this, other, matrix);
    }
}

// function round(first: number, precision = 4) {
//     return Math.round(first * Math.pow(10, precision)) / Math.pow(10, precision);
// }

function calcHasLineOfSight(p: Point, other: Point, matrix: PLetter[][]): boolean {
    const diffCol = other.col - p.col;
    const diffRow = other.row - p.row;

    let currCol = p.col;
    let currRow = p.row;
    if (diffCol != 0) {
        currCol += Math.sign(diffCol);
        currRow += diffRow / Math.abs(diffCol);
        while (between(currCol, p.col, other.col)) {
            if (isRound(currRow) && !same(currCol, other.col)) {
                currRow = Math.round(currRow);
                try {
                    if (matrix[currRow][currCol] !== PLetter.EMPTY) {
                        return false;
                    }
                } catch (e) {
                    console.error(`bad coords row [${currRow}] col [${currCol}]`)
                }
            }
            currCol += Math.sign(diffCol);
            currRow += diffRow / Math.abs(diffCol);
        }
    } else {
        currRow += Math.sign(diffRow);
        while (between(currRow, p.row, other.row)) {
            if (!same(currRow, other.row)) {
                if (matrix[currRow][currCol] !== PLetter.EMPTY) {
                    return false;
                }
            }
            currRow += Math.sign(diffRow);
        }
    }
    return true;
}


function updatePointsWithFriends(pList: Point[], matrix: PLetter[][]): void {
    for (let point of pList) {
        for (let otherPoint of pList) {
            if (point.isFriend(otherPoint, matrix)) {
                point.friends.add(otherPoint);
                otherPoint.friends.add(point);
            } else {
                point.invisibles.add(otherPoint);
                otherPoint.invisibles.add(point);
            }
        }
    }
}

function findMostVisibleAsteroid(input: PLetter[][]): Point[] {
    const pList: Point[] = [];
    input.forEach((row, rowIndex) => {
        row.forEach((val, columnIndex) => {
            if (val == PLetter.ASTEROID) {
                pList.push(new Point(rowIndex, columnIndex));
            }
        })
    });
    updatePointsWithFriends(pList, input);
    let sortedList = pList.sort((a, b) => b.friends.size - a.friends.size);
    return sortedList;
}

function findMostVisibleAsteroidDist(input: PLetter[][]): number {
    return findMostVisibleAsteroid(input)[0].solution.friends;
}

const solutions: number[] = [];
findMostVisibleAsteroid(testInput1);
assert.deepEqual(findMostVisibleAsteroid(testInput1)[0].solution, {...new Point(8, 5).solution, friends: 33});
console.log('test 1 done');
assert.deepEqual(findMostVisibleAsteroid(testInput2)[0].solution, testsolution2);
console.log('test 2 done');
assert.deepEqual(findMostVisibleAsteroid(testInput3)[0].solution, testsolution3);
console.log('test 2 done');
assert.deepEqual(findMostVisibleAsteroid(testinput4)[0].solution, {...new Point(13, 11).solution, friends: 210});
console.log('test 4 done');
// Part 1
logAndPushSolution(findMostVisibleAsteroidDist(input), solutions);
assert.deepEqual(solutions[0], 334);

function getDestroyOrder(ast: P, other: P, bestPoint: P) {
    // console.log(` ast [${JSON.stringify(ast)}], other[${JSON.stringify(other)}], bestPoint [${JSON.stringify(bestPoint)}]`);
    const diffRow1 = ast.row - bestPoint.row;
    const diffRow2 = other.row - bestPoint.row;

    const diffCol1 = ast.col - bestPoint.col;
    const diffCol2 = other.col - bestPoint.col;
    if (diffCol1 >= 0) {
        if (diffCol2 >= 0) {
            return diffRow2 / diffCol2 - diffRow1 / diffCol1 || 0
        } else {
            return 1;
        }
    } else {
        if (diffCol2 < 0) {
            return diffRow2 / diffCol2 - diffRow1 / diffCol1 || 0
        } else {
            return -1;
        }
    }
}

assert.deepEqual(getDestroyOrder({"col": 11, "row": 13}, {"col": 11, "row": 13}, {"col": 11, "row": 13}), 0)
console.log('assert success');
assert.deepEqual(getDestroyOrder({"col": 11, "row": 12}, {"col": 11, "row": 13}, {"col": 11, "row": 13}), 0)
console.log('assert success');
assert.deepEqual(getDestroyOrder({"col": 10, "row": 1}, {"col": 11, "row": 12}, {"col": 11, "row": 13}) < 0, true)
assert.deepEqual(getDestroyOrder({"col": 11, "row": 12}, {"col": 10, "row": 1}, {"col": 11, "row": 13}) > 0, true)
console.log('assert success');

function findDestroyedAsteroid(matrix: PLetter[][], targetDestroyed: number) {
    const updatedMatrix = matrix.map(row => [...row]);
    const pointsWFriends = findMostVisibleAsteroid(updatedMatrix);
    const bestPoint = pointsWFriends[0];
    // console.log(`bestPoint ${JSON.stringify(bestPoint)} f [${bestPoint.friends.size}]`);
    let nbDestroyed = 0;
    while (bestPoint.friends.size > 0) {
        let sortedDestroyables = [...bestPoint.friends].sort((ast, other) => -1 * getDestroyOrder(ast, other, bestPoint));
        for (let destroyable of sortedDestroyables) {
            updatedMatrix[destroyable.row][destroyable.col] = PLetter.EMPTY;
            pointsWFriends.splice(pointsWFriends.indexOf(destroyable), 1);
            nbDestroyed++;
            if (nbDestroyed === targetDestroyed) {
                return destroyable;
            }
        }
        bestPoint.friends.clear();
        bestPoint.invisibles.clear();
        updatePointsWithFriends(pointsWFriends, updatedMatrix);
    }
}

assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 1)!), calcResult({col: 11, row: 12}));
console.log('ok: ', 1);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 2)!), calcResult({col: 12, row: 1}));
console.log('ok: ', 2);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 3)!), calcResult({col: 12, row: 2}));
console.log('ok: ', 3);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 10)!), calcResult({col: 12, row: 8}));
console.log('ok: ', 10);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 20)!), calcResult({col: 16, row: 0}));
console.log('ok: ', 20);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 50)!), calcResult({col: 16, row: 9}));
console.log('ok: ', 50);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 100)!), calcResult({col: 10, row: 16}));
console.log('ok: ', 100);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 199)!), calcResult({col: 9, row: 6}));
console.log('ok: ', 199);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 200)!), calcResult({col: 8, row: 2}));
console.log('ok: ', 200);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 201)!), calcResult({col: 10, row: 9}));
console.log('ok: ', 201);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 299)!), calcResult({col: 11, row: 1}));
console.log('ok: ', 299);
assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 200)!), 802);
console.log('ok: ', 200);

type P = { col: number; row: number };

function calcResult(solution: P) {
    return 100 * solution.col + solution.row;
}

logAndPushSolution(calcResult(findDestroyedAsteroid(input, 200)!), solutions);