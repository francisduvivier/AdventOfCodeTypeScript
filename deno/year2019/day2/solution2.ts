// Input
import {IntcodeRunner} from "../intcode/IntcodeRunner.ts";

import {logAndPushSolution} from "../util/SolutionHandler.ts";
import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import {inputProgram} from "./input.ts";

export const solutions: number[] = [];
// Part 1
const part1Result = IntcodeRunner.runIntCodeProgram([...inputProgram], 12, 2);
logAndPushSolution(part1Result, solutions);

// Part 2
let part2Result: any = undefined;
for (let noun = 0; noun < 100 && part2Result === undefined; noun++) {
    for (let verb = 0; verb < 100 && part2Result === undefined; verb++) {
        if (IntcodeRunner.runIntCodeProgram([...inputProgram], noun, verb) === 19690720) {
            part2Result = 100 * noun + verb;
        }
    }
}
logAndPushSolution(part2Result!, solutions);

assertEquals(solutions, [3790645, 6577]);
