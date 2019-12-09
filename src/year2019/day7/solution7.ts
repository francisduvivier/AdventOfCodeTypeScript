import * as assert from "assert";
import {IntcodeRunner} from "../intcode/IntcodeRunner";
import {logAndPushSolution} from "../util/SolutionHandler";

const input = [3, 8, 1001, 8, 10, 8, 105, 1, 0, 0, 21, 34, 43, 60, 81, 94, 175, 256, 337, 418, 99999, 3, 9, 101, 2, 9, 9, 102, 4, 9, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 99, 3, 9, 102, 4, 9, 9, 1001, 9, 4, 9, 102, 3, 9, 9, 4, 9, 99, 3, 9, 102, 4, 9, 9, 1001, 9, 2, 9, 1002, 9, 3, 9, 101, 4, 9, 9, 4, 9, 99, 3, 9, 1001, 9, 4, 9, 102, 2, 9, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 99, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 99, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 99, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 99]

function calcOutput(phases: number[], memCopy: number[]) {
    let currentInput = 0;
    const intcodeVMs = phases.map(() => new IntcodeRunner([...memCopy]));
    intcodeVMs.forEach((vm, index) => vm.queueInput(phases[index]));

    while (!(intcodeVMs[intcodeVMs.length - 1].finished())) {
        for (let i = 0; i < phases.length; i++) {
            const currVM = intcodeVMs[i];
            if (currVM.finished()) {
                console.error("trying to restart halted program", i)
            }
            currVM.queueInput(currentInput);
            currVM.run();
            currentInput = currVM.getOutput();
        }
    }
    return currentInput;
}

function hasSameNumber(phases: number[]) {
    return (new Set(phases)).size !== phases.length;
}

function calcHighestThrust(inputMem: number[], possiblePhases: number[]): [number, number[]] {
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
                            let output = calcOutput(phaseConfig, [...inputMem]);
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

export const solutions: number[] = [];

// Part 1
const [highestThrust] = calcHighestThrust(input, [0, 1, 2, 3, 4]);

logAndPushSolution(highestThrust, solutions);
const part2Phases = [5, 6, 7, 8, 9];
const TEST = false;
if (TEST) {
    const testInput = [3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54,
        -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4,
        53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10];
    assert.deepEqual(calcHighestThrust(testInput, part2Phases), [18216, [9, 7, 8, 5, 6]]);
    console.log("Part 2: test input success");
}
const [part2] = calcHighestThrust(input, part2Phases);
logAndPushSolution(part2, solutions);