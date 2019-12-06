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
    parentMap = new Map();
    orbits.forEach((tuple) => {
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
    const result = []
    if (parent === undefined) {
        return result;
    }
    result.push(...getParentSequence(parent, parentMap));
    result.push(parent);
    return result;
}

function findFirstDifference(parents1, parents2) {
    const [shortestList, otherList] = parents1.length < parents2.length ? [parents1, parents2] : [parents2, parents1];
    for (let i = 0; i < shortestList.length; i++) {
        if (shortestList[i] !== otherList[i]) {
            return i;
        }
    }
    return shortestList.length - 1;
}

function findDistanceBetween(planet1, planet2, input) {
    const parentMap = getParentMap(getTupleList(input));
    const parents1 = getParentSequence(planet1, parentMap);
    console.log('parents1', parents1.length);
    const parents2 = getParentSequence(planet2, parentMap);
    console.log('parents2', parents2.length);
    diffIndex = findFirstDifference(parents1, parents2);
    console.log('diffIndex', diffIndex);

    return parents1.length + parents2.length - (diffIndex) * 2;
}

// Part 2
if (true) {
    const testInput = require('./testinput2');
    console.log("Part2Test): " + findDistanceBetween('YOU', 'SAN', testInput));
}
console.log("Part2: " + findDistanceBetween('YOU', 'SAN', input));