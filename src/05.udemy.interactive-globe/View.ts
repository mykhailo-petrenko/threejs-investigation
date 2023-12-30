import { BaseEvent, EventDispatcher } from 'three';

export class View extends EventDispatcher<{
  'resize': BaseEvent<'resize'>
}> {
  private context: WebGL2RenderingContext;

  constructor(
    private container: HTMLElement,
    private canvas?: HTMLCanvasElement | undefined
  ) {
    super();

    this.initCanvas();
    this.initContext();

    this.resizeWatcher();
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getContext(): WebGL2RenderingContext {
    return this.context;
  }

  public getSize(): [number, number] {
    return [this.canvas.width, this.canvas.height];
  }

  public getAspect() {
    return this.canvas.width / this.canvas.height;
  }

  private initCanvas(): void {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.container.appendChild(this.canvas);

      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.right = '0';
      this.canvas.style.bottom = '0';
      this.canvas.style.left = '0';
      this.canvas.style.zIndex = '10';
    }
  }

  private initContext(): void {
    this.context = this.canvas.getContext('webgl2');
  }

  private resizeWatcher(): void {
    const resizeObserver = new ResizeObserver((entries) => {
      this.fireSizeUpdate();
    });

    resizeObserver.observe(this.container);

    this.fireSizeUpdate();
  }

  private fireSizeUpdate(): void {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;

    this.dispatchEvent({type: 'resize'});
  }

}
