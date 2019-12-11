import {IntcodeRunner} from "../intcode/IntcodeRunner";
import {GridRobot} from "../util/GridRobot";
import {input} from "./input";
import {logAndPushSolution} from "../util/SolutionHandler";

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

    doOutput(output: number): void {
        if (this.shouldPaint) {
            if (this.robot.val == undefined) {
                this.nbPainted++;
            }
            this.robot.paint(output);
        } else {
            this.robot.turn(output);
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
