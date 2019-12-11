function splitNL(s: string): string[] {
    return s.split('\n');
}

export const inputStrs = splitNL(``);

function spread() {
    return (str: any) => [...str];
}

function spreadToNb() {
    return (str: any) => [...str].map(Number);
}

const inputLetters = splitNL(``).map(spread);
const inputNbMatrix = splitNL(``).map(spreadToNb);
const inputNbs: number[] = [];
export let input: any = inputLetters;
input = inputNbMatrix;
input = inputNbs;

export const testInputs: string[] = [];
testInputs.push(`test`);