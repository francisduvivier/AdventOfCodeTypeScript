import { IOHandler } from "../day11/solution11";

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

function getArgs(mem: (number | string)[], addresses: (string | number)[], modeLettersLeftToRight: MODELETTER[]) {
    const args: (string | number)[] = [];
    for (let i = 0; i < addresses.length; i++) {
        if (typeof addresses[i] == 'string' || modeLettersLeftToRight[i] === MODELETTER.IMMEDIATE_MODE) {
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
    private readonly outputs: (number | string)[] = [];
    private lastNextPos: number = 0;

    constructor(private readonly mem: (number | string)[], queuedInput?: number[], ioHandler?: IOHandler) {
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

    getAllOutput(): (number | string)[] {
        return this.outputs.splice(0);
    }

    getNextPos() {
        return this.lastNextPos;
    }

    doOutput(arg: number | string) {
        if (this.ioHandler) {
            this.ioHandler.doOutput(arg);
        }
        this.outputs.push(arg);
    }

    processOpCode(pos: number) {
        let instruct = `${this.mem[pos]}`;
        let opCode
        let modesString: string
        let args = [];
        let newMode = false;
        if (instruct.match('^[a-z]+ [+-][0-9]+$')) {
            let tuple = instruct.split(' ');
            opCode = tuple[0]
            modesString = ``
            args = [tuple[1]]
            newMode = true
        } else {
            opCode = instruct.slice(instruct.length - 2);
            modesString = instruct.slice(0, instruct.length - 2);
        }
        console.log(`opCode [${opCode}] instruct [${instruct}]`);
        let nbArgs = 0;
        let nextPos: number | string = 0;
        let operation: (addrss: (number | string)[], args: (number | string)[]) => void = () => {
        };
        let waitingForInput = false;
        switch (opCode) {
            case '1': //Add
                nbArgs = 3;
                operation = (addrss, args) => {
                    this.mem[addrss[2]] = Number(args[0]) + Number(args[1]);
                };
                break;
            case '2': //Multiply
                nbArgs = 3;
                operation = (addrss, args) => {
                    this.mem[addrss[2]] = Number(args[0]) * Number(args[1]);
                };
                break;
            case '3': //JUMP to INPUT
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
            case 'acc':
            case '4': //Do OUTPUT
                nbArgs = 1;
                operation = (addrss, args) => {
                    this.doOutput(args[0]);
                };
                break;
            case '5': // JUMP IF NOT 0
                nbArgs = 2;
                operation = (addrss, args) => {
                    if (args[0] !== 0) {
                        nextPos = args[1]
                    }
                };
                break;
            case '6': // JUMP IF 0
                nbArgs = 2;
                operation = (addrss, args) => {
                    if (args[0] === 0) {
                        nextPos = args[1]
                    }
                };
                break;
            case '7': // SMALLER THAN
                nbArgs = 3;
                operation = (addrss, args) => {
                    this.mem[addrss[2]] = args[0] < args[1] ? 1 : 0;
                };
                break;
            case '8': // EQUAL THAN
                nbArgs = 3;
                operation = (addrss, args) => {
                    this.mem[addrss[2]] = args[0] === args[1] ? 1 : 0;
                };
                break;
            case 'jmp':
                nbArgs = 1;
                operation = (addrss, args) => {
                    let jumpAmount = Number(args[0]);
                    nextPos = pos + jumpAmount
                };
                break;
            case '9': // CHANGE RELATIVE BASE
                nbArgs = 1;
                operation = (addrss, args) => {
                    this.relativeBase += Number(args[0]);
                };
                break;
            case 'nop': // CHANGE RELATIVE BASE
                nbArgs = 1;
                operation = () => {
                };
                break;
            case '99': // STOP?
                nbArgs = NaN;
                operation = () => {
                    nextPos = -1;
                };
                break;
            default:
                throw `unknown intcode [${this.mem[pos]}] at pos [${pos}]`
        }
        const addresses: (number | string)[] = [];
        const modeLettersLtoR = getModeLettersLtoR(modesString);
        const isNumber = (n: any) => {
            return typeof n === 'number';
        };
        for (let i = 0; i < nbArgs; i++) {
            addresses[i] = this.mem[(pos + 1 + i)];
            if (isNumber(addresses[i]) && modeLettersLtoR[i] === MODELETTER.RELATIVE_MODE) {
                (addresses[i] as number) += this.relativeBase;
            }
        }
        // console.log(`addresses [${addresses}]`);
        if (!newMode) {
            args = getArgs(this.mem, addresses, modeLettersLtoR);
            nextPos = nbArgs >= 0 ? pos + 1 + nbArgs : NaN;
        } else {
            nextPos = pos + 1
        }
        // console.log(`args [${args}]`);
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

    private readonly donePointers = [];

    run(startPointer?: number) {
        let instructionPointer = startPointer || this.lastNextPos;
        while (instructionPointer >= 0 && instructionPointer < this.mem.length) {
            if (this.donePointers.indexOf(instructionPointer) != -1) {
                return -1;
            }
            this.donePointers.push(instructionPointer)
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
