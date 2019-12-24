import {Grid, P} from "../util/Grid";
import * as assert from "assert";
import Long from "long";
import {DIR, DIRS, getNewPos} from "../util/GridRobot";

assert.equal(Long.fromString(calcBioDev(Grid.fromMatrix(`.....
.....
.....
#....
.#...`.split('\n').map(line => line.split('')))), true, 2).toNumber(), 2129920);


const input = `##.#.
#.###
##...
...#.
#.##.`;

function calcBioDev(inputGrid: any) {
    const allTilesRev = [...inputGrid.all()].reverse();
    return allTilesRev.slice(allTilesRev.indexOf('#')).map(val => val == '.' ? '0' : '1').join('');
}

function part1(inputString: any) {
    const bioDevs: string[] = [];
    const bioDevToOrder: Map<string, number> = new Map<string, number>();
    let currGrid: Grid<string> = Grid.fromMatrix<string>(inputString.split('\n').map(line => line.split('')));


    let currBioDev = calcBioDev(currGrid);
    console.log(currGrid.asImage(el => el!))
    console.log(bioDevs.length);
    while (!bioDevToOrder.get(currBioDev)) {

        bioDevToOrder.set(currBioDev, bioDevs.push(currBioDev));
        const newGrid = new Grid<string>();
        currGrid.forEach((p, val) => {
            let nSurroundingBugs = 0;
            for (let dir of DIRS) {
                if (currGrid.get(getNewPos(dir, p)) == '#') {
                    nSurroundingBugs++;
                }
            }
            if (val == '#' && nSurroundingBugs != 1) {
                newGrid.set(p, '.');
            } else if (val == '.' && (nSurroundingBugs == 1 || nSurroundingBugs == 2)) {
                newGrid.set(p, '#')
            } else {
                newGrid.set(p, val);
            }
        });
        currGrid = newGrid;
        console.log(currGrid.asImage(el => el!));
        console.log(bioDevs.length);
        currBioDev = calcBioDev(currGrid);
    }
    console.log(bioDevToOrder.get(currBioDev));
    return currBioDev;
}

console.log(Long.fromString(part1(input), true, 2).toString());
type INFO = { b: boolean, surr?: number }
type REC_GRID = Grid<INFO | REC_GRID>

function isInfo(newVal: INFO | REC_GRID | undefined): newVal is INFO {
    return newVal?.['b'] !== undefined;
}

function wrapAround(col: Long | number, max: Long | number): Long {
    if (typeof col == 'number') {
        col = Long.fromNumber(col);
    }
    if (typeof max == 'number') {
        max = Long.fromNumber(max, true);
    }
    let moddie = col.mod(max);
    if (!moddie.isNegative()) {
        return moddie
    } else {
        return max.add(moddie);
    }
}

const indexes = [0, 1, 2, 3, 4];

function incrRecGridFrom(grid: REC_GRID, newPos: P, dir: DIR) {

    const goesOutWard = !(newPos.col == 2 && newPos.row == 2);
    let newPositions: P[] = [];
    if (goesOutWard) {
        const newOutWardColMapped = wrapAround(newPos.col, 6).toNumber();
        const newOutWardRowMapped = wrapAround(newPos.row, 6).toNumber();
        newPositions = [P(newOutWardRowMapped, newOutWardColMapped)];
    } else {
        switch (dir) {
            case DIR.DOWN:
                return indexes.map(i => P(0, i))
            case DIR.UP:
                return indexes.map(i => P(4, i))
            case DIR.RIGHT:
                return indexes.map(i => P(i, 0));
            case DIR.LEFT:
                return indexes.map(i => P(i, 4))
        }
    }
    for (let pos of newPositions) {
        const currVal = (grid.get(pos) ?? {b: false}) as INFO;
        currVal.surr = (currVal.surr || 0) + 1;
        grid.set(pos, currVal);
    }
}

function part2(inputString: any) {
    const recGrid: REC_GRID = Grid.fromMatrix<string>(inputString.split('\n').map(line => line.split('').map(s => ({b: s == '#'}))));
    recGrid.setRc(2, 2, undefined!);
    for (let i = 0; i < 200; i++) {
        recGrid.forEach((p, v) => {
            for (let dir of DIRS) {
                {
                    const newPos = getNewPos(dir, p);
                    const newVal = recGrid.get(newPos);
                    if (newVal !== undefined) {
                        if (isInfo(newVal)) {
                            newVal.surr = (newVal.surr || 0) + 1;
                        } else {
                            incrRecGridFrom(newVal, newPos, dir);
                        }
                    } else {
                        if (newPos.row % 4 == 0 || newPos.col % 4 == 0 || newPos.row == 2 && newPos.col == 2) {
                            const currVal = {b: false} as INFO;
                            currVal.surr = (currVal.surr || 0) + 1;
                            recGrid.set(newPos, currVal);
                        } else {
                            const newVal: REC_GRID = new Grid();
                            incrRecGridFrom(newVal, newPos, dir);
                        }
                    }
                }
            }
        })
    }

}

part2(input);