import * as assert from "assert";
import {TURN} from "./GridRobot";

export function isLetter(el: string | undefined): el is string {
    return !!el?.match(/[a-zA-Z]/);
}

export function isLowerletter(char: string | undefined) {
    const charCode = char?.charCodeAt(0);
    return charCode && charCode > 96 && charCode < 123;
}

export function isUpperletter(char: string | undefined) {
    const charCode = char?.charCodeAt(0);
    return charCode && charCode > 64 && charCode < 91;
}

export function sortString(unSortedLetters) {
    return [...(unSortedLetters)].sort().join('');
}

assert.deepEqual(sortString('badc'), 'abcd')

export function keysToSortedString(keys: Set<string>) {
    return [...keys.values()].sort().join('');
}

export function toCharCode(char: string): number {
    return char.charCodeAt(0)
}

export function toLetter(t: TURN.LEFT | TURN.RIGHT): string {
    return t == TURN.LEFT ? 'L' : 'R';
}