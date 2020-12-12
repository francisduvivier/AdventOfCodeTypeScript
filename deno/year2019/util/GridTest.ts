import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { ARROW, ARROWS, DIR, DIRNAMES, DIRS, dirToArrow, getNewDir, getNewPos, rotate, TURN } from "./GridRobot.ts";
import { P } from "./Grid.ts";

export function runTests() {
    assertEquals(getNewDir(DIR.RIGHT, TURN.LEFT), DIR.UP);
    assertEquals(getNewDir(DIR.RIGHT, TURN.RIGHT), DIR.DOWN);
    assertEquals(getNewDir(DIR.UP, TURN.RIGHT), DIR.RIGHT);
    assertEquals(getNewDir(DIR.UP, TURN.LEFT), DIR.LEFT);

    assertEquals(getNewPos(DIR.RIGHT, { row: 0, col: -1 }), { row: 0, col: 0 });
    assertEquals(getNewPos(DIR.DOWN, { row: 0, col: -1 }), { row: 1, col: -1 });
    assertEquals(getNewPos(DIR.UP, { row: 0, col: -1 }), { row: -1, col: -1 });
    assertEquals(getNewPos(DIR.LEFT, { row: 0, col: -1 }), { row: 0, col: -2 });
    assertEquals(DIRS, [0, 1, 2, 3]);
    assertEquals(DIRNAMES[DIRNAMES.indexOf('DOWN' as keyof ARROW)], 'DOWN');
    assertEquals(ARROWS.length, 4);
    assertEquals(dirToArrow(DIR.UP), '^');
    assertEquals(rotate(P(0, 1), 90), rotate(P(0, 1), -270));
    assertEquals(rotate(P(1, 0), 90), rotate(P(1, 0), -270));
    assertEquals(rotate(P(0, -1), 90), rotate(P(0, -1), -270));
    assertEquals(rotate(P(-1, 0), 90), rotate(P(-1, 0), -270));
    assertEquals(rotate(P(0, 1), 270), rotate(P(0, 1), -90));
    assertEquals(rotate(P(1, 0), 270), rotate(P(1, 0), -90));
    assertEquals(rotate(P(0, -1), 270), rotate(P(0, -1), -90));
    assertEquals(rotate(P(-1, 0), 270), rotate(P(-1, 0), -90));
}