import { IntcodeRunner } from "../intcode/IntcodeRunner.ts";
import { GridRobot, TURN } from "../util/GridRobot.ts";
import { input } from "./input.ts";
import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { logAndPushSolution } from "../util/SolutionHandler.ts";

export interface IOHandler {
    getInput(): number;

    doOutput(output: number): void;
}

const enum COLOR {
    BLACK,
    WHITE
}

class RobotIOHandler implements IOHandler {
    nbPainted = 0;
    private readonly robot: GridRobot<COLOR>;
    private shouldPaint = true;

    constructor(robot: GridRobot<COLOR>) {
        this.robot = robot;
    }

    getInput(): number {
        return this.robot.val || COLOR.BLACK;
    };

    static readonly TURNMAP = [TURN.LEFT, TURN.RIGHT, TURN.NOTURN];

    doOutput(output: number): void {
        if (this.shouldPaint) {
            if (this.robot.val == undefined) {
                this.nbPainted++;
            }
            this.robot.paint(output);
        } else {
            this.robot.turn(RobotIOHandler.TURNMAP[output]);
            this.robot.move();
        }
        this.shouldPaint = !this.shouldPaint;
    };
}

export const solutions: number[] = [];

function runPart1() {
    const robot = new GridRobot<COLOR>();
    const ioHandler = new RobotIOHandler(robot);
    new IntcodeRunner(input, [], ioHandler).run();
    return ioHandler.nbPainted;
}

// Part 1
logAndPushSolution(runPart1(), solutions, 11);

// Part 2
const robot2 = new GridRobot<COLOR>();
const ioHandler2 = new RobotIOHandler(robot2);
robot2.paint(COLOR.WHITE);
new IntcodeRunner(input, [], ioHandler2).run();
logAndPushSolution(ioHandler2.nbPainted, solutions);
console.log(robot2.asImage());

assertEquals(solutions, [2211, 248]);
