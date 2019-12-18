import {input, testInput0, testInput1, testInput2} from "./input";
import {DIR, DIRS, getNewPos, GridRobot} from "../util/GridRobot";
import {P} from "../util/Grid";
import * as assert from "assert";

testInput1;
testInput2;
const START = '@';

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
            if (el == START) {
                gridInput.p = P(rindex, cindex);
            }
        });
    });
    return gridInput;
}

let times = 0;

const DEBUG = true;

// const DEBUG = false;

function part1(inputString = input) {
    const grid = createGrid(inputString);
    const targetKeys = getAllKeys([...grid.all()].filter(isletter));
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
        let newVal = grid.get(newState.p)!;
        assert.notDeepEqual(newVal, undefined);
        if (newVal == '#' || newState.prevState?.foundKeysKey === alfaKey || isBlockedAtDoor(newVal, newState)) {
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

    const startState = new State(undefined, undefined, grid);
    let lastState = startState;

    for (let dir of DIRS) {
        const newState = new State(lastState, dir, grid);
        if (isOkState(newState)) {
            addUnexploredOkState(newState);
        }
    }


    while (unExploredStatesWDirList.length > 0) {
        DEBUG && console.log(times, unExploredStatesWDirList);
        const newState = getNextUnexplored();

        for (let dir of DIRS) {
            const newState = new State(lastState, dir, grid);
            if (isOkState(newState)) {
                addUnexploredOkState(newState);
            }
        }
        lastState = newState;
    }

    console.log(times++, solution);
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
    readonly p: P;
    readonly steps: number;

    constructor(public prevState: State | undefined, public dir: undefined | DIR, grid: GridRobot<string>) {
        if (prevState !== undefined) {
            this.foundKeysKey = prevState.foundKeysKey;
            this.p = getNewPos(dir!, prevState.p);
            this.steps = prevState.steps + 1
        } else {
            this.steps = 0;
            this.foundKeysKey = '';
            this.p = {...grid.p};
        }
        let posVal = grid.get(this.p);
        assert.notDeepEqual(posVal, undefined);
        if (isLowerletter(posVal) && this.foundKeysKey.indexOf(posVal!) == -1) {
            this.foundKeysKey = this.foundKeysKey.split('').concat([posVal!]).sort().join('');
        }
    }

    toKeyForBest() {
        return 'k-' + this.foundKeysKey + 'r' + this.p.row + 'c' + this.p.col;
    }


    toKeyWDir(dir: DIR) {
        return this.toKeyForBest() + DIR[dir];
    }

    key() {
        return this.prevState && this.prevState.toKeyWDir(this.dir!) || 'START';
    }
}

part1(testInput0);
// part1(testInput1);
// part1(testInput2);
// part1();
