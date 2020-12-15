import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { rInput, tInput } from "./input.ts";
import { logAndPushSolution } from "../../year2019/util/SolutionHandler.ts";

function part1(input: string[]) {
    const options = input[1].split(',').filter(val => val !== 'x').map(Number);
    const myStart = Number(input[0]);
    let min = options[0];
    for (const option of options) {
        console.log(option);
        if (myStart % option > myStart % min) {
            min = option;
        }

    }
    console.log(min, myStart, min * (myStart % min));
    return min * (min - myStart % min);
}

function part2(input: string[]) {
    return 0;
}


// const input = tInput;

assertEquals(part1(tInput), 295);
const sols = [];
logAndPushSolution(part1(rInput), sols);
assertEquals(sols[0], 4808);
assertEquals(part2(tInput), 286);
logAndPushSolution(part2(rInput), sols);
assertEquals(sols[1], -1); // TODO


