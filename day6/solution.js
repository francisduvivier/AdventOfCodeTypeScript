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

const TESTING = false;
if (TESTING) {
    const testInput = require('./testinput');
    console.log("Part1(Test): " + countIndirectOrbits(getTupleList(testInput)));
}
console.log("Part1: " + countIndirectOrbits(getTupleList(input)));