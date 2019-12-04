const inputStart = 240298;
const inputEnd = 784956;

// It is a six-digit number. -> DONE
function is6Digits(candidate) {
    return String(candidate).length === 6;
}

// Two adjacent digits are the same (like 22 in 122345).
function hasAdjacentSameNumbers(candidate) {
    return !!(String(candidate).match(/(11|22|33|44|55|66|77|88|99|00)/))
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
        && hasAdjacentSameNumbers(candidate)
        && digitsOnlyIncrease(candidate)
    ) {
        nbValid++;
    }
}
console.log("Part 1: " + nbValid);

// An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.
function hasExactly2AdjacentSameNumbers(candidate) {
    return !!(` ${candidate} `).match(/([^1]11[^1]|[^2]22[^2]|[^3]33[^3]|[^4]44[^4]|[^5]55[^5]|[^6]66[^6]|[^7]77[^7]|[^8]88[^8]|[^9]99[^9]|[^0]00[^0])/);
}

let nbValidPart2 = 0;

// The value is within the range given in your puzzle input. -> DONE
for (let candidate = inputStart; candidate <= inputEnd; candidate++) {
    if (
        is6Digits(candidate)
        && hasExactly2AdjacentSameNumbers(candidate)
        && digitsOnlyIncrease(candidate)
    ) {
        nbValidPart2++;
    }
}
console.log("Part 2: " + nbValidPart2);