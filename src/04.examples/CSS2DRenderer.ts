import type {
  Camera, Scene
} from 'three';
import {
  Matrix4,
  Object3D,
  Vector3
} from 'three';

export class CSS2DObject extends Object3D {
  isCSS2DObject: boolean;
  element: HTMLElement;

  constructor(element: HTMLElement = document.createElement('div')) {

    super();

    this.isCSS2DObject = true;

    this.element = element;

    this.element.style.position = 'absolute';
    this.element.style.userSelect = 'none';

    this.element.setAttribute('draggable', 'false');

    this.addEventListener('removed', () => {

      this.traverse(function (objectIn) {
        const object = objectIn as CSS2DObject;

        if (object.element instanceof Element && object.element.parentNode !== null) {

          // @ts-ignore
          object.element.parentNode.removeChild(object.element);

        }

      });

    });

  }

  copy(source: any, recursive: boolean) {

    super.copy(source, recursive);

    this.element = source.element.cloneNode(true);

    return this;

  }
}

const _vector = new Vector3();
const _viewMatrix = new Matrix4();
const _viewProjectionMatrix = new Matrix4();
const _a = new Vector3();
const _b = new Vector3();

export interface CSS2DRendererParameter {
  element?: HTMLElement;
}

export interface Size {
  width: number;
  height: number;
}

export class CSS2DRenderer {

  public PADDING_LEFT = '5px';

  domElement: HTMLElement;

  render: (scene: Scene, camera: Camera) => void;
  getSize: () => Size;
  setSize: (width: number, height: number) => void;

  constructor(parameters: CSS2DRendererParameter = {}) {

    let _width: number, _height: number;
    let _widthHalf: number, _heightHalf: number;

    const cache = {
      objects: new WeakMap()
    };

    const domElement = parameters.element !== undefined ? parameters.element : document.createElement('div');

    domElement.style.overflow = 'hidden';

    this.domElement = domElement;

    this.getSize = () => {

      return {
        width: _width,
        height: _height
      };

    };

    this.render = function (scene: Scene, camera: Camera) {

      this.clear();

      // @ts-ignore
      if (scene.matrixWorldAutoUpdate === true) scene.updateMatrixWorld();
      // @ts-ignore
      if (camera.parent === null && camera.matrixWorldAutoUpdate === true) camera.updateMatrixWorld();

      _viewMatrix.copy(camera.matrixWorldInverse);
      _viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, _viewMatrix);

      renderObject(scene, scene, camera);
      zOrder(scene);

    };

    this.setSize = function (width, height) {

      _width = width;
      _height = height;

      _widthHalf = _width / 2;
      _heightHalf = _height / 2;

      domElement.style.width = width + 'px';
      domElement.style.height = height + 'px';

    };

    const renderObject = (object: Object3D | CSS2DObject, scene: Scene, camera: Camera) => {

      if ((object as CSS2DObject).isCSS2DObject) {

        _vector.setFromMatrixPosition(object.matrixWorld);
        _vector.applyMatrix4(_viewProjectionMatrix);

        const visible = (object.visible ) && (_vector.z >= -1 && _vector.z <= 1) && (object.layers.test(camera.layers));
        (object as CSS2DObject).element.style.display = (visible) ? '' : 'none';

        if (visible) {

          // @ts-ignore
          object.onBeforeRender(this, scene, camera, undefined, undefined, undefined);

          const element = (object as CSS2DObject).element;

          // @TODO: Add the Left | Right | Center alignment
          element.style.transform = 'translate(-150%,-50%) translate(' + (_vector.x * _widthHalf + _widthHalf) + 'px,' + (-_vector.y * _heightHalf + _heightHalf) + 'px)';

          if (element.parentNode !== domElement) {

            domElement.appendChild(element);

          }

          // @ts-ignore
          object.onAfterRender(this, scene, camera, undefined, undefined, undefined);

        }

        const objectData = {
          distanceToCameraSquared: getDistanceToSquared(camera, object)
        };

        cache.objects.set(object, objectData);

      }

      for (let i = 0, l = object.children.length; i < l; i++) {

        renderObject(object.children[i], scene, camera);

      }

    };

    function getDistanceToSquared(object1: Object3D, object2: Object3D) {

      _a.setFromMatrixPosition(object1.matrixWorld);
      _b.setFromMatrixPosition(object2.matrixWorld);

      return _a.distanceToSquared(_b);

    }

    function filterAndFlatten(scene: Scene): CSS2DObject[] {

      const result: CSS2DObject[] = [];

      scene.traverse(function (object) {

        if ((object as CSS2DObject).isCSS2DObject) result.push(object as CSS2DObject);

      });

      return result;

    }

    function zOrder(scene: Scene) {

      const sorted = filterAndFlatten(scene).sort(function (a, b) {

        if (a.renderOrder !== b.renderOrder) {

          return b.renderOrder - a.renderOrder;

        }

        const distanceA = cache.objects.get(a).distanceToCameraSquared;
        const distanceB = cache.objects.get(b).distanceToCameraSquared;

        return distanceA - distanceB;

      });

      const zMax = sorted.length;

      for (let i = 0, l = sorted.length; i < l; i++) {

        sorted[i].element.style.zIndex = `${zMax - i}`;

      }

    }

  }

  clear(): void {
    if (!this.domElement) {
      return;
    }

    const nodes = this.domElement.childNodes || [];

    for (const node of nodes) {
      this.domElement.removeChild(node);
    }
  }

}
