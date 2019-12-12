import {logAndPushSolution} from "../util/SolutionHandler";
import {P3} from "../util/Grid";
import {allTruthy, sum} from "../util/MapReduce";
import * as assert from "assert";
import {findLCM} from "../util/Math";

const solutions: number[] = [];

class Moon {
    pos: P3;
    vel: P3;

    constructor(x: number, y: number, z: number) {
        this.pos = P3(y, x, z);
        this.vel = P3(0, 0, 0);
    }

    updateVel(other: Moon) {
        const colSign = Math.sign(other.pos.col - this.pos.col);
        if (colSign) {
            this.vel.col += colSign;
            other.vel.col -= colSign;
        }
        let rowSign = Math.sign(other.pos.row - this.pos.row);
        if (rowSign) {
            this.vel.row += rowSign;
            other.vel.row -= rowSign;
        }
        let zSign = Math.sign(other.pos.z - this.pos.z);
        if (zSign) {
            this.vel.z += zSign;
            other.vel.z -= zSign;
        }
    }

    updatePos() {
        this.pos.col += this.vel.col;
        this.pos.row += this.vel.row;
        this.pos.z += this.vel.z;
    }


    toString(): string {
        return `pos=<x=${this.pos.col}, y=${this.pos.row}, z=${this.pos.z}>, vel=<x=${this.vel.col}, y=${this.vel.row}, z=${this.vel.z}>`
    }

    equals(moon: Moon) {
        return this.pos.col == moon.pos.col
            && this.pos.row == moon.pos.row
            && this.pos.z == moon.pos.z
            && this.vel.col == moon.vel.col
            && this.vel.row == moon.vel.row
            && this.vel.z == moon.vel.z

    }

    updateVelX(other: Moon) {
        const colSign = Math.sign(other.pos.col - this.pos.col);
        if (colSign) {
            this.vel.col += colSign;
            other.vel.col -= colSign;
        }
    }

    updatePosX() {
        this.pos.col += this.vel.col;
    }

    updateVelY(other: Moon) {
        const rowSign = Math.sign(other.pos.row - this.pos.row);
        if (rowSign) {
            this.vel.row += rowSign;
            other.vel.row -= rowSign;
        }
    }

    updatePosY() {
        this.pos.row += this.vel.row;
    }

    updateVelZ(other: Moon) {
        const zSign = Math.sign(other.pos.z - this.pos.z);
        if (zSign) {
            this.vel.z += zSign;
            other.vel.z -= zSign;
        }
    }

    updatePosZ() {
        this.pos.z += this.vel.z;
    }

    copy() {
        return new Moon(this.pos.col, this.pos.row, this.pos.z)
    }
}

function copyMoon(moon: Moon) {
    return moon.copy()
}

export const input: Moon[] = [
    new Moon(1, 4, 4),
    new Moon(-4, -1, 19),
    new Moon(-15, -14, 12),
    new Moon(-17, 1, 10),
];
export const testInput2: Moon[] = [
    new Moon(-8, -10, 0),
    new Moon(5, 5, 10),
    new Moon(2, -7, 3),
    new Moon(9, -8, -3),
];

export function calcTotalEnergy(moon: Moon): number {
    return calcTotalAbs(moon.pos)// potential
        * calcTotalAbs(moon.vel) // kinetic
}

function calcTotalAbs(p3: P3): number {
    return Math.abs(p3.row) + Math.abs(p3.col) + Math.abs(p3.z)
}

function part1(moons: Moon[], nbSteps = 1000) {
    for (let step = 0; step < nbSteps; step++) {
        for (let mooni = 0; mooni < moons.length; mooni++) {
            for (let otherMoon of moons.slice(mooni + 1)) {
                const moon = moons[mooni];
                if (moon !== otherMoon) {
                    moon.updateVel(otherMoon);
                }
            }
        }
        for (let moon of moons) {
            moon.updatePos();
        }
    }
    return sum(moons.map(calcTotalEnergy));
}


assert.deepEqual(part1(testInput2.map(copyMoon), 100), sum([290, 608, 574, 468]));

logAndPushSolution(part1(input.map(copyMoon)), solutions);
assert.deepEqual(solutions, [10635]);


export function part2(input: Moon[]): P3 {
    let moons = input;
    const origMoons: Moon[] = input.map(copyMoon);
    const sol = P3(0, 0, 0);
    let step = 0;
    while (step == 0 || !allTruthy(moons.map((m, index) => m.equals(origMoons[index])))) {
        for (let mooni = 0; mooni < moons.length; mooni++) {
            for (let otherMoon of moons.slice(mooni + 1)) {
                const moon = moons[mooni];
                if (moon !== otherMoon) {
                    moon.updateVelY(otherMoon);
                }
            }
        }
        for (let moon of moons) {
            moon.updatePosY();
        }
        // if (true||(step + 1) % 10 == 0) {
        //     console.log('\nstep ' + (step + 1))
        //     console.log(moons.map((m) => m.toString()).join('\n'));
        // }
        step++;
    }
    sol.col = step;
    step = 0;
    while (step == 0 || !allTruthy(moons.map((m, index) => m.equals(origMoons[index])))) {
        for (let mooni = 0; mooni < moons.length; mooni++) {
            for (let otherMoon of moons.slice(mooni + 1)) {
                const moon = moons[mooni];
                if (moon !== otherMoon) {
                    moon.updateVelX(otherMoon);
                }
            }
        }
        for (let moon of moons) {
            moon.updatePosX();
        }
        // if (true||(step + 1) % 10 == 0) {
        //     console.log('\nstep ' + (step + 1))
        //     console.log(moons.map((m) => m.toString()).join('\n'));
        // }
        step++;
    }
    sol.row = step;
    step = 0;
    while (step == 0 || !allTruthy(moons.map((m, index) => m.equals(origMoons[index])))) {
        for (let mooni = 0; mooni < moons.length; mooni++) {
            for (let otherMoon of moons.slice(mooni + 1)) {
                const moon = moons[mooni];
                if (moon !== otherMoon) {
                    moon.updateVelZ(otherMoon);
                }
            }
        }
        for (let moon of moons) {
            moon.updatePosZ();
        }
        // if (true||(step + 1) % 10 == 0) {
        //     console.log('\nstep ' + (step + 1))
        //     console.log(moons.map((m) => m.toString()).join('\n'));
        // }
        step++;
    }
    sol.z = step;
    return sol;
}


const part2TestPoint3 = part2(testInput2.map(copyMoon));
assert.deepEqual(findLCM(part2TestPoint3.col, part2TestPoint3.z, part2TestPoint3.row), 4686774924);
const part2Point3 = part2(input.map(copyMoon));
logAndPushSolution(findLCM(part2Point3.col, part2Point3.z, part2Point3.row), solutions);
assert.deepEqual(solutions, [10635, 583523031727256]);
