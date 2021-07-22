import { round, sign } from './core';
import { Vector } from './vector';
/**
 * Radius of WGS84 sphere
 *
 * @const
 * @type {number} Earth radius in nautical miles.
 */
export const earthRadius = 6378137;

/**
 * @const
 * @type {number} Nautical miles in meters.
 */
export const nauticalMile: number = 1852;

/**
 * @param {number[][]} boundingRectangle - Rectangle in EPSG:3857 coordinates.
 * @param {number[]} point - Point in EPSG:3857 coordinates.
 * @returns {boolean} Whether the point is in the bounding rectangle or not.
 */
 export function getPointInBoundingRectangle(boundingRectangle: number[][], point: number[]): boolean {
  if (
    boundingRectangle[0][0] > point[0] ||
    boundingRectangle[1][0] < point[0] ||
    boundingRectangle[0][1] > point[1] ||
    boundingRectangle[1][1] < point[1]
  ) {
    return false;
  }
  return true;
}

/**
 * @param {number[][]} triangle - Triangle in EPSG:3857 coordinates.
 * @param {number[]} point - Point in EPSG:3857 coordinates.
 * @returns {boolean} Whether the point is in the triangle or not.
 */
export function getPointInTriangle(triangle: number[][], point: number[]): boolean {
  const d1 = sign(point, triangle[0], triangle[1]);
  const d2 = sign(point, triangle[1], triangle[2]);
  const d3 = sign(point, triangle[2], triangle[0]);

  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

  return !(hasNeg && hasPos);
}

/**
 * @param {number[][]} rectangle1 - First rectangle as bounding rectangle
 * @param {number[][]} rectangle2 - Second rectangle as bounding rectangle
 * @returns {boolean} Whether the two rectangles intersect or not
 */
export function getRectangleIntersection(rectangle1: number[][], rectangle2: number[][]): boolean {
  if (
    rectangle1[0][0] > rectangle2[1][0] ||
    rectangle1[1][0] < rectangle2[0][0] ||
    rectangle1[0][1] > rectangle2[1][1] ||
    rectangle1[1][1] < rectangle2[0][1]
  ) {
    return false;
  }
  return true;
}

/**
 * @param {number[]} startPoint - Point in WGS 84 / EPSG:4326 coordinates.
 * @param {number[]} endPoint - Point in WGS 84 / EPSG:4326 coordinates.
 * @returns {number} Distance in meters
 */
export function getDistance(startPoint: number[], endPoint: number[]): number {
  if (round(startPoint[1], 6) === round(endPoint[1], 6) && round(startPoint[0], 6) === round(endPoint[0], 6)) {
    return 0;
  }

  const V1x = earthRadius * (Math.cos((startPoint[1] * Math.PI) / 180) * Math.cos((startPoint[0] * Math.PI) / 180));
  const V1y = earthRadius * (Math.cos((startPoint[1] * Math.PI) / 180) * Math.sin((startPoint[0] * Math.PI) / 180));
  const V1z = earthRadius * Math.sin((startPoint[1] * Math.PI) / 180);

  const V2x = earthRadius * (Math.cos((endPoint[1] * Math.PI) / 180) * Math.cos((endPoint[0] * Math.PI) / 180));
  const V2y = earthRadius * (Math.cos((endPoint[1] * Math.PI) / 180) * Math.sin((endPoint[0] * Math.PI) / 180));
  const V2z = earthRadius * Math.sin((endPoint[1] * Math.PI) / 180);

  let value =
    (V1x * V2x + V1y * V2y + V1z * V2z) /
    (Math.sqrt(Math.pow(V1x, 2) + Math.pow(V1y, 2) + Math.pow(V1z, 2)) *
      Math.sqrt(Math.pow(V2x, 2) + Math.pow(V2y, 2) + Math.pow(V2z, 2)));
  if (value > 1) {
    value = 1;
  } else if (value < -1) {
    value = -1;
  }

  return Math.round(Math.acos(value) * earthRadius);
}

/**
 * @param {number[]} centerPoint - Point in WGS 84 / EPSG:4326 coordinates.
 * @param {number} angle - Angle in degree
 * @param {number} distance - Distance in meter
 * @returns {number} Point in WGS 84 / EPSG:4326 coordinates
 */
