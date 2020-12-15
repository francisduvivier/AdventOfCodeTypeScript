import { assert } from "https://deno.land/std@0.80.0/testing/asserts.ts";

const rInput = [1,20,8,12,0,14];
const tInput = [0, 3, 6];


function part1(input) {
    return calc_number(input, 2020 - 1);
}

function part2(input) {
    return calc_number(input, 30000000 - 1);
}

function calc_number(input: number[], index: number) {
    input = [...input];
    const startLen = input.length;
    const lastIndexMap = {};
    let prevNumber = input.pop() as number;
    for (let i = 0, n = input[i]; i < input.length; ++i, n = input[i]) {
        lastIndexMap[n] = i;
    }
    console.log(lastIndexMap, prevNumber);
    for (let i = startLen - 1; i < index; i++) {
        let newNumber = 0;
        if (lastIndexMap[prevNumber] !== undefined)
            newNumber = i - lastIndexMap[prevNumber];
        // console.log(i, prevNumber, newNumber, lastIndexMap);
        lastIndexMap[prevNumber] = i;
        prevNumber = newNumber;
    }

    // console.log(lastIndexMap);
    console.log(prevNumber);
    return prevNumber;

}

const part1_t = part1(tInput);
console.log(['part1 test', (part1_t)]);
assert(part1_t == 436);
const part1_r = part1(rInput);
console.log(['part1 real', part1_r]);
const part2_r = part2(rInput);
console.log(['part2 real', part2_r]);
assert(part2([0, 3, 6]) == 175594);
assert(part2([3, 2, 1]) == 18);
assert(part2([3, 1, 2]) == 362);
assert(part2([1, 3, 2]) == 2578);
assert(part2([1, 2, 3]) == 261214);
assert(part2([2, 1, 3]) == 3544142);
assert(part2([2, 3, 1]) == 6895259);

