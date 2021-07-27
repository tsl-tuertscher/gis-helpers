/**
 * @const
 * @type {number} Earth circumference in meters
 */
const earthCircumference = 40075016.68557849;

/**
 * @param {number} x - Coordinate in x
 * @param {number} z - Zoom level
 * @returns {number} X coordinate in EPSG:3857
 */
export function fromTileX(x: number, z: number): number {
  return (((x / Math.pow(2, z)) * 2 - 1) * earthCircumference) / 2;
}

/**
 * @param {number} y - Coordinate in y
 * @param {number} z - Zoom level
 * @returns {number} Y coordinate in EPSG:3857
 */
export function fromTileY(y: number, z: number): number {
  return ((1 - (y / Math.pow(2, z)) * 2) * earthCircumference) / 2;
}

/**
 * @param {number} x - Coordinate in EPSG:3857
 * @param {number} z - Zoom level
 * @returns {number} Tile x
 */
 export function toTileX(x: number, z: number): number {
  return (Math.pow(2, z) / 2 * (1 + (2 * x / earthCircumference)));
}

/**
 * @param {number} y - Coordinate in EPSG:3857
 * @param {number} z - Zoom level
 * @returns {number} Tile y
 */
export function toTileY(y: number, z: number): number {
  return (Math.pow(2, z) / 2 * (1 - (2 * y / earthCircumference)));
}

/**
 * @param {number} x - Coordinate in x
 * @param {number} z - Zoom level
 * @returns {number} Longitude coordinate in WGS 84 / EPSG:4326
 */
export function tile2lon(x: number, z: number): number {
  return (x / Math.pow(2, z)) * 360 - 180;
}

/**
 * @param {number} y - Coordinate in y
 * @param {number} z - Zoom level
 * @returns {number} Latitude coordinate in WGS 84 / EPSG:4326
 */
export function tile2lat(y: number, z: number): number {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

/**
 * @param {number} lon - Longitude coordinate in WGS 84 / EPSG:4326
 * @param {number} zoom - Zoom level
 * @param {boolean} floor - Floor value of the result
 * @returns {number} Coordinate in x
 */
export function lon2tile(lon: number, zoom: number, floor: boolean): number {
  if (floor) {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  } else {
    return ((lon + 180) / 360) * Math.pow(2, zoom);
  }
}

/**
 * @param {number} lat - Latitude coordinate in WGS 84 / EPSG:4326
 * @param {number} zoom - Zoom level
 * @param {boolean} floor - Floor value of the result
 * @returns {number} Coordinate in y
 */
export function lat2tile(lat: number, zoom: number, floor: boolean): number {
  if (floor) {
    return Math.floor(
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
        Math.pow(2, zoom),
    );
  } else {
    return (
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
    );
  }
}
