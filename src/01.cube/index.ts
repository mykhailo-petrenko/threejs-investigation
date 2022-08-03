import {
  BoxBufferGeometry,
  BoxGeometry,
  Clock, Float32BufferAttribute,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const screenWidth = 800;
const screenHeight = 800;

const scale = screenWidth / screenHeight;

const renderer = new WebGLRenderer();
renderer.setSize(screenWidth, screenHeight);

document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(60, scale, 1, 1000);

camera.position.set(200, 200, 200);
camera.lookAt(0,0,0);

const clock = new Clock();
const scene = new Scene();
//----------------//

{
  const light = new HemisphereLight();
  scene.add(light);
}

{
  const segments = 2;
  const geometry = new BoxGeometry(100, 100, 100, segments, segments, segments);

  const position: Float32BufferAttribute = geometry.getAttribute('position') as Float32BufferAttribute;
  const n = position.count;

  //
  // for (let i = 0; i < n; i++) {
  //   position.
  // }

  console.log('position', position);

  const material1 = new MeshBasicMaterial({
    color: 0xff0f00
  });
  const material2 = new MeshBasicMaterial({
    color: 0xf0ff00,
    wireframe: true,
  });


console.log('i geometry', geometry);
  const cube = new Mesh(geometry, material1);
  const cubeEdges = new Mesh(geometry, material2);

  scene.add(cube);
  scene.add(cubeEdges);
}


//----------------//
new OrbitControls(camera, renderer.domElement);

const tick = () => {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  // control.update( delta );

  requestAnimationFrame(tick);
};


tick();

/*
const verticesOfCube = [
    -1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
    -1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
];
const indicesOfFaces = [
    2, 1, 0,    0, 3, 2,
    0, 4, 7,    7, 3, 0,
    0, 1, 5,    5, 4, 0,
    1, 2, 6,    6, 5, 1,
    2, 3, 7,    7, 6, 2,
    4, 5, 6,    6, 7, 4,
];
const radius = 7;
const detail = 2;
const geometry = new THREE.PolyhedronBufferGeometry(verticesOfCube, indicesOfFaces, radius, detail);
*/
