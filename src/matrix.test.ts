import { round } from './core';
import { Vector } from './vector';
import { Matrix } from './matrix';

describe('matrix', () => {
  it('Matrix', () => {
    const mat = new Matrix();
    expect(mat).toBeTruthy;
  });

  it('setRotationsMatrixX', () => {
    const mat = new Matrix();
    mat.setRotationsMatrixX(Math.PI / 2);
    const vec = mat.multiple(new Vector(1, 2, 3));

    expect(mat).toBeTruthy;
    expect(vec).toBeTruthy;

    expect(round(vec.x, 4)).toEqual(1);
    expect(round(vec.y, 4)).toEqual(-3);
    expect(round(vec.z, 4)).toEqual(2);
  });

  it('setRotationsMatrixY', () => {
    const mat = new Matrix();
    mat.setRotationsMatrixY(Math.PI / 2);
    const vec = mat.multiple(new Vector(1, 2, 3));

    expect(mat).toBeTruthy;
    expect(vec).toBeTruthy;

    expect(round(vec.x, 4)).toEqual(3);
    expect(round(vec.y, 4)).toEqual(2);
    expect(round(vec.z, 4)).toEqual(-1);
  });

  it('setRotationsMatrixZ', () => {
    const mat = new Matrix();
    mat.setRotationsMatrixZ(Math.PI / 2);
    const vec = mat.multiple(new Vector(1, 2, 3));

    expect(mat).toBeTruthy;
    expect(vec).toBeTruthy;

    expect(round(vec.x, 4)).toEqual(-2);
    expect(round(vec.y, 4)).toEqual(1);
    expect(round(vec.z, 4)).toEqual(3);
  });

  it('setRotationsMatrixBasedOnDirection', () => {
    const mat = new Matrix();
    mat.setRotationsMatrixBasedOnDirection(new Vector(1, 0, 0), Math.PI / 2);
    let vec = mat.multiple(new Vector(1, 2, 3));

    expect(mat).toBeTruthy;
    expect(vec).toBeTruthy;

    expect(round(vec.x, 4)).toEqual(1);
    expect(round(vec.y, 4)).toEqual(-3);
    expect(round(vec.z, 4)).toEqual(2);

    mat.setRotationsMatrixBasedOnDirection(new Vector(0, 1, 0), Math.PI / 2);
    vec = mat.multiple(new Vector(1, 2, 3));

    expect(mat).toBeTruthy;
    expect(vec).toBeTruthy;

    expect(round(vec.x, 4)).toEqual(3);
    expect(round(vec.y, 4)).toEqual(2);
    expect(round(vec.z, 4)).toEqual(-1);

    mat.setRotationsMatrixBasedOnDirection(new Vector(0, 0, 1), Math.PI / 2);
    vec = mat.multiple(new Vector(1, 2, 3));

    expect(mat).toBeTruthy;
    expect(vec).toBeTruthy;

    expect(round(vec.x, 4)).toEqual(-2);
    expect(round(vec.y, 4)).toEqual(1);
    expect(round(vec.z, 4)).toEqual(3);
  });
});
