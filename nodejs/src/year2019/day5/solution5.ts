import {IntcodeRunner} from "../intcode/IntcodeRunner";
import {logAndPushSolution} from "../util/SolutionHandler";
import * as assert from "assert";
import {input} from "./input";

let intcodeRunner = new IntcodeRunner([...input]);

export const solutions: number[] = [];
// Part 1
const AIR_CONDITIONER_ID = 1;

intcodeRunner.queueInput(AIR_CONDITIONER_ID);
intcodeRunner.run();
logAndPushSolution(intcodeRunner.getOutput(), solutions);

// Part 2
intcodeRunner = new IntcodeRunner([...input]);
const RADIATOR_CONTROLLER_ID = 5;
intcodeRunner.queueInput(RADIATOR_CONTROLLER_ID);
intcodeRunner.run();
logAndPushSolution(intcodeRunner.getOutput(), solutions);

assert.deepEqual(solutions, [16348437, 6959377]);
