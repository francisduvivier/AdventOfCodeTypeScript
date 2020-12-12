import {logAndPushSolution} from "../util/SolutionHandler.ts";
import {allTruthy, sum} from "../util/MapReduce.ts";
import { assert, assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import {inputWire1, inputWire2} from "./input.ts";

interface Point {
    x: number,
    y: number,
    delay: number,
    meta?: any
}

function getManhattanDist(point: Point) {
    return Math.abs(point.x) + Math.abs(point.y);
}

function getSignalDelay(point?: Point): number {
    return point && point.delay || Infinity;
}

function getIntersectDelay(interSect?: InterSect): number {
    if (!interSect) {
        return Infinity;
    }
    return interSect && sum(interSect.points.map(getSignalDelay));
}

interface Instruction {
    operation: (point: Point) => Point
    times: number
}

function createInstruction(opName: string): Instruction {
    const dirLetter = opName[0];
    let operation: (point: Point) => Point = (arg) => arg;
    switch (dirLetter) {
        case 'D':
            operation = (p: Point) => {
                return {
                    x: p.x,
                    y: p.y - 1,
                    delay: p.delay + 1,
                    meta: opName
                }
            };
            break;
        case 'U':
            operation = (p) => {
                return {
                    x: p.x,
                    y: p.y + 1,
                    delay: p.delay + 1,
                    meta: opName
                }
            };
            break;
        case 'L':
            operation = (p) => {
                return {
                    x: p.x - 1,
                    y: p.y,
                    delay: p.delay + 1,
                    meta: opName
                }
            };
            break;
        case 'R':
            operation = (p) => {
                return {
                    x: p.x + 1,
                    y: p.y,
                    delay: p.delay + 1,
                    meta: opName
                }
            };
            break;

        default:
            throw "invalid operation: " + dirLetter;
    }
    return {
        operation: operation,
        times: Number(opName.slice(1))
    }
}

function interpolateWire(wire: string[]): Point[] {
    const allPoints: Point[] = [];
    let currStartPoint: Point = {x: 0, y: 0, delay: 0, meta: 'start'};
    for (let val of wire) {
        allPoints.push(...interpolatePoints(currStartPoint, val));
        currStartPoint = allPoints[allPoints.length - 1];
    }
    return allPoints;
}

function interpolatePoints(startPos: Point, opString: string): Point[] {
    const points: Point[] = [];
    const instruction: Instruction = createInstruction(opString);
    let lastPos: Point = startPos;
    for (let i = 0; i < instruction.times; i++) {
        const newPos = instruction.operation(lastPos);
        points.push(newPos);
        lastPos = newPos;
    }
    return points;
}

function pointEquals(point1: Point, point2: Point): boolean {
    return point1.x === point2.x && point1.y === point2.y;
}

function compareDistance(point1: Point, point2: Point) {
    return getManhattanDist(point1) - getManhattanDist(point2);
}


function indexOfFirstDistanceMatchInSortedList(searchPoint: Point, pointList: Point[], startIndex = 0): number {
    let inputDistance = getManhattanDist(searchPoint);
    for (let index = startIndex; index < pointList.length; index++) {
        const otherPoint = pointList[index];
        if (inputDistance == getManhattanDist(otherPoint)) {
            return index;
        }
    }
    return -1;
}


function getFirstMatchInSortedList(searchPoint: Point, pointList: Point[], startIndex = 0, compareFunc = getManhattanDist, maxWeight = Infinity): Point | undefined {
    for (let index = startIndex; index < pointList.length; index++) {
        const otherPoint = pointList[index];
        if (pointEquals(searchPoint, otherPoint)) {
            return otherPoint;
        }
        if (maxWeight < compareFunc(otherPoint)) {
            return undefined;
        }
    }
    return undefined;
}

function findClosestMatch(wirePointLists: Point[][]) {
    const sortedLists = wirePointLists.map((pointList: Point[]) => pointList.sort(compareDistance));
    for (const point of sortedLists[0]) {
        let otherLists = sortedLists.slice(1);
        let processedPointsPointers = otherLists.map(() => 0);
        let matchingPoints = otherLists.map((pointList: Point[], index) => {
            processedPointsPointers[index] = indexOfFirstDistanceMatchInSortedList(point, pointList, processedPointsPointers[index]);
            if (processedPointsPointers[index] == -1) {
                return undefined;
            }
            return getFirstMatchInSortedList(point, pointList, processedPointsPointers[index], getManhattanDist, getManhattanDist(point));
        });
        const isInAllLists: boolean = allTruthy(matchingPoints);
        if (isInAllLists) {
            point.meta = {currMeta: point.meta, otherPoints: matchingPoints};
            return point;
        }
    }
    throw "no matching point found";
}

export const solutions: number[] = [];
// Part 1

const interPolatedWire1 = interpolateWire(inputWire1);
const interPolatedWire2 = interpolateWire(inputWire2);
let closestIntersectPoint = findClosestMatch([interPolatedWire1, interPolatedWire2]);
logAndPushSolution(getManhattanDist(closestIntersectPoint), solutions);


interface InterSect {
    points: (Point | undefined)[];
}

function findShortestMatch(firstWire: Point[], otherWire: Point[]) {
    let currBestInterSection: InterSect | undefined = undefined;
    for (const point of firstWire) {
        if (getSignalDelay(point) > getIntersectDelay(currBestInterSection)) {
            break;
        }
        const bestDelay = getIntersectDelay(currBestInterSection);
        const currResult = getFirstMatchInSortedList(point, otherWire, 0, getSignalDelay, bestDelay - getSignalDelay(point));
        if (getIntersectDelay({points: [point, currResult]}) < bestDelay) {
            currBestInterSection = {points: [point, currResult]};
        }
    }
    return currBestInterSection;
}

// Part 2

const fastestIntersectPoint = findShortestMatch(interPolatedWire1, interPolatedWire2);
logAndPushSolution(getIntersectDelay(fastestIntersectPoint), solutions);

assertEquals(solutions, [232, 6084]);
