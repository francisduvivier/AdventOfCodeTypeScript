import { logAndPushSolution } from "../../year2019/util/SolutionHandler.ts";
import { rInput } from "./input.ts";

const solutionArray = []

//Part 1

function part1() {
    const input = rInput;
    const joltDiffAmounts = [0, 0, 0, 0, 0]
    const sorted = rInput.sort((a, b) => a - b)
    let prev = 0;
    for (let i1 = 0; i1 < input.length; i1++) {
        let curr = input[i1];
        joltDiffAmounts[curr - prev]++;
        prev = curr;
    }
    const part1Sol = joltDiffAmounts[1] * (joltDiffAmounts[3] + 1)
    logAndPushSolution(part1Sol, solutionArray);
}

part1();

function part2() {
    // const input = tInput.sort((a, b) => a - b);
    const input = rInput.sort((a, b) => a - b);
    const sorted = input
    let prev = 0;
    const diffList = [] as number[];
    for (let i1 = 0; i1 < input.length; i1++) {
        let curr = sorted[i1];
        diffList.push(curr - prev);
        prev = curr;
    }
    console.log(diffList)
    diffList.push(3)
    const oneJoltDiffs = [0, 0, 0, 0, 0]
    let currOnes = 0;
    for (const diff of diffList) {
        if (diff == 1) {
            currOnes++;
        } else if (diff == 3) {
            oneJoltDiffs[currOnes]++;
            currOnes = 0;
        } else {
            throw 'invalid input:' + diff
        }
    }
    let currTotal = 1;

    console.log(oneJoltDiffs);
    for (let i = 0; i < oneJoltDiffs.length; i++) {
        currTotal *= calcCombinations(oneJoltDiffs[i], i);
    }
    logAndPushSolution(currTotal, solutionArray);
}

function calcCombinations(amount, index) {
    console.log('am i', amount, index)
    if (index <= 1 || amount == 0) {
        return 1
    } else if (index < 4) {
        return Math.pow(Math.pow(2, index - 1), amount)
    } else if (index == 4) {
        return Math.pow(Math.pow(2, index - 1) - 1, amount) || 1
    } else {
        throw 'invalid input';
    }
}

//Part 2
part2();
console.log('done')
