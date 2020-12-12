import { rInput } from "./input.ts";
import { Grid, P } from "../../year2019/util/Grid.ts";
import { logAndPushSolution } from "../../year2019/util/SolutionHandler.ts";

declare const console: any;

type GridEl = '#' | '.' | 'L';

function getAdjacents(p: P, grid: Grid<GridEl>) {
    const solution: GridEl[] = [];
    for (const rowDiff of [-1, 0, 1]) {
        for (const colDiff of [-1, 0, 1]) {
            if (rowDiff == 0 && colDiff == 0) {
                continue;
            }
            const adjacent = grid.getRc(p.row + rowDiff, p.col + colDiff);
            if (adjacent !== undefined) {
                solution.push(adjacent);
            }
        }
    }
    return solution;
}

function applyRules(theGrid: Grid<string>, tolerance: number = 4, getOthersFunc: (p: P, grid: Grid<GridEl>) => GridEl[] = getAdjacents) {
    const oldGrid = Grid.fromMatrix(theGrid.asArray() as GridEl[][]);
    let somethingChanged = false;

    function shouldBeFilled(p: P, val: GridEl) {
        return val === 'L' && getOthersFunc(p, oldGrid).filter(o => o == '#').length == 0;
    }

    function shouldBeEvacuated(p: P, val: GridEl) {
        return val === '#' && getOthersFunc(p, oldGrid).filter(o => o == '#').length >= tolerance;
    }

    oldGrid.forEach((p, val) => {
        if (shouldBeFilled(p, val)) {
            theGrid.set(p, '#')
            somethingChanged = true
        } else if (shouldBeEvacuated(p, val)) {
            somethingChanged = true
            theGrid.set(p, 'L')
        }
    });
    return somethingChanged;
}

//Part 1

function part1() {
    const input = rInput;
    const grid = Grid.fromMatrix<GridEl>(input);
    console.log(grid.asImage((e: any) => e))
    while (applyRules(grid)) ;
    const nbFilled = grid.getNbElem('#')
    logAndPushSolution(' sol ' + nbFilled, [])
}


function getVisibles(p: P, grid: Grid<GridEl>) {
    const solution: GridEl[] = [];
    for (const rowDiff of [-1, 0, 1]) {
        for (const colDiff of [-1, 0, 1]) {
            if (rowDiff == 0 && colDiff == 0) {
                continue;
            }
            let currRow = p.row;
            let currCol = p.col;
            currRow += rowDiff
            currCol += colDiff
            while (grid.getRc(currRow, currCol) == '.') {
                currRow += rowDiff
                currCol += colDiff
            }
            const visible = grid.getRc(currRow, currCol)
            if (visible !== undefined) {
                solution.push(visible);
            }
        }
    }
    return solution;
}


function part2() {
    const input = rInput;
    const grid = Grid.fromMatrix<GridEl>(input);
    console.log(grid.asImage((e: any) => e))
    while (applyRules(grid, 5, getVisibles)) ;
    const nbFilled = grid.getNbElem('#')
    logAndPushSolution(' sol ' + nbFilled, [])
}

// const input = tInput;
part1();
part2();
