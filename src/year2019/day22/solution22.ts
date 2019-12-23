import {input} from "./input";
import * as assert from "assert";
import Long from "long";
// const DEBUG = false;
const DEBUG = true;


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
        const currIndex = (i * increment) % startCards.length;
        assert.deepEqual(newCards[currIndex], undefined, '' + increment + ', i ' + i);
        newCards[currIndex] = startCards[i];
        // startCards.length < 100 && console.log(currIndex, '->', i, startCards.length, increment)
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
    DEBUG && console.log('doing part1');

    let cards: number[] = [];
    for (let i = 0; i < nbStartCards; i++) {
        cards.push(i);
    }
    const instructs = inputString.split('\n');

    DEBUG && assert.deepEqual(doIncrement([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3), [0, 7, 4, 1, 8, 5, 2, 9, 6, 3]);
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
    if (currTargetPos % increment == 0) {
        return currTargetPos / increment;
    }
    let testV = 1;
    while (((totalNbCards % increment) * testV + currTargetPos) % increment !== 0) {
        if (testV > increment) {
            throw 'invalid state';
        }
        testV++;
    }
    const result = (totalNbCards * testV + currTargetPos) / increment;
    // console.log('testV', testV);
    DEBUG && assert.deepEqual((result * increment) % totalNbCards, currTargetPos, `increment [${increment}], currTargetPos [${currTargetPos}], totalNbCards [${totalNbCards}], (result * increment) % totalNbCards${(result * increment) % totalNbCards},`);
    return result;
    // let currI = 1;
    // let result = (totalNbCards / currI + currTargetPos) / increment;
    // while (!isRound(result)) {
    //     currI++;
    //     result = (totalNbCards / currI + currTargetPos) / increment;
    // }
    // if (result < 0) {
    //     result = totalNbCards + result;
    // }
    // assert.deepEqual((result * increment) % totalNbCards, currTargetPos);
    //
    // return result;
}

assert.deepEqual(doIncrementRev(3, 0, 10), 0);

assert.deepEqual(doIncrementRev(2, 1, 9), testIncrement(2, 9)[1]);
assert.deepEqual(doIncrementRev(2, 2, 9), 1);

assert.deepEqual(doIncrementRev(2, 8, 9), 4);
assert.deepEqual(doIncrementRev(3, 1, 10), 7);
assert.deepEqual(doIncrementRev(3, 3, 10), 1);
assert.deepEqual(doIncrementRev(3, 2, 10), 4);
assert.deepEqual(doIncrementRev(3, 8, 10), 6);
assert.deepEqual(
    doIncrementRev(4,
        9,
        15), testIncrement(4, 15)[9]);
assert.deepEqual(
    doIncrementRev(3,
        4,
        19), testIncrement(3, 19)[4]);


assert.deepEqual(
    doIncrementRev(4,
        10000,
        10007), testIncrement(4, 10007,)[10000]);


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

export function doReverseRev(oldTargetPos: number, totalNbCards: number) {
    oldTargetPos = totalNbCards - 1 - oldTargetPos;
    return oldTargetPos;
}


function shuffleNumber(instructsReversed: string[], maxNumber: number) {
    let m = Long.ONE;
    let a = Long.ZERO;
    for (let op of instructsReversed) {
        if (op.startsWith(CUT)) {
            const nbCardsToCut = Number(op.slice(CUT_LEN));
            a = a.sub(nbCardsToCut);
        } else if (op.startsWith(INCR)) {
            const increment = Number(op.slice(INCR_LEN));
            m = m.mul(increment).mod(maxNumber);
            a = a.mul(increment).mod(maxNumber);
        } else if (op.startsWith('deal into new stack')) {
            m = m.neg();
            a = a.neg().sub(1);
        }
    }
    return {m, a};
}

