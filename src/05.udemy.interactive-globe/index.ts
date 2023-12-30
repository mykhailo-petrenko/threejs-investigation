import { GlobeScene } from '@/05.udemy.interactive-globe/globeScene';
import { View } from '@/05.udemy.interactive-globe/View';
const container = document.getElementById('mapContainer') as HTMLElement;
const element = document.getElementById('GeoMapCanvas') as HTMLCanvasElement;
const elementLabels = document.getElementById('GeoMappingLabels') as HTMLElement;

elementLabels.style.display = 'none';

const view = new View(container, element);

const globe = new GlobeScene(view);

globe.init();

