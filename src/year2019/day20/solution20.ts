import {input, testInput1, testInput2, testSol1, testSol2} from "./input";
import {createGrid, Grid, P} from "../util/Grid";
import {DIR, DIRS, getNewPos} from "../util/GridRobot";
import {isLetter} from "../util/Strings";
import * as assert from "assert";
import {logAndPushSolution} from "../util/SolutionHandler";
// part1
// find portals
// Make replace dots with letterPairs on portals
// make map of letterPairs to positions
function getOtherPortalEdge(p: P, portalGrid: Grid<P[]>) {
    return portalGrid.get(p);
}

export const WALL = '#';


function getPosAsKey(movedPos: P) {
    return 'r' + movedPos.row + 'c' + movedPos.col;
}

export class State {
    readonly steps: number;

    constructor(public prevState: State | undefined, readonly p: P, grid: Grid<string>) {

        if (prevState !== undefined) {
            this.steps = prevState.steps + 1
        } else {
            this.steps = 0;
        }
        let newPosVal = grid.get(this.p);
        assert.notDeepEqual(newPosVal, undefined, JSON.stringify(p));
    }

    toKeyForBest() {
        return getPosAsKey(this.p);
    }

    key() {
        return this.toKeyForBest();
    }
}


function outer(portInfo: { p: P; dir: DIR }, rawGrid: Grid<string>) {
    const lastLetterPos = getNewPos(portInfo.dir, getNewPos(portInfo.dir, portInfo.p));
    assert.deepEqual(isLetter(rawGrid.get(lastLetterPos)), true);
    return lastLetterPos.row % (rawGrid.rows - 1) == 0 || lastLetterPos.col % (rawGrid.cols - 1) == 0;
}

function sortStringForDir(unSortedLetters: any, dir: DIR): string {
    const reverse = outer && dir == DIR.UP
        || dir == DIR.LEFT
    ;
    return reverse ? [...unSortedLetters].reverse().join('') : unSortedLetters;
}

assert.deepEqual(sortStringForDir('OJ', DIR.UP), 'JO');
assert.deepEqual(sortStringForDir('CB', DIR.LEFT), 'BC');
assert.deepEqual(sortStringForDir('BC', DIR.DOWN), 'BC');

function createGridInfo(input: string) {

    const rawGrid = createGrid(input);
    const portalGrid = new Grid<P[]>();
    const portalNameToInfo = new Map<string, { p: P, dir: DIR }[]>();
    rawGrid.forEach((p) => {
        if (rawGrid.get(p) === PASSAGE) {
            for (const dir of DIRS) {
                const nextPos = getNewPos(dir, p);
                const firstLetter = rawGrid.get(nextPos);
                if (isLetter(firstLetter)) {
                    const nextNextPos = getNewPos(dir, nextPos);
                    const nextLetter = rawGrid.get(nextNextPos);
                    if (isLetter(nextLetter)) {
                        let unSortedLetters = firstLetter + nextLetter;
                        let sortedLetters = sortStringForDir(unSortedLetters, dir);
                        let currInfo = portalNameToInfo.get(sortedLetters);
                        if (!currInfo) {
                            portalNameToInfo.set(sortedLetters, [{p: p, dir: dir}]);
                        } else {
                            currInfo.push({p: p, dir: dir});
                            // if (currInfo.length > 2) {
                            //     console.log('---------', currInfo.length)
                            //     console.log(JSON.stringify(currInfo))
                            // }
                            // assert.deepEqual(currInfo.length, 2, JSON.stringify(currInfo));
                        }
                    }
                }
            }
        }
    });
    for (const portalName of portalNameToInfo.keys()) {
        let infos = portalNameToInfo.get(portalName);
        if (infos && infos.length >= 2) {
            for (let i = 0; i < infos.length; i++) {
                const otherInfos = [...infos];
                otherInfos.splice(i, 1);
                let thisPortalInfo = infos[i];
                const thisPortalPos = thisPortalInfo.p;
                const connectingOtherPortals: P[] = [];
                for (const otherInfo of otherInfos) {
                    if (outer(thisPortalInfo, rawGrid) && !outer(otherInfo, rawGrid) || !outer(thisPortalInfo, rawGrid) && outer(otherInfo, rawGrid)) {
                        connectingOtherPortals.push(otherInfo.p)
                    } else {
                        console.log(portalName, JSON.stringify(thisPortalInfo), outer(thisPortalInfo, rawGrid), JSON.stringify(otherInfo), outer(otherInfo, rawGrid), rawGrid.rows, rawGrid.cols);
                    }
                }
                portalGrid.set(getNewPos(thisPortalInfo.dir, thisPortalPos), connectingOtherPortals);
            }
        }
    }
    return {rawGrid, portalGrid, portalNameToInfo};
}


const DEBUG = false;

// Part1
const PASSAGE = '.';

