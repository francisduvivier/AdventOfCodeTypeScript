import {input, testInput1, testInput2, testInput3} from "./input";
import {IntcodeRunner} from "../intcode/IntcodeRunner";
const firstInput= 1;
new IntcodeRunner(testInput1, [firstInput]).run();
new IntcodeRunner(testInput2, [firstInput]).run();
new IntcodeRunner(testInput3, [firstInput]).run();
new IntcodeRunner(input, [firstInput]).run();