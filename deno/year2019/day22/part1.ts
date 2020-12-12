import {input} from "./input.ts";
import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";

const DEBUG = false;
export const CUT = 'cut ';
export const CUT_LEN = CUT.length;
export const INCR = 'deal with increment ';
export const INCR_LEN = INCR.length;

export function doCut(cards: number[], nbCardsToCut: number) {
    let spliceNumber = nbCardsToCut > 0 ? nbCardsToCut : cards.length + nbCardsToCut;
    const spliced = cards.splice(0, spliceNumber);
    cards.push(...spliced);
    return cards
}

export function doIncrement(startCards: number[], increment: number) {
    const newCards: number[] = [];
    for (let i = 0; i < startCards.length; i++) {
        const newIndex = (i * increment) % startCards.length;
        assertEquals(newCards[newIndex], undefined, '' + increment + ', i ' + i);
        newCards[newIndex] = startCards[i];
        // startCards.length < 100 && console.log(newIndex, '->', i, startCards.length, increment)
    }
    return newCards;
}

export function doReverse(cards: number[]) {
    cards = cards.reverse();
    return cards;
}

export function part1(inputString: string, nbStartCards: number, times: number = 1) {
    DEBUG && console.log('doing part1');

    let cards: number[] = [];
    for (let i = 0; i < nbStartCards; i++) {
        cards.push(i);
    }
    const instructs = inputString.split('\n');

    DEBUG && assertEquals(doIncrement([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3), [0, 7, 4, 1, 8, 5, 2, 9, 6, 3]);
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

export const testInput1 = `deal with increment 7
deal into new stack
deal into new stack`;
export const testSol1 = [0, 3, 6, 9, 2, 5, 8, 1, 4, 7];
export const testInput2 = `deal with increment 7
deal with increment 9
cut -2`;
export const testSol2 = [6, 3, 0, 7, 4, 1, 8, 5, 2, 9];
export const testInput3 = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`;
export const testSol3 = [9, 2, 5, 8, 1, 4, 7, 0, 3, 6];

export function runPart1() {
    assertEquals(part1(testInput1, 10), testSol1);
    assertEquals(part1(testInput2, 10), testSol2);
    assertEquals(part1(testInput3, 10), testSol3);

    const actual = part1(input, 10007).indexOf(2019);
    return actual;
}