import {IOHandler} from "../day11/solution11";
import {ARROW, arrowToDir, DIR, getNewPos, GridRobot, TURN} from "../util/GridRobot";
import {IntcodeRunner} from "../intcode/IntcodeRunner";
import {input} from "./input";
import {cpP, P} from "../util/Grid";
import {logAndPushSolution} from "../util/SolutionHandler";
import {allTruthy, sum} from "../util/MapReduce";
import * as assert from "assert";

// const BAD_STATE = 'bad state';
// const badStates = new Set<string>();
const unExplored = new Set<string>();

class Arcade implements IOHandler {
    outputNb = 0;
    col = 0;
    row = 0;
    status = 0;
    SHOWGAME: boolean
        = false;
    // = true;
    // = DEBUG;
    public lastOutput: number = -1;
    nbInputs = 0;
    DELAY
        = false;
    outputStr = '';
    intersects: number[] = [];
    finalOutput: number = -1;
    painter = new GridRobot<string>()
    // = true;
    private lastShow: number = Date.now();

    constructor(public robot: GridRobot<string>) {
        this.painter.d = DIR.RIGHT
    }

    doOutput(output: number): void {
        unExplored.delete(this.robot.posToKeyWDir(this.robot.d));
        this.lastOutput = output;
        switch (output) {
            case 35:
                this.painter.paint('#');
                this.painter.move();
                this.outputStr += '#';
                break;
            case 46:
                this.painter.paint('.');
                this.painter.move();
                this.outputStr += '.';
                break;
            case 10:
                this.painter.p = P(this.painter.p.row + 1, 0);
                this.outputStr += '\n';
                break;
            default:
                if (output > 2 ** 7) {
                    console.log('final output', output);
                    this.finalOutput = output;
                } else {
                    let char = String.fromCharCode(output);
                    this.robot.p = cpP(this.painter.p);
                    this.robot.d = arrowToDir(char as ARROW);
                    this.painter.paint('#');
                    this.painter.move();
                    this.outputStr += '#';
                }
                console.log('got output' + output);
                break;
        }
        this.SHOWGAME && this.showGame();
        this.outputNb++;
    }

    getInput(): number {
        this.nbInputs++;

        if (this.SHOWGAME) {
            if (Date.now() - this.lastShow > 200) {
                this.showGame();
                this.lastShow = Date.now();
            }
        }
        return 0;
    }

    showGame() {
        console.clear();
        console.log(this.painter.asImage((el?: string) => el || '-'));
        // console.log(this.outputStr);
        console.log('');
    }
}

export const solutions = [];

export function part1() {
    let robot = new GridRobot<string>();
    let arcade = new Arcade(robot);
    // arcade.SHOWGAME = true;
    const intcode = new IntcodeRunner([...input], [], arcade);
    intcode.run();
    const intersects: number[] = [];
    const intersectPoints: P[] = [];
    arcade.painter.forEach(p => {
        if (arcade.painter.get(p) == '#' && allTruthy([DIR.RIGHT, DIR.LEFT, DIR.DOWN, DIR.UP].map(d => {
                return arcade.painter.get(getNewPos(d, p)) == '#'
            })
        )) {
            intersects.push(p.row * p.col);
            intersectPoints.push(P(p.row, p.col))
        }
    });
    // arcade.showGame();
    // console.log(arcade.outputStr)
    return sum(intersects);
}

logAndPushSolution(part1(), solutions);
assert.deepEqual(solutions[0], 5972);

export enum MCHAR {
    A = 'A', B = 'B', C = 'C', N = '\n', S = ','
}

export enum MCOD {
    A = toCharCode(MCHAR.A), B = toCharCode(MCHAR.B), C = toCharCode(MCHAR.C), N = toCharCode(MCHAR.N), S = toCharCode(MCHAR.S)
}

export enum TD {
    L = TURN.LEFT, R = TURN.RIGHT
}

export enum VIDCOD {
    Y = toCharCode('y'), N = toCharCode('n')
}

function tdToa(td: TD) {
    return td == TD.L ? 'L' : 'R'
}

assert.deepEqual(tdToa(TD.L), 'L')
assert.deepEqual(tdToa(TURN.LEFT as any), 'L')
assert.deepEqual(tdToa(TURN.RIGHT as any), 'R')

function toCharCode(char: string): number {
    return char.charCodeAt(0)
}

assert.deepEqual(toCharCode('\n'), 10);
assert.deepEqual(toCharCode('^'), 94);


export function getFullProgramRobot(arcade: Arcade) {
    // arcade.painter.
    return undefined;
}

function part2() {
    let robot = new GridRobot<string>();
    let arcade = new Arcade(robot);
    arcade.SHOWGAME = true;
    let inputProg = [...input];
    inputProg[0] = 1;
    const intcode = new IntcodeRunner(inputProg, [], arcade);
    intcode.run();
    return arcade.finalOutput;
}

logAndPushSolution(part2(), solutions);