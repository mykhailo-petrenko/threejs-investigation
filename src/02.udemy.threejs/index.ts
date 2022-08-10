/**
 * Udemy Three.js & ts
 * https://www.udemy.com/course/threejs-tutorials/learn/lecture/27587980#overview
 * https://sbcode.net/threejs/import-threejs-modules/
 */
import {
  BoxBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

import { GUI } from 'dat.gui';

const getAspect = (): number => {
  return window.innerWidth / window.innerHeight;
};


const scene = new Scene();

const camera = new PerspectiveCamera(60, getAspect(), 0.1, 1000);
const renderer = new WebGLRenderer();

const adjustAspect = () => {
  camera.aspect = getAspect();
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,  window.innerHeight);

  render();
};

adjustAspect();
window.addEventListener('resize', adjustAspect);

document.body.appendChild(renderer.domElement);

function render() {
  renderer.render(scene, camera);
}

const stats = Stats();
document.body.appendChild(stats.domElement);

const control = new OrbitControls(camera, renderer.domElement);
control.addEventListener('change', render);

const gui = new GUI();



// ---------------------------------------------------------
const planeGeometry = new PlaneBufferGeometry(50, 50, 10, 10);
const planeMaterial = new MeshBasicMaterial({color: 0x00ff00, wireframe: true});
const plane = new Mesh(planeGeometry, planeMaterial);
plane.rotation.set(Math.PI / 2, 0, 0);
scene.add(plane);

const size = 10;
const segments = 3;
const geometry = new BoxBufferGeometry(size,size,size,segments,segments,segments);

const material = new MeshBasicMaterial({
  color: 0xf0ff00,
  wireframe: true,
});

const cube = new Mesh(geometry, material);
cube.position.setY(size/2);
scene.add(cube);

camera.position.set(50, 50, 50);
camera.lookAt(0,0,0);


const cubeFolder = gui.addFolder('Cube')
cubeFolder.add(cube.rotation, 'x', -Math.PI, Math.PI);
cubeFolder.open();

const planeFolder = gui.addFolder('Plane')
planeFolder.add(plane.rotation, 'z', -Math.PI, Math.PI);
planeFolder.open();
// ---------------------------------------------------------

control.target.set(0, 0, 0);
control.enableDamping = true;
control.dampingFactor = 0.1;

control.listenToKeyEvents(document.body);

control.update();

function tick() {
  requestAnimationFrame(tick);

  cube.rotation.y += 0.01;
  control.update();
  render();
  stats.update();
}

requestAnimationFrame(tick);
render();
