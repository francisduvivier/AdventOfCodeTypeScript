import {input} from "./input";
import * as assert from "assert";


const CUT = 'cut ';
const CUT_LEN = CUT.length;

const INCR = 'deal with increment ';
const INCR_LEN = INCR.length;

function part1(nbStartCards: number, inputString: string) {
    let cards: number[] = [];
    for (let i = 0; i < nbStartCards; i++) {
        cards.push(i);
    }
    const instructs = inputString.split('\n');

    function doIncrement(startCards: number[], increment: number) {
        const newCards: number[] = [];
        for (let i = 0; i < startCards.length; i++) {
            assert.deepEqual(newCards[(i * increment) % startCards.length], undefined, '' + increment + ', i ' + i);
            newCards[(i * increment) % startCards.length] = startCards[i];
        }
        return newCards;
    }

    assert.deepEqual(doIncrement([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3), [0, 7, 4, 1, 8, 5, 2, 9, 6, 3]);
    for (let op of instructs) {
        if (op.startsWith(CUT)) {
            const nbCards = Number(op.slice(CUT_LEN));
            let startPos = nbCards > 0 ? nbCards : cards.length + nbCards;
            const spliced = cards.splice(startPos);
            cards.push(...spliced);
        } else if (op.startsWith(INCR)) {
            const increment = Number(op.slice(INCR_LEN));
            cards = doIncrement(cards, increment);
        } else if (op.startsWith('deal into new stack')) {
            cards = cards.reverse();
        }
    }
    return cards;
}

const testInput1 = `deal with increment 7
deal into new stack
deal into new stack`;
const testSol1 = [0, 3, 6, 9, 2, 5, 8, 1, 4, 7];
assert.deepEqual(part1(10, testInput1), testSol1);
console.log(part1(10007, input)[2019]);