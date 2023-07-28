const fs = require('fs');
const turf = require('@turf/turf');


let NLRegions = fs.readFileSync('../public/NLRegions.geojson');

NLRegions = JSON.parse(NLRegions);
NLRegions = turf.toMercator(NLRegions);
console.log(NLRegions);

const nlBbox = turf.bbox(NLRegions);
const nlCentroid = turf.centroid(NLRegions);

console.log('bbox', nlBbox);
console.log('centroid', nlCentroid);
