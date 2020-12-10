import {logAndPushSolution} from "../util/SolutionHandler";

const TESTING = false;
import {input} from './input';

type Orbit = { child: Body, parent: Body }

function getNbParents(child: Body, parentMap: ParentMap): number {
    let parent = parentMap.get(child);
    if (parent === undefined) {
        return 0;
    }
    return 1 + getNbParents(parent, parentMap);
}

function getParentMap(orbits: Orbit[]) {
    const parentMap = new Map();
    orbits.forEach((tuple) => {
        if (parentMap.get(tuple.child)) {
            throw 'duplicate child';
        }
        parentMap.set(tuple.child, tuple.parent);
    });
    return parentMap;
}

function countIndirectOrbits(orbits: Orbit[]) {
    let nbIndirects = 0;
    const parentMap = getParentMap(orbits);
    orbits.forEach((tuple) => {
        nbIndirects += getNbParents(tuple.child, parentMap);
    });
    return nbIndirects;
}

function getTupleList(input: string[]) {
    return input.map(orbit => {
            const [parent, child] = orbit.split(')');
            const tuple: Orbit = {parent, child};
            return tuple
        }
    );
}

export const solutions: number[] = [];

// Part 1
import testInput from './testinput';

if (TESTING) {
    console.log("Part 1 (Test): " + countIndirectOrbits(getTupleList(testInput)));
}

const part1 = countIndirectOrbits(getTupleList(input));
logAndPushSolution(part1, solutions);

type Body = string;
type ParentMap = Map<Body, Body>;

function getParentSequence(child: Body, parentMap: ParentMap) {
    let parent = parentMap.get(child);
    const result: Body[] = [];
    if (parent === undefined) {
        return result;
    }
    result.push(...getParentSequence(parent, parentMap));
    result.push(parent);
    return result;
}


function findClosestSameParent(parents1: Body[], parents2: Body[]) {
    const [shortestList, otherList] = parents1.length < parents2.length ? [parents1, parents2] : [parents2, parents1];
    for (let i = shortestList.length - 1; i >= 0; i--) {
        if (shortestList[i] === otherList[i]) {
            return i;
        }
    }
    throw 'no parent in common!';
}

function findDistanceBetween(planet1: Body, planet2: Body, input: string[]) {
    const parentMap = getParentMap(getTupleList(input));
    const parents1 = getParentSequence(planet1, parentMap);
    const parents2 = getParentSequence(planet2, parentMap);
    const closestSameParentIndex = findClosestSameParent(parents1, parents2);
    return parents1.length + parents2.length - (closestSameParentIndex + 1) * 2;
}

// Part 2
import testInput2 from './testinput2';
import * as assert from "assert";

if (TESTING) {
    console.log("Part 2 Test: " + findDistanceBetween('YOU', 'SAN', testInput2));
}
const part2 = findDistanceBetween('YOU', 'SAN', input);

logAndPushSolution(part2, solutions);

assert.deepEqual(solutions, [295936, 457]);