function part2(inputString: string, totalNbCards: number, totalNbTimes: number, targetCard: number) {
    DEBUG && console.log('doing part2');
    const reversedInstructs = inputString.split('\n');
    const prev2020Positions: number[] = [];
    let curr2020Pos = targetCard;
    DEBUG && assert.deepEqual(prev2020Positions.indexOf(curr2020Pos), -1, '' + curr2020Pos);
    DEBUG && prev2020Positions.push(curr2020Pos);
    const {m, a} = shuffleNumber(reversedInstructs, totalNbCards);
    console.log('m,a', m, a);
    let timesDone = Long.ZERO;
    let currCTot = Long.ONE;
    let currYTot = Long.ZERO;
    while (timesDone.lessThan(totalNbTimes)) {
        let currY = a;
        let currC = m;
        let currPower = 0;
        while (timesDone.add(Math.pow(2, currPower + 1)).lessThan(totalNbTimes)) {
            const oldY = currY;
            currY = currY.mul(currC).mod(totalNbCards).add(oldY);
            currC = currC.mul(currC).mod(totalNbCards);
            currPower++;
        }
        currCTot = currCTot.mul(currC).mod(totalNbCards);
        currYTot = currYTot.mul(currC).mod(totalNbCards).add(currY);
        timesDone = timesDone.add(Math.pow(2, currPower));
    }
    assert.deepEqual(timesDone.toNumber(), totalNbTimes);


    console.log('FOUND something!', timesDone, `\n${targetCard} = (x* ${currCTot.toString()} +${currYTot.toString()}) mod ${totalNbCards}\n pos [${currCTot.mul(targetCard).add(currYTot).mod(totalNbCards).toString()}]`);

    function isTheOne(kVal: number, mult: Long, add: Long, maxNumb: Long, target: number) {
        const ktimesMax = maxNumb.neg().mul(kVal);
        const xNom = (ktimesMax.add(target).sub(add));
        const result = xNom.mod(mult).isZero();
        return result ? xNom.div(mult).toNumber() : undefined;
    }

    let currK = 0;
    const totalNbCardsL = Long.fromNumber(totalNbCards);
    let x = isTheOne(currK, currCTot, currYTot, totalNbCardsL, curr2020Pos);
    const startDate = Date.now();
    let lastPrint = Date.now();

    console.log('totalNbTimes', totalNbTimes);
    while (x == undefined) {
        currK++;
        x = isTheOne(currK, currCTot, currYTot, totalNbCardsL, curr2020Pos);
        if (x == undefined) {
            x = isTheOne(-currK, currCTot, currYTot, totalNbCardsL, curr2020Pos);
        }
        if (Date.now() - lastPrint > 1000) {
            DEBUG && console.log(currK, 1000 * currK / (Date.now() - startDate) + '/s');
            lastPrint = Date.now();
        }
    }
// curr2020Pos = curr2020Pos/bigPower - a * (m != 1 ? ((1 - bigPower) / bigPower*(1 - m)) : 1);
    curr2020Pos = x % totalNbCards;
    if (curr2020Pos < 0) {
        curr2020Pos = totalNbCards + curr2020Pos;
    }
    console.log('curr2020Pos', curr2020Pos)
    return curr2020Pos;
}


let times = 0;
times = 1;
let inputString = input.split('\n')[0];
assert.deepEqual(part2(inputString, 10007, times, 2020), part1(inputString, 10007, times)[(2020)]);
inputString = input.split('\n')[3];
assert.deepEqual(part2(inputString, 10007, times, 2020), part1(inputString, 10007, times)[(2020)]);
inputString = input.split('\n')[4];
assert.deepEqual(part2(inputString, 10007, times, 2020), part1(inputString, 10007, times)[(2020)]);
inputString = input.split('\n')[7];
assert.deepEqual(part2(inputString, 10007, times, 2020), part1(inputString, 10007, times)[(2020)]);
inputString = input.split('\n')[1];
assert.deepEqual(part2(inputString, 10007, times, 2020), part1(inputString, 10007, times)[(2020)]);

assert.deepEqual(part2(input, 10007, times, 2020), part1(input, 10007, times)[(2020)]);
assert.deepEqual(part2(input, 10007, times, 214), part1(input, 10007, times)[(214)]);
assert.deepEqual(part2(input, 10007, times, 9999), part1(input, 10007, times)[(9999)]);

times = 107;
input.split('\n')[0];
assert.deepEqual(part2(inputString, 10007, times, 2020), part1(inputString, 10007, times)[(2020)]);
inputString = input.split('\n')[1];
assert.deepEqual(part2(inputString, 10007, times, 2020), part1(inputString, 10007, times)[(2020)]);
inputString = input.split('\n')[3];
assert.deepEqual(part2(inputString, 10007, times, 2020), part1(inputString, 10007, times)[(2020)]);
inputString = input.split('\n').slice(0, 2).join('\n');
assert.deepEqual(part2(inputString, 10007, times, 2020), part1(inputString, 10007, times)[(2020)]);

// assert.deepEqual(part2(input, 10007, times, 2020), part1(input, 10007, times)[(2020)]);
//
//
// times = 10007;
// assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
// console.log('1')
// inputString = input.split('\n')[3];
// assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
//
// console.log('2')
// inputString = input.split('\n')[1];
//
// assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
// console.log('3')
// inputString = input.split('\n').slice(0, 2).join('\n');
// assert.deepEqual(part1(inputString, 10007, times)[2020], part2(inputString, 10007, times, 2020));
// console.log('4')

// assert.deepEqual(part1(input, 10007, times)[2020], part2(input, 10007, times, 2020));
console.log('simpleSuccess');
// part2(input, 119315717514047, 101741582076661, 59681423049027); fail
const result = part2(input, 119315717514047, 101741582076661, 2020);
part2(input, 119315717514047, 101741582076661, result);
console.log(result);
// assert.deepEqual(doShuffle(101741582076661, input, 2020, 101741582076661), 1538);