import { createGrid, P } from "../../year2019/util/Grid.ts";
import { multiply } from "../../year2019/util/Math.ts";
const rInput = Deno.readTextFileSync('./input.txt');
const tInput = Deno.readTextFileSync('./testinput.txt');

function makeWidenedGrid(input) {
    console.log('input len', input.length);
    console.log('input type', typeof input);
    const multipliedInput = input.split('\n').map(line => {
        let newline = '';
        for (let i = 0; i < 100; i++) {
            newline += line;
        }
        return newline
    }).join('\n')
    return createGrid<'#' | '.'>(multipliedInput);
}

function findTrees(grid, slope) {
    let slopeTrees = 0;
    grid.forEach((p, val) => {
        if (((p.col) / (p.row)).toFixed(5) == (slope.col / slope.row).toFixed(5) && val == '#') {
            slopeTrees++;
        }
    });
    return slopeTrees;
}

function part1(input) {
    const grid = makeWidenedGrid(input);
    const slope = P(1, 3);
    return findTrees(grid, slope);
}

function part2(input) {
    const grid = makeWidenedGrid(input);

    const slopes = [P(1, 1)
        , P(1, 3)
        , P(1, 5)
        , P(1, 7)
        , P(2, 1)];
    const treesPerSlope = slopes.map(slope => findTrees(grid, slope));
    return multiply(treesPerSlope);
}
console.log('part1', part1(tInput));
console.log('part1', part1(rInput));

console.log('part2', part2(tInput));
console.log('part2', part2(rInput));
