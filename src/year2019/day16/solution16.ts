import * as assert from "assert";
import {logAndPushSolution} from "../util/SolutionHandler";
import {sum} from "../util/MapReduce";

const testInput1 = '80871224585914546619083218645595';
const input = '59750530221324194853012320069589312027523989854830232144164799228029162830477472078089790749906142587998642764059439173975199276254972017316624772614925079238407309384923979338502430726930592959991878698412537971672558832588540600963437409230550897544434635267172603132396722812334366528344715912756154006039512272491073906389218927420387151599044435060075148142946789007756800733869891008058075303490106699737554949348715600795187032293436328810969288892220127730287766004467730818489269295982526297430971411865028098708555709525646237713045259603175397623654950719275982134690893685598734136409536436003548128411943963263336042840301380655801969822';

function repeat(basePattern: number[], times: number) {
    let pattern: number[] = [];
    for (let patval of basePattern) {
        for (let ip = 0; ip < times; ip++) {
            pattern.push(patval);
        }
    }
    return pattern;
}

assert.deepEqual(repeat([0, 1, 0, -1], 1), [0, 1, 0, -1]);
assert.deepEqual(repeat([0, 1, 0, -1], 3), [0, 0, 0, 1, 1, 1, 0, 0, 0, -1, -1, -1]);

function part1(inputNb: string): string {
    const nbPhases = 100;
    const basePattern = [0, 1, 0, -1];
    let currInput = inputNb.split('').map(Number);
    for (let i = 0; i < nbPhases; i++) {
        currInput = currInput.map((n1, i1) => {
            let pattern = repeat(basePattern, i1 + 1);
            const first = pattern[0];
            pattern.push(first);
            pattern = pattern.slice(1);
            return Math.abs(sum(currInput.map((n2, i2) => n2 * pattern[i2 % pattern.length]))) % 10
        });
    }
    return currInput.join('');
}

assert.deepEqual(part1(testInput1).slice(0, 8), '24176176');
assert.deepEqual(part1('19617804207202209144916044189917').slice(0, 8), '73745418');
assert.deepEqual(part1('69317163492948606335995924319873').slice(0, 8), '52432133');
const solutions: string[] = [];
logAndPushSolution(part1(input).slice(0, 8), solutions);


function do1Phase(nbPhases: number, currInput: number[], basePattern: number[]) {
    for (let phase = 0; phase < nbPhases; phase++) {
        console.log('phase: ' + phase);
        currInput = currInput.map((n1, i1) => {
            let pattern = repeat(basePattern, i1 + 1);
            const first = pattern[0];
            pattern.push(first);
            pattern = pattern.slice(1);
            return Math.abs(sum(currInput.map((n2, i2) => n2 * pattern[i2 % pattern.length]))) % 10
        });
    }
    return currInput;
}

function part2(inputNb: string): string {
    let currInput = repeat(inputNb.split('').map(Number), 1000);
    const msgOffset = Number(inputNb.slice(0, 7));
    const nbPhases = 100;
    const basePattern = [0, 1, 0, -1];
    currInput = do1Phase(nbPhases, currInput, basePattern);
    currInput.splice(msgOffset, 8);
    return currInput.join('');
}

logAndPushSolution(part2(input).slice(0, 8), solutions);
assert.deepEqual(part2('03036732577212944063491565474664').slice(0, 8), '84462026');
