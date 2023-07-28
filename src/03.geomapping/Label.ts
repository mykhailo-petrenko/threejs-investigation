import { Feature, Position } from "@turf/turf";
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Object3D,
  Points,
  PointsMaterial, Sprite,
  SpriteMaterial,
} from "three";
import { coordinateTransformer } from '@/03.geomapping/geoUtils';

export interface LabelOptions {
  fontSize: number;
  color: string;
}

export class LabelFactory {
  static DEFAULT_OPTIONS: LabelOptions = {
    fontSize: 24,
    color: 'black'
  };

  constructor() {

  }

  label(feature: Feature): Object3D {
    const {name, latitude, longitude} = feature.properties;

    const labelPosition = coordinateTransformer([longitude, latitude]);

    return this.labelSprite(
      name,
      labelPosition
    );
  }
  labelPoint(
    text: string,
    coordinate: Position,
    options?: LabelOptions
  ): Object3D {
    options = {
      ...LabelFactory.DEFAULT_OPTIONS,
      ...options,
    };

    const w = 250;
    const h = w;

    const canvas = new LabelCanvas();
    const canvasEl = canvas.resize(w, h).render(text, options);

    const texture = new CanvasTexture(canvasEl);
    texture.needsUpdate = false;

    // const material = new MeshBasicMaterial({
    //     map: texture,
    //     transparent: true
    // });
    // const plane = new PlaneGeometry(w, h);
    // const mesh = new Mesh(plane, material);

    const pointsMaterial = new PointsMaterial({
      map: texture,
      transparent: true,
      size: 64,
      sizeAttenuation: false,
      fog: false,
    });
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([0, 0, 0,]);
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));

    const mesh = new Points(geometry, pointsMaterial);

    // mesh.scale.set(200, 200, 1);
    mesh.position.set(coordinate[0], coordinate[1], coordinate[2] + 100);

    return mesh;
  }

  labelSprite(
    text: string,
    coordinate: Position,
    options?: LabelOptions
  ): Object3D {
    options = {
      ...LabelFactory.DEFAULT_OPTIONS,
      ...options,
    };

    const w = 200;
    const h = 200;

    const canvas = new LabelCanvas();

    const canvasEl = canvas.resize(w, h).render(text, options);
    const texture = new CanvasTexture(canvasEl);
    texture.needsUpdate = false;

    const material = new SpriteMaterial({
      map: texture,
      transparent: true,
      sizeAttenuation: false,
      fog: false,
    });

    const sprite = new Sprite(material);

    const scale = 0.1;
    sprite.scale.set(scale, scale, 1);
    sprite.position.set(coordinate[0], coordinate[1], coordinate[2]);

    return sprite;
  }
}

export class LabelCanvas {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.createCanvas();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.backgroundColor = 'transparent';
    this.context = this.canvas.getContext('2d');
  }

  resize(width: number, height: number): LabelCanvas {
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.clearRect(0, 0, width, height);

    return this;
  }

  render(content: string, options: LabelOptions): HTMLCanvasElement {
    this.context.font = `${options.fontSize}px Arial`;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // this.context.fillStyle = "blue";
    // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = options.color;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
    const textX = this.canvas.width / 2;
    const textY = (this.canvas.height / 2) - options.fontSize;
    this.context.fillText(content, textX, textY);

    return this.canvas;
  }
}
