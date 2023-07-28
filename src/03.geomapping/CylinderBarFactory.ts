import { Position } from '@turf/turf';
import { CylinderGeometry, Mesh, MeshPhongMaterial, Object3D } from 'three';
import { coordinateTransformer, CoordinateTransformer } from '@/03.geomapping/geoUtils';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';



export interface CylinderBar {
  label: string;
  position: Position;
  count: number;
  color: string;
}

const HALF_PI = Math.PI / 2;

export class CylinderBarFactory {

  private transformer: CoordinateTransformer;

  constructor() {
    this.transformer = coordinateTransformer;
  }

  public createBar(feature: CylinderBar): Object3D {
    const K = 1000;

    const [x, y, z] = this.transformer(feature.position);

    const radius = K * Math.log2(feature.count + 1); // derived from size ...

    const height = radius * 3;
    const segments = radius / 10;
    const cylinder = new CylinderGeometry(radius, radius, height, segments);


    const material = new MeshPhongMaterial({
      color: feature.color,
      transparent: true,
    })

    const mesh = new Mesh(cylinder, material);
    mesh.rotateX(HALF_PI);
    mesh.position.set(x, y, z + (height / 2));

    const legenda = this.addLegenda(feature);
    legenda.position.set(radius, 0, 0)
    mesh.add(legenda);

    return mesh;
  }

  private addLegenda(feature: CylinderBar): Object3D {
    const legendaElement = this.createLegendaElement(feature);

    return new CSS2DObject( legendaElement );
  }

  protected createLegendaElement(feature: CylinderBar): HTMLElement {
    const legendaDiv = document.createElement( 'section' );
    legendaDiv.className = 'cylinder-bar-legenda';
    legendaDiv.style.backgroundColor = 'transparent';

    const legendaContainer = document.createElement( 'div' );
    legendaContainer.className = 'cylinder-bar-container';
    legendaDiv.appendChild(legendaContainer);

    {
      const label = document.createElement('div');
      label.className = 'cylinder-bar-label';
      label.textContent = feature.label;
      legendaContainer.appendChild(label);

      const count = document.createElement('div');
      count.className = 'cylinder-bar-count';
      count.textContent = `count: ${feature.count}`;
      legendaContainer.appendChild(count);
    }

    return legendaDiv;
  }
}
