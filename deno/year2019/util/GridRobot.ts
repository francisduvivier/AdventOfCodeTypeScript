import { runTests } from "./GridTest.ts";
import { cpP, Grid, P } from "./Grid.ts";

export enum TURN {
    LEFT = 90,
    RIGHT = -90,
    NOTURN = 0
}

export const DIR = {
    UP: { row: -1, col: 0 },
    DOWN: { row: 1, col: 0 },
    LEFT: { row: 0, col: -1 },
    RIGHT: { row: 0, col: 1 },
} as const;
export type DIRNAME = keyof typeof DIR;
export type DIR = typeof DIR[keyof typeof DIR];
export const DIRS = [DIR.UP, DIR.DOWN, DIR.LEFT, DIR.RIGHT] as const;
export const DIRROWCOLMAP: { [key: string]: { [key: string]: DIR } } = {
    '-1': { '0': DIR.UP },
    '1': { '0': DIR.DOWN },
    '0': { '1': DIR.RIGHT, '-1': DIR.LEFT }
};

export enum ARROW {
    UP = '^',
    LEFT = '<',
    DOWN = 'v',
    RIGHT = '>',
}

export const ARROWS: ARROW[] = Object.values(ARROW);
export const DIRNAMES: (keyof ARROW)[] = Object.keys(ARROW) as (keyof ARROW & string)[];

export function isArrow(d: string): d is ARROW {
    return ARROWS.indexOf(d as any) !== -1;
}

type WindDir = 'N' | 'S' | 'E' | 'W';

export function windToDir(windDir: WindDir): DIR {
    switch (windDir) {
        case 'N':
            return DIR.UP;
        case 'S':
            return DIR.DOWN;
        case 'W':
            return DIR.LEFT;
        case 'E':
            return DIR.RIGHT;
    }
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
            throw 'invalid dir ' + dir;
    }
}

export function getNewPosForArrow(dir: ARROW, p: P): P {
    return getNewPos(arrowToDir(dir), p);
}

export function getNewPos(dir: P, p: P): P {
    return P(p.row + dir.row, p.col + dir.col);
}

export function getNewDir(currAbsDir: P, degrees: number): DIR {
    return rotate(currAbsDir, degrees) as DIR;
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

    private _d: P = DIR.UP;

    get d(): P {
        return this._d;
    }

    set d(value: P) {
        this._d = value;
    }

    move(times = 1) {
        this.nbMoves++;
        for (let i = 0; i < times; i++) {
            this.p = getNewPos(this._d, this._p);
        }
    }

    moveWindDir(windDir: WindDir, times = 1) {
        this.nbMoves++;
        const dir = windToDir(windDir);
        for (let i = 0; i < times; i++) {
            this.p = getNewPos(dir, this._p);
        }
    }

    turn(t: TURN) {
        this._d = getNewDir(this._d, t);
    }

    paint(output: ELTYPE) {
        this.set(this.p, output);
    }

    paintNext(output: ELTYPE) {
        const newPos = getNewPos(this._d, this._p);
        this.set(newPos, output);
    }

    getNewDir(turnDir: TURN) {
        return getNewDir(this.d, turnDir);
    }

    getNextPos(dir: P = this.d): P {
        return getNewPos(dir, this.p);
    }

    getNextVal(dir: P = this.d): ELTYPE | undefined {
        return this.get(this.getNextPos(dir));
    }

    paintNextDir(output: ELTYPE, dir: P) {
        const newPos = getNewPos(dir, this._p);
        this.set(newPos, output);
    }

    posToKeyWDir(d: P): string {
        return JSON.stringify(this.p) + DIRS.indexOf(DIRROWCOLMAP[d.row][d.col]);
    }


    clear() {
        super.clear();
        this._p = P(0, 0);
    }

    rotateAroundOrigin(degrees) {
        this.p = rotate(this.p, degrees);
    }
}

export function rotate(point: P, degrees: number): P {
    degrees = degrees % 360;
    if (degrees == 0) {
        return cpP(point);
    }
    const y = -point.row;
    const x = point.col;
    const cos = Math.cos(degrees * Math.PI / 180);
    const sin = Math.round(Math.sin(degrees * Math.PI / 180));
    const newX = Math.round(cos * x - sin * y);
    const newY = Math.round(cos * y + sin * x);
    let newP = P(-newY + 0, newX + 0);
    if (DIRROWCOLMAP[newP.row]?.[newP.col]) {
        return DIRROWCOLMAP[newP.row][newP.col];
    }
    return newP;
}

runTests();
