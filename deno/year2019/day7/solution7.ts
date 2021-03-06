import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import {IntcodeRunner} from "../intcode/IntcodeRunner.ts";
import {logAndPushSolution} from "../util/SolutionHandler.ts";
import {input, testInput} from "./input.ts";

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
assertEquals(calcHighestThrust(testInput, part2Phases), [18216, [9, 7, 8, 5, 6]]);

const [part2] = calcHighestThrust(input, part2Phases);
logAndPushSolution(part2, solutions);

assertEquals(solutions, [11828, 1714298]);
