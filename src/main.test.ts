import {
  getBearing,
  getBearing360,
  getDistance,
  getRadialCoordinates,
  getPointInPolygon,
  getBoundingRectangle,
} from './main';
import { round } from './core';

describe('main', () => {
  it('getDistance', () => {
    const res = Math.round(getDistance([9, 47.5], [13, 49.2]));
    expect(res).toBe(351187);
  });

  it('getBearing', () => {
    const res = Math.round(getBearing([9, 47.5], [13, 49.2]));
    expect(res).toBe(56);
  });

  it('getBearing360', () => {
    let res = getBearing360(578);
    expect(res).toBe(218);

    res = getBearing360(-490);
    expect(res).toBe(230);

    res = getBearing360(-49);
    expect(res).toBe(311);
  });

  it('getRadialCoordinates', () => {
    const res = getRadialCoordinates([9, 47.5], 45, 1000);
    expect(res[0]).toBe(9.009403);
    expect(res[1]).toBe(47.506352);
  });

  it('getPointInPolygon', () => {
    expect(
      getPointInPolygon(
        [
          [8.313217163085938, 46.71067759419637],
          [8.556976318359373, 46.71067759419637],
          [8.556976318359373, 46.82966386051541],
          [8.313217163085938, 46.82966386051541],
          [8.313217163085938, 46.71067759419637],
        ],
        [8.459472656249998, 46.779373682055635],
      ),
    ).toEqual(true);
  });

  it('boundingRectangle', () => {
    const res = getBoundingRectangle([
      [8.61328125, 46.98962081759436],
      [8.8604736328125, 47.07386310181414],
      [8.9154052734375, 46.897739085507],
      [8.84124755859375, 46.70596917928676],
      [8.63525390625, 46.84140712700584],
      [8.42376708984375, 47.00273390667881],
      [8.8055419921875, 47.10939214403789],
      [8.8055419921875, 46.822616668804926],
      [8.70941162109375, 46.781254534638606],
    ]);
    expect(res[0]).toEqual([8.42376708984375, 46.70596917928676]);
    expect(res[1]).toEqual([8.9154052734375, 47.10939214403789]);
  });
});
