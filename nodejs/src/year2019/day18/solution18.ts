import {
    input,
    testInput0,
    testInput1,
    testInput2,
    testInput4,
    testInput5,
    testInput6,
    testSol0,
    testSol1,
    testSol2,
    testSol4,
    testSol5,
    testSol6
} from "./input";
import {DIRS, getNewPos} from "../util/GridRobot";
import {createGrid, Grid, P} from "../util/Grid";
import * as assert from "assert";
import {logAndPushSolution} from "../util/SolutionHandler";
import {isLetter, isLowerletter, isUpperletter, keysToSortedString, sortString} from "../util/Strings";

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

let times = 0;

// const DEBUG = true;
const DEBUG = false;

const WALL = '#';

function insertElem(someList: string[], insertIndex: number, newVal: string): void {
    const remaining = someList.splice(insertIndex);
    someList[insertIndex] = newVal;
    someList.push(...remaining);
}

let origArray = [1, 2, 3, 4, 5, 6].map(String);
insertElem(origArray, 1, 'insert');
assert.deepEqual(origArray, [1, 'insert', 2, 3, 4, 5, 6].map(String));

function calcLeastMoves(inputString = input, splitTask?: boolean): State | undefined {
    const grid = createGrid(inputString);// TODO loop and find vault entrance
    let nbRobots = 1;
    const startPositions: P[] = [];
    let start: P = undefined!;
    grid.forEach((p, v) => {
        if (v == VAULT_ENTRANCE) {
            start = p;
            return true;
        }
    });
    if (splitTask) {
        nbRobots = 4;
        grid.set(start, WALL);
        for (let dir of DIRS) {
            grid.set(getNewPos(dir, start), WALL);
        }
        for (let rowMod of [-1, 1]) {
            for (let colMod of [-1, 1]) {
                const newStart = P(start.row + rowMod, start.col + colMod);
                startPositions.push(newStart);
                grid.set(newStart, VAULT_ENTRANCE)
            }
        }
        DEBUG && console.log(grid.asImage(e => e!))
    } else {
        startPositions.push(start);
    }
    DEBUG && console.log(startPositions);
    const targetKeys = getAllKeys([...grid.all()].filter(isLetter));
    const alfaKey = keysToSortedString(targetKeys);
    DEBUG && console.log('alfaKey', alfaKey);
    const unExploredStatesWDirMap = new Map<string, State>();
    const unExploredStatesWDirList: string[] = [];
    const bestStepsForState: Map<string, State> = new Map<string, State>();
    let solution: State | undefined = undefined;

    function isBlockedAtDoor(newVal: string, newState: State) {
        return isUpperletter(newVal) && newState.foundKeysKey.indexOf(newVal.toLowerCase()) == -1;
    }

    function isOkState(newState: State) {
        if (newState.moverIndex == undefined) {
            throw 'invalid state'
        }

        if (solution && newState.steps + (solution.foundKeysKey.length - newState.foundKeysKey.length) >= solution.steps) {
            return false;
        }
        let newVal = grid.get(newState.p[newState.moverIndex])!;
        assert.notDeepEqual(newVal, undefined);
        if (newVal == WALL || newState.prevState?.foundKeysKey.length === alfaKey.length || isBlockedAtDoor(newVal, newState)) {
            return false;
        }

        const bestEquivalentState = bestStepsForState.get(newState.uuid);
        if (bestEquivalentState === undefined) {
            // assert.deepEqual(unExploredStatesWDirList.indexOf(newState.uuid), -1, newState.uuid);
            return true;
        }
        return newState.steps < bestEquivalentState.steps;
    }

    function addUnexploredOkState(newState: State) {
        unExploredStatesWDirMap.set(newState.uuid, newState);
        unExploredStatesWDirList.push(newState.uuid);
        for (let key of newState.toKeysForBest()) {
            if (!bestStepsForState.get(key)) {
                bestStepsForState.set(key, newState);
            }
        }
        assert.notDeepEqual(bestStepsForState.get(newState.uuid), unExploredStatesWDirList, newState.uuid);
        if (newState.foundKeysKey.length == alfaKey.length) {
            console.assert(solution?.steps ?? Infinity > newState.steps);
            console.assert([...newState.foundKeysKey].sort().join('') == alfaKey);
            solution = newState;
            console.log('adding solution', solution.steps);
        }
    }

    function getNextUnexplored(): State {
        let newStateKey = unExploredStatesWDirList.shift()!;
        assert.notDeepEqual(newStateKey, undefined);
        const newState = unExploredStatesWDirMap.get(newStateKey)!;
        assert.notDeepEqual(newState, undefined, '' + newStateKey + unExploredStatesWDirList.length);
        unExploredStatesWDirMap.delete(newStateKey);
        DEBUG && console.log(newState.uuid);
        return newState;
    }

    function findShortestPath() {
        const startState = new State(undefined, startPositions, undefined, grid);

        function addNextOkStates(currState = startState) {
            for (let dir of DIRS) {
                for (let mi = 0; mi < nbRobots; mi++) {
                    const newPositions = [...currState.p];
                    newPositions[mi] = getNewPos(dir, currState.p[mi]);
                    const newState = new State(currState, newPositions, mi, grid);
                    let okState = isOkState(newState);
                    if (okState) {
                        addUnexploredOkState(newState);
                    }
                }
            }
        }

        addNextOkStates();


        while (unExploredStatesWDirList.length > 0) {
            DEBUG && console.log(times, unExploredStatesWDirList);
            const unExploredOkState = getNextUnexplored();

            addNextOkStates(unExploredOkState);
        }
    }

    findShortestPath();

    return solution;
}

