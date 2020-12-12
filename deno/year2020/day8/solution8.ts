import { logAndPushSolution } from "../../year2019/util/SolutionHandler.ts";
import { rInput } from "./input.ts";
let intcodeRunner: IntcodeRunner;

// Part 1

class Accumulator implements IOHandler {
    public count = 0;

    doOutput(output: number | string): void {
        this.count += Number(output)
    }

    getInput(): number {
        return 0;
    }
}

const solutionArray = [];
let accumulator = new Accumulator();
//Part 1
intcodeRunner = new IntcodeRunner(rInput.split(/\n/), [], accumulator);
intcodeRunner.run();
logAndPushSolution(accumulator.count, solutionArray);

//Part 2
let input = rInput.split(/\n/);

const mutations = input.map((v, i) => i).filter(i => input[i].match(/nop|jmp/)).map((switchI) => {
    const copy = [...input];
    const orig = copy[switchI];
    copy[switchI] = orig.replace('nop', 'jmp')
    if (orig == copy[switchI]) {
        copy[switchI]= orig.replace('jmp', 'nop')
    }
    return copy
})
for (const mutation of mutations) {
    accumulator.count = 0;
    intcodeRunner = new IntcodeRunner(mutation, [], accumulator);
    let result = intcodeRunner.run();
    if (result != -1) {
        logAndPushSolution(accumulator.count, solutionArray);
        break;
    }
}
