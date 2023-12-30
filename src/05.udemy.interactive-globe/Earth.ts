import {
  AdditiveBlending,
  BackSide,
  Group, IUniform,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  TextureLoader
} from 'three';

import vs from './shaders/vertex.glsl';
import fs from './shaders/fragment.glsl';
import atmosphereFS from './shaders/atmosphere.fragment.glsl';

export class Earth {
  static DEFAULT_TEXTURE_PATH = '/world.topo.bathy.200412.3x5400x2700.png';

  readonly root = new Group();
  public uniforms: Record<string, IUniform>;

  constructor() {
    this.initUniforms();
    this.initSphere();
  }

  private initUniforms() {
    this.uniforms = {
      sunDirection: {
        value: [1, 0, 0]
      },
      atmosphereColor: {
        value: [.3, .6, 1.]
      }
    };
  }

  private initSphere(): void {
    const R = 5;
    const globeMesh = new SphereGeometry(R, R*10, R*10);
    const atmosphereMesh = new SphereGeometry(R*1.1, R*10, R*10);

    const texture = new TextureLoader().load(Earth.DEFAULT_TEXTURE_PATH);
    const customMaterial = new ShaderMaterial({
      fragmentShader: fs,
      vertexShader: vs,
      uniforms: {
        globeTexture: {
          value: texture,
        },
        sunDirection: this.uniforms.sunDirection,
        atmosphereColor:  this.uniforms.atmosphereColor,
      }
    });
    const globe = new Mesh(globeMesh, customMaterial);

    this.root.add(globe);

    const atmosphereMaterial = new ShaderMaterial({
      fragmentShader: atmosphereFS,
      vertexShader: vs,
      uniforms: {
        sunDirection: this.uniforms.sunDirection,
        atmosphereColor:  this.uniforms.atmosphereColor,
      },
      side: BackSide,
      blending: AdditiveBlending,
    });
    const pseudoAtmosphere = new Mesh(atmosphereMesh, atmosphereMaterial)
    this.root.add(pseudoAtmosphere);
  }
}
