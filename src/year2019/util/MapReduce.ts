export function sumFrom<ARR extends (number | string), START extends (number | string)>(mArray: ARR[], start: START): START {
    return mArray.reduce((first: START, next: ARR) => {
        return <any>first + next;
    }, start);
}

export type Summable = string | number;

export function sum(mArray: number[]): number;
export function sum(mArray: string[]): string;
export function sum<T extends Summable>(mArray: T[]): T {
    return mArray.reduce((first, next) => {
        return <any>first + next;
    });
}

export function allTruthy(values: any[]): boolean {
    for (const value of values) {
        if (!value) {
            return false;
        }
    }
    return true;
}