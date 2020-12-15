import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { rInput, tInput } from "./input.ts";
import { GridRobot } from "../../year2019/util/GridRobot.ts";
import { P } from "../../year2019/util/Grid.ts";
import { logAndPushSolution } from "../../year2019/util/SolutionHandler.ts";

declare const console: any;
type INST = 'N' |// means to move north by the given value.
    'S' |// means to move south by the given value.
    'E' |// means to move east by the given value.
    'W' |// means to move west by the given value.
    'L' |// means to turn left the given number of degrees.
    'R' |// means to turn right the given number of degrees.
    'F';// means to move forward by the given value in the direction the ship is currently facing.
function toInstruction(line): { letter: INST, amount: number } {
    return { letter: line[0], amount: Number(line.substr(1)) };
}

function calcEndManhattanDistance(input: string[], startWayPoint, moveWaypoint = false): number {
    const instructions = input.map(toInstruction);
    const craft = new GridRobot();
    const waypoint = new GridRobot();
    waypoint.p = startWayPoint;
    for (let instruction of instructions) {
        console.log(instruction, craft.p, waypoint.p);
        const letter = instruction.letter;
        const amount = instruction.amount;
        switch (letter) {
            case "E":
            case "S":
            case "W":
            case "N":
                (moveWaypoint ? waypoint : craft).moveWindDir(letter, amount);
                break;
            case "L":
            case "R":
                let remainingDegrees = amount;
                waypoint.rotateAroundOrigin(remainingDegrees * (letter === 'L' ? 1 : -1));
                break;
            case "F":
                craft.d = waypoint.p;
                craft.move(amount);
                break;
            default:
                break;
        }
    }
    return Math.abs(craft.p.row) + Math.abs(craft.p.col);
}

function part1(input: string[]) {
    return calcEndManhattanDistance(input, P(0, 1));
}

function part2(input: string[]) {
    return calcEndManhattanDistance(input, P(-1, 10), true);
}


// const input = tInput;

assertEquals(part1(tInput), 25);
const sols = [];
logAndPushSolution(part1(rInput), sols);
assertEquals(sols[0], 1319);
assertEquals(part2(tInput), 286);
logAndPushSolution(part2(rInput), sols);
assertEquals(sols[1], 62434);