export function sortedKeysStringSameOrBetter(keys: string, other: string) {
    keys.indexOf(other) !== -1;
}

export class State {
    private static readonly KEY_SEPARATOR = 'k_';
    readonly steps: number;
    readonly keysUnlockedSorted: string;
    readonly uuid: string;
    private readonly posKey: string;

    constructor(public prevState: State | undefined, readonly p: P[], readonly moverIndex: number | undefined, grid: Grid<string>) {

        if (prevState !== undefined) {
            this.keysUnlockedSorted = prevState.keysUnlockedSorted;
            this.steps = prevState.steps + 1
        } else {
            this.steps = 0;
            this.keysUnlockedSorted = '';
        }
        if (moverIndex !== undefined) {
            let newPosVal = grid.get(this.p[moverIndex]);
            assert.notDeepEqual(newPosVal, undefined);
            if (isLowerletter(newPosVal) && this.keysUnlockedSorted.indexOf(newPosVal!) === -1) {
                this.keysUnlockedSorted += newPosVal;
                this.keysUnlockedSorted = sortString(this.keysUnlockedSorted);
            }
        }
        this.posKey = '';
        for (let movedPos of [this.p[this.moverIndex ?? 0]]) {
            this.posKey += 'r' + movedPos.row + 'c' + movedPos.col;
        }
        this.uuid = this.posKey + State.KEY_SEPARATOR + this.foundKeysKey;

    }

    get foundKeysKey(): string {
        return this.keysUnlockedSorted;
    }

    toKeysForBest() {
        const uuidSplit = this.uuid.split(State.KEY_SEPARATOR);
        const bestkeys: string[] = [uuidSplit[0] + State.KEY_SEPARATOR];
        for (let letter of uuidSplit[1]) {
            bestkeys[bestkeys.length] = bestkeys[bestkeys.length - 1] + letter;
        }
        return bestkeys;
    }
}

const solutionStates: (State | undefined)[] = [];
const solutions: number[] = [];
solutionStates.push(calcLeastMoves(testInput0));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length - 1], testSol0);
solutionStates.push(calcLeastMoves(testInput1));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length - 1], testSol1);
solutionStates.push(calcLeastMoves(testInput2));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length - 1], testSol2);
solutionStates.push(calcLeastMoves());
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length - 1], 4620);

solutionStates.push(calcLeastMoves(testInput6, true));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length - 1], testSol6);
solutionStates.push(calcLeastMoves(testInput5, true));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
// assert.deepEqual(solutions[solutions.length - 1], testSol5);
testSol5;
solutionStates.push(calcLeastMoves(testInput4, true));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length - 1], testSol4);

solutionStates.push(calcLeastMoves(input, true));
logAndPushSolution(solutionStates[solutions.length]!.steps, solutions);
assert.deepEqual(solutions[solutions.length - 1], 1564);
