import { Vector3 } from 'three';

export class Ellipsoid {
  readonly radii: Vector3 = new Vector3();
  readonly radiiSquared: Vector3 = new Vector3();
  readonly radiiToTheFourth: Vector3 = new Vector3();
  readonly oneOverRadiiSquared: Vector3 = new Vector3();
  readonly maxRadius: number;
  readonly minRadius: number;


  /**
   * Ellipsoid, defined by a, b and c radii
   *
   * @param a {number}
   * @param b {number}
   * @param c {number}
   */
  constructor(a: number, b: number, c: number) {
    this.radii.set(a, b, c);

    this.radiiSquared = new Vector3(
      this.radii.x * this.radii.x,
      this.radii.y * this.radii.y,
      this.radii.z * this.radii.z
    );
    this.radiiToTheFourth = new Vector3(
      this.radiiSquared.x * this.radiiSquared.x,
      this.radiiSquared.y * this.radiiSquared.y,
      this.radiiSquared.z * this.radiiSquared.z
    );
    this.oneOverRadiiSquared = new Vector3(
      1.0 / (this.radiiSquared.x),
      1.0 / (this.radiiSquared.y),
      1.0 / (this.radiiSquared.z)
    );
  }

  geodeticSurfaceNormal(positionOnSurface: Vector3, target?: Vector3): Vector3 {
    if (!target) {
      target = new Vector3();
    }

    target.multiplyVectors(positionOnSurface, this.oneOverRadiiSquared).normalize();

    return target;
  }


}
export const WORLD_SPHERICAL_MERCATOR_AXIS = 6371007.0;
export const WORLD_SPHERICAL = new Ellipsoid(
  WORLD_SPHERICAL_MERCATOR_AXIS,
  WORLD_SPHERICAL_MERCATOR_AXIS,
  WORLD_SPHERICAL_MERCATOR_AXIS
);

export const WGS84_SEMI_MAJOR_AXIS = 6378137.0;
export const WGS84_SEMI_MINOR_AXIS = 6356752.314245;


// Earth WGS84 Ellipsoid
export const Wgs84 = new Ellipsoid(
  WGS84_SEMI_MAJOR_AXIS,
  WGS84_SEMI_MAJOR_AXIS,
  WGS84_SEMI_MINOR_AXIS
);

// Unit Sphere
export const UnitSphere = new Ellipsoid(1.0, 1.0, 1.0);