export function getRadialCoordinates(centerPoint: number[], angle: number, distance: number) {
  const coordinates: number[] = [];

  if (distance === 0) {
    coordinates[1] = centerPoint[1];
    coordinates[0] = centerPoint[0];
    return coordinates;
  } else if (distance < 0) {
    distance *= -1;
    angle += 180;
  }

  let westHemisphere = 1;

  while (angle < 0) {
    angle += 360;
  }

  while (angle > 360) {
    angle -= 360;
  }

  if (angle > 180) {
    westHemisphere = -1;
  }

  const cosTheta = Math.cos(distance / earthRadius);
  const cosA = Math.cos((centerPoint[1] * Math.PI) / 180);
  const cosAlpha = Math.cos((angle * Math.PI) / 180);

  const sinTheta = Math.sin(distance / earthRadius);
  const sinA = Math.sin((centerPoint[1] * Math.PI) / 180);

  coordinates[1] = (Math.asin(cosAlpha * cosA * sinTheta + sinA * cosTheta) * 180) / Math.PI;

  let n = Math.sqrt(1 - Math.pow(cosAlpha * cosA * sinTheta + cosTheta * sinA, 2));
  const z = cosTheta * cosA - cosAlpha * sinTheta * sinA;

  if (z > n) {
    n = z;
  }
  coordinates[0] = centerPoint[0] + ((Math.acos(z / n) * 180) / Math.PI) * westHemisphere;

  return [round(coordinates[0], 6), round(coordinates[1], 6)];
}

/**
 * @param {number[]} centerPoint - Point in WGS 84 / EPSG:4326 coordinates.
 * @param {number[]} directionPoint - Point in WGS 84 / EPSG:4326 coordinates.
 * @returns {number} Angle in degree
 */
export function getBearing(centerPoint: number[], directionPoint: number[]): number {
  if (centerPoint[1] === directionPoint[1] && centerPoint[0] === directionPoint[0]) {
    return 0;
  }

  const cosPhiA = Math.cos((centerPoint[1] * Math.PI) / 180);
  const cosPhiB = Math.cos((directionPoint[1] * Math.PI) / 180);
  const sinPhiA = Math.sin((centerPoint[1] * Math.PI) / 180);
  const sinPhiB = Math.sin((directionPoint[1] * Math.PI) / 180);
  const cosLambdaLamdaB = Math.cos(((centerPoint[0] - directionPoint[0]) * Math.PI) / 180);

  let n = Math.sqrt(1 - Math.pow(cosLambdaLamdaB * cosPhiA * cosPhiB + sinPhiA * sinPhiB, 2));
  let z = cosPhiA * sinPhiB - cosLambdaLamdaB * cosPhiB * sinPhiA;

  let zTemp = 0;
  if (Math.abs(n) < Math.abs(z)) {
    zTemp = z;
    z = n;
    n = zTemp;
  }

  const val = (Math.acos(z / n) * 180) / Math.PI;

  if (centerPoint[0] > directionPoint[0]) {
    return val * -1;
  } else {
    return val;
  }
}

/**
 * @param {number} angle - Angle in degree
 * @returns {number} Angle in degree
 */
export function getBearing360(angle: number): number {
  let newAngle = angle;

  while (newAngle < 0) {
    newAngle += 360;
  }

  while (newAngle > 360) {
    newAngle -= 360;
  }

  return newAngle;
}

/**
 * @param {number[][]} points - Points in WGS 84 / EPSG:4326 coordinates.
 * @returns {number[][]} Bounding rectangle in WGS 84 / EPSG:4326 coordinates.
 */
export function getBoundingRectangle(points: number[][]): number[][] {
  let lonMin = 180;
  let latMin = 90;

  let lonMax = -180;
  let latMax = -90;

  if (points.length > 0) {
    for (let i = 0; i < points.length; i++) {
      const lat = points[i][1];
      const lon = points[i][0];

      if (lat > latMax) {
        latMax = lat;
      }

      if (lat < latMin) {
        latMin = lat;
      }

      if (lon > lonMax) {
        lonMax = lon;
      }

      if (lon < lonMin) {
        lonMin = lon;
      }
    }
  } else {
    lonMin = 0;
    latMin = 0;

    lonMax = -0;
    latMax = -0;
  }

  return [
    [lonMin, latMin],
    [lonMax, latMax],
  ];
}

/**
 * @param {number[][]} polygon - Polygon in WGS 84 / EPSG:4326 coordinates.
 * @param {number[]} point - Point in WGS 84 / EPSG:4326 coordinates.
 * @returns {boolean} Whether the point is in the polygon or not.
 */
