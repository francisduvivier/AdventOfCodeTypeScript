import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { logAndPushSolution } from "../util/SolutionHandler.ts";
import { sum } from "../util/MapReduce.ts";

sum;
export const testInput1 = '80871224585914546619083218645595';
const input = '59750530221324194853012320069589312027523989854830232144164799228029162830477472078089790749906142587998642764059439173975199276254972017316624772614925079238407309384923979338502430726930592959991878698412537971672558832588540600963437409230550897544434635267172603132396722812334366528344715912756154006039512272491073906389218927420387151599044435060075148142946789007756800733869891008058075303490106699737554949348715600795187032293436328810969288892220127730287766004467730818489269295982526297430971411865028098708555709525646237713045259603175397623654950719275982134690893685598734136409536436003548128411943963263336042840301380655801969822';

function repeatPattern<T extends number>(basePattern: T[], times: number, maxLength?: number): T[] {
    let resultArray: T[] = [];
    for (let patval of basePattern) {
        for (let ip = 0; ip < times; ip++) {
            resultArray.push(patval);
            if (maxLength != undefined && resultArray.length >= maxLength) {
                return resultArray;
            }
        }
    }
    return resultArray;
}

export function repeat<T extends number>(basePattern: T[], times: number, maxLength?: number): T[] {
    let resultArray: T[] = [];
    for (let time = 0; time < times; time++) {
        resultArray.push(...basePattern);
    }
    return resultArray;
}

assertEquals(repeatPattern([0, 1, 0, -1], 1), [0, 1, 0, -1]);
assertEquals(repeatPattern([1, 2, 3, 5], 5), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5,]);
assertEquals(repeat([1, 2, 3, 5], 5), [1, 2, 3, 5, 1, 2, 3, 5, 1, 2, 3, 5, 1, 2, 3, 5, 1, 2, 3, 5]);
assertEquals(repeat('5asdfa21654' as any, 5), '5asdfa216545asdfa216545asdfa216545asdfa216545asdfa21654'.split(''));


function calcPattern(basePattern: SIGN[], repeatNb: number, maxLength?: number): SIGN[] {
    let resultArray: SIGN[] = [];
    for (let patval of basePattern) {
        for (let ip = 0; ip < repeatNb; ip++) {
            resultArray.push(patval);
            if (maxLength != undefined && resultArray.length >= maxLength + 1) {
                return resultArray.slice(1);
            }
        }
    }
    if (resultArray.length == 0) {
        throw `repeat ${basePattern}, ${repeatNb}, ${maxLength}) = [],`
    }
    resultArray.push(resultArray[0]);
    resultArray.splice(0, 1);
    return resultArray;
}

assertEquals(calcPattern([0, 1, 0, -1], 1, 10), [1, 0, -1, 0]);
assertEquals(calcPattern([0, 1, 0, -1], 3, 7), [0, 0, 1, 1, 1, 0, 0]);
assertEquals(calcPattern([0, 1, 0, -1], 3, 12), [0, 0, 1, 1, 1, 0, 0, 0, -1, -1, -1, 0]);


export function part1(inputNb: string): string {
    const nbPhases = 100;
    const basePattern: SIGN[] = [0, 1, 0, -1];
    const result = doFFTOld(nbPhases, inputNb.split('').map(Number), basePattern, 1);
    return result.join('');
}

assertEquals(part1(testInput1).slice(0, 8), '24176176');
assertEquals(part1('19617804207202209144916044189917').slice(0, 8), '73745418');
assertEquals(part1('69317163492948606335995924319873').slice(0, 8), '52432133');
const solutions: string[] = [];
logAndPushSolution(part1(input).slice(0, 8), solutions);


type SIGN = 0 | 1 | -1;

type ENDINDEXSUMMAP = { [key: number]: number, length: number };


function updateSumList(sumMap: ENDINDEXSUMMAP[], startIndex: number, endIndex: number): number {
    const DEBUG = false;
    DEBUG && console.assert(startIndex <= endIndex, '' + startIndex + ', ' + endIndex);
    const startSumList = sumMap[startIndex];
    DEBUG && console.log(startIndex, endIndex);
    DEBUG && console.assert(startSumList !== undefined, '' + startIndex + ', ' + endIndex);
    if (startSumList[endToRel(startIndex, endIndex)] !== undefined) {
        DEBUG && console.log('return');
        return startSumList[endToRel(startIndex, endIndex)];
    }
    let firstNextSmallerIndex = relToEnd(startIndex, startSumList.length);
    if (firstNextSmallerIndex > endIndex) {
        firstNextSmallerIndex = endIndex;
        while (startSumList[endToRel(startIndex, firstNextSmallerIndex - 1)] == undefined) {
            firstNextSmallerIndex--;
        }

    }
    DEBUG && console.log('firstNextSmallerIndex', firstNextSmallerIndex);
    updateSumList(sumMap, firstNextSmallerIndex, endIndex);
    const nextResult = sumMap[firstNextSmallerIndex][endToRel(firstNextSmallerIndex, endIndex)];
    DEBUG && console.assert(!isNaN(nextResult), 'bad result', nextResult, startIndex, endIndex, firstNextSmallerIndex, endToRel(firstNextSmallerIndex, endIndex))
    let startSumListElement = startSumList[endToRel(startIndex, firstNextSmallerIndex - 1)];
    DEBUG && console.assert(!isNaN(startSumListElement), 'bad result2', startSumListElement, startIndex, endIndex, firstNextSmallerIndex, endToRel(firstNextSmallerIndex, endIndex))

    startSumList[endToRel(startIndex, endIndex)] = startSumListElement + nextResult;
    return startSumList[endToRel(startIndex, endIndex)];
}

