import { Position } from '@turf/turf';

export type CoordinateTransformer = (Position) => Position;

export const coordinateTransformer: CoordinateTransformer = (source: Position): Position => {

  const out = convertToMercator(source);
  // z
  out[2] = out[2] || 0;
  return out;
}

/**
 * Convert lon/lat values to 900913 x/y.
 * (from https://github.com/mapbox/sphericalmercator)
 *
 * @param {Array<number>} lonLat WGS84 point
 * @returns {Array<number>} Mercator [x, y] point
 */
export function convertToMercator(lonLat: number[]) {
  const D2R = Math.PI / 180;
  // 900913 properties
  const A = 6378137.0;
  const MAX_EXTENT = 20037508.342789244;

  // compensate longitudes passing the 180th meridian
  // from https://github.com/proj4js/proj4js/blob/master/lib/common/adjust_lon.js
  const adjusted = Math.abs(lonLat[0]) <= 180 ? lonLat[0] : lonLat[0] - sign(lonLat[0]) * 360;
  const xy = [
    A * adjusted * D2R,
    A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lonLat[1] * D2R)),
  ];

  // if xy value is beyond max extent (e.g. poles), return max extent
  if (xy[0] > MAX_EXTENT) xy[0] = MAX_EXTENT;
  if (xy[0] < -MAX_EXTENT) xy[0] = -MAX_EXTENT;
  if (xy[1] > MAX_EXTENT) xy[1] = MAX_EXTENT;
  if (xy[1] < -MAX_EXTENT) xy[1] = -MAX_EXTENT;

  return xy;
}

/**
 * Returns the sign of the input, or zero
 *
 * @param {number} x input
 * @returns {number} -1|0|1 output
 */
function sign(x: number) {
  return x < 0 ? -1 : x > 0 ? 1 : 0;
}
