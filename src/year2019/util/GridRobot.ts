import {runTests} from "./GridTest";
import {Grid, P} from "./Grid";

export enum TURN {
    LEFT,
    RIGHT,
    NOTURN
}

export const enum DIR {
    UP,
    LEFT,
    DOWN,
    RIGHT,
}

export enum ARROW {
    UP = '^',
    LEFT = '<',
    DOWN = 'v',
    RIGHT = '>',
}

export function isArrow(d: string): d is ARROW {
    return d == ARROW.UP || d == ARROW.DOWN || d == ARROW.LEFT || d == ARROW.RIGHT
}

export function arrowToDir(dir: ARROW): DIR {
    switch (dir) {
        case ARROW.DOWN:
            return DIR.DOWN;
        case ARROW.LEFT:
            return DIR.LEFT;
        case ARROW.RIGHT:
            return DIR.RIGHT;
        case ARROW.UP:
            return DIR.UP;
        default:
            throw 'invalid dir ' + dir
    }
}

export function getNewPosA(dir: ARROW, p: P): P {
    switch (dir) {
        case ARROW.DOWN:
            return {row: p.row + 1, col: p.col};
        case ARROW.LEFT:
            return {row: p.row, col: p.col - 1};
        case ARROW.RIGHT:
            return {row: p.row, col: p.col + 1};
        case ARROW.UP:
            return {row: p.row - 1, col: p.col};
        default:
            throw 'invalid dir ' + dir
    }
}

export function getNewPos(dir: DIR, p: P): P {
    switch (dir) {
        case DIR.DOWN:
            return {row: p.row + 1, col: p.col};
        case DIR.LEFT:
            return {row: p.row, col: p.col - 1};
        case DIR.RIGHT:
            return {row: p.row, col: p.col + 1};
        case DIR.UP:
            return {row: p.row - 1, col: p.col};
        default:
            throw 'invalid dir ' + dir
    }
}

export function getNewDir(currAbsDir: DIR, turnDir: TURN): DIR {
    if (turnDir == TURN.NOTURN) {
        return currAbsDir;
    }
    return (currAbsDir + (turnDir == TURN.LEFT ? 1 : 3)) % 4;
}

export class GridRobot<ELTYPE> extends Grid<ELTYPE> {
    nbMoves: number = 0;

    get val(): ELTYPE | undefined {
        return this.get(this.p);
    }

    set val(value: ELTYPE | undefined) {
        this.set(this.p, value);
    }

    private _p: P = P(0, 0);

    get p(): P {
        return this._p;
    }

    set p(p: P) {
        this._p = p;
    }

    private _d: DIR = DIR.UP;

    get d(): DIR {
        return this._d;
    }

    set d(value: DIR) {
        this._d = value;
    }

    move(times = 1) {
        this.nbMoves++;
        for (let i = 0; i < times; i++) {
            this.p = getNewPos(this._d, this._p);
        }
    }

    turn(t: TURN) {
        this._d = getNewDir(this._d, t);
    }

    paint(output: ELTYPE) {
        this.set(this.p, output)
    }

    paintNext(output: ELTYPE) {
        const newPos = getNewPos(this._d, this._p);
        this.set(newPos, output)
    }

    paintNextDir(output: ELTYPE, dir: DIR) {
        const newPos = getNewPos(dir, this._p);
        this.set(newPos, output)
    }

    posToKeyWDir(d: DIR): string {
        return JSON.stringify(this.p) + d;
    }


    clear() {
        super.clear();
        this._p = P(0, 0);
    }
}

runTests();
