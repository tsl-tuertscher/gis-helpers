![example workflow](https://github.com/tsl-tuertscher/gis-helpers/actions/workflows/main.yml/badge.svg)
![example workflow](https://github.com/tsl-tuertscher/gis-helpers/actions/workflows/npm.yml/badge.svg)
![example workflow](https://github.com/tsl-tuertscher/gis-helpers/actions/workflows/package.yml/badge.svg)
# gis-helpers
Helper functions for geographic information system

## Install

```
npm install @tsl-tuertscher/gis-helpers
```

## Usage

```js
import {
  getBearing,
  getBearing360,
  getDistance,
  getRadialCoordinates,
  getPointInPolygon,
  getBoundingRectangle,
} from '@tsl-tuertscher/gis-helpers';
import { Vector } from '@tsl-tuertscher/gis-helpers/vector';

...

const distance = getDistance([9, 47.5], [13, 49.2]);
const bearing = getBearing([9, 47.5], [13, 49.2]);
const coordinate = getRadialCoordinates([9, 47.5], 45, 1000);

...

const vector = new Vector(1,2,3);
const newVector = vector.innerProduct(new Vector(4, 5, 6));

```
