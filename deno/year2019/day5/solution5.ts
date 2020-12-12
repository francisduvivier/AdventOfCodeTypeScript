import {IntcodeRunner} from "../intcode/IntcodeRunner.ts";
import {logAndPushSolution} from "../util/SolutionHandler.ts";
import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import {input} from "./input.ts";

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

assertEquals(solutions, [16348437, 6959377]);
