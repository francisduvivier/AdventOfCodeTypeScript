import {input} from "./input";
import * as assert from "assert";
import {CUT, CUT_LEN, INCR, INCR_LEN, part1} from "./part1";
// const DEBUG = false;
const DEBUG = false;

function shuffleNumber(instructs: string[], maxNumber: bigint) {
    let m: bigint = BigInt(1);
    let a: bigint = BigInt(0);
    for (let op of instructs) {
        if (op.startsWith(CUT)) {
            const nbCardsToCut = BigInt(op.slice(CUT_LEN));
            a = a - (nbCardsToCut);
        } else if (op.startsWith(INCR)) {
            const increment = BigInt(op.slice(INCR_LEN));
            m = m * (increment) % (maxNumber);
            a = a * (increment) % (maxNumber);
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
    (DEBUG || totalNbTimes > 1000000n) && console.log(`m,a formula:\n TARGET= (x* ${bigPower} +${a.toString()} *(1 - ${bigPower})/(1-${m.toString()})) mod ${totalNbCards}\n`);
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
    assert.deepEqual(timesDone.toString(), totalNbTimes.toString(), '' + (timesDone < (totalNbTimes)) + ',' + timesDone + ',' + totalNbTimes);
    (DEBUG || totalNbTimes > 1000000n) && console.log('FOUND something!', timesDone.toString(), `\n TARGET= (x* ${currCTot.toString()} +${currYTot.toString()}) mod ${totalNbCards}\n`);
    return {currCTot, currYTot};
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
    let reverse = currCTot * (targetCard) + (currYTot) % (totalNbCards);
    if (reverse < 0n) {
        reverse = reverse + (totalNbCards);
    }
    (DEBUG || totalNbTimes > 1000000) && console.log('reverse number', reverse.toString());

    function isTheOne(kVal: bigint, mult: bigint, add: bigint, maxNumb: bigint, target: bigint) {
        const ktimesMax = maxNumb*(kVal);
        const xNom = (ktimesMax + (target) - (add));
        const result = xNom % (mult) == 0n;
        return result ? xNom/ mult : undefined;
    }

    let currK = 0n;
    let x = isTheOne(currK, currCTot, currYTot, totalNbCards, targetCard);
    const startDate = Date.now();
    let lastPrint = Date.now();

    DEBUG && console.log('totalNbTimes', totalNbTimes);
    while (x == undefined) {
        currK++;
        x = isTheOne(currK, currCTot, currYTot, totalNbCards, targetCard);
        if (x == undefined) {
            x = isTheOne(-currK, currCTot, currYTot, totalNbCards, targetCard);
        }
        if (Date.now() - lastPrint > 1000n) {
            DEBUG && console.log(currK, 1000 * Number(currK.toString()) / (Date.now() - startDate) + '/s');
            lastPrint = Date.now();
        }
    }
// curr2020Pos = curr2020Pos/bigPower - a * (m != 1 ? ((1 - bigPower) / bigPower*(1 - m)) : 1);
    let valueAt2020 = x % (totalNbCards);
    if (valueAt2020 < 0n) {
        valueAt2020 = valueAt2020 + (totalNbCards);
    }
    return {result: valueAt2020, reverse: reverse};
}

function doQuickTests() {
    let times = 0;
    times = 1;
    let inputString = input.split('\n')[0];
    checkPart2(inputString, 10007, times);
    inputString = input.split('\n')[3];
    checkPart2(inputString, 10007, times);
    inputString = input.split('\n')[4];
    checkPart2(inputString, 10007, times);
    inputString = input.split('\n')[7];
    checkPart2(inputString, 10007, times);
    inputString = input.split('\n')[1];
    checkPart2(inputString, 10007, times);

    checkPart2(input, 10007, times);
    checkPart2(input, 10007, times);
    checkPart2(input, 10007, times);

    function checkPart2(input: string, totalNbCards: number, times: number) {

        console.log('doing checkPart2', totalNbCards, times);
        const part1Result = part1(input, totalNbCards, times);
        console.log('did part1', totalNbCards, times);
        for (let i = 0; i < totalNbCards; i++) {
            const part2Results = part2(input, totalNbCards, times, i);
            assert.deepEqual(part2Results.result, part1Result[i]);
            assert.deepEqual(part2(input, totalNbCards, times, part2Results.result).reverse, i);
        }
        console.log('did checkPart2', totalNbCards, times);
    }

    times = 11;
    const totalNbCards = 10007;
    checkPart2(input.split('\n')[0], totalNbCards, times);
    checkPart2(input.split('\n')[0], totalNbCards, times);
    checkPart2(input.split('\n')[0], totalNbCards, times);
    checkPart2(input.split('\n').slice(0, 10).join('\n'), totalNbCards, times);
}

DEBUG &&
doQuickTests();

part2(input, 119315717514047, 101741582076661, 2020);


// 2020= (x* (-49410182999439**101741582076661) +33371205102045 *(1 - (-49410182999439**101741582076661))/(1--49410182999439)) mod 119315717514047
// 2020= (x* (-49410182999439^101741582076661) +33371205102045 *(1 - (-49410182999439^101741582076661))/(1--49410182999439)) mod 119315717514047
// 2020= (2020* (-49410182999439**x) +33371205102045 *(1 - (-49410182999439**x))/(1--49410182999439))) mod 119315717514047
// console.log('computing part 1 for full input with 10007 and times ' + times);
// checkPart2(input, 10007, times);
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
part2(input, 119315717514047, 101741582076661, result.result);
console.log(result);
// assert.deepEqual(doShuffle(101741582076661, input, 2020, 101741582076661), 1538);
// not 25345638561473, 59681423049027