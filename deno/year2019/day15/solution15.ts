import { IntcodeRunner } from "../intcode/IntcodeRunner.ts";
import { IOHandler } from "../day11/solution11.ts";
import { BLOCK, P, SPACE } from "../util/Grid.ts";
import { logAndPushSolution } from "../util/SolutionHandler.ts";
import { input } from "./input.ts";
import { DIR, DIRS, getNewPos, GridRobot } from "../util/GridRobot.ts";

SPACE;
const BALL = '\u25CF\u25CF';
const ROBOT_ID = 2;

enum EL {
    BLOCK,
    WALL,
    ROBOT,
    EMPTY,
    OXYGEN,
    OTHER
}

const showGame = (el: any) => {
    switch (el) {
        case EL.BLOCK:
            return BLOCK;
        case EL.WALL:
            return '##';
        case EL.ROBOT:
            return BALL;
        case EL.EMPTY:
            return SPACE;
        case EL.OXYGEN:
            return 'OO';
        case EL.OTHER:
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

    SHOWGAME: boolean
        = false;
    // = true;
    // = DEBUG;
    public lastOutput: number = -1;
    nbInputs = 0;
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
        for (let dir of DIRS) {
            let painted = this.robot.getNextVal(dir);
            if (painted == undefined || painted == UNEXPLORED && !badStates.has(this.robot.posToKeyWDir(dir))) {
                unExplored.add(this.robot.posToKeyWDir(dir));
                this.robot.paintNextDir(UNEXPLORED, dir);
                optionsLeft.push(dir)
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
        console.log(this.robot.asImage(showGame));
        console.log('');
    }
}


enum JOYPOS {
    N = 1,
    S = 2,
    W = 3,
    E = 4,
}

export function windToDir(windDir: JOYPOS): DIR {
    switch (windDir) {
        case JOYPOS.N:
            return DIR.UP;
        case JOYPOS.S:
            return DIR.DOWN;
        case JOYPOS.W:
            return DIR.LEFT;
        case JOYPOS.E:
            return DIR.RIGHT;
    }
}

export function dirWind(dir: DIR): JOYPOS {
    switch (dir) {
        case DIR.UP:
            return JOYPOS.N;
        case DIR.DOWN:
            return JOYPOS.S;
        case DIR.LEFT:
            return JOYPOS.W;
        case DIR.RIGHT:
            return JOYPOS.E;
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
        ar.showGame();
        grid.forEach((p: P) => {
            if (grid.get(p) == EL.OXYGEN) {
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