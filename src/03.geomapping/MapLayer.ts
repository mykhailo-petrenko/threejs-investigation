import { Group, Scene } from 'three';
import { centroid, Feature, toMercator } from '@turf/turf';

import { LabelFactory } from './Label';
import { ProvincesFactory } from './ProvincesFactory';
import { BordersFactory } from './BordersFactory';
import { CylinderBarFactory, CylinderBar } from './CylinderBarFactory';

export class MapLayer {
  private scene: Scene;
  public map: Group;

  public borders: Group;
  public provinces: Group;
  public labels: Group;

  public bars: Group;

  public offset: number[];

  constructor(scene: Scene) {
    this.scene = scene;

    this.map = new Group();
  }

  init(geoJSON: any) {
    toMercator(geoJSON, {mutate: true});
    const center = centroid(geoJSON).geometry.coordinates;

    this.offset = [-center[0], -center[1]];

    this.map.translateX(this.offset[0]);
    this.map.translateY(this.offset[1]);

    this.scene.add(this.map);

    this.drawLayers(geoJSON.features);

    this.bars = new Group();
    this.bars.translateX(this.offset[0]);
    this.bars.translateY(this.offset[1]);

    this.scene.add(this.bars);
  }

  public drawLayers(features: Feature[]) {
    const labelsFactory = new LabelFactory();
    const provincesFactory = new ProvincesFactory();
    const bordersFactory = new BordersFactory();

    this.borders = new Group();
    this.map.add(this.borders);

    this.provinces = new Group();
    this.map.add(this.provinces);

    this.labels = new Group();
    this.map.add(this.labels);

    for (let feature of features) {
      console.log(feature);

      // Province area
      const province = provincesFactory.province(feature);
      province.renderOrder = 10;
      this.provinces.add(province);

      // Province border
      const border = bordersFactory.border(feature);
      border.renderOrder = 100;
      this.borders.add(border);

      // Province label
      const label = labelsFactory.label(feature);
      label.renderOrder = 1000;
      this.labels.add(label);
    }
  }

  public drawBars(bars: CylinderBar[]) {
    this.bars.clear();

    const barFactory = new CylinderBarFactory();

    for (const feature of bars) {
      const bar = barFactory.createBar(feature);
      bar.renderOrder = 900;
      this.bars.add(bar);
    }
  }
}
