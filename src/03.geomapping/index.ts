/**
 * Load the GeoJSON via ThreeJS
 */

import { GeoMapping } from './GeoMapping';


const element = document.getElementById('GeoMapCanvas') as HTMLCanvasElement;
const elementLabels = document.getElementById('GeoMappingLabels') as HTMLElement;

const geoMap = new GeoMapping(element, elementLabels);
geoMap.init();
geoMap.resize(window.innerWidth, window.innerHeight);
geoMap.initControl();

const map = geoMap.initMapLayer();

(async () => {
  const rawJson = await fetch('./assets/UKRAINE-regions.geojson');
  let geoJson = await rawJson.json();

  map.init(geoJson);

  map.drawBars([{
    color: 'yellow',
    count: 4000,
    label: 'Kyiv',
    position: [30.523333, 50.450001],
  }]);
})();
