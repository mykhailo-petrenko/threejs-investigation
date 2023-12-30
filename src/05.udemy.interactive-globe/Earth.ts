import { Group, Mesh, MeshBasicMaterial, ShaderMaterial, SphereGeometry, TextureLoader } from 'three';

import fs from './shaders/fragment.glsl';
import vs from './shaders/vertex.glsl';

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
    // const globe = new Mesh(globeMesh, material);

    const customMaterial = new ShaderMaterial({
      fragmentShader: fs,
      vertexShader: vs,
      uniforms: {
        globeTexture: {
          value: texture,
        },
        sunDirection: {
          value: [1, 0, 0]
        }
      }
    });
    const globe = new Mesh(globeMesh, customMaterial);

    this.root.add(globe);
  }
}
