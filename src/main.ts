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

/**
 * @param {number} angle1 - Angle in degrees
 * @param {number} angle2 - Angle in degrees
 * @returns {number} Delta angle
 */
export function getDeltaAngle(
  angle1: number,
  angle2: number
): number {
  const a1 = getBearing360(angle1);
  const a2 = getBearing360(angle2);
  let delta = 0;

  if (a1 > a2) {
    delta = a1 - a2;
    if (delta < 180) {
      return delta;
    } else {
      return 360 - delta;
    }

  } else {
    delta = a2 - a1;
    if (delta < 180) {
      return delta;
    } else {
      return 360 - delta;
    }

  }
}

/**
 * @param {number[][]} points - Points in WGS 84 / EPSG:4326 coordinates.
 * @param {number} deviation - Deviation in meters
 * @returns {number[][]} Simplified points
 */
export function simplify(
  points: number[][],
  deviation: number
): number[][] {
  if (points.length > 5) {
    const simplified: number[][] = [];

    let i = 0;
    let j = 0;
    let idx = 1;

    let bearing = 0;
    let bearingNext = 0;

    let distance = 0;
    let deltaAngle = 0;

    simplified.push(points[0])
    for (i = 1; i < points.length - 1; i++) {
      bearingNext = getBearing360(getBearing(simplified[simplified.length - 1], points[i + 1]));

      for (j = idx; j <= i; j++) {
        bearing = getBearing360(getBearing(simplified[simplified.length - 1], points[j]));

        distance = getDistance(simplified[simplified.length - 1], points[j]);
        deltaAngle = getDeltaAngle(bearing, bearingNext);
  
        if (Math.sin(deltaAngle / 180 * Math.PI) * distance > deviation) {
          simplified.push(points[i])
          idx = i;
          break;
        }
      };
    }
    simplified.push(points[points.length - 1])
    return simplified;

  } else {
    return points;

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

simplify([[16.44842303000007,47.71961288700004],[16.448566192000044,47.71971360400005],[16.44856855100005,47.71971377800003],[16.44859754500004,47.71971592500006],[16.44882073900004,47.719732435000026],[16.448997210000073,47.71974548500003],[16.449077113000044,47.71975139300008],[16.449172040000064,47.719758383000055],[16.449404379000043,47.71977549400003],[16.44945410200006,47.71977915700006],[16.449502395000025,47.719775060000075],[16.449561017000065,47.719770090000054],[16.44959453000007,47.71976724800004],[16.44961081400004,47.719765865000056],[16.449635201000035,47.71976381600007],[16.449670421000064,47.71976084700003],[16.449726100000078,47.719756163000056],[16.449744672000065,47.719754601000034],[16.449747471000023,47.71975436400004],[16.44979140600003,47.71975069400003],[16.449794738000037,47.71975041200005],[16.449796110000023,47.71975030300007],[16.449828092000075,47.719747607000045],[16.44983443500007,47.71974706100008],[16.449847335000072,47.71974595000006],[16.449852452000073,47.71974552200004],[16.449860487000024,47.71974484900005],[16.44987308000003,47.71974378300007],[16.44988697900004,47.719742618000055],[16.449896387000024,47.719741826000075],[16.44989826400007,47.71974087900003],[16.449918540000056,47.71973069500007],[16.449920750000047,47.71972957700007],[16.44993383700006,47.719722998000066],[16.449945513000046,47.71971713100004],[16.449988234000045,47.71969561800006],[16.45003421800004,47.71967247300006],[16.450080188000072,47.71964932000003],[16.45011754500007,47.71963051100005],[16.45016619100005,47.71960601400008],[16.450201125000035,47.719588431000034],[16.45022405000003,47.71957688500004],[16.45026259100007,47.71955746300006],[16.45043743100007,47.71946937300004],[16.450454432000072,47.71946081100003],[16.450499792000073,47.71943796800008],[16.450500801000032,47.71943745900006],[16.45054811600005,47.719413630000076],[16.450590771000066,47.71939214400004],[16.450621134000073,47.71937685300003],[16.45068492000007,47.71934472800007],[16.45074580000005,47.71931407500006],[16.45083349300006,47.71926992200008],[16.450871626000037,47.71925292800006],[16.450935883000056,47.71922430500007],[16.451202308000063,47.71910557500007],[16.451471396000045,47.71898558200007],[16.451494550000064,47.71897525900005],[16.451567271000044,47.71894283000006],[16.451596539000036,47.71892977700003],[16.45164173300003,47.71890962400005],[16.451729165000074,47.718870637000066],[16.451846385000067,47.71881835700003],[16.451862176000077,47.71881131600003],[16.45199465500002,47.71875235500005],[16.452240838000023,47.71864245800003],[16.45248409100003,47.71853400200007],[16.452725745000066,47.71842626700004],[16.452767703000063,47.71840756200004],[16.45290133000003,47.71834798700007],[16.452967399000045,47.71831853200007],[16.453002681000044,47.71830284500004],[16.453219773000058,47.718236328000046],[16.453244678000033,47.718228701000044],[16.453458839000064,47.71816313200003],[16.453691778000064,47.718091740000034],[16.453818570000067,47.71805302000007],[16.453915777000077,47.71801613000008],[16.454034145000037,47.71797120600007],[16.454129900000055,47.717934865000075],[16.454169448000073,47.71791980200004],[16.454233432000024,47.71789405900006],[16.454308194000077,47.71786398000006],[16.45434227100003,47.71784595500003],[16.454377546000046,47.71782739000008],[16.45451831200006,47.71772407600008],[16.454621506000024,47.71764829500006],[16.45463925200005,47.71763526400008],[16.454691940000032,47.71759680300005],[16.454780284000037,47.71753231000008],[16.454869161000033,47.71746754700007],[16.454958437000073,47.71740251300008],[16.45507458800006,47.717317663000074],[16.455139382000027,47.71727046400008],[16.45523145100003,47.71720326900004],[16.45523675900006,47.71719939500008],[16.45525021000003,47.717189577000056],[16.455389291000074,47.717051457000025],[16.45548831700006,47.716953154000066],[16.45549877600007,47.71694277200004],[16.455549379000047,47.71689253800008],[16.455641575000072,47.71680100400005],[16.455710529000044,47.71673253800003],[16.45582889700006,47.71661909900007],[16.455876080000053,47.716573882000034],[16.455896143000075,47.71654822700003],[16.455981913000073,47.716441460000055],[16.45599181800003,47.71642913100004],[16.456031433000078,47.71638681600007],[16.45608580000004,47.71632857900005],[16.456206509000026,47.71619927800003],[16.456397137000067,47.71599553300007],[16.45642642300004,47.715964205000034],[16.456527184000038,47.71585641300004],[16.45656672100006,47.71581411600005],[16.456601057000057,47.715777383000045],[16.456621303000077,47.71575570200008],[16.456692781000072,47.71567915700007],[16.45678915700006,47.71554953200007],[16.45679879100004,47.715536575000044],[16.456832666000025,47.71549102700004],[16.456838065000056,47.715477297000064],[16.456915602000038,47.715280101000076],[16.456931155000063,47.71524054200006],[16.45696618900007,47.71515144300008],[16.457058174000053,47.71490386600004],[16.457062760000042,47.71489152400005],[16.457045107000056,47.71488306200007],[16.45711633800005,47.714762059000066],[16.45711933700005,47.71475696300007],[16.45715632100007,47.71469413500006],[16.457163856000022,47.71468133500008],[16.457188838000036,47.71463889800003],[16.457294397000055,47.71445362500003],[16.45743647200004,47.71412029100003],[16.45768380000004,47.713670861000026],[16.45772174800004,47.713552367000034],[16.457734595000034,47.713519173000066],[16.45655749200006,47.714158731000055],[16.455657339000027,47.714647623000076],[16.455367210000077,47.71480531600008],[16.453996535000044,47.71554064600008],[16.45323977000004,47.71596348300005],[16.452363559000048,47.716452512000046],[16.45205308000004,47.716625445000034],[16.451680530000033,47.71683214400008],[16.451025661000074,47.71720375500007],[16.450528507000058,47.717471370000055],[16.449995065000053,47.717760301000055],[16.44902606100004,47.71828702300007],[16.448767240000052,47.71842704800008],[16.447621972000036,47.71904932000007],[16.44829743200006,47.71952452600004],[16.44842303000007,47.71961288700004]], 10);
