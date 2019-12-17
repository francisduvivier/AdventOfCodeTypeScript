import {IOHandler} from "../day11/solution11";
import {ARROW, arrowToDir, DIR, getNewDir, getNewPos, GridRobot, isArrow, TURN} from "../util/GridRobot";
import {IntcodeRunner} from "../intcode/IntcodeRunner";
import {input} from "./input";
import {cpP, P} from "../util/Grid";
import {logAndPushSolution} from "../util/SolutionHandler";
import {allTruthy, sum} from "../util/MapReduce";
import * as assert from "assert";

// const BAD_STATE = 'bad state';
// const badStates = new Set<string>();
const unExplored = new Set<string>();

const SCAFF = '#';

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
    painter = new GridRobot<string>();
    // = true;
    private lastShow: number = 0;
    private lastOutput2: number = 0;

    constructor(public robot: GridRobot<string>) {
        this.painter.d = DIR.RIGHT
    }

    doOutput(output: number): void {
        unExplored.delete(this.robot.posToKeyWDir(this.robot.d));
        if ((output == 46 || output == 35 || isArrow(String.fromCharCode(output))) && this.lastOutput == 10 && this.lastOutput2 == 10) {
            this.painter.clear();
        }
        this.lastOutput2 = this.lastOutput;
        this.lastOutput = output;
        switch (output) {

            case 35:
                this.painter.paint(SCAFF);
                this.painter.move();
                this.outputStr += SCAFF;
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
                    this.painter.paint(char);
                    if (isArrow(char)) {
                        this.robot.d = arrowToDir(char as ARROW);
                        this.robot.p = cpP(this.painter.p);
                    }
                    this.painter.move();
                    this.outputStr += SCAFF;
                }
                break;
        }
        this.maybeShow();
        this.outputNb++;
    }

    getInput(): number {
        this.nbInputs++;
        this.maybeShow();
        return 0;
    }

    showGame() {
        console.clear();
        console.log(this.painter.asImage((el?: string) => el || '-'));
        // console.log(this.outputStr);
        console.log('');
    }

    private maybeShow() {
        if (this.SHOWGAME) {
            if (Date.now() - this.lastShow > 200) {
                this.showGame();
                this.lastShow = Date.now();
            }
        }
    }
}

export const solutions = [];

function runGridPainter() {
    let robot = new GridRobot<string>();
    let arcade = new Arcade(robot);
    // arcade.SHOWGAME = true;
    const intcode = new IntcodeRunner([...input], [], arcade);
    intcode.run();
    return arcade;
}

export function part1() {
    let arcade = runGridPainter();
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

assert.deepEqual(tdToa(TD.L), 'L');
assert.deepEqual(tdToa(TURN.LEFT as any), 'L');
assert.deepEqual(tdToa(TURN.RIGHT as any), 'R');

function toCharCode(char: string): number {
    return char.charCodeAt(0)
}

assert.deepEqual(toCharCode('\n'), 10);
assert.deepEqual(toCharCode('^'), 94);


function getNextTurnDir(robot: GridRobot<string>, painter: GridRobot<string>): TURN {
    const possible: TURN[] = [];
    for (let turnDir of [TURN.NOTURN, TURN.RIGHT, TURN.LEFT]) {
        const adjacent = getNewPos(getNewDir(robot.d, turnDir), robot.p);
        if (painter.get(adjacent) == SCAFF) {
            possible.push(turnDir);
        }
    }
    return possible[0];
}

function toLetter(t: TURN.LEFT | TURN.RIGHT): string {
    return t == TURN.LEFT ? 'L' : 'R';
}

export function getIntCodeInputs(arcade: Arcade): (string | number)[] {
    const painter = arcade.painter;
    const robot = arcade.robot;
    let nextTurn = getNextTurnDir(robot, painter);
    let prog: (string | number)[] = [];
    while (nextTurn !== undefined) {
        if (nextTurn == TURN.NOTURN) {
            robot.move();
        } else {
            robot.turn(nextTurn);
        }
        if (nextTurn == TURN.NOTURN) {
            if (prog.length && typeof prog[prog.length - 1] == "number") {
                (prog[prog.length - 1] as number) += 1
            } else {
                prog.push(1)
            }
        } else {
            prog.push(toLetter(nextTurn))
        }

        nextTurn = getNextTurnDir(robot, painter);
    }
    console.log('prog', prog);
    return prog;
}

const testString = ',sldfj,sdfa,24,';
assert.deepEqual(testString.replace(/(^,|,$)/g, ''), 'sldfj,sdfa,24');
assert.deepEqual(testString.slice(0, testString.length - 1), ',sldfj,sdfa,24');

function movesToProgram(moves: (string | number)[]) {
    let A = `R,8,L,12,R,8`;
    let B = `L,10,L,10,R,8`;
    let C = `L,12,L,12,L,10,R,10`;
    const prog = `A,A,B,C,B,C,B,A,C,A\n${A}\n${B}\n${C}\ny\n`
    return prog;
}

function part2() {
    const mode1Arcade = runGridPainter();
    // mode1Arcade.showGame();
    let moves = getIntCodeInputs(mode1Arcade);
    const programInput = movesToProgram(moves);
    let robot = new GridRobot<string>();
    let arcade = new Arcade(robot);
    arcade.SHOWGAME = true;
    let inputProg = [...input];
    inputProg[0] = 2;
    const intcode = new IntcodeRunner(inputProg, [...programInput].map(toCharCode), arcade);
    intcode.run();
    arcade.showGame();

    return arcade.finalOutput;
}

logAndPushSolution(part2(), solutions);