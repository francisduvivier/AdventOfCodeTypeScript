import { allTruthy, sum } from "../../year2019/util/MapReduce.ts";

const rInput = Deno.readTextFileSync('./input.txt');
const tInput = Deno.readTextFileSync('./testinput.txt');

function part1(input) {
    const groups = input.split('\n\n');
    const score = (g) => {
        const unique = new Set();
        const persons = g.split('\n');
        persons.forEach(p => p.split('').forEach(l => unique.add(l)))
        return unique.size;
    };
    let scores = groups.map(score);
    return sum(scores)
}

function part2(input) {
    const groups = input.split('\n\n');
    const score = (g) => {
        const persons = g.split('\n');
        let uniqueFiltered = persons[0].split('')
        uniqueFiltered = uniqueFiltered.filter(l => allTruthy(persons.slice(1).map(p => p.indexOf(l) != -1)))
        return uniqueFiltered.length;
    };
    let scores = groups.map(score);
    return sum(scores)
}

console.log('part1 test', part1(tInput));
console.log('part1', part1(rInput));

console.log('part2 test', part2(tInput));
console.log('part2', part2(rInput));
