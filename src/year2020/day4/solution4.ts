import * as fs from 'fs';
import { allTruthy } from "../../year2019/util/MapReduce";

const rInput = fs.readFileSync('./src/year2020/day4/input.txt', { encoding: 'UTF8' });
const tInput = fs.readFileSync('./src/year2020/day4/testinput.txt', { encoding: 'UTF8' });

const fields = [
    'byr', // (Birth Year)
    'iyr', // (Issue Year)
    'eyr', // (Expiration Year)
    'hgt', // (Height)
    'hcl', // (Hair Color)
    'ecl', // (Eye Color)
    'pid', // (Passport ID)
    // 'cid', // (Country ID)
] as const;

function part1(input) {
    const lines = input.split('\n\n');
    let valid = 0;
    lines.forEach((line) => {
        if (allTruthy(fields.map(f => line.indexOf(f + ':') !== -1))) {
            valid++;
        }
    })
    return valid
}

const validators = {
    byr: (val?) => {
        return val?.match(/^\d\d\d\d$/) && +val >= 1920 && +val <= 2002;
    }, //(Birth Year) four digits; at least 1920 and at most 2002.
    iyr: (val?) => {
        return val?.match(/^\d\d\d\d$/) && +val >= 2010 && +val <= 2020;
    }, //(Issue Year) four digits; at least 2010 and at most 2020.
    eyr: (val?) => {
        return val?.match(/^\d\d\d\d$/) && +val >= 2020 && +val <= 2030;
    }, //(Expiration Year) four digits; at least 2020 and at most 2030.
    hgt: (val?) => {
        const match = val?.match(/^(\d+)(cm|in)$/);
        const digits = match?.[1];
        if (match?.[2] === 'cm') {
            return +digits >= 150 && +digits <= 193; // the number must be at least 150 and at most 193.
        } else if (match?.[2] === 'in') {
            return +digits >= 59 && +digits <= 76;// the number must be at least 59 and at most 76.
        }
        return false;
    }, //(Height) a number followed by either cm or in:
    hcl: (val?) => {
        return val?.match(/^#[0-9a-f]{6}$/);
    }, //(Hair Color) a # followed by exactly six characters 0-9 or a-f.
    ecl: (val?) => {
        return val?.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/);
    }, //(Eye Color) exactly one of: amb blu brn gry grn hzl oth.
    pid: (val?) => {
        return val?.match(/^\d{9}$/);
    }, //(Passport ID) a nine-digit number, including leading zeroes.
    cid: (val?) => {
        return true;
    }, //(Country ID) ignored, missing or not.
}


function part2(input) {
    const lines = input.split('\n\n');
    let valid = 0;

    function getVal(line, f: string) {
        let match = line.match(f+':([^ \n]+)');
        return match?.[1];
    }

    lines.forEach((line) => {
        const fieldChecker = f => validators[f](getVal(line, f));
        if (allTruthy(fields.map(fieldChecker))) {
            valid++;
        }
    })
    return valid
}

console.log('part1 test', part1(tInput));
console.log('part1', part1(rInput));

console.log('part2', part2(tInput));
console.log('part2', part2(rInput));
