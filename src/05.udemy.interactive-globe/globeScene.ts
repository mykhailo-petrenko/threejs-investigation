import { Clock, Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { WORLD_SPHERICAL_MERCATOR_AXIS } from '@/05.udemy.interactive-globe/geo/Ellipsoid';
import { View } from '@/05.udemy.interactive-globe/View';
import { Earth } from '@/05.udemy.interactive-globe/Earth';

export class GlobeScene {
  static DEFAULT_FAR = WORLD_SPHERICAL_MERCATOR_AXIS;

  world: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  debugCamera: PerspectiveCamera;

  private earth: Earth;
  private time = new Clock();

  constructor(private view: View) {
    this.world = new Scene();
    this.world.background = new Color(0, 0, 0);
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
    this.updateCamera();

    this.view.addEventListener('resize', () => {
      this.updateCamera();
    });

    const earth = new Earth();
    // @ts-ignore
    window.earth = earth;
    this.world.add(earth.root);
    this.earth = earth;

    const ORIGIN = new Vector3(0, 0, 0);

    this.camera.position.set(20, 0, 0);
    this.camera.lookAt(ORIGIN);

    this.updateLoop();
    setTimeout(() => this.renderLoop(), 0);
  }

  private render(): void {
    this.renderer.clear(true, true, true);
    this.renderer.render(this.world, this.camera);
  }

  private update(): void {
    this.earth.update(this.time.getDelta());
  }

  private renderLoop() {
    this.render();

    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }

  private updateLoop() {
    this.update();

    setTimeout(() => {
      this.updateLoop();
    });
  }

  private updateCamera(): void {
    this.camera.aspect = this.view.getAspect();
    this.camera.updateProjectionMatrix();
    const [w, h] = this.view.getSize();
    this.renderer.setSize(w, h);
  }

}
