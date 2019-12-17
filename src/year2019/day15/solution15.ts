import {IntcodeRunner} from "../intcode/IntcodeRunner";
import {IOHandler} from "../day11/solution11";
import {BLOCK, P, SPACE} from "../util/Grid";
import {logAndPushSolution} from "../util/SolutionHandler";
import {input} from "./input";
import {DIR, getNewPos, GridRobot} from "../util/GridRobot";

SPACE;
const BALL = '\u25CF\u25CF';
BALL;
const ROBOT_ID = 2;
const showGame = (el: any) => {
    switch (el) {
        case 0:
            return BLOCK;
        case 1:
            return '##';
        case ROBOT_ID:
            return BALL;
        case 3:
            return SPACE;
        case 4:
            return 'OO';
        case 5:
            return '**';

    }
    return '--'
};

const BAD_STATE = 'bad state';
const badStates = new Set<string>();
const unExplored = new Set<string>();
let oxygenPos: P | undefined = undefined;
// const DEBUG = true;
const DEBUG = false;

const UNEXPLORED = 1;

class Arcade implements IOHandler {
    outputNb = 0;
    col = 0;
    row = 0;
    status = 0;
    SHOWGAME: boolean
        // = false;
        = true;
    // = DEBUG;
    public lastOutput: number = -1;
    nbInputs = 0;
    DELAY
        = false;

    // = true;
    private lastShow: number = Date.now();

    constructor(public robot: GridRobot<unknown>) {
        this.robot.paint(2);
        unExplored.add(this.robot.posToKeyWDir(this.robot.d));
    }

    doOutput(output: number): void {
        if (this.robot.getNbElem(UNEXPLORED) == 0) {
            throw 'ALL EXPLORED';
        }
        unExplored.delete(this.robot.posToKeyWDir(this.robot.d));
        this.lastOutput = output;
        switch (output) {
            case 0:
                this.robot.paintNext(0);
                badStates.add(this.robot.posToKeyWDir(this.robot.d));
                DEBUG && console.log('painting brick');
                break;
            case 1:
                if (oxygenPos != this.robot.p) {
                    this.robot.paint(3);
                }
                this.robot.move(1);
                this.robot.paint(ROBOT_ID);
                break;
            case 2:
                this.robot.move(1);
                this.robot.paint(4);
                oxygenPos = this.robot.p;
                // console.log(this.robot.asImage(showGame));
                // throw 'found +' + JSON.stringify(this.robot.p)
                break;
        }

        this.outputNb++;
    }

    getInput(): number {
        this.nbInputs++;

        if (this.SHOWGAME) {
            if (Date.now() - this.lastShow > 60) {
                this.showGame();
                this.lastShow = Date.now();
            }
        }
        const optionsLeft: DIR[] = [];
        for (let i = 0; i < 4; i++) {
            let painted = this.robot.get(getNewPos(i, this.robot.p));
            if (painted == undefined || painted == UNEXPLORED && !badStates.has(this.robot.posToKeyWDir(i))) {
                unExplored.add(this.robot.posToKeyWDir(i));
                this.robot.paintNextDir(UNEXPLORED, i);
                optionsLeft.push(i)
            }
        }
        if (optionsLeft.length == 0) {
            for (let i = 0; i < 4; i++) {
                if (!badStates.has(this.robot.posToKeyWDir(i))) {
                    optionsLeft.push(i)
                }
            }
        } else {
        }
        if (optionsLeft.length == 0) {
            console.log('unexpected' + BAD_STATE);
            throw BAD_STATE;
        }
        let dir = optionsLeft[Math.floor(Math.random() * optionsLeft.length)];
        DEBUG && console.log('returning ' + dirWind(dir));
        this.robot.d = dir;
        return dirWind(dir);
    }

    showGame() {
        // console.clear();
        console.log(this.robot.asImage(showGame));
        console.log('');
        if (this.DELAY) {
            var waitTill = new Date(new Date().getTime() + 60);
            while (waitTill > new Date()) {
            }
        }
    }
}

const N = 1;
const S = 2;
const W = 3;
const E = 4;
type JOYPOS = 1 | 2 | 3 | 4;

export function windToDir(windDir: JOYPOS): DIR {
    switch (windDir) {
        case N:
            return DIR.UP;
        case S:
            return DIR.DOWN;
        case W:
            return DIR.LEFT;
        case E:
            return DIR.RIGHT;
    }
}

export function dirWind(dir: DIR): JOYPOS {
    switch (dir) {
        case DIR.UP:
            return N;
        case DIR.DOWN:
            return S;
        case DIR.LEFT:
            return W;
        case DIR.RIGHT:
            return E;
    }
}


const solutions: number[] = [];

export function part1() {
    let bestMoves = Infinity;
    while (true) {
        const grid = new GridRobot<number>();
        const ar = new Arcade(grid);
        const ir = new IntcodeRunner([...input], [], ar);
        try {
            ir.run();
        } catch (e) {
            if (e == BAD_STATE) {
                // console.log(e);
                continue;
            }
            if (ar.nbInputs < bestMoves) {
                bestMoves = grid.nbMoves;
                logAndPushSolution(bestMoves, solutions);
            }
        }
    }

}

// part1();


function part2() {
    const grid = new GridRobot<number>();
    const ar = new Arcade(grid);
    const ir = new IntcodeRunner([...input], [], ar);
    try {
        ir.run();
    } catch (e) {
        console.error(e);
        console.log('oxygenPos', oxygenPos);
    }
    let minutes = 0;
    const EMPTY = 3;
    grid.paint(EMPTY);
    while (grid.getNbElem(EMPTY) > 0) {
        ar.DELAY = true;
        ar.showGame();
        grid.forEach((p: P) => {
            if (grid.get(p) == 4) {
                grid.set(p, 5);
                for (let i = 0; i < 4; i++) {
                    const adjacent = getNewPos(i, p);
                    if (grid.get(adjacent) == EMPTY) {
                        grid.set(adjacent, 7)
                    }
                }
            }
        });
        grid.forEach((p: P) => {
            if (grid.get(p) == 7) {
                grid.set(p, 4)
            }
        });
        minutes++;
    }
    console.log('minutes', minutes)
}

part2();