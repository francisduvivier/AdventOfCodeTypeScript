import {IOHandler} from "../day11/solution11";

const enum MODELETTER {
    POSITION_MODE = 0,
    IMMEDIATE_MODE = 1,
    RELATIVE_MODE = 2,
}

function toModeLetter(letter: string): MODELETTER {
    let modeNumber = Number(letter);
    if (modeNumber < 0 || modeNumber > 2) {
        throw 'invalide modeletter ' + letter;
    }
    return modeNumber;
}

function getModeLettersLtoR(modesString: string): MODELETTER[] {
    return [...modesString].reverse().map(toModeLetter);
}

function getArgs(mem: number[], addresses: number[], modeLettersLeftToRight: MODELETTER[]) {
    const args: number[] = [];
    for (let i = 0; i < addresses.length; i++) {
        if (modeLettersLeftToRight[i] === MODELETTER.IMMEDIATE_MODE) {
            args[i] = addresses[i] || 0
        } else {
            args[i] = mem[addresses[i]] || 0
        }
    }

    return args;
}

export class IntcodeRunner {
    private relativeBase: number = 0;
    readonly ioHandler: IOHandler | undefined;
    private readonly queuedInput: number[] = [];
    private readonly outputs: number[] = [];
    private lastNextPos: number = 0;

    constructor(private readonly mem: number[], queuedInput?: number[], ioHandler?: IOHandler) {
        this.ioHandler = ioHandler;
        if (queuedInput !== undefined) {
            this.queueInput(...queuedInput);
        }
    }

    static runFromMem(mem: number[], startPointer?: number) {
        const intcodeProgram = new IntcodeRunner(mem, undefined);
        return intcodeProgram.run(startPointer);
    }

    static runIntCodeProgram(modifyableMemory: number[], noun: number, verb: number) {
        modifyableMemory[1] = noun;
        modifyableMemory[2] = verb;
        return IntcodeRunner.runFromMem(modifyableMemory);
    }

    getInput() {
        const input = this.queuedInput[0];
        this.queuedInput.splice(0, 1);
        if (input === undefined && this.ioHandler) {
            return this.ioHandler.getInput();
        }
        return input;
    }

    getOutput() {
        const output = this.outputs[this.outputs.length - 1];
        this.outputs.length = 1;
        this.outputs[0] = output;
        return output;
    }

    getAllOutput(): number[] {
        return this.outputs.splice(0);
    }

    getNextPos() {
        return this.lastNextPos;
    }

    doOutput(arg: number) {
        if (this.ioHandler) {
            this.ioHandler.doOutput(arg);
        }
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
            case 9:
                nbArgs = 1;
                operation = (addrss, args) => {
                    this.relativeBase += args[0];
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
        const addresses: number[] = [];
        const modeLettersLtoR = getModeLettersLtoR(modesString);
        for (let i = 0; i < nbArgs; i++) {
            addresses[i] = this.mem[(pos + 1 + i)];
            if (modeLettersLtoR[i] === MODELETTER.RELATIVE_MODE) {
                addresses[i] += this.relativeBase;
            }
        }
        // console.log(`addresses [${addresses}]`);
        const args = getArgs(this.mem, addresses, modeLettersLtoR);
        // console.log(`args [${args}]`);
        nextPos = nbArgs >= 0 ? pos + 1 + nbArgs : NaN;
        operation(addresses, args);
        if (waitingForInput) {
            return -1
        }
        this.lastNextPos = nextPos;
        return nextPos;
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
