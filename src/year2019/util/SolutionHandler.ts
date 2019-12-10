export function logAndPushSolution(part2: (number | string), solutionArray: (number | string)[]) {
    solutionArray.push(part2);
    console.log(`Part ${solutionArray.length}:`, part2);
}