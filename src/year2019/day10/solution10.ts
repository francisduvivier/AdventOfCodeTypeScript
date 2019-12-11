import {input, PLetter, Solution, testInput1} from "./input";
import {logAndPushSolution} from "../util/SolutionHandler";
import {runTests} from "./tests";
import {flattenPoint, P} from "../util/Grid";

function isRound(val: number, precision = 4) {
    return Math.round(val * Math.pow(10, precision)) === Math.round(val) * Math.pow(10, precision);
}

function between(val: number, first: number, second: number) {
    return val >= first && val <= second || val <= first && val >= second;
}

export function same(first: number, second: number, precision = 4) {
    return Math.round(first * Math.pow(10, precision)) === Math.round(second * Math.pow(10, precision));
}


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

export function findMostVisibleAsteroid(input: PLetter[][]): Point[] {
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

export function findMostVisibleAsteroidDist(input: PLetter[][]): number {
    return findMostVisibleAsteroid(input)[0].solution.friends;
}

export const solutions: number[] = [];
findMostVisibleAsteroid(testInput1);
// Part 1
logAndPushSolution(findMostVisibleAsteroidDist(input), solutions);

export function getDestroyOrder(ast: P, other: P, bestPoint: P) {
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

export function findDestroyedAsteroid(matrix: PLetter[][], targetDestroyed: number) {
    const updatedMatrix = matrix.map(row => [...row]);
    const pointsWFriends = findMostVisibleAsteroid(updatedMatrix);
    const bestPoint = pointsWFriends[0];
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

runTests();
logAndPushSolution(flattenPoint(findDestroyedAsteroid(input, 200)!), solutions);