function getSumRec(sumMap: ENDINDEXSUMMAP[], absStartIndex: number, endIndex: number, fullInputLength: number): number {
    return updateSumList(sumMap, absStartIndex, endIndex);

}

export function endToRel(startIndex: number, endIndex: number) {
    return endIndex - startIndex
}

export function relToEnd(startIndex: number, rel: number) {
    return startIndex + rel;
}

function getSumMap(currInput: number[]) {
    const sumMap: ENDINDEXSUMMAP[] = currInput.map(el => [el]);
    return sumMap;
}

export function doFFTOld(nbPhases: number, unrepeatedStartInput: number[], basePattern: SIGN[], repeatInput = 1) {
    const startDate = Date.now();
    let lastShow: number = Date.now();
    let currInput = repeatPattern(unrepeatedStartInput, repeatInput);
    const fullInputLength = currInput.length;
    console.log('old fullInputLength', fullInputLength);
    const DEBUG = false;
    for (let phase = 0; phase < nbPhases; phase++) {
        const sumMap = getSumMap(currInput);
        repeatInput != 1 && console.log('phase: ' + phase);
        currInput = currInput.map((n1, iForPat) => {
            const times0 = iForPat + 1;
            const firstTimes0 = iForPat;
            let sum = 0;
            for (let absIndex = firstTimes0; absIndex < fullInputLength; absIndex += times0 * 2) {
                const sumNumber = getSumRec(sumMap, absIndex, Math.min(absIndex + times0 - 1, fullInputLength - 1), fullInputLength);
                DEBUG && console.assert(!isNaN(sumNumber));
                let patternNb: SIGN = ([1, 0, -1, 0] as SIGN[])[Math.floor((absIndex - firstTimes0) / times0) % 4];
                sum += patternNb == 1 ? sumNumber : -sumNumber;
                if (patternNb == 0) {
                    throw 'inefficient pattern nb absIndex: ' + absIndex
                }
            }


            return Math.abs(sum) % 10
        });
        if (true && repeatInput != 1) {
            const currDate = Date.now();
            if (currDate - lastShow > 1000) {
                let timeDiffSinceStart = currDate - startDate;
                let millisPerSum = (timeDiffSinceStart) / (phase + 1);
                console.log('did phase ', (phase + 1), 'left: ' + (nbPhases - (phase + 1)), 'will take ' + (nbPhases - (phase + 1)) * millisPerSum / 1000, 'sec');
                lastShow = currDate;
            }
        }
    }
    return currInput;
}

function doFFT(nbPhases: number, unrepeatedStartInput: number[], repeatInput, msgOffset: number = 0) {
    const startDate = Date.now();
    let lastShow: number = Date.now();
    let currInput = repeat(unrepeatedStartInput, repeatInput);
    const fullInputLength = currInput.length;
    console.log('new fullInputLength', fullInputLength);
    for (let phase = 0; phase < nbPhases; phase++) {
        const sumMap: number[] = [];

        for (let iForPat = currInput.length - 1; iForPat >= msgOffset - 1; iForPat--) {
            sumMap[iForPat] = (sumMap[iForPat + 1] || 0) + currInput[iForPat];
            currInput[iForPat] = Math.abs(sumMap[iForPat]) % 10
        }
        const currDate = Date.now();
        if (currDate - lastShow > 1000) {
            let timeDiffSinceStart = currDate - startDate;
            let millisPerSum = (timeDiffSinceStart) / (phase + 1);
            console.log('did phase ', (phase + 1), 'left: ' + (nbPhases - (phase + 1)), 'will take ' + (nbPhases - (phase + 1)) * millisPerSum / 1000, 'sec');
            lastShow = currDate;
        }
    }
    return currInput;
}


function part2(inputNb: string, repeatTimes = 10000): string {
    const msgOffset = Number(inputNb.slice(0, 7));
    const nbPhases = 100;
    const result = doFFT(nbPhases, inputNb.split('').map(Number), repeatTimes, msgOffset);
    console.log(result.length, msgOffset, result.slice(msgOffset, msgOffset + 8).join(''), result.slice(msgOffset + 7, msgOffset + 7 + 8).join(''));
    return result.slice(msgOffset, msgOffset + 8).join('');
}

console.log(part2('03036732577212944063491565474664', 10000), '84462026');
console.log(part2('02935109699940807407585447034323', 10000), '78725270');
logAndPushSolution(part2(input, 10000), solutions);
