const input = [3, 225, 1, 225, 6, 6, 1100, 1, 238, 225, 104, 0, 1102, 27, 28, 225, 1, 113, 14, 224, 1001, 224, -34, 224, 4, 224, 102, 8, 223, 223, 101, 7, 224, 224, 1, 224, 223, 223, 1102, 52, 34, 224, 101, -1768, 224, 224, 4, 224, 1002, 223, 8, 223, 101, 6, 224, 224, 1, 223, 224, 223, 1002, 187, 14, 224, 1001, 224, -126, 224, 4, 224, 102, 8, 223, 223, 101, 2, 224, 224, 1, 224, 223, 223, 1102, 54, 74, 225, 1101, 75, 66, 225, 101, 20, 161, 224, 101, -54, 224, 224, 4, 224, 1002, 223, 8, 223, 1001, 224, 7, 224, 1, 224, 223, 223, 1101, 6, 30, 225, 2, 88, 84, 224, 101, -4884, 224, 224, 4, 224, 1002, 223, 8, 223, 101, 2, 224, 224, 1, 224, 223, 223, 1001, 214, 55, 224, 1001, 224, -89, 224, 4, 224, 102, 8, 223, 223, 1001, 224, 4, 224, 1, 224, 223, 223, 1101, 34, 69, 225, 1101, 45, 67, 224, 101, -112, 224, 224, 4, 224, 102, 8, 223, 223, 1001, 224, 2, 224, 1, 223, 224, 223, 1102, 9, 81, 225, 102, 81, 218, 224, 101, -7290, 224, 224, 4, 224, 1002, 223, 8, 223, 101, 5, 224, 224, 1, 223, 224, 223, 1101, 84, 34, 225, 1102, 94, 90, 225, 4, 223, 99, 0, 0, 0, 677, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1105, 0, 99999, 1105, 227, 247, 1105, 1, 99999, 1005, 227, 99999, 1005, 0, 256, 1105, 1, 99999, 1106, 227, 99999, 1106, 0, 265, 1105, 1, 99999, 1006, 0, 99999, 1006, 227, 274, 1105, 1, 99999, 1105, 1, 280, 1105, 1, 99999, 1, 225, 225, 225, 1101, 294, 0, 0, 105, 1, 0, 1105, 1, 99999, 1106, 0, 300, 1105, 1, 99999, 1, 225, 225, 225, 1101, 314, 0, 0, 106, 0, 0, 1105, 1, 99999, 1007, 677, 677, 224, 102, 2, 223, 223, 1005, 224, 329, 101, 1, 223, 223, 1108, 226, 677, 224, 1002, 223, 2, 223, 1005, 224, 344, 101, 1, 223, 223, 1008, 677, 677, 224, 102, 2, 223, 223, 1005, 224, 359, 101, 1, 223, 223, 8, 226, 677, 224, 1002, 223, 2, 223, 1006, 224, 374, 101, 1, 223, 223, 108, 226, 677, 224, 1002, 223, 2, 223, 1006, 224, 389, 1001, 223, 1, 223, 1107, 226, 677, 224, 102, 2, 223, 223, 1005, 224, 404, 1001, 223, 1, 223, 7, 226, 677, 224, 1002, 223, 2, 223, 1005, 224, 419, 101, 1, 223, 223, 1107, 677, 226, 224, 102, 2, 223, 223, 1006, 224, 434, 1001, 223, 1, 223, 1107, 226, 226, 224, 1002, 223, 2, 223, 1006, 224, 449, 101, 1, 223, 223, 1108, 226, 226, 224, 1002, 223, 2, 223, 1005, 224, 464, 101, 1, 223, 223, 8, 677, 226, 224, 102, 2, 223, 223, 1005, 224, 479, 101, 1, 223, 223, 8, 226, 226, 224, 1002, 223, 2, 223, 1006, 224, 494, 1001, 223, 1, 223, 1007, 226, 677, 224, 1002, 223, 2, 223, 1006, 224, 509, 1001, 223, 1, 223, 108, 226, 226, 224, 1002, 223, 2, 223, 1006, 224, 524, 1001, 223, 1, 223, 1108, 677, 226, 224, 102, 2, 223, 223, 1006, 224, 539, 101, 1, 223, 223, 1008, 677, 226, 224, 102, 2, 223, 223, 1006, 224, 554, 101, 1, 223, 223, 107, 226, 677, 224, 1002, 223, 2, 223, 1006, 224, 569, 101, 1, 223, 223, 107, 677, 677, 224, 102, 2, 223, 223, 1006, 224, 584, 101, 1, 223, 223, 7, 677, 226, 224, 102, 2, 223, 223, 1005, 224, 599, 101, 1, 223, 223, 1008, 226, 226, 224, 1002, 223, 2, 223, 1005, 224, 614, 1001, 223, 1, 223, 107, 226, 226, 224, 1002, 223, 2, 223, 1005, 224, 629, 101, 1, 223, 223, 7, 226, 226, 224, 102, 2, 223, 223, 1006, 224, 644, 1001, 223, 1, 223, 1007, 226, 226, 224, 102, 2, 223, 223, 1006, 224, 659, 101, 1, 223, 223, 108, 677, 677, 224, 102, 2, 223, 223, 1005, 224, 674, 1001, 223, 1, 223, 4, 223, 99, 226];

const IMMEDIATE_MODE = 1;

function getArgs(mem, addresses, modesString) {
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

const AIR_CONDITIONER_ID = 1;

function getInput() {
    return AIR_CONDITIONER_ID;
}

const outputs = [];

function doOutput(arg) {
    outputs.push(arg);
}

function processOpCode(pos, mem) {
    let instruct = `${mem[pos]}`;
    const opCode = Number(instruct.slice(instruct.length - 2));
    // console.log(`opCode [${opCode}] instruct [${instruct}]`);
    const modesString = instruct.slice(0, instruct.length - 2);
    let nbArgs = 0;
    let operation = () => {
    };
    switch (opCode) {
        case 1:
            nbArgs = 3;
            operation = (addrss, args) => {
                mem[addrss[2]] = args[0] + args[1];
            };
            break;
        case 2:
            nbArgs = 3;
            operation = (addrss, args) => {
                mem[addrss[2]] = args[0] * args[1];
            };
            break;
        case 3:
            nbArgs = 1;
            operation = (addrss, args) => {
                mem[addrss[0]] = getInput();
            };
            break;
        case 4:
            nbArgs = 1;
            operation = (addrss, args) => {
                doOutput(args[0]);
            };
            break;
        case 99:
            nbArgs = NaN;
            break;
        default:
            throw `unknown intcode [${mem[pos]}] at pos [${pos}]`
    }
    const addresses = [];
    for (let i = 0; i < nbArgs; i++) {

        addresses[i] = mem[(pos + 1 + i)];
    }
    // console.log(`addresses [${addresses}]`);
    const args = getArgs(mem, addresses, modesString);
    // console.log(`args [${args}]`);
    operation(addresses, args);
    const nextPos = nbArgs >= 0 ? pos + 1 + nbArgs : NaN;
    return nextPos;
}

function runFromMem(mem) {
    let instructionPointer = 0;
    while (instructionPointer >= 0 && instructionPointer < mem.length) {
        // console.log(`pointer [${instructionPointer}]`);
        instructionPointer = processOpCode(instructionPointer, mem);
    }
    return mem[0];
}

function runIntCodeProgram(mem, noun, verb) {
    mem[1] = noun;
    mem[2] = verb;
    return runFromMem(mem);
}

// Part 1
const part1Result = runFromMem([...input]);
outputs.slice(0, outputs.length - 1).map((out, pos) => out === 0 || console.error(`non 0 output [${out}] at pos [${pos}]`));
console.log("Part1: " + outputs[outputs.length - 1]);