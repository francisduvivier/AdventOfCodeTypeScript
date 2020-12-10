import {runTests} from "./GridTest";
import {Grid, P} from "./Grid";

export enum TURN {
    LEFT,
    RIGHT,
    NOTURN
}

export enum DIR {
    UP = 0,
    LEFT = 1,
    DOWN = 2,
    RIGHT = 3,
}

export const DIRS: DIR[] = Object.values(DIR).filter(k => typeof k == 'number') as DIR[];

export enum ARROW {
    UP = '^',
    LEFT = '<',
    DOWN = 'v',
    RIGHT = '>',
}

export const ARROWS: ARROW[] = Object.values(ARROW);
export const DIRNAMES: (keyof ARROW)[] = Object.keys(ARROW) as (keyof ARROW & string)[];

export function isArrow(d: string): d is ARROW {
    return ARROWS.indexOf(d as any) !== -1
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

export function dirToArrow(dir: DIR): ARROW {
    return ARROW[DIR[dir]];
}

export function getNewPosForArrow(dir: ARROW, p: P): P {
    return getNewPos(arrowToDir(dir), p);
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

    getNewDir(turnDir: TURN) {
        return getNewDir(this.d, turnDir)
    }

    getNextPos(dir: DIR = this.d): P {
        return getNewPos(dir, this.p);
    }

    getNextVal(dir: DIR = this.d): ELTYPE | undefined {
        return this.get(this.getNextPos(dir));
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
