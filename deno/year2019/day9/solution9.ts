import {input, testInput1, testInput2, testInput3} from "./input.ts";
import {IntcodeRunner} from "../intcode/IntcodeRunner.ts";
import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import {logAndPushSolution} from "../util/SolutionHandler.ts";
import {hasNbDigits} from "../util/Math.ts";

const firstInput = 1;
let intcodeRunner = new IntcodeRunner([...testInput1], [firstInput]);
intcodeRunner.run();
assertEquals(intcodeRunner.getAllOutput().slice(0, testInput1.length), testInput1);

intcodeRunner = new IntcodeRunner(testInput2, [firstInput]);
intcodeRunner.run();
const output = intcodeRunner.getOutput();

assertEquals(hasNbDigits(output, 16), true);
intcodeRunner = new IntcodeRunner(testInput3, [firstInput]);
intcodeRunner.run();
assertEquals(intcodeRunner.getOutput(), 1125899906842624);

export const solutions: number[] = [];

// Part 1
intcodeRunner = new IntcodeRunner(input, [firstInput]);
intcodeRunner.run();
logAndPushSolution(intcodeRunner.getOutput(), solutions);

// Part 2
intcodeRunner = new IntcodeRunner(input, [2]);
intcodeRunner.run();
logAndPushSolution(intcodeRunner.getOutput(), solutions);
assertEquals(solutions, [3497884671, 46470]);