function showMergedGrid(rawGrid: Grid<string>, portalGrid: Grid<P[]>) {
    const mergedGrid = new Grid<string>();
    rawGrid.forEach(pos => {
        rawGrid.get(pos) && mergedGrid.set(pos, rawGrid.get(pos))
    });
    portalGrid.forEach(pos => {
        portalGrid.get(pos) && mergedGrid.set(pos, String(portalGrid.get(pos)!.length));
    });
    console.log(mergedGrid.asImage(el => el ?? '-'));
}

function showSolutionGrid(rawGrid: Grid<string>, solution: State) {
    const solutionGrid = new Grid<string>();
    rawGrid.forEach(pos => {
        rawGrid.get(pos) && solutionGrid.set(pos, rawGrid.get(pos))
    });
    let solutionState: State | undefined = solution;

    while (solutionState) {
        solutionGrid.set(solutionState.p, String(solutionState.steps % 10))
        solutionState = solutionState.prevState;
    }
    console.log(solutionGrid.asImage(el => el ?? '-'));
}

function part1(input: string): State {
    const {rawGrid, portalGrid, portalNameToInfo} = createGridInfo(input);
    // DEBUG &&
    // console.log(rawGrid.asImage(el => el ?? '-'));
    // DEBUG &&
    // console.log(portalGrid.asImage(el => el ? 'P' : '-'));
    // DEBUG &&
    showMergedGrid(rawGrid, portalGrid);
    console.log(JSON.stringify([...portalNameToInfo.entries()]));

    function getNextPosWarped(dir: DIR, p: P, _portalGrid: Grid<P[]>): P[] {
        const nextPosNormal = getNewPos(dir, p);
        const otherPortalEdges = getOtherPortalEdge(nextPosNormal, _portalGrid);
        if (otherPortalEdges) {
            return otherPortalEdges;
        }
        return [nextPosNormal];
    }

    const startPos = portalNameToInfo.get('AA')![0].p;
    const endPos = portalNameToInfo.get('ZZ')![0].p;
    const endPosKey = getPosAsKey(endPos);


    DEBUG && console.log(startPos);
    DEBUG && console.log('endPos', endPos);
    const unExploredStatesWDirMap = new Map<string, State>();
    const unExploredStatesWDirList: string[] = [];
    const bestStepsForState: Map<string, number> = new Map<string, number>();
    let solution: State | undefined = undefined;

    function isFinished(state: State | undefined) {
        return state?.toKeyForBest() === endPosKey
    }

    function isOkState(newState: State) {
        let newVal = rawGrid.get(newState.p);
        assert.notDeepEqual(newVal, undefined);
        if (newVal !== PASSAGE || isFinished(newState.prevState)) {
            return false;
        }

        const bestNbSteps = bestStepsForState.get(newState.toKeyForBest());
        if (bestNbSteps === undefined) {
            return true;
        }
        return bestNbSteps > newState.steps;
    }

    function addUnexploredOkState(newState: State) {
        unExploredStatesWDirMap.set(newState.key(), newState);
        unExploredStatesWDirList.push(newState.key());
        bestStepsForState.set(newState.toKeyForBest(), newState.steps);
        if (isFinished(newState)) {
            console.assert(solution?.steps ?? Infinity > newState.steps);
            solution = newState;
        }
    }

    function getNextUnexplored(): State {
        let newStateKey = unExploredStatesWDirList.pop()!;
        assert.notDeepEqual(newStateKey, undefined);
        const newState = unExploredStatesWDirMap.get(newStateKey)!;
        assert.notDeepEqual(newState, undefined);
        unExploredStatesWDirMap.delete(newStateKey);
        DEBUG && console.log(newState.key());
        return newState;
    }

    function findShortestPath() {
        const startState = new State(undefined, startPos, rawGrid);

        for (let dir of DIRS) {
            const newPoss = getNextPosWarped(dir!, startState.p, portalGrid);
            for (const newPos of newPoss) {
                const newState = new State(startState, newPos, rawGrid);
                let okState = isOkState(newState);
                if (okState) {
                    addUnexploredOkState(newState);
                }
            }
        }


        while (unExploredStatesWDirList.length > 0) {
            const unExploredOkState = getNextUnexplored();

            for (let dir of DIRS) {
                const newPoss = getNextPosWarped(dir!, unExploredOkState.p, portalGrid);
                for (const newPos of newPoss) {
                    const newState = new State(unExploredOkState, newPos, rawGrid);
                    let okState = isOkState(newState);
                    if (okState) {
                        addUnexploredOkState(newState);
                    }
                }
            }
        }
    }

    findShortestPath();
    showSolutionGrid(rawGrid, solution!);

    return solution!;
}

assert.deepEqual(part1(testInput1).steps, testSol1);
console.log('assert.deepEqual(part1(testInput1), testSol1)');
assert.deepEqual(part1(testInput2).steps, testSol2);
console.log('assert.deepEqual(part1(testInput2), testSol2)');

const solutions: number[] = []
let solution1 = part1(input);

logAndPushSolution(solution1.steps, solutions);