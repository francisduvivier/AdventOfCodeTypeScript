import * as assert from "assert";
import {ARROW, ARROWS, DIR, DIRNAMES, DIRS, dirToArrow, getNewDir, getNewPos, TURN} from "./GridRobot";

export function runTests() {
    assert.deepEqual(getNewDir(DIR.RIGHT, TURN.LEFT), DIR.UP);
    assert.deepEqual(getNewDir(DIR.RIGHT, TURN.RIGHT), DIR.DOWN);
    assert.deepEqual(getNewDir(DIR.UP, TURN.RIGHT), DIR.RIGHT);
    assert.deepEqual(getNewDir(DIR.UP, TURN.LEFT), DIR.LEFT);

    assert.deepEqual(getNewPos(DIR.RIGHT, {row: 0, col: -1}), {row: 0, col: 0});
    assert.deepEqual(getNewPos(DIR.DOWN, {row: 0, col: -1}), {row: 1, col: -1});
    assert.deepEqual(getNewPos(DIR.UP, {row: 0, col: -1}), {row: -1, col: -1});
    assert.deepEqual(getNewPos(DIR.LEFT, {row: 0, col: -1}), {row: 0, col: -2});
    assert.deepEqual(DIRS, [0, 1, 2, 3]);
    assert.deepEqual(DIRNAMES[DIRNAMES.indexOf('DOWN' as keyof ARROW)], 'DOWN');
    assert.deepEqual(ARROWS.length, 4);
    assert.deepEqual(dirToArrow(DIR.UP), '^');
}