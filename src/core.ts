export function round(val: number, digits: number): number {
    return Math.round(val * Math.pow(10, digits)) / Math.pow(10, digits);
}
