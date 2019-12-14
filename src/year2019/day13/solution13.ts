import {IntcodeRunner} from "../intcode/IntcodeRunner";
import {IOHandler} from "../day11/solution11";
import {BLOCK, Grid, SPACE} from "../util/Grid";
import {logAndPushSolution} from "../util/SolutionHandler";
import * as assert from "assert";
import {input} from "./input";

const BALL = ' \u25CF';
const showGame = (el: any) => {
    switch (el) {
        case 0:
            return SPACE;
        case 1:
            return BLOCK;
        case 2:
            return '##';
        case 3:
            return ' -';
        case 4:
            return BALL;
    }
    return 'xx'
};

class Arcade implements IOHandler {
    outputNb = 0;
    nbBlock = 0;
    col = 0;
    row = 0;
    score = 0;

    ball = new ArcadePiece(0);
    pad = new ArcadePiece(0);
    useBallVel: boolean = false;
    SHOWGAME: boolean = false;

    constructor(public grid: Grid<unknown>) {

    }

    doOutput(output: number): void {

        switch (Number(this.outputNb)) {
            case 0:
                this.col = output;
                break;
            case 1:
                this.row = output;
                break;
            case 2:
                if (this.col == -1 && this.row == 0) {
                    this.score = output;
                } else {
                    if (this.grid.getRc(this.row, this.col) !== 2 && output == 2) {
                        this.nbBlock++;
                    }
                    if (output == 3) {
                        this.pad.col = this.col;
                    }
                    if (output == 4) {
                        this.ball.updateBall(this.col);
                        this.ball.col = this.col;
                    }
                    this.grid.setRc(this.row, this.col, output);
                }
                break;
        }
        this.outputNb++;
        this.outputNb = this.outputNb % 3;
    }

    getInput(): number {
        if (this.SHOWGAME) {
            this.showGame();
        }
        let newPos = this.ball.col;
        if (this.useBallVel) {
            newPos += this.ball.vel
        }
        this.pad.updateBall(newPos);
        return this.pad.vel;
    }

    private showGame() {
        console.clear();
        console.log(this.grid.asImage(showGame));
        console.log('');
        var waitTill = new Date(new Date().getTime() + 1 / 24 * 1000);
        while (waitTill > new Date()) {
        }
    }
}

type JOYPOS = -1 | 0 | 1;

class ArcadePiece {
    col: number;
    vel: JOYPOS = 0;

    constructor(x: number) {
        this.col = x;
    }

    updateBall(otherCol: number) {
        const colSign = Math.sign(otherCol - this.col) as JOYPOS;
        this.vel = colSign;
    }
}

const solutions: number[] = []

function part1() {
    const grid = new Grid<number>();
    const ar = new Arcade(grid);
    const ir = new IntcodeRunner([...input], [], ar);
    ir.run();
    logAndPushSolution(ar.nbBlock, solutions);
}

part1();

export function part2() {
    const input2 = [2, ...input.slice(1)];
    const grid = new Grid<number>();
    const ar = new Arcade(grid);
    ar.SHOWGAME = true;
    const ir = new IntcodeRunner(input2, [], ar);
    ir.run();
    logAndPushSolution(ar.score, solutions);
}

part2();

assert.deepEqual(solutions, [268, 13989]);