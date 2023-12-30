import { Group, Mesh, MeshBasicMaterial, SphereGeometry, TextureLoader } from 'three';

export class Earth {
  static DEFAULT_TEXTURE_PATH = '/world.topo.bathy.200412.3x5400x2700.png';

  readonly root = new Group();


  constructor() {
    this.initSphere();
  }

  private initSphere(): void {
    const globeMesh = new SphereGeometry(5, 50, 50);

    const texture = new TextureLoader().load(Earth.DEFAULT_TEXTURE_PATH);
    const material = new MeshBasicMaterial({
      map: texture,
    });

    const globe = new Mesh(globeMesh, material);

    this.root.add(globe);
  }
}
