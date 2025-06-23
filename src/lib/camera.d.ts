import { Vec2Type, Vec3Type, QtnType, Mat4Type } from "./math";

/**
 * OrbitControls に似た WebGL 用カメラ制御クラス
 */
export declare class WebGLOrbitCamera {
  static readonly DEFAULT_DISTANCE: number;
  static readonly DEFAULT_MIN_DISTANCE: number;
  static readonly DEFAULT_MAX_DISTANCE: number;
  static readonly DEFAULT_MOVE_SCALE: number;

  target: HTMLElement;
  distance: number;
  minDistance: number;
  maxDistance: number;
  moveScale: number;

  position: Vec3Type;
  center: Vec3Type;
  upDirection: Vec3Type;

  defaultPosition: Vec3Type;
  defaultCenter: Vec3Type;
  defaultUpDirection: Vec3Type;

  movePosition: Vec3Type;
  rotateX: number;
  rotateY: number;
  scale: number;

  isDown: boolean;
  prevPosition: Vec2Type;
  offsetPosition: Vec2Type;

  qt: QtnType;
  qtx: QtnType;
  qty: QtnType;

  constructor(
    target: HTMLElement,
    option?: {
      distance?: number;
      min?: number;
      max?: number;
      move?: number;
    }
  );

  mouseInteractionStart(event: MouseEvent): void;
  mouseInteractionMove(event: MouseEvent): void;
  mouseInteractionEnd(): void;
  wheelScroll(event: WheelEvent): void;

  update(): Mat4Type;
}
