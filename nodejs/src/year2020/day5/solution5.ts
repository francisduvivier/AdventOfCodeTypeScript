import * as fs from 'fs';
import { P } from "../../year2019/util/Grid";

const rInput = fs.readFileSync('./src/year2020/day5/input.txt', { encoding: 'UTF8' });
const tInput = fs.readFileSync('./src/year2020/day5/testinput.txt', { encoding: 'UTF8' });

function toNumber(code: string): number {
    code = code.replace(/[FL]/g, '0')
    code = code.replace(/[BR]/g, '1')
    if (!code.match('^[01]+$')) {
        throw 'sanity fail'
    }
    const result = Number.parseInt(code, 2);
    if (!(result >= 0) || !(result <= 128)) {
        throw 'sanity fail'
    }
    return result
}

function toRowCol(line): P {
    const rowPart = line.substr(0, 7)
    const colPart = line.substr(7, 3)
    return P(
        toNumber(rowPart),
        toNumber(colPart)
    )
}

function toId(rowCol: P) {
    if (!rowCol) return -1;
    return rowCol.row * 8 + rowCol.col;
}

function part1(input) {
    const lines = input.split('\n');
    const seats = lines.map(toRowCol);
    const ids = seats.map(toId);
    return Math.max(...ids)
}

function part2(input) {
    const lines = input.split('\n');
    const seats = lines.map(toRowCol);
    const sortedSeats = seats.sort((seata, seatb) => toId(seata) - toId(seatb));
    return toId(sortedSeats.slice(0, sortedSeats.length - 1).find((curr, index) => {
        if (toId(curr) + 2 === toId(sortedSeats[index + 1])) {
            return true
        }
        return false;
    })) + 1;
}

console.log('part1 test', part1(tInput));
console.log('part1', part1(rInput));

console.log('part2 test', part2(tInput));
console.log('part2', part2(rInput));
