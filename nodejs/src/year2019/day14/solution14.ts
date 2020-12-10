import {input, testInput1, testInput2, testInput3, testInput5, testSol1, testSol2, testSol5} from "./input";
import * as assert from "assert";

type CHEM = string;

export class Reaction {
    inputs: Map<CHEM, number> = new Map<CHEM, number>();
    output: [number, CHEM];

    constructor(public readonly inputStr: string) {
        const inout = inputStr.split('=>').map(s => s.split(','));
        const inList = inout[0];
        (inList.map(s => s.trim().split(' ') as [number, CHEM])
            .forEach((el: [number, CHEM]) => {
                    this.inputs.set(el[1], el[0])
                }
            ));
        const out = inout[1][0];
        const outTuple = (out.trim().split(' ') as [number, CHEM]);
        this.output = outTuple
    }
}

function makeInputOutPutMap(reactionList: Reaction[]): Map<CHEM, Reaction> {
    const result = new Map<CHEM, Reaction>();
    for (const react of reactionList) {
        result.set(react.output[1], react);
    }
    return result;
}


function doChainReaction(reactionList: Reaction[], nbFuel: number = 1): number {
    const ioMap = makeInputOutPutMap(reactionList);
    const currChemLevels = new Map<CHEM, number>();
    const fuelReact = ioMap.get('FUEL')!;
    assert.deepEqual(!!fuelReact, true);
    doReactionRec(fuelReact, nbFuel, ioMap, currChemLevels);
    return currChemLevels.get('ORE')!;
}

function doReactionRec(r: Reaction, outPutNeeded: number, ioMap: Map<CHEM, Reaction>, chemLevels: Map<CHEM, number>) {
    assert.deepEqual(chemLevels.get(r.output[1]) || 0, 0);
    const minOutput = r.output[0];
    // console.log('doing first ' + minOutput);
    const timesReaction = Math.ceil(outPutNeeded / minOutput);
    // console.log('did first');
    const excessOutput = timesReaction * minOutput - outPutNeeded;
    chemLevels.set(r.output[1], excessOutput);
    r.inputs.forEach((timesInput, chem) => {
        const totalNeed = timesInput * timesReaction;
        if (chem == 'ORE') {
            const currOre = chemLevels.get('ORE') || 0;
            chemLevels.set('ORE', currOre + totalNeed);
            return;
        }
        const chemLevel = chemLevels.get(chem) || 0;
        chemLevels.set(chem, Math.max(0, chemLevel - totalNeed));
        const needLeft = totalNeed - chemLevel;
        if (needLeft > 0) {
            const r1 = ioMap.get(chem)!;
            assert.notDeepEqual(r1, undefined, chem);
            doReactionRec(r1, needLeft, ioMap, chemLevels);
        }
    })
}

export function part1(reactionStrings: string[]) {
    const reactionList = reactionStrings.map(r => new Reaction(r));
    const nbOre = doChainReaction(reactionList, 1);
    return nbOre
}

console.log('doing testInput1');
assert.deepEqual(part1(testInput1), testSol1);

console.log('doing testInput2');
assert.deepEqual(part1(testInput2), testSol2);
console.log('doing testInput5');
assert.deepEqual(part1(testInput5), testSol5);
console.log('doing input');
assert.deepEqual(part1(input), 469536);
console.log('part1', part1(input));

function part2(nbOre: number, reactionStrings: string[]) {
    const reactionList = reactionStrings.map(r => new Reaction(r));
    let orePerFuel = part1(reactionStrings);
    let testFuel = Math.floor(nbOre / orePerFuel);
    let oreUsed = 0;
    let testMin = testFuel;
    let testMax = Infinity;
    while (true) {
        if (testFuel == Infinity) {
            throw 'Illegal testFuel amount ' + testFuel;
        }
        oreUsed = doChainReaction(reactionList, testFuel);
        if (oreUsed > nbOre) {
            testMax = testFuel;
        } else {
            testMin = testFuel;
        }
        if (testMax == Infinity) {
            testFuel *= 2;
        } else {
            const diff = testMax - testMin;
            testFuel = testMin + Math.floor(diff / 2);
            if (Math.abs(diff) <= 1) {
                return testMin;
            }
        }

    }
}

console.log(part2(1000000000000, input));

assert.deepEqual(part2(1000000000000, testInput3), 82892753);
console.log('done test 3');
assert.deepEqual(part2(1000000000000, testInput5), 460664);
console.log('done test 5');
console.log(part2(1000000000000, input));
JSON.stringify(testInput3.length)
JSON.stringify(testInput5.length)