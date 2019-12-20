import {input, testInput1, testInput2, testInput3, testSol1, testSol2, testSol3} from "./input";
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


function getPosAsKey(movedPos: P): string {
    return 'r' + movedPos.row + 'c' + movedPos.col;
}

export class State {
    readonly steps: number;

    constructor(public prevState: State | undefined, readonly p: P, grid: Grid<string>, readonly level: number) {

        if (prevState !== undefined) {
            this.steps = prevState.steps + 1
        } else {
            this.steps = 0;
        }

        let newPosVal = grid.get(this.p);
        assert.notDeepEqual(newPosVal, undefined, JSON.stringify(p));
    }

    toKeyForBest(): string {
        return getPosAsKey(this.p);
    }

    getUUID(): string {
        return this.toKeyForBest() + 'l' + this.level;
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

const MAX_LEVEL = 30;

function calcShortestPath(input: string, maxLevel = MAX_LEVEL): State {
    const {rawGrid, portalGrid, portalNameToInfo} = createGridInfo(input);
    // DEBUG &&
    // console.log(rawGrid.asImage(el => el ?? '-'));
    // DEBUG &&
    // console.log(portalGrid.asImage(el => el ? 'P' : '-'));
    // DEBUG &&
    showMergedGrid(rawGrid, portalGrid);
    console.log(JSON.stringify([...portalNameToInfo.entries()]));

    function getNextPosWarped(dir: DIR, p: P, _portalGrid: Grid<P[]>): { lc: number, pos: P } {
        const nextPosNormal = getNewPos(dir, p);
        const otherPortalEdges = getOtherPortalEdge(nextPosNormal, _portalGrid);
        if (maxLevel >= 0 && otherPortalEdges && otherPortalEdges[0]) {
            let levelChange = outer({p, dir}, rawGrid) ? -1 : +1;
            return {lc: levelChange, pos: otherPortalEdges[0]};
        }
        return {lc: 0, pos: nextPosNormal};
    }

    const startPos = portalNameToInfo.get('AA')![0].p;
    const endPos = portalNameToInfo.get('ZZ')![0].p;
    const endPosUUID = getPosAsKey(endPos) + 'l0';


    DEBUG && console.log(startPos);
    DEBUG && console.log('endPos', endPos);
    const unExploredStatesWDirMap = new Map<string, State>();
    const unExploredStatesWDirList: string[] = [];
    const bestStepsForState: Map<string, State[]> = new Map<string, State[]>();
    let solution: State | undefined = undefined;

    function isFinished(state: State | undefined) {
        return state?.getUUID() === endPosUUID
    }

    function isOkState(newState: State) {
        let newVal = rawGrid.get(newState.p);
        assert.notDeepEqual(newVal, undefined);
        if (newVal !== PASSAGE || isFinished(newState.prevState)) {
            return false;
        }
        if (newState.level < 0) {
            return false;
        }
        const bestStateInfos: { steps: number, level: number }[] | undefined = bestStepsForState.get(newState.toKeyForBest());
        for (let bestStateInfo of bestStateInfos ?? []) {
            if ((newState.level == bestStateInfo.level || newState.level > maxLevel)
                // (newState.level % 2 == bestStateInfo.level % 2
                // && Math.abs(newState.level) >= Math.abs(bestStateInfo.level) && Math.sign(bestStateInfo.level) == Math.sign(newState.level))
                && newState.steps >= bestStateInfo.steps) {
                return false
            }
        }
        return true;
    }

    function addUnexploredOkState(newState: State) {
        assert.notDeepEqual(newState, undefined);
        let uuid = newState.getUUID();
        assert.deepEqual(unExploredStatesWDirList.indexOf(uuid), -1, uuid);
        unExploredStatesWDirList.push(uuid);
        unExploredStatesWDirMap.set(uuid, newState);
        if (bestStepsForState.get(newState.toKeyForBest()) == undefined) {
            bestStepsForState.set(newState.toKeyForBest(), [])
        }
        bestStepsForState.get(newState.toKeyForBest())!.push(newState);
        if (isFinished(newState)) {
            console.assert(solution?.steps ?? Infinity > newState.steps);
            solution = newState;
        }
    }

    function getNextUnexplored(): State {
        let newStateKey = unExploredStatesWDirList.pop()!;
        assert.notDeepEqual(newStateKey, undefined);
        assert.notDeepEqual(unExploredStatesWDirMap.get(newStateKey), undefined, newStateKey);
        const newState = unExploredStatesWDirMap.get(newStateKey)!;
        unExploredStatesWDirMap.delete(newStateKey);
        DEBUG && console.log(newState.getUUID());
        return newState;
    }


    function findShortestPath() {
        function addOkUnexploredStates(unExploredOkState: State) {
            for (let dir of DIRS) {
                const newPosWithLevelChange = getNextPosWarped(dir!, unExploredOkState.p, portalGrid);
                const newState = new State(unExploredOkState, newPosWithLevelChange.pos, rawGrid, unExploredOkState.level + newPosWithLevelChange.lc);
                let okState = isOkState(newState);
                if (okState) {
                    addUnexploredOkState(newState);
                }
            }
        }

        const startState = new State(undefined, startPos, rawGrid, 0);
        addOkUnexploredStates(startState);
        while (unExploredStatesWDirList.length > 0) {
            const unExploredOkState = getNextUnexplored();
            addOkUnexploredStates(unExploredOkState);
        }
    }

    findShortestPath();
    showSolutionGrid(rawGrid, solution!);

    return solution!;
}

assert.deepEqual(calcShortestPath(testInput1).steps, 26);
testSol1;
console.log('assert.deepEqual(part1(testInput1), testSol1)');
// assert.deepEqual(calcShortestPath(testInput2), testSol2);
// console.log('assert.deepEqual(part1(testInput2), testSol2)');
assert.deepEqual(calcShortestPath(testInput3).steps, testSol3);
console.log('assert.deepEqual(part1(testInput3), testSol3)');
testSol2;
testSol3;
testInput2;
testInput3;
const solutions: number[] = []
let solution1 = calcShortestPath(input);

logAndPushSolution(solution1.steps, solutions);