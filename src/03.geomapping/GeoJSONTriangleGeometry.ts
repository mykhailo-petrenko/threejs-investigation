import { Feature, Position } from "@turf/turf";
import earcut from 'earcut';
import { GeoJSONGeometry } from "./GeoJSONGeometry";

export class GeoJSONTriangleGeometry extends GeoJSONGeometry {
  constructor(geoJson: Feature, coordinateTransformer?: (Position) => Position) {
    super(geoJson, coordinateTransformer);
  }

  genPolygon(polygon: Position[][]): any[] {
    const coords3d: Position[][] = polygon
      .map((coordsSegment) => {
        return coordsSegment.map((value: Position) => this._transformCoordinate(value))
      });
      // .map(coordsSegment => interpolateLine(coordsSegment, resolution)


    // Each point generates 3 vertices items (x,y,z).
    const {vertices, holes} = earcut.flatten(coords3d);
    const triangles = earcut(vertices, holes, 3);

    return [
      {indices: triangles, vertices: vertices}
    ];
  }
}
