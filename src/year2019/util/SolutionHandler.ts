let currentDay = 1;
let part1 = true;

export function logAndPushSolution(part2: number | string, solutionArray: (number | string)[], day?: number) {
    if (day !== undefined) {
        currentDay = day;
    }
    solutionArray.push(part2);
    if (!part1) {
        currentDay += 1;
    } else {
        console.log('Day ' + currentDay);
    }
    part1 = !part1;
    console.log(`Part ${solutionArray.length}:`, part2);
}