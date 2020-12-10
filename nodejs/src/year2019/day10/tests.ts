import * as assert from "assert";
import {testInput1, testInput2, testInput3, testinput4, testsolution2, testsolution3} from "./input";
import {findDestroyedAsteroid, findMostVisibleAsteroid, getDestroyOrder} from "./solution10";
import {flattenPoint} from "../util/Grid";
import {same} from "../util/Math";

export function runTests() {
    assert.deepEqual(same(1, 2), false);

    assert.deepEqual(same(5, 5.001), false);

    assert.deepEqual(same(5, 5.00001), true);

    assert.deepEqual(findMostVisibleAsteroid(testInput1)[0].solution, {row: 8, col: 5, friends: 33});

    assert.deepEqual(findMostVisibleAsteroid(testInput2)[0].solution, testsolution2);

    assert.deepEqual(findMostVisibleAsteroid(testInput3)[0].solution, testsolution3);

    assert.deepEqual(findMostVisibleAsteroid(testinput4)[0].solution, {row: 13, col: 11, friends: 210});

    assert.deepEqual(getDestroyOrder({"col": 11, "row": 13}, {"col": 11, "row": 13}, {"col": 11, "row": 13}), 0)

    assert.deepEqual(getDestroyOrder({"col": 11, "row": 12}, {"col": 11, "row": 13}, {"col": 11, "row": 13}), 0)

    assert.deepEqual(getDestroyOrder({"col": 10, "row": 1}, {"col": 11, "row": 12}, {"col": 11, "row": 13}) < 0, true)

    assert.deepEqual(getDestroyOrder({"col": 11, "row": 12}, {"col": 10, "row": 1}, {"col": 11, "row": 13}) > 0, true)

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 1)!), flattenPoint({col: 11, row: 12}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 2)!), flattenPoint({col: 12, row: 1}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 3)!), flattenPoint({col: 12, row: 2}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 10)!), flattenPoint({col: 12, row: 8}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 20)!), flattenPoint({col: 16, row: 0}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 50)!), flattenPoint({col: 16, row: 9}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 100)!), flattenPoint({col: 10, row: 16}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 199)!), flattenPoint({col: 9, row: 6}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 200)!), flattenPoint({col: 8, row: 2}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 201)!), flattenPoint({col: 10, row: 9}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 299)!), flattenPoint({col: 11, row: 1}));

    assert.deepEqual(flattenPoint(findDestroyedAsteroid(testinput4, 200)!), 802);
}