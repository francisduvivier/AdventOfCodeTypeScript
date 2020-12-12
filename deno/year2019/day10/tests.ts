import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import {testInput1, testInput2, testInput3, testinput4, testsolution2, testsolution3} from "./input.ts";
import {findDestroyedAsteroid, findMostVisibleAsteroid, getDestroyOrder} from "./solution10.ts";
import {flattenPoint} from "../util/Grid.ts";
import {same} from "../util/Math.ts";

export function runTests() {
    assertEquals(same(1, 2), false);

    assertEquals(same(5, 5.001), false);

    assertEquals(same(5, 5.0000001), true);

    assertEquals(findMostVisibleAsteroid(testInput1)[0].solution, {row: 8, col: 5, friends: 33});

    assertEquals(findMostVisibleAsteroid(testInput2)[0].solution, testsolution2);

    assertEquals(findMostVisibleAsteroid(testInput3)[0].solution, testsolution3);

    assertEquals(findMostVisibleAsteroid(testinput4)[0].solution, {row: 13, col: 11, friends: 210});

    assertEquals(getDestroyOrder({"col": 11, "row": 13}, {"col": 11, "row": 13}, {"col": 11, "row": 13}), 0)

    assertEquals(getDestroyOrder({"col": 11, "row": 12}, {"col": 11, "row": 13}, {"col": 11, "row": 13}), 0)

    assertEquals(getDestroyOrder({"col": 10, "row": 1}, {"col": 11, "row": 12}, {"col": 11, "row": 13}) < 0, true)

    assertEquals(getDestroyOrder({"col": 11, "row": 12}, {"col": 10, "row": 1}, {"col": 11, "row": 13}) > 0, true)

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 1)!), flattenPoint({col: 11, row: 12}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 2)!), flattenPoint({col: 12, row: 1}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 3)!), flattenPoint({col: 12, row: 2}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 10)!), flattenPoint({col: 12, row: 8}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 20)!), flattenPoint({col: 16, row: 0}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 50)!), flattenPoint({col: 16, row: 9}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 100)!), flattenPoint({col: 10, row: 16}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 199)!), flattenPoint({col: 9, row: 6}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 200)!), flattenPoint({col: 8, row: 2}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 201)!), flattenPoint({col: 10, row: 9}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 299)!), flattenPoint({col: 11, row: 1}));

    assertEquals(flattenPoint(findDestroyedAsteroid(testinput4, 200)!), 802);
}