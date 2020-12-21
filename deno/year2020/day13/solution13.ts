import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { rInput, tInput } from "./input.ts";
import { logAndPushSolution } from "../../year2019/util/SolutionHandler.ts";

function part1(input: string[]) {
    const options = input[1].split(',').filter(val => val !== 'x').map(Number);
    const myStart = Number(input[0]);
    let min = options[0];
    for (const option of options) {
        // console.log(option);
        if (myStart % option > myStart % min) {
            min = option;
        }
    }
    console.log(min, myStart, min * (myStart % min));
    return min * (min - myStart % min);
}

function product(vals: bigint[]): bigint {
    return vals.reduce((prev: bigint, curr: bigint) => (BigInt(prev) * BigInt(curr)), 1n);
}

type AYZ = { a: bigint; y: bigint; z: bigint, mod: bigint };

function calcZ(y: bigint, mod: bigint): bigint {
    let z = 0n;
    while ((BigInt(++z * y) % BigInt(mod)) != 1n) {
        if (z > 10000000) {
            throw `z too big for mp [${y}], mod [${mod}]`;
        }
    }
    return z;
}

function calcAYZs(modProduct: bigint, congruences: { eq: bigint, mod: bigint }[]): AYZ[] {
    const solution = congruences.map(c => {
        return { a: c.eq, y: BigInt(modProduct) / BigInt(c.mod), z: -1n, mod: c.mod };
    });
    for (const solPart of solution) {
        solPart.z = calcZ(solPart.y, solPart.mod);
    }
    console.table([['a', 'y', 'z'], ...solution.map(sol => [sol.a, sol.y, sol.z])]);
    return solution;
}

function solveX(congruences) {
    const modProduct = product(congruences.map(c => c.mod));
    assert(!!modProduct);
    console.log('modprod', modProduct);
    const ayzvals = calcAYZs(modProduct, congruences);

    let x = 0n;
    for (const ayz of ayzvals) {
        x += (BigInt(ayz.a) * BigInt(ayz.y) * BigInt(ayz.z));
    }
    return x % modProduct;

}

function part2(input: string[]) {
    let values = input[1].split(',');
    const congruences = values.map((divisor, index) => {
        return divisor != 'x' && { eq: BigInt(divisor) - (BigInt(index) % (BigInt(divisor))), mod: BigInt(divisor) };
    }).filter(el => el);
    const x = solveX(congruences);
    return x;
}


// const input = tInput;

assertEquals(part1(tInput), 295);
const sols = [];
logAndPushSolution(part1(rInput), sols);
assertEquals(sols[0], 4808);
assertEquals(solveX([{ eq: 15, mod: 27 }, { eq: 16, mod: 20 }]), 96n);
// assertEquals(part2(tInput), 1068788);
assertEquals(part2(['', '17,x,13,19']), 3417n);
assertEquals(part2(['', '67,7,59,61']), 754018n);
assertEquals(part2(['', '67,7,x,59,61']), 1261476n);
assertEquals(part2(['', '67,x,7,59,61']), 779210n);
assertEquals(part2(['', '1789,37,47,1889']), 1202161486n);
assertEquals(part2(['', '41,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,541,x,x,x,x,x,x,x,23,x,x,x,x,13,x,x,x,17,x,x,x,x,x,x,x,x,x,x,x,29,x,983,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,19']), 1010182346291467n);
console.log('P2 R', part2(rInput));
logAndPushSolution(part2(rInput).toString(), sols);
// assertEquals(sols[1], -1); // TODO
