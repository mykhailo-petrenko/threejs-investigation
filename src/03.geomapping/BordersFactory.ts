import { Feature } from '@turf/turf';
import { LineBasicMaterial, LineSegments, Object3D } from 'three';
import { GeoJSONGeometry } from '@/03.geomapping/GeoJSONGeometry';

export class BordersFactory {
  public border(feature: Feature): Object3D {
    const lineMaterial = new LineBasicMaterial({
      color: 'red',
      transparent: true,
    });

    const contoursGeometry = new GeoJSONGeometry(feature);

    return new LineSegments(
      contoursGeometry,
      lineMaterial
    );
  }
}
