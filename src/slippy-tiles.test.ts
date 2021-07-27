import { round } from './core';
import { fromTileX, fromTileY, tile2lon, tile2lat, lon2tile, lat2tile, toTileX, toTileY } from './slippy-tiles';

describe('slippy-tiles', () => {
  it('fromTileX', () => {
    const tile = round(fromTileX(269, 9), 4);
    expect(tile).toBe(1017529.7205);
  });

  it('fromTileY', () => {
    const tile = round(fromTileY(179, 9), 4);
    expect(tile).toBe(6026906.8062);
  });

  it('toTileX', () => {
    const tile = round(toTileX(1017529.7205, 9), 1);
    expect(tile).toBe(269);
  });

  it('toTileY', () => {
    const tile = round(toTileY(6026906.8062, 9), 1);
    expect(tile).toBe(179);
  });

  it('tile2lon', () => {
    const tile = round(tile2lon(269, 9), 4);
    expect(tile).toBe(9.1406);
  });

  it('tile2lat', () => {
    const tile = round(tile2lat(179, 9), 4);
    expect(tile).toBe(47.5172);
  });

  it('lon2tile', () => {
    let tile = round(lon2tile(9.34, 12, false), 4);
    expect(tile).toBe(2154.2684);

    tile = lon2tile(9.34, 9, true);
    expect(tile).toBe(269);
  });

  it('lat2tile', () => {
    let tile = round(lat2tile(47.34, 12, false), 4);
    expect(tile).toBe(1434.9802);

    tile = lat2tile(47.34, 9, true);
    expect(tile).toBe(179);
  });
});
