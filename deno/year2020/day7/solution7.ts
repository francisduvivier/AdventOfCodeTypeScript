import { anyTruthy, sum } from "../../year2019/util/MapReduce.ts";
import { rInput, tInput } from "./input.ts";

function cBagObj(bagLine) {
    const match = bagLine.match('^(.+) bags contain');
    const color = match?.[1]
    const colorDeps = [...bagLine.matchAll(' (\[0-9]+) ([^.,]+) bags?[.,]')].map(match => {
        return { amount: match[1], color: match[2] }
    });
    // console.log([...colorDeps])
    return {
        color, colorDeps
    }
}

const mMap = {}

function addToMap(bo) {
    mMap[bo.color] = bo.colorDeps;
    // console.log('mMap[bo.color]', mMap[bo.color])
}

function canHaveShinyGoldRec(boColor) {
    if (boColor == 'shiny gold') {
        return true;
    }
    if (!mMap[boColor].length) {
        return false;
    } else {
        return anyTruthy(mMap[boColor].map(colorDep =>
            canHaveShinyGoldRec(colorDep.color)))
    }
}

function part1(input) {
    const bagLines = input.split('\n');
    const bagObjects = bagLines.map(cBagObj)
    bagObjects.forEach(addToMap)
    let scores = bagObjects.filter((bo) => bo.color !== 'shiny gold').map(bo => canHaveShinyGoldRec(bo.color))
    return sum(scores.map(val => val ? 1 : 0))
}

function countBagsRec(colorName) {
    return 1 + sum(mMap[colorName].map(colorDep =>
        colorDep.amount * countBagsRec(colorDep.color)))
}

function part2(input) {
    const bagLines = input.split('\n');
    const bagObjects = bagLines.map(cBagObj)
    bagObjects.forEach(addToMap)
    let score = countBagsRec('shiny gold') - 1
    return score;
}

console.log('part1 test', part1(tInput));
console.log('part1', part1(rInput));
console.log('part2', part2(rInput));