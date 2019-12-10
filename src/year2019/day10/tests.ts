import * as assert from "assert";
import {testInput1, testInput2, testInput3, testinput4, testsolution2, testsolution3} from "./input";
import {calcResult, findDestroyedAsteroid, findMostVisibleAsteroid, getDestroyOrder, same} from "./solution10";

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

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 1)!), calcResult({col: 11, row: 12}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 2)!), calcResult({col: 12, row: 1}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 3)!), calcResult({col: 12, row: 2}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 10)!), calcResult({col: 12, row: 8}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 20)!), calcResult({col: 16, row: 0}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 50)!), calcResult({col: 16, row: 9}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 100)!), calcResult({col: 10, row: 16}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 199)!), calcResult({col: 9, row: 6}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 200)!), calcResult({col: 8, row: 2}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 201)!), calcResult({col: 10, row: 9}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 299)!), calcResult({col: 11, row: 1}));

    assert.deepEqual(calcResult(findDestroyedAsteroid(testinput4, 200)!), 802);
}