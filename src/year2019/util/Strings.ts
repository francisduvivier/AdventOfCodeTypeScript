import * as assert from "assert";

export function isLetter(el: string | undefined): el is string {
    return !!el?.match(/[a-zA-Z]/);
}

export function isLowerletter(char: string | undefined) {
    return isLetter(char) && char.toLowerCase() == char
}

export function isUpperletter(char: string | undefined) {
    return isLetter(char) && char.toUpperCase() == char
}

export function sortString(unSortedLetters) {
    return [...(unSortedLetters)].sort().join('');
}

assert.deepEqual(sortString('badc'), 'abcd')

export function keysToSortedString(keys: Set<string>) {
    return [...keys.values()].sort().join('');
}