export function getPointInPolygon(polygon: number[][], point: number[]): boolean {
  const bR = getBoundingRectangle(polygon);

  let directionPoint = [];
  let intersectionCounter = 0;
  let intersectionPoint;
  const heading = [];
  const bearing = [];
  const deltaAngle = [];
  const radius = [];

  if (bR[0][0] < point[0] && bR[1][0] > point[0] && bR[0][1] < point[1] && bR[1][1] > point[1]) {
    const n = 0;
  } else {
    return false;
  }

  for (let counter = 0; counter < polygon.length; counter++) {
    bearing[counter] = getBearing(point, polygon[counter]);
    radius[counter] = getDistance(point, polygon[counter]);
  }

  bearing.splice(bearing.length - 1, 1);

  const sortedBearing = bearing.sort();
  for (let counter = 1; counter < sortedBearing.length; counter++) {
    deltaAngle.push(Math.abs(sortedBearing[counter] - sortedBearing[counter - 1]));
  }

  const sortedDeltaAngel = deltaAngle.sort((a, b) => b - a);
  const biggestGap = deltaAngle.indexOf(sortedDeltaAngel[0]);

  heading[4] = sortedBearing[biggestGap] + sortedDeltaAngel[0] / 2;
  directionPoint = getRadialCoordinates(point, heading[4], Math.max.apply(null, radius) + 0.1);

  for (let a = 1; a < polygon.length; a++) {
    if (polygon[a - 1][1] === point[1] && polygon[a - 1][0] === point[0]) {
      return true;
    }

    intersectionPoint = intersection(directionPoint, point, polygon[a - 1], polygon[a]);

    heading[0] = getBearing(intersectionPoint, point);
    heading[1] = getBearing(intersectionPoint, directionPoint);

    heading[2] = getBearing(intersectionPoint, polygon[a - 1]);
    heading[3] = getBearing(intersectionPoint, polygon[a]);

    // It should be 180, but because of numerical errors it is set from 170 to 190.
    if (
      Math.abs(Math.round(heading[0] - heading[1])) > 170 &&
      Math.abs(Math.round(heading[0] - heading[1])) < 190 &&
      Math.abs(Math.round(heading[2] - heading[3])) > 170 &&
      Math.abs(Math.round(heading[2] - heading[3])) < 190
    ) {
      intersectionCounter += 1;
    }
  }

  if (intersectionCounter % 2 === 1) {
    return true;
  } else {
    return false;
  }
}

function intersection(point1: number[], point2: number[], point3: number[], point4: number[]): number[] {
  const plane1 = getPlane(point1, point2);
  const plane2 = getPlane(point3, point4);

  const intersectionPoint1 = vector2Vertex(cartesian2spherical(plane1.vectorProduct(plane2)));
  const intersectionPoint2 = vector2Vertex(cartesian2spherical(plane2.vectorProduct(plane1)));

  const distance1 = getDistance(intersectionPoint1, point1);
  const distance2 = getDistance(intersectionPoint2, point1);

  if (distance1 === 0) {
    return intersectionPoint1;
  } else if (distance2 === 0) {
    return intersectionPoint2;
  } else if (distance1 > distance2) {
    return intersectionPoint2;
  } else {
    return intersectionPoint1;
  }
}

function cartesian2spherical(vectorCartesian: Vector): Vector {
  const vec = new Vector(0, 0, 0);

  vec.x = Math.atan2(vectorCartesian.y, vectorCartesian.x);
  vec.z = Math.sqrt(Math.pow(vectorCartesian.x, 2) + Math.pow(vectorCartesian.y, 2) + Math.pow(vectorCartesian.z, 2));
  vec.y = Math.acos(vectorCartesian.z / vec.z);

  return vec;
}

function getPlane(startPoint: number[], endPoint: number[]): Vector {
  const vector1 = new Vector(
    earthRadius * (Math.cos((startPoint[1] * Math.PI) / 180) * Math.cos((startPoint[0] * Math.PI) / 180)),
    earthRadius * (Math.cos((startPoint[1] * Math.PI) / 180) * Math.sin((startPoint[0] * Math.PI) / 180)),
    earthRadius * Math.sin((startPoint[1] * Math.PI) / 180),
  );

  const vector2 = new Vector(
    earthRadius * (Math.cos((endPoint[1] * Math.PI) / 180) * Math.cos((endPoint[0] * Math.PI) / 180)),
    earthRadius * (Math.cos((endPoint[1] * Math.PI) / 180) * Math.sin((endPoint[0] * Math.PI) / 180)),
    earthRadius * Math.sin((endPoint[1] * Math.PI) / 180),
  );

  return vector1.vectorProduct(vector2);
}

function vector2Vertex(vector: Vector): number[] {
  return [(vector.x * 180) / Math.PI, 90 - (vector.y * 180) / Math.PI];
}
