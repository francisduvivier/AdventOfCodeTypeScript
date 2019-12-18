import {
    input,
    testInput0,
    testInput1,
    testInput2,
    testInput4, testInput5,
    testSol0,
    testSol1,
    testSol2,
    testSol4,
    testSol5
} from "./input";
import {DIRS, getNewPos, GridRobot} from "../util/GridRobot";
import {P} from "../util/Grid";
import * as assert from "assert";
import {logAndPushSolution} from "../util/SolutionHandler";

testInput1;
testInput2;
const VAULT_ENTRANCE = '@';

function getAllKeys(letterList: string[]) {
    const allLetters = new Set<string>(letterList);
    let keyWithoutDoor: string[] = [];
    let doorWithoutKey: string[] = [];
    const keys = new Set<string>();
    for (let letter of allLetters) {
        if (letter.toLowerCase() == letter) {
            keys.add(letter);
            if (!allLetters.has(letter.toUpperCase())) {
                keyWithoutDoor.push(letter);
            }
        } else {
            if (!allLetters.has(letter.toLowerCase())) {
                doorWithoutKey.push(letter);
            }
        }
    }
    assert.deepEqual(doorWithoutKey, []);
    return keys;
}

function isletter(el: string | undefined): el is string {
    return !!el && !!el.match(/[a-zA-Z]/);
}

function createGrid(inputString: string) {
    const gridInput = new GridRobot<string>();
    const rows = inputString.split('\n');
    rows.forEach((row, rindex) => {
        row.split('').forEach((el, cindex) => {
            gridInput.set(P(rindex, cindex), el);
            if (el == VAULT_ENTRANCE) {
                gridInput.p = P(rindex, cindex);
            }
        });
    });
    return gridInput;
}

let times = 0;

// const DEBUG = true;
const DEBUG = false;

const WALL = '#';

function calcLeastMoves(inputString = input, splitTask?: boolean): State | undefined {
    const gridRobot = createGrid(inputString);
    let nbRobots = 1;
    const startPositions: P[] = [];
    const origP = gridRobot.p;
    if (splitTask) {
        nbRobots = 4;
        gridRobot.paint(WALL);
        for (let dir of DIRS) {
            gridRobot.paintNextDir(WALL, dir);
        }
        for (let rowMod of [-1, 1]) {
            for (let colMod of [-1, 1]) {
                const newStart = P(origP.row + rowMod, origP.col + colMod);
                startPositions.push(newStart);
                gridRobot.set(newStart, VAULT_ENTRANCE)
            }
        }
        // DEBUG &&
        console.log(gridRobot.asImage(e => e!))
    } else {
        startPositions.push(origP);
    }
    DEBUG && console.log(startPositions)
    const targetKeys = getAllKeys([...gridRobot.all()].filter(isletter));
    const alfaKey = keysToSortedString(targetKeys);
    DEBUG && console.log('alfaKey', alfaKey);
    const unExploredStatesWDirMap = new Map<string, State>();
    const unExploredStatesWDirList: string[] = [];
    const bestStepsForState: Map<string, number> = new Map<string, number>();
    let solution: State | undefined = undefined;

    function isBlockedAtDoor(newVal: string, newState: State) {
        return isletter(newVal) && newVal.toUpperCase() == newVal && newState.foundKeysKey.indexOf(newVal.toLowerCase()) == -1;
    }

    function isOkState(newState: State) {
        if (newState.moverIndex == undefined) {
            throw 'invalid state'
        }
        let newVal = gridRobot.get(newState.p[newState.moverIndex])!;
        assert.notDeepEqual(newVal, undefined);
        if (newVal == WALL || newState.prevState?.foundKeysKey === alfaKey || isBlockedAtDoor(newVal, newState)) {
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
        if (newState.foundKeysKey == alfaKey) {
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
        const startState = new State(undefined, startPositions, undefined, gridRobot);

        for (let dir of DIRS) {
            for (let mi = 0; mi < nbRobots; mi++) {
                const newPositions = [...startState.p];
                newPositions[mi] = getNewPos(dir!, startState.p[mi]);
                const newState = new State(startState, newPositions, mi, gridRobot);
                if (isOkState(newState)) {
                    addUnexploredOkState(newState);
                }
            }
        }


        while (unExploredStatesWDirList.length > 0) {
            DEBUG && console.log(times, unExploredStatesWDirList);
            const unExploredOkState = getNextUnexplored();

            for (let dir of DIRS) {
                for (let mi = 0; mi < nbRobots; mi++) {
                    const newPositions = [...unExploredOkState.p];
                    newPositions[mi] = getNewPos(dir!, unExploredOkState.p[mi]);
                    const newState = new State(unExploredOkState, newPositions, mi, gridRobot);
                    if (isOkState(newState)) {
                        addUnexploredOkState(newState);
                    }
                }
            }
        }
    }

    findShortestPath();

    return solution;
}

export function keysToSortedString(keys: Set<string>) {
    return [...keys.values()].sort().join('');
}

export function sortedKeysStringSameOrBetter(keys: string, other: string) {
    keys.indexOf(other) !== -1;
}

function isLowerletter(char: string | undefined) {
    return isletter(char) && char.toLowerCase() == char
}

export class State {
    readonly foundKeysKey: string;
    readonly steps: number;

    constructor(public prevState: State | undefined, readonly p: P[], readonly moverIndex: number | undefined, grid: GridRobot<string>) {

        if (prevState !== undefined) {
            this.foundKeysKey = prevState.foundKeysKey;
            this.steps = prevState.steps + 1
        } else {
            this.steps = 0;
            this.foundKeysKey = '';
        }
        if (moverIndex !== undefined) {
            let newPosVal = grid.get(this.p[moverIndex]);
            assert.notDeepEqual(newPosVal, undefined);
            if (isLowerletter(newPosVal) && this.foundKeysKey.indexOf(newPosVal!) == -1) {
                this.foundKeysKey = this.foundKeysKey.split('').concat([newPosVal!]).sort().join('');
            }
        }
    }

    toKeyForBest() {
        return 'k-' + this.foundKeysKey + this.p.map(p => 'r' + p.row + 'c' + p.col).join(',');
    }

    key() {
        return this.prevState?.toKeyForBest() + this.toKeyForBest();
    }
}

const solutionStates: (State | undefined)[] = []
const solutions: number[] = []
solutionStates.push(calcLeastMoves(testInput0));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length-1], testSol0);
solutionStates.push(calcLeastMoves(testInput1));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length-1], testSol1);
solutionStates.push(calcLeastMoves(testInput2));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length-1], testSol2);
// calcLeastMoves();
solutionStates.push(calcLeastMoves(testInput4, true));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length-1], testSol4);

solutionStates.push(calcLeastMoves(testInput5, true));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length-1], testSol5);