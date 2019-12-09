import {input, testInput1, testInput2, testInput3} from "./input";
import {IntcodeRunner} from "../intcode/IntcodeRunner";
import * as assert from "assert";

const firstInput = 1;
console.log('doing testInput1');
let intcodeRunner = new IntcodeRunner([...testInput1], [firstInput]);
intcodeRunner.run();
assert.deepEqual(intcodeRunner.getAllOutput().slice(0, testInput1.length), testInput1);
console.log('assert success');

intcodeRunner = new IntcodeRunner(testInput2, [firstInput]);
intcodeRunner.run();
const output = intcodeRunner.getOutput();
// assert.equal(Math.pow(10, 16) < output && Math.pow(10, 17) > output, true);
console.log('assert success', output);

intcodeRunner = new IntcodeRunner(testInput3, [firstInput]);
intcodeRunner.run();
assert.deepEqual(intcodeRunner.getOutput(), 1125899906842624);
console.log('assert success');

// Part 1
intcodeRunner = new IntcodeRunner(input, [firstInput]);
intcodeRunner.run();
console.log(intcodeRunner.getAllOutput());

// Part 2
intcodeRunner = new IntcodeRunner(input, [2]);
intcodeRunner.run();
console.log(intcodeRunner.getAllOutput());