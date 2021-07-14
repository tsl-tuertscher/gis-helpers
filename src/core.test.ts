import { round } from './core';

describe('core', () => {
  it('round', () => {
    const res = round(10.1244, 2);
    expect(res).toBe(10.12);
  });
});
