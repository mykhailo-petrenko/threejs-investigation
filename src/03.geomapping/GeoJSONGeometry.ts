import { BufferGeometry, Float32BufferAttribute } from "three";
import earcut from 'earcut';
import { Feature, Geometry, GeometryCollection, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon, Position } from "@turf/turf";

export class GeoJSONGeometry extends BufferGeometry {
  protected _transformCoordinate: (Position) => Position;

  constructor(
    private geoJson: Feature,
    coordinateTransformer?: (Position) => Position
  ) {
    super();

    if (coordinateTransformer) {
      this._transformCoordinate = coordinateTransformer;
    } else {
      this._transformCoordinate = this.defaultTransformCoordinates;
    }

    this.rebuild();
  }

  public rebuild() {
    const geometry = this.geoJson.geometry;

    const groups = this.getGroups(geometry);


    let indices = [], vertices = [];
    let groupCnt = 0;
    groups.forEach(newG => {
      const prevIndCnt = indices.length;

      concatGroup({indices, vertices}, newG);

      this.addGroup(prevIndCnt, indices.length - prevIndCnt, groupCnt++);

      groupCnt++;
    });

    // build geometry
    indices.length && this.setIndex(indices);
    vertices.length && this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  }

  protected defaultTransformCoordinates([x, y, z]: Position): Position {
    return [x, y, z || 0] as Position;
  }

  getGroups(geometry: Geometry | GeometryCollection): any[] {
    console.log('getGroups', geometry.type);
    switch(geometry.type) {
      case 'Point': 
        return this.genPoint((geometry as Point).coordinates);
      case 'MultiPoint': 
        return this.genMultiPoint((geometry as MultiPoint).coordinates);
      case 'LineString': 
        return this.genLineString((geometry as LineString).coordinates);
      case 'MultiLineString': 
        return this.genMultiLineString((geometry as MultiLineString).coordinates);
      case 'Polygon': 
        return this.genPolygon((geometry as Polygon).coordinates);
      case 'MultiPolygon': 
        return this.genMultiPolygon((geometry as MultiPolygon).coordinates);
    }
    return [];
  }

  genPoint(coords: Position): any[] { 
    const vertices = this._transformCoordinate(coords);
    const indices = [];

    return [{vertices, indices}];
  }

  genMultiPoint(coords: Position[]): any[] {
    const result = {vertices: [], indices: []};

    coords
      .map(c => this.genPoint(c))
      .forEach(([newPnt]) => {
        concatGroup(result, newPnt);
      });

    return [result];
  }

  genLineString(coords: Position[]): any[] {
    // const coords3d = interpolateLine(coords, resolution)
    const coords3d = coords.map((coordinate) => this._transformCoordinate(coordinate));

    const {vertices} = earcut.flatten([coords3d]);

    const numPoints = Math.round(vertices.length / 3);

    const indices = [];

    for (let vIdx = 1; vIdx < numPoints; vIdx++) {
      indices.push(vIdx - 1, vIdx);
    }

    return [{vertices, indices}];
  }

  genMultiLineString(coords: Position[][]): any[] {
    const result = {vertices: [], indices: []};

    coords
      .map(coordinate => this.genLineString(coordinate))
      .forEach(([newLine]) => {
        concatGroup(result, newLine);
      });

    return [result];
  }

  genPolygon(polygon: Position[][]): any[] {
    const coords3d: Position[][] = polygon
      .map((coordsSegment) => {
        return coordsSegment.map((value: Position) => this._transformCoordinate(value))
      });
      // .map(coordsSegment => interpolateLine(coordsSegment, resolution)
      

    // Each point generates 3 vertice items (x,y,z).
    const {vertices, holes} = earcut.flatten(coords3d);

    const firstHoleIdx = holes[0] || Infinity;
    const outerVertices = vertices.slice(0, firstHoleIdx * 3);
    const holeVertices = vertices.slice(firstHoleIdx * 3);

    const holesIdx = new Set(holes);

    const numPoints = Math.round(vertices.length / 3);

    const outerIndices = [], holeIndices = [];
    for (let vIdx = 1; vIdx < numPoints; vIdx++) {
      if (!holesIdx.has(vIdx)) {
        if (vIdx < firstHoleIdx) {
          outerIndices.push(vIdx - 1, vIdx)
        } else {
          holeIndices.push(vIdx - 1 - firstHoleIdx, vIdx - firstHoleIdx);
        }
      }
    }

    const groups = [{indices: outerIndices, vertices: outerVertices}];

    if (holes.length) {
      groups.push({indices: holeIndices, vertices: holeVertices});
    }

    return groups;
  }

  genMultiPolygon(polygons: Position[][][]) {
  
    const outer = {vertices: [], indices: []};
    const holes = {vertices: [], indices: []};

    polygons.map(polygon => this.genPolygon(polygon)).forEach(([newOuter, newHoles]) => {
      concatGroup(outer, newOuter);
      newHoles && concatGroup(holes, newHoles);
    });

    const groups = [outer];
    holes.vertices.length && groups.push(holes);

    return groups;
  }

}

function concatGroup(main, extra) {
  const prevVertCnt = Math.round(main.vertices.length / 3);
  concatArr(main.vertices, extra.vertices);
  concatArr(main.indices, extra.indices.map(ind => ind + prevVertCnt));
}

function concatArr(target, src) {
  for (let e of src) target.push(e);
}
