import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { WORLD_SPHERICAL_MERCATOR_AXIS } from '@/05.udemy.interactive-globe/geo/Ellipsoid';
import { View } from '@/05.udemy.interactive-globe/View';
import { Earth } from '@/05.udemy.interactive-globe/Earth';

export class GlobeScene {
  static DEFAULT_FAR = WORLD_SPHERICAL_MERCATOR_AXIS;

  world: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  debugCamera: PerspectiveCamera;

  constructor(private view: View) {
    this.world = new Scene();
    this.renderer = new WebGLRenderer({
      canvas: this.view.getCanvas(),
      context: this.view.getContext(),
      precision: 'highp',
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera = new PerspectiveCamera(50, 1, 0.1, GlobeScene.DEFAULT_FAR);
    this.debugCamera = new PerspectiveCamera();
  }

  public init(): void {
    setTimeout(() => this.renderLoop(), 0);

    this.updateCamera();

    this.view.addEventListener('resize', () => {
      this.updateCamera();
    });

    const earth = new Earth();

    this.world.add(earth.root);

    const ORIGIN = new Vector3(0, 0, 0);

    this.camera.position.set(20, 0, 0);
    this.camera.lookAt(ORIGIN);
  }

  private render(): void {
    this.renderer.render(this.world, this.camera);
  }

  private renderLoop() {
    this.render();

    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }

  private updateCamera(): void {
    this.camera.aspect = this.view.getAspect();
    this.camera.updateProjectionMatrix();
    const [w, h] = this.view.getSize();
    this.renderer.setSize(w, h);
  }

}
