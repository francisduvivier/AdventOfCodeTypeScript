import { logAndPushSolution } from "../../year2019/util/SolutionHandler.ts";
import { rInput } from "./input.ts";

interface InstructionData {
    code: keyof AssemblyRunner["instructionMap"]
    args: number[]
}

class AssemblyRunner {
    private mem = [];
    private instructionPointer = 0;
    private pointerHistory: number[] = [];
    private readonly program: InstructionData[]
    private readonly accumulator: Accumulator;
    readonly instructionMap = {
        'nop': () => {
        },
        'jmp': (args) => {
            this.instructionPointer += args[0] - 1
        },
        'acc': (args) => {
            this.accumulator.doAcc(args[0])
        }
    }

    constructor(lines, accumulator: Accumulator) {
        this.accumulator = accumulator;
        this.program = lines.map(line => line.split(' ')).map(duo => ({
            code: duo[0],
            args: duo.slice(1).map(Number)
        }) as InstructionData);
    }

    run(): number {
        while (this.pointerHistory.indexOf(this.instructionPointer) == -1 && this.instructionPointer < this.program.length) {
            this.pointerHistory.push(this.instructionPointer)
            const instruction = this.program[this.instructionPointer]
            this.instructionMap[instruction.code](instruction.args);
            this.instructionPointer++;
        }
        if (this.instructionPointer < this.program.length) {
            return -1;
        }
        return 1;
    }
}

let intcodeRunner: AssemblyRunner;

// Part 1

class Accumulator {
    public count = 0;

    doAcc(output: number): void {
        this.count += Number(output)
    }
}

const solutionArray = [];
let accumulator = new Accumulator();
//Part 1
intcodeRunner = new AssemblyRunner(rInput.split(/\n/), accumulator);
intcodeRunner.run();
logAndPushSolution(accumulator.count, solutionArray);

//Part 2
let input = rInput.split(/\n/);

const mutations = input.map((v, i) => i).filter(i => input[i].match(/nop|jmp/)).map((switchI) => {
    const copy = [...input];
    const orig = copy[switchI];
    copy[switchI] = orig.replace('nop', 'jmp')
    if (orig == copy[switchI]) {
        copy[switchI] = orig.replace('jmp', 'nop')
    }
    return copy;
})
for (const mutation of mutations) {
    accumulator.count = 0;
    intcodeRunner = new AssemblyRunner(mutation, accumulator);
    let result = intcodeRunner.run();
    if (result != -1) {
        logAndPushSolution(accumulator.count, solutionArray);
        break;
    }
}
