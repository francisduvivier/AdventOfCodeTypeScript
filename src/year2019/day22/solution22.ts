import {input} from "./input";
import * as assert from "assert";
import {isRound} from "../util/Math";


const CUT = 'cut ';
const CUT_LEN = CUT.length;

const INCR = 'deal with increment ';
const INCR_LEN = INCR.length;

function doCut(cards: number[], nbCardsToCut: number) {
    let spliceNumber = nbCardsToCut > 0 ? nbCardsToCut : cards.length + nbCardsToCut;
    const spliced = cards.splice(0, spliceNumber);
    cards.push(...spliced);
    return cards
}


function doIncrement(startCards: number[], increment: number) {
    const newCards: number[] = [];
    for (let i = 0; i < startCards.length; i++) {
        assert.deepEqual(newCards[(i * increment) % startCards.length], undefined, '' + increment + ', i ' + i);
        newCards[(i * increment) % startCards.length] = startCards[i];
    }
    return newCards;
}


function doReverse(cards: number[]) {
    cards = cards.reverse();
    return cards;
}

export function testCut(totalNbCards: number, nbCardsToCut: number) {
    let cards: number[] = [];

    for (let i = 0; i < totalNbCards; i++) {
        cards[i] = i;
    }
    return doCut(cards, nbCardsToCut);
}

export function testReverse(totalNbCards: number, targetCard: number) {
    let cards: number[] = [];

    for (let i = 0; i < totalNbCards; i++) {
        cards[i] = i;
    }
    return doReverse(cards)[targetCard];
}


export function testIncrement(incr: number, totalNbCards: number) {
    let cards: number[] = [];

    for (let i = 0; i < totalNbCards; i++) {
        cards[i] = i;
    }
    return doIncrement(cards, incr);
}

