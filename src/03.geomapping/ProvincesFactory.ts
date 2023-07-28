import { DoubleSide, Mesh, MeshBasicMaterial, Object3D } from 'three';
import { Feature } from '@turf/turf';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { GeoJSONTriangleGeometry } from './GeoJSONTriangleGeometry';

export class ProvincesFactory {
  private colorIndex = 0;
  public colors: string[];

  constructor() {
    this.colors = schemeCategory10;
  }

  province(feature: Feature): Object3D {

    const color = this.getColor();

    const meshMaterial = new MeshBasicMaterial( {
      color: color,
      transparent: true,
      side: DoubleSide
    } );

    const trianglesGeometry = new GeoJSONTriangleGeometry(feature);

    return new Mesh(trianglesGeometry, meshMaterial);
  }

  private getColor(): string {
    const index = this.colorIndex++;
    return this.colors[index % this.colors.length];
  }
}
