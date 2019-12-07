import * as assert from "assert";
import {IntcodeRunner} from "./intcode/IntcodeRunner";

const input = [3, 8, 1001, 8, 10, 8, 105, 1, 0, 0, 21, 34, 43, 60, 81, 94, 175, 256, 337, 418, 99999, 3, 9, 101, 2, 9, 9, 102, 4, 9, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 99, 3, 9, 102, 4, 9, 9, 1001, 9, 4, 9, 102, 3, 9, 9, 4, 9, 99, 3, 9, 102, 4, 9, 9, 1001, 9, 2, 9, 1002, 9, 3, 9, 101, 4, 9, 9, 4, 9, 99, 3, 9, 1001, 9, 4, 9, 102, 2, 9, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 99, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 99, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 99, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 99]
console.log("input.length", input.length);
const intcodeVM = new IntcodeRunner();
function calcOutput(phases: number[], memCopy: number[], recursive?: boolean) {
    let currentInput = 0;
    const memCopies = phases.map(() => [...memCopy]);
    const pointerLocations = phases.map(() => 0);
    const halteds = phases.map(() => false);
    let firstTime = true;
    while (!halteds[halteds.length - 1]) {
        for (let i = 0; i < phases.length; i++) {
            if (halteds[i]) {
                console.error("trying to restart halted program", i)
            }
            if (firstTime) {
                intcodeVM.queueInput(phases[i]);
            }
            intcodeVM.queueInput(currentInput);
            intcodeVM.runFromMem(memCopies[i], recursive ? pointerLocations[i] : 0);
            pointerLocations[i] = intcodeVM.getNextPos();
            halteds[i] = !(intcodeVM.getNextPos() >= 0);
            currentInput = intcodeVM.getOutput();
        }
        firstTime = false;
    }
    return currentInput;
}

function hasSameNumber(phases: number[]) {
    return (new Set(phases)).size !== phases.length;
}

function calcHighestThrust(inputMem: number[], possiblePhases: number[], recursive?: boolean) {
    let highestThrust = 0;
    let bestPhasesSetting = [0, 0, 0, 0, 0];
    const phases = possiblePhases;

    for (const amp1Phase of phases) {
        for (const amp2Phase of phases) {
            for (const amp3Phase of phases) {
                for (const amp4Phase of phases) {
                    for (const amp5Phase of phases) {
                        const phaseConfig = [amp1Phase, amp2Phase, amp3Phase, amp4Phase, amp5Phase];
                        if (hasSameNumber(phaseConfig)) {
                            continue;
                        }
                        try {
                            let output = calcOutput(phaseConfig, [...inputMem], recursive);
                            if (output > highestThrust) {
                                bestPhasesSetting = phaseConfig;
                                highestThrust = output;
                            }
                        } catch (e) {
                            console.log("try config FAIL", JSON.stringify(phaseConfig), e);
                        }
                    }
                }
            }
        }
    }
    return [highestThrust, bestPhasesSetting]
}

// Part 1
const [highestThrust, bestPhasesSetting] = calcHighestThrust(input, [0, 1, 2, 3, 4]);

console.log("Part 1:", highestThrust, JSON.stringify(bestPhasesSetting));

const part2Phases = [5, 6, 7, 8, 9];
const testInput = [3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54,
    -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4,
    53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10];
assert.deepEqual(calcHighestThrust(testInput, part2Phases, true), [18216, [9, 7, 8, 5, 6]]);
console.log("Part 2: test input success");
console.log("Part 2:", JSON.stringify(calcHighestThrust(input, part2Phases, true)));