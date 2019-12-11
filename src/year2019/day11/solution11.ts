import {IntcodeRunner} from "../intcode/IntcodeRunner";
import {input} from "./input";
import * as assert from "assert";
import {logAndPushSolution} from "../util/SolutionHandler";

export interface IOHandler {
    getInput(): number;

    doOutput(output: number): void;
}

const enum TURN {
    LEFT,
    RIGHT
}

export type P = { col: number; row: number };

const enum ABS_DIR {
    UP,
    LEFT,
    DOWN,
    RIGHT,
}

function getNewDir(currAbsDir: ABS_DIR, turnDir: TURN): ABS_DIR {
    return (currAbsDir + (turnDir == TURN.LEFT ? 1 : 3)) % 4;
}

assert.deepEqual(getNewDir(ABS_DIR.RIGHT, TURN.LEFT), ABS_DIR.UP);
assert.deepEqual(getNewDir(ABS_DIR.RIGHT, TURN.RIGHT), ABS_DIR.DOWN);
assert.deepEqual(getNewDir(ABS_DIR.UP, TURN.RIGHT), ABS_DIR.RIGHT);
assert.deepEqual(getNewDir(ABS_DIR.UP, TURN.LEFT), ABS_DIR.LEFT);

function getNewPos(dir: ABS_DIR, p: P): P {
    switch (dir) {
        case ABS_DIR.DOWN:
            return {row: p.row + 1, col: p.col};
        case ABS_DIR.LEFT:
            return {row: p.row, col: p.col - 1};
        case ABS_DIR.RIGHT:
            return {row: p.row, col: p.col + 1};
        case ABS_DIR.UP:
            return {row: p.row - 1, col: p.col};
        default:
            throw 'invalid dir ' + dir
    }
}

assert.deepEqual(getNewPos(ABS_DIR.RIGHT, {row: 0, col: -1}), {row: 0, col: 0});
assert.deepEqual(getNewPos(ABS_DIR.DOWN, {row: 0, col: -1}), {row: 1, col: -1});
assert.deepEqual(getNewPos(ABS_DIR.UP, {row: 0, col: -1}), {row: -1, col: -1});
assert.deepEqual(getNewPos(ABS_DIR.LEFT, {row: 0, col: -1}), {row: 0, col: -2});

const enum COLOR {
    BLACK,
    WHITE
}

class Robot {
    nbPainted = 0;
    maxRow = 0;
    minRow = 0;
    maxCol = 0;
    minCol = 0;
    first = true;
    private p: P = {row: 0, col: 0};
    private dir: ABS_DIR = ABS_DIR.UP;
    private readonly grid: {
        [val: string]: { [val: string]: COLOR }
    } = {};

    turn(turnDir: TURN) {
        this.dir = getNewDir(this.dir, turnDir)
    }

    move() {
        this.p = getNewPos(this.dir, this.p);
        if (this.maxCol < this.p.col) {
            this.maxCol = this.p.col;
        }
        if (this.minCol > this.p.col) {
            this.minCol = this.p.col;
        }
        if (this.maxRow < this.p.row) {
            this.maxRow = this.p.row;
        }
        if (this.minRow > this.p.row) {
            this.minRow = this.p.row;
        }
    }

    read(row = this.p.row, col = this.p.col) {
        return (this.grid[row] && this.grid[row][col] !== undefined) ? this.grid[row][col] : COLOR.BLACK;
    }

    paint(output: COLOR) {
        if (!this.grid[this.p.row]) {
            this.grid[this.p.row] = {}
        }
        if (this.grid[this.p.row][this.p.col] === undefined) {
            this.nbPainted++;
        }
        this.grid[this.p.row][this.p.col] = output;
    }

    showGrid() {
        const rowStrings: string[] = [];
        for (let row = this.minRow; row < this.maxRow + 1; row++) {
            rowStrings[row - this.minRow] = '';
            for (let col = this.minCol; col < this.maxCol + 1; col++) {
                rowStrings[row - this.minRow] += this.read(row, col) == COLOR.BLACK ? ' ' : '\u25A0'
            }
        }
        return rowStrings.join('\n') + '\n';
    }
}

class RobotIOHandler implements IOHandler {
    private readonly robot: Robot;
    private shouldPaint = true;

    constructor(robot: Robot) {
        this.robot = robot;
    }

    getInput(): number {
        return this.robot.read();
    };

    doOutput(output: number): void {
        if (this.shouldPaint) {
            this.robot.paint(output)
        } else {
            this.robot.turn(output);
            this.robot.move();
        }
        this.shouldPaint = !this.shouldPaint;
    };
}

const solutions: number[] = [];

function runPart1() {
    const robot = new Robot();
    const ioHandler = new RobotIOHandler(robot);
    new IntcodeRunner(input, [], ioHandler).run();
    return robot.nbPainted;
}

// Part 1
logAndPushSolution(runPart1(), solutions);

// Part 2
const robot2 = new Robot();
const ioHandler2 = new RobotIOHandler(robot2);
robot2.paint(COLOR.WHITE);
new IntcodeRunner(input, [], ioHandler2).run();
logAndPushSolution(robot2.nbPainted, solutions);
console.log(robot2.showGrid());
