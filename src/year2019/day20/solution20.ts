import {input} from "./input";
import {createGrid, Grid, P} from "../util/Grid";
import {DIR, DIRS, getNewPos} from "../util/GridRobot";
import {isLetter, sortString} from "../util/Strings";
import * as assert from "assert";
// part1
// find portals
// Make replace dots with letterPairs on portals
// make map of letterPairs to positions
function getOtherPortalEdge(p: P, portalGrid: Grid<P>) {
    return portalGrid.get(p);
}

// Modify getNextPos(pos, dir) to check for letter and if going into portal, then change pos to other edge using map
export function getNextPosWarped(dir: DIR, p: P, portalGrid: Grid<P>) {
    const nextPosNormal = getNewPos(dir, p);
    const otherPortalEdge = getOtherPortalEdge(nextPosNormal, portalGrid);
    if (otherPortalEdge) {
        return otherPortalEdge;
    }
    return nextPosNormal;
}

function createGridInfo(input: string) {
    const rawGrid = createGrid(input);
    const portalGrid = new Grid<P>();
    const portalNameToInfo = new Map<string, [{ p: P, dir: DIR }, { p: P, dir: DIR }] | [{ p: P, dir: DIR }]>();
    rawGrid.forEach((p) => {
        if (rawGrid.get(p) === '.') {
            for (const dir of DIRS) {
                const nextPos = getNewPos(dir, p);
                const firstLetter = rawGrid.get(nextPos);
                if (isLetter(firstLetter)) {
                    const nextNextPos = getNewPos(dir, nextPos);
                    const nextLetter = rawGrid.get(nextNextPos);
                    if (isLetter(nextLetter)) {
                        let unSortedLetters = firstLetter + nextLetter;
                        let sortedLetters = sortString(unSortedLetters);
                        let currInfo = portalNameToInfo.get(sortedLetters);
                        if (!currInfo) {
                            portalNameToInfo.set(sortedLetters, [{p: nextNextPos, dir: dir}]);
                        } else {
                            currInfo.push({p: nextNextPos, dir: dir});
                            assert.deepEqual(currInfo.length, 2);
                        }
                    }
                }
            }
        }
    });
    for (const portalNames of portalNameToInfo.keys()) {
        let infos = portalNameToInfo.get(portalNames);
        if (infos?.length == 2) {
            portalGrid.set(getNewPos(infos[0].dir, infos[0].p), infos[1].p);
            portalGrid.set(getNewPos(infos[1].dir, infos[1].p), infos[0].p);
        }
    }
    return {rawGrid, portalGrid, portalNameToInfo};
}


// Part1
function part1(input: string) {
    const {rawGrid, portalGrid, portalNameToInfo} = createGridInfo(input);
    const startPos = portalNameToInfo.get('AA')![0].p;
    const endPos = portalNameToInfo.get('ZZ')![0].p;

}

console.log(input.length);