function part1(inputString: string, nbStartCards: number, times: number = 1) {


    let cards: number[] = [];
    for (let i = 0; i < nbStartCards; i++) {
        cards.push(i);
    }
    const instructs = inputString.split('\n');

    assert.deepEqual(doIncrement([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3), [0, 7, 4, 1, 8, 5, 2, 9, 6, 3]);
    for (let i = 0; i < times; i++) {
        for (let op of instructs) {
            if (op.startsWith(CUT)) {
                const nbCardsToCut = Number(op.slice(CUT_LEN));
                cards = doCut(cards, nbCardsToCut);
            } else if (op.startsWith(INCR)) {
                const increment = Number(op.slice(INCR_LEN));
                cards = doIncrement(cards, increment);
            } else if (op.startsWith('deal into new stack')) {
                cards = doReverse(cards);
            }
        }
    }
    return cards;
}

const testInput1 = `deal with increment 7
deal into new stack
deal into new stack`;
const testSol1 = [0, 3, 6, 9, 2, 5, 8, 1, 4, 7];
assert.deepEqual(part1(testInput1, 10), testSol1);
const testInput2 = `deal with increment 7
deal with increment 9
cut -2`;
const testSol2 = [6, 3, 0, 7, 4, 1, 8, 5, 2, 9];
assert.deepEqual(part1(testInput2, 10), testSol2);

const testInput3 = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`;
const testSol3 = [9, 2, 5, 8, 1, 4, 7, 0, 3, 6];
assert.deepEqual(part1(testInput3, 10), testSol3);

const actual = part1(input, 10007).indexOf(2019);
console.log(actual);
assert.deepEqual(actual, 1538);

function doIncrementRev(increment: number, currTargetPos: number, totalNbCards: number) {
    // console.log(increment, currTargetPos, totalNbCards);
    // let currI = 0;
    // let result = (currI * nbCards - currTargetPos) / increment;
    // while (!isRound(result)) {
    //     currI++;
    //     result = (currI * nbCards - currTargetPos) / increment;
    // }
    // if (result < 0) {
    //     result = nbCards + result;
    // }
    isRound;
    let result = 0;
    while ((result * increment) % totalNbCards !== currTargetPos) {
        result++
    }
    assert.deepEqual((result * increment) % totalNbCards, currTargetPos);
    return result;
}

assert.deepEqual(
    doIncrementRev(30,
        1999,
        10007), testIncrement(30, 10007)[1999]);


assert.deepEqual(
    doIncrementRev(30,
        10000,
        10007), testIncrement(30, 10007,)[10000]);


function doCutRev(nbCardsToCut: number, oldTargetPos: number, totalNbCards: number) {
    let result = (oldTargetPos + nbCardsToCut) % totalNbCards;
    if (result < 0) {
        result = totalNbCards + result;
    }
    return result;
}

assert.deepEqual(
    doCutRev(30,
        2014,
        10007), testCut(10007, 30)[2014]);
assert.deepEqual(
    doCutRev(-30,
        2014,
        10007), testCut(10007, -30)[2014]);

assert.deepEqual(
    doCutRev(-30,
        10000,
        10007), testCut(10007, -30)[10000]);
assert.deepEqual(
    doCutRev(30,
        10000,
        10007), testCut(10007, 30)[10000]);

function doReverseRev(oldTargetPos: number, totalNbCards: number) {
    oldTargetPos = totalNbCards - 1 - oldTargetPos;
    return oldTargetPos;
}


function shuffleNumber(currTargetPos: number, reversedInstructs: string[], totalNbCards: number) {
    let oldTargetPos = currTargetPos;
    for (let op of reversedInstructs) {
        if (op.startsWith(CUT)) {
            const nbCardsToCut = Number(op.slice(CUT_LEN));
            oldTargetPos = doCutRev(nbCardsToCut, oldTargetPos, totalNbCards);

        } else if (op.startsWith(INCR)) {
            const increment = Number(op.slice(INCR_LEN));
            oldTargetPos = doIncrementRev(increment, oldTargetPos, totalNbCards);
        } else if (op.startsWith('deal into new stack')) {
            oldTargetPos = doReverseRev(oldTargetPos, totalNbCards);
        }
    }
    console.log('shuffleNumber', currTargetPos, oldTargetPos);
    return oldTargetPos;
}

function part2(inputString: string, totalNbCards: number, times: number = totalNbCards, targetCard: number) {
    const instructs = inputString.split('\n');
    const prev2020Positions: number[] = [];
    let curr2020Pos = targetCard;


    const revInstructs = instructs.reverse();
    curr2020Pos = shuffleNumber(curr2020Pos, revInstructs, totalNbCards);
    let currTimes = 1;
    prev2020Positions;
    while (curr2020Pos != targetCard && currTimes < times) {
        // assert.deepEqual(prev2020Positions.indexOf(curr2020Pos), -1, '' + curr2020Pos);
        // prev2020Positions.push(curr2020Pos);
        curr2020Pos = shuffleNumber(curr2020Pos, revInstructs,totalNbCards);
        currTimes++;
    }
    const remainingTimes = times % currTimes;
    for (let i = 0; i < remainingTimes; i++) {
        curr2020Pos = shuffleNumber(curr2020Pos, revInstructs, totalNbCards);
    }
    console.log(currTimes, remainingTimes);
    return curr2020Pos;
}


let times = 0;
times = 1;
let inputString = input.split('\n')[0];
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
inputString = input.split('\n')[3];
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
inputString = input.split('\n')[1];
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));

assert.deepEqual(part1(input, 10007, times)[2020], part2(input, 10007, times, 2020));
assert.deepEqual(part1(input, 10007, times)[214], part2(input, 10007, times, 214));
assert.deepEqual(part1(input, 10007, times)[9999], part2(input, 10007, times, 9999));

times = 10;
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
inputString = input.split('\n')[3];
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
inputString = input.split('\n')[1];
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
inputString = input.split('\n').slice(0, 2).join('\n');
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));

assert.deepEqual(part1(input, 10007, times)[2020], part2(input, 10007, times, 2020));


times = 500;
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
inputString = input.split('\n')[3];
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
inputString = input.split('\n')[1];
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
inputString = input.split('\n').slice(0, 2).join('\n');
assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));

assert.deepEqual(part1(input, 10007, times)[2020], part2(input, 10007, times, 2020));
console.log('simpleSuccess');
console.log(part2(input, 101741582076661, 1, 2020));
// assert.deepEqual(doShuffle(101741582076661, input, 2020, 101741582076661), 1538);