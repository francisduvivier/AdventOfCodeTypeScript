const IMMEDIATE_MODE = 1;

function getArgs(mem: number[], addresses: number[], modesString: string) {
    const args = [];
    const modeLetters = [...modesString].reverse();
    for (let i = 0; i < addresses.length; i++) {
        if (modeLetters[i] === String(IMMEDIATE_MODE)) {
            args[i] = addresses[i]
        } else {
            args[i] = mem[addresses[i]]
        }
    }

    return args;
}

export class IntcodeRunner {
    constructor(private readonly mem: number[]) {
    }

    private readonly queuedInput: number[] = [];
    private readonly outputs: number[] = [];
    private lastNextPos: number = 0;


    getInput() {
        const input = this.queuedInput[0];
        this.queuedInput.splice(0, 1);
        return input;
    }

    getOutput() {
        const output = this.outputs[this.outputs.length - 1];
        this.outputs.length = 1;
        this.outputs[0] = output;
        return output;
    }

    getNextPos() {
        return this.lastNextPos;
    }

    doOutput(arg: number) {
        this.outputs.push(arg);
    }

    processOpCode(pos: number) {
        let instruct = `${this.mem[pos]}`;
        const opCode = Number(instruct.slice(instruct.length - 2));
        // console.log(`opCode [${opCode}] instruct [${instruct}]`);
        const modesString: string = instruct.slice(0, instruct.length - 2);
        let nbArgs = 0;
        let nextPos = 0;
        let operation: (addrss: number[], args: number[]) => void = () => {
        };
        let waitingForInput = false;
        switch (opCode) {
            case 1:
                nbArgs = 3;
                operation = (addrss, args) => {
                    this.mem[addrss[2]] = args[0] + args[1];
                };
                break;
            case 2:
                nbArgs = 3;
                operation = (addrss, args) => {
                    this.mem[addrss[2]] = args[0] * args[1];
                };
                break;
            case 3:
                nbArgs = 1;
                operation = (addrss) => {
                    let input = this.getInput();
                    if (input === undefined) {
                        waitingForInput = true;
                    } else {
                        this.mem[addrss[0]] = input;
                    }
                };
                break;
            case 4:
                nbArgs = 1;
                operation = (addrss, args) => {
                    this.doOutput(args[0]);
                };
                break;
            case 5:
                nbArgs = 2;
                operation = (addrss, args) => {
                    if (args[0] !== 0) {
                        nextPos = args[1]
                    }
                };
                break;
            case 6:
                nbArgs = 2;
                operation = (addrss, args) => {
                    if (args[0] === 0) {
                        nextPos = args[1]
                    }
                };
                break;
            case 7:
                nbArgs = 3;
                operation = (addrss, args) => {
                    this.mem[addrss[2]] = args[0] < args[1] ? 1 : 0;
                };
                break;
            case 8:
                nbArgs = 3;
                operation = (addrss, args) => {
                    this.mem[addrss[2]] = args[0] === args[1] ? 1 : 0;
                };
                break;
            case 99:
                nbArgs = NaN;
                operation = () => {
                    nextPos = -1;
                };
                break;
            default:
                throw `unknown intcode [${this.mem[pos]}] at pos [${pos}]`
        }
        const addresses = [];
        for (let i = 0; i < nbArgs; i++) {
            addresses[i] = this.mem[(pos + 1 + i)];
        }
        // console.log(`addresses [${addresses}]`);
        const args = getArgs(this.mem, addresses, modesString);
        // console.log(`args [${args}]`);
        nextPos = nbArgs >= 0 ? pos + 1 + nbArgs : NaN;
        operation(addresses, args);
        if (waitingForInput) {
            return -1
        }
        this.lastNextPos = nextPos;
        return nextPos;
    }

    static runFromMem(mem: number[], startPointer?: number) {
        const intcodeProgram = new IntcodeRunner(mem);
        intcodeProgram.run(startPointer);
    }

    static runIntCodeProgram(modifyableMemory: number[], noun: number, verb: number) {
        modifyableMemory[1] = noun;
        modifyableMemory[2] = verb;
        return IntcodeRunner.runFromMem(modifyableMemory);
    }

    queueInput(...inputs: number[]) {
        this.queuedInput.push(...inputs);
    }

    run(startPointer?: number) {
        let instructionPointer = startPointer || this.lastNextPos;
        while (instructionPointer >= 0 && instructionPointer < this.mem.length) {
            instructionPointer = this.processOpCode(instructionPointer);
        }
        return this.getMemValue(0);
    }

    getMemValue(resultPos: number) {
        return this.mem[resultPos];
    }

    finished() {
        return !(this.getNextPos() >= 0);
    }
}
