import {input} from "./input.ts";
import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import {CUT, CUT_LEN, INCR, INCR_LEN, part1, runPart1} from "./part1.ts";
import {logAndPushSolution} from "../util/SolutionHandler.ts";
// const DEBUG = false;
const DEBUG = false;
const solutions: number[] = [];
const part1Solution = runPart1();
assertEquals(part1Solution, 1538);
logAndPushSolution(part1Solution, solutions);

function shuffleNumber(instructs: string[], maxNumber: bigint) {
    let m: bigint = BigInt(1);
    let a: bigint = BigInt(0);
    for (let op of instructs) {
        if (op.startsWith(CUT)) {
            const nbCardsToCut = BigInt(op.slice(CUT_LEN));
            a = a - (nbCardsToCut);
        } else if (op.startsWith(INCR)) {
            const increment = BigInt(op.slice(INCR_LEN));
            m = (m * (increment)) % (maxNumber);
            a = (a * (increment)) % (maxNumber);
        } else if (op.startsWith('deal into new stack')) {
            m = -m;
            a = -(a + 1n);
        }
    }
    return {m, a};
}

function shuffleNumberTimes(instructs: string[], totalNbCards: bigint, totalNbTimes: bigint) {
    const {m, a} = shuffleNumber(instructs, totalNbCards);
    const bigPower = `(${m.toString()}**${totalNbTimes.toString()})`;
    (DEBUG) && console.log(`m,a formula:\n TARGET= (x* ${bigPower} +${a.toString()} *(1 - ${bigPower})/(1-${m.toString()})) mod ${totalNbCards}\n`);
    let timesDone = 0n;
    let currCTot = 1n;
    let currYTot = 0n;
    while (timesDone < (totalNbTimes)) {
        let currY = a;
        let currC = m;
        let currPower = 0n;
        while (timesDone + (2n ** (currPower + 1n)) < (totalNbTimes)) {
            const oldY = currY;
            currY = (currY * (currC) + (oldY)) % (totalNbCards);
            currC = (currC ** 2n) % (totalNbCards);
            currPower++;
        }
        currCTot = (currCTot * (currC)) % (totalNbCards);
        currYTot = (currYTot * (currC) + (currY)) % (totalNbCards);
        timesDone = timesDone + (2n ** currPower);
    }
    assertEquals(timesDone.toString(), totalNbTimes.toString(), '' + (timesDone < (totalNbTimes)) + ',' + timesDone + ',' + totalNbTimes);
    (DEBUG) && console.log('FOUND something!', timesDone.toString(), `\n TARGET= (x* ${currCTot.toString()} +${currYTot.toString()}) mod ${totalNbCards}\n`);
    return {currCTot, currYTot};
}

function calcInverse(multiplier: bigint, addition: bigint, targetCard: bigint, totalNbCards: bigint) {
    const exponent = totalNbCards - 2n;
    let timesDone = 0n;
    let currTotal = (targetCard - addition);
    while (timesDone < (exponent)) {
        let curr2Power = 0n;
        let currExponential = multiplier;
        while (timesDone + (2n ** (curr2Power + 1n)) < (exponent)) {
            currExponential = (currExponential ** 2n) % (totalNbCards);
            curr2Power++;
        }
        currTotal = (currTotal * (currExponential)) % (totalNbCards);
        timesDone = timesDone + (2n ** curr2Power);
    }
    return currTotal;
}

function part2(inputString: string, totalNbCards: bigint | number, totalNbTimes: bigint | number, targetCard: bigint | number) {
    if (typeof targetCard == 'number') {
        targetCard = BigInt(targetCard);
    }
    if (typeof totalNbCards == 'number') {
        totalNbCards = BigInt(totalNbCards);
    }
    if (typeof totalNbTimes == 'number') {
        totalNbTimes = BigInt(totalNbTimes);
    }
    DEBUG && console.log('doing part2');
    const instructs = inputString.split('\n');
    let {currCTot, currYTot} = shuffleNumberTimes(instructs, totalNbCards, totalNbTimes);
    let reverse = (currCTot * (targetCard) + (currYTot)) % (totalNbCards);
    if (reverse < 0n) {
        reverse = reverse + (totalNbCards);
    }
    (DEBUG) && console.log('reverse number', reverse.toString());
    let valueAt2020 = calcInverse(currCTot, currYTot, targetCard, totalNbCards);
    if (valueAt2020 < 0n) {
        valueAt2020 = valueAt2020 + (totalNbCards);
    }
    return {result: valueAt2020, reverse: reverse};
}

const PART1_CARDS = 10007;

function doQuickTests() {
    let times = 0;
    times = 1;
    let inputString = input.split('\n')[0];
    checkPart2(inputString, PART1_CARDS, times);
    inputString = input.split('\n')[3];
    checkPart2(inputString, PART1_CARDS, times);
    inputString = input.split('\n')[4];
    checkPart2(inputString, PART1_CARDS, times);
    inputString = input.split('\n')[7];
    checkPart2(inputString, PART1_CARDS, times);
    inputString = input.split('\n')[1];
    checkPart2(inputString, PART1_CARDS, times);

    checkPart2(input, PART1_CARDS, times);
    checkPart2(input, PART1_CARDS, times);
    checkPart2(input, PART1_CARDS, times);
    checkPart2(input, PART1_CARDS, times);

    function checkPart2(input: string, totalNbCards: number, times: number) {

        console.log('doing checkPart2', totalNbCards, times);
        const part1Result = part1(input, totalNbCards, times);
        console.log('did part1', totalNbCards, times);
        for (let i = 0; i < totalNbCards; i++) {
            const part2Results = part2(input, totalNbCards, times, i);
            assertEquals(part2Results.result, part1Result[i]);
            assertEquals(part2(input, totalNbCards, times, part2Results.result).reverse, i);
        }
        console.log('did checkPart2', totalNbCards, times);
    }

    times = 11;
    const totalNbCards = PART1_CARDS;
    checkPart2(input.split('\n')[0], totalNbCards, times);
    checkPart2(input.split('\n')[0], totalNbCards, times);
    checkPart2(input.split('\n')[0], totalNbCards, times);
    checkPart2(input.split('\n').slice(0, 10).join('\n'), totalNbCards, times);
}

DEBUG &&
doQuickTests();

const PART2_TARGET = 2020n;
const PART2_TIMES = 101741582076661;
const PART2_CARDS = 119315717514047;
const part2Result = part2(input, PART2_CARDS, PART2_TIMES, PART2_TARGET).result;
assertEquals(part2(input, PART2_CARDS, PART2_TIMES, part2Result).reverse, PART2_TARGET);
logAndPushSolution(Number(part2Result), solutions);