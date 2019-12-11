import {runTests} from "./GridTest";
import {Grid, P} from "./Grid";

export const enum TURN {
    LEFT,
    RIGHT
}

export const enum DIR {
    UP,
    LEFT,
    DOWN,
    RIGHT,
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
    return (currAbsDir + (turnDir == TURN.LEFT ? 1 : 3)) % 4;
}

export class GridRobot<ELTYPE> extends Grid<ELTYPE> {
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
}

runTests();