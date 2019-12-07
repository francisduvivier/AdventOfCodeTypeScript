const input = require('./input');

function countDirectOrbits(orbits) {
    return orbits.length;
}

function getNbParents(child, parentMap) {
    let parent = parentMap.get(child);
    if (parent === undefined) {
        return 0;
    }
    return 1 + getNbParents(parent, parentMap);
}

function getParentMap(orbits) {
    const parentMap = new Map();
    orbits.forEach((tuple) => {
        if (parentMap.get(tuple.child)) {
            throw 'duplicate child';
        }
        parentMap.set(tuple.child, tuple.parent);
    });
    return parentMap;
}

function countIndirectOrbits(orbits) {
    nbIndirects = 0;
    const parentMap = getParentMap(orbits);
    orbits.forEach((tuple) => {
        nbIndirects += getNbParents(tuple.child, parentMap);
    });
    return nbIndirects;
}

function getTupleList(input) {
    return input.map(orbit => {
            [parent, child] = orbit.split(')');
            const tuple = {parent, child};
            return tuple
        }
    );
}

// Part 1
const TESTING = false;
if (TESTING) {
    const testInput = require('./testinput');
    console.log("Part1(Test): " + countIndirectOrbits(getTupleList(testInput)));
}
console.log("Part1: " + countIndirectOrbits(getTupleList(input)));

function getParentSequence(child, parentMap) {
    let parent = parentMap.get(child);
    const result = [];
    if (parent === undefined) {
        return result;
    }
    result.push(...getParentSequence(parent, parentMap));
    result.push(parent);
    return result;
}

function findClosestSameParent(parents1, parents2) {
    const [shortestList, otherList] = parents1.length < parents2.length ? [parents1, parents2] : [parents2, parents1];
    for (let i = shortestList.length - 1; i >= 0; i--) {
        if (shortestList[i] === otherList[i]) {
            return i;
        }
    }
    throw 'no parent in common!';
}

function findDistanceBetween(planet1, planet2, input) {
    const parentMap = getParentMap(getTupleList(input));
    const parents1 = getParentSequence(planet1, parentMap);
    const parents2 = getParentSequence(planet2, parentMap);
    const closestSameParentIndex = findClosestSameParent(parents1, parents2);
    return parents1.length + parents2.length - (closestSameParentIndex + 1) * 2;
}

// Part 2
if (TESTING) {
    const testInput = require('./testinput2');
    console.log("Part2Test): " + findDistanceBetween('YOU', 'SAN', testInput));
}
console.log("Part2: " + findDistanceBetween('YOU', 'SAN', input));