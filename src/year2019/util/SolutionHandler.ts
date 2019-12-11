let currentDay = 1;
let part1 = true;

export function logAndPushSolution(part2: (number | string), solutionArray: (number | string)[]) {
    solutionArray.push(part2);
    if (!part1) {
        currentDay += 1;
    } else {
        console.log('Day ' + currentDay);
    }
    part1 = !part1;
    console.log(`Part ${solutionArray.length}:`, part2);
}