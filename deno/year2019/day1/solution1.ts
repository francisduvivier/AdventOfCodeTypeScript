// Input
import { logAndPushSolution } from "../util/SolutionHandler.ts";
import { sum } from "../util/MapReduce.ts";
import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { masses } from "./input.ts";

export const solutions: (number | string)[] = [];
// Part 1
const calcFuel = (mass: number) => Math.floor(mass / 3) - 2;
logAndPushSolution(sum(masses.map(calcFuel)), solutions);

// Part 2
function calcFuelRec(mass: number): number {
    let first = calcFuel(mass);
    if (first <= 0) {
        return 0;
    }
    return first + calcFuelRec(first);
}

logAndPushSolution(sum(masses.map(calcFuelRec)), solutions);

assertEquals(solutions, [3198599, 4795042]);
