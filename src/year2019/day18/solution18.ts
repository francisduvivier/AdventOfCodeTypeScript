import {input} from "./input";
import {GridRobot} from "../util/GridRobot";
import {P} from "../util/Grid";


function part1() {
    const gridInput = new GridRobot<string>();
    const rows = input.split('\n');
    rows.forEach((row, rindex) => {
        row.split('').forEach((el, cindex) => {
            gridInput.set(P(rindex, cindex), el);
        });
    });
    console.log(gridInput.asImage(el => el!));
}

part1();