import { logAndPushSolution } from "../../year2019/util/SolutionHandler.ts";
import { rInput } from "./input.ts";

const input
    = rInput;
// = tInput;
const solutionArray = []
//Part 1
let firstBad;

for (let i1 = 25; i1 < input.length; i1++) {
    const n1 = input[i1];
    let found = false;
    for (const n2 of input.slice(i1 - 25, i1)) {
        for (const n3 of input.slice(i1 - 25 + 1, i1)) {
            if (n2 + n3 == n1) {
                found = true;
            }
            if (found) break;
        }
        if (found) break;
    }
    if (!found) {
        firstBad = n1
        break;
    }
}
logAndPushSolution(firstBad, solutionArray);

function part2() {
    for (let i1 = 0; i1 < input.length; i1++) {
        let sum = 0
        for (let i2 = i1; i2 < input.length; i2++) {
            sum += input[i2];
            if (sum == firstBad) {
                const terms = input.slice(i1, i2);
                const solution = Math.max(...terms) + Math.min(...terms)
                logAndPushSolution(solution, solutionArray);
                return;
            } else if (sum > firstBad) {
                break;
            }
        }
    }
}

//Part 2
part2();
console.log('done')
