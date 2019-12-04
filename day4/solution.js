const inputStart = 240298;
const inputEnd = 784956;

// It is a six-digit number. -> DONE
function is6Digits(candidate) {
    return String(candidate).length === 6;
}

// Two adjacent digits are the same (like 22 in 122345).
function hasAPair(candidate) {
    return !!String(candidate).match(/([0-9])\1/);
}

function digitsOnlyIncrease(candidate) {
    let numbers = [...String(candidate)].map(numberString => Number(numberString));
    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] > numbers[i + 1]) {
            return false;
        }
    }
    return true;
}

let nbValid = 0;
// The value is within the range given in your puzzle input. -> DONE
for (let candidate = inputStart; candidate <= inputEnd; candidate++) {
    if (
        is6Digits(candidate)
        && hasAPair(candidate)
        && digitsOnlyIncrease(candidate)
    ) {
        nbValid++;
    }
}
console.log("Part 1: " + nbValid);

// An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.
function hasAPairStrict(candidate) {
    return hasAPair((String(candidate)).replace(/([0-9])\1\1+/g, 'x'));

}

let nbValidPart2 = 0;

// The value is within the range given in your puzzle input. -> DONE
for (let candidate = inputStart; candidate <= inputEnd; candidate++) {
    if (
        is6Digits(candidate)
        && hasAPairStrict(candidate)
        && digitsOnlyIncrease(candidate)
    ) {
        nbValidPart2++;
    }
}
console.log("Part 2: " + nbValidPart2);