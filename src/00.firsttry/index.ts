
import { BufferGeometry, Clock, Line, LineBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

const screenWidth = 500;
const screenHeight = 500;

const scale = screenWidth / screenHeight;

const renderer = new WebGLRenderer();
renderer.setSize(screenWidth, screenHeight);

document.body.appendChild(renderer.domElement);


const camera = new PerspectiveCamera(60, scale, 1, 500);

camera.position.set(30, 30, 30);
camera.lookAt(0,0,0);

const clock = new Clock();
const scene = new Scene();

{
  const lineMaterial = new LineBasicMaterial({color: 0xffff00});

  const points = [];
  points.push( new Vector3( - 10, 0, 0 ) );
  points.push( new Vector3( 0, 10, 0 ) );
  points.push( new Vector3( 10, 0, 0 ) );
  points.push( new Vector3( 0, 0, 10 ) );
  points.push( new Vector3( -10, 0, 0) );

  const geometry = new BufferGeometry().setFromPoints( points );

  const line = new Line(geometry, lineMaterial);

  scene.add(line);
}

{
  const xMaterial = new LineBasicMaterial({color: 0xff0000});
  const yMaterial = new LineBasicMaterial({color: 0x00ff00});
  const zMaterial = new LineBasicMaterial({color: 0x0000ff});

  const xPoints = [
    new Vector3( 0, 0, 0 ),
    new Vector3( 20, 0, 0 )
  ];
  const yPoints = [
    new Vector3( 0, 0, 0 ),
    new Vector3( 0, 20, 0 )
  ];
  const zPoints = [
    new Vector3( 0, 0, 0 ),
    new Vector3( 0, 0, 20 )
  ];

  const xGeometry = new BufferGeometry().setFromPoints( xPoints );
  const yGeometry = new BufferGeometry().setFromPoints( yPoints );
  const zGeometry = new BufferGeometry().setFromPoints( zPoints );

  const xLine = new Line(xGeometry, xMaterial);
  const yLine = new Line(yGeometry, yMaterial);
  const zLine = new Line(zGeometry, zMaterial);

  scene
    .add(xLine)
    .add(yLine)
    .add(zLine);
}

const control = new OrbitControls(camera, renderer.domElement);
// const control = new FlyControls(camera, renderer.domElement);

// control.dragToLook = true;
// control.movementSpeed = 10;
// control.rollSpeed = 1;

const r = () => {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  // control.update( delta );

  requestAnimationFrame(r);
};


r();
