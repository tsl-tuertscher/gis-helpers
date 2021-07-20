export function round(val: number, digits: number): number {
  return Math.round(val * Math.pow(10, digits)) / Math.pow(10, digits);
}

export function sign(
  p1: number[],
  p2: number[],
  p3: number[]
): number {
  return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
}
