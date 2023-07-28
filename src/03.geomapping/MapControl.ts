import { MOUSE, PerspectiveCamera, TOUCH } from "three";
import { Orbit3DControl } from "./Orbit3DControl";

export class Map3DControls extends Orbit3DControl {

  constructor(object: PerspectiveCamera, domElement?: HTMLElement) {
    super(object, domElement);

    this.mouseButtons.LEFT = MOUSE.PAN;
    this.mouseButtons.RIGHT = MOUSE.ROTATE;

    this.touches.ONE = TOUCH.PAN;
    this.touches.TWO = TOUCH.DOLLY_ROTATE;

    this.screenSpacePanning = false;

    this.enableDamping = false;
    this.rotateSpeed = 0.7;
    this.zoomSpeed = 0.7;
  }
}
