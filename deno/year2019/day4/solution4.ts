import {logAndPushSolution} from "../util/SolutionHandler.ts";
import {hasNbDigits} from "../util/Math.ts";
import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";

const inputStart = 240298;
const inputEnd = 784956;

// It is a six-digit number. -> DONE
// Two adjacent digits are the same (like 22 in 122345).
function hasAPair(candidate: string | number) {
    return !!String(candidate).match(/([0-9])\1/);
}

function digitsOnlyIncrease(candidate: number) {
    let numbers = [...String(candidate)].map(numberString => Number(numberString));
    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] > numbers[i + 1]) {
            return false;
        }
    }
    return true;
}

export const solutions: number[] = [];
// Part 1
let nbValid = 0;
// The value is within the range given in your puzzle input. -> DONE
for (let candidate = inputStart; candidate <= inputEnd; candidate++) {
    if (
        hasNbDigits(candidate, 6)
        && hasAPair(candidate)
        && digitsOnlyIncrease(candidate)
    ) {
        nbValid++;
    }
}
logAndPushSolution(nbValid, solutions);

// An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.
function hasAPairStrict(candidate: number) {
    return hasAPair((String(candidate)).replace(/([0-9])\1\1+/g, 'x'));

}

let nbValidPart2 = 0;

// The value is within the range given in your puzzle input. -> DONE
for (let candidate = inputStart; candidate <= inputEnd; candidate++) {
    if (
        hasNbDigits(candidate, 6)
        && hasAPairStrict(candidate)
        && digitsOnlyIncrease(candidate)
    ) {
        nbValidPart2++;
    }
}

logAndPushSolution(nbValidPart2, solutions);

assertEquals(solutions, [1150, 748]);
