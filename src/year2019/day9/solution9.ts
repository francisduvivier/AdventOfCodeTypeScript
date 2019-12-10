import {input, testInput1, testInput2, testInput3} from "./input";
import {IntcodeRunner} from "../intcode/IntcodeRunner";
import * as assert from "assert";
import {logAndPushSolution} from "../util/SolutionHandler";
import {hasNbDigits} from "../util/Math";

const firstInput = 1;
let intcodeRunner = new IntcodeRunner([...testInput1], [firstInput]);
intcodeRunner.run();
assert.deepEqual(intcodeRunner.getAllOutput().slice(0, testInput1.length), testInput1);

intcodeRunner = new IntcodeRunner(testInput2, [firstInput]);
intcodeRunner.run();
const output = intcodeRunner.getOutput();

assert.deepEqual(hasNbDigits(output, 16), true);
intcodeRunner = new IntcodeRunner(testInput3, [firstInput]);
intcodeRunner.run();
assert.deepEqual(intcodeRunner.getOutput(), 1125899906842624);

export const solutions: number[] = [];

// Part 1
intcodeRunner = new IntcodeRunner(input, [firstInput]);
intcodeRunner.run();
logAndPushSolution(intcodeRunner.getOutput(), solutions);

// Part 2
intcodeRunner = new IntcodeRunner(input, [2]);
intcodeRunner.run();
logAndPushSolution(intcodeRunner.getOutput(), solutions);