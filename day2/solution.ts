// Input
const inputProgram = [
    1, 0, 0, 3,
    1, 1, 2, 3,
    1, 3, 4, 3,
    1, 5, 0, 3,
    2, 1, 10, 19,
    1, 19, 6, 23,
    2, 23, 13, 27,
    1, 27, 5, 31,
    2, 31, 10, 35,
    1, 9, 35, 39,
    1, 39, 9, 43,
    2, 9, 43, 47,
    1, 5, 47, 51,
    2, 13, 51, 55,
    1, 55, 9, 59,
    2, 6, 59, 63,
    1, 63, 5, 67,
    1, 10, 67, 71,
    1, 71, 10, 75,
    2, 75, 13, 79,
    2, 79, 13, 83,
    1, 5, 83, 87,
    1, 87, 6, 91,
    2, 91, 13, 95,
    1, 5, 95, 99,
    1, 99, 2, 103,
    1, 103, 6, 0,
    99,
    2, 14, 0, 0];

function processOpCode(pos, mem) {
    const opCode = mem[pos];
    let nbArgs = 0;
    let operation = () => {
    };
    switch (opCode) {
        case 1:
            nbArgs = 3;
            operation = (addrss) => {
                mem[addrss[2]] = mem[addrss[0]] + mem[addrss[1]];
            };
            break;
        case 2:
            nbArgs = 3;
            operation = (addrss) => {
                mem[addrss[2]] = mem[addrss[0]] * mem[addrss[1]];
            };
            break;
        case 99:
            nbArgs = NaN;
            break;
        default:
            throw `unknown intcode [${mem[pos]}] at pos [${pos}]`
    }
    const addresses = [];
    for (let i = 0; i <= nbArgs; i++) {
        addresses[i] = mem[pos + 1 + i];
    }
    operation(addresses);
    const nextPos = nbArgs >= 0 ? pos + 1 + nbArgs : NaN;
    return nextPos;
}

function runIntCodeProgram(mem, noun, verb) {
    mem[1] = noun;
    mem[2] = verb;
    let instructionPointer = 0;
    while (instructionPointer >= 0 && instructionPointer < mem.length) {
        instructionPointer = processOpCode(instructionPointer, mem);
    }
    return mem[0];
}

// Part 1

const part1Result = runIntCodeProgram([...inputProgram], 12, 2);
console.log("Part1: " + part1Result);

// Part 2
let part2Result = undefined;
for (let noun = 0; noun < 100 && part2Result === undefined; noun++) {
    for (let verb = 0; verb < 100 && part2Result === undefined; verb++) {
        if (runIntCodeProgram([...inputProgram], noun, verb) === 19690720) {
            part2Result = 100 * noun + verb;
        }
    }
}
console.log("Part2: " + part2Result);