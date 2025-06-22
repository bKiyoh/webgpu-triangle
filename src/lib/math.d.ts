export class Vec2 {
  static create(x?: number, y?: number): Float32Array;
  static length(v: Float32Array): number;
  static normalize(v: Float32Array): Float32Array;
  static dot(v0: Float32Array, v1: Float32Array): number;
  static cross(v0: Float32Array, v1: Float32Array): number;
}

export class Vec3 {
  static create(x?: number, y?: number, z?: number): Float32Array;
  static length(v: Float32Array): number;
  static normalize(v: Float32Array): Float32Array;
  static dot(v0: Float32Array, v1: Float32Array): number;
  static cross(v0: Float32Array, v1: Float32Array): Float32Array;
  static faceNormal(
    v0: Float32Array,
    v1: Float32Array,
    v2: Float32Array
  ): Float32Array;
}

export class Mat4 {
  static create(): Float32Array;
  static identity(dest?: Float32Array): Float32Array;
  static multiply(
    a: Float32Array,
    b: Float32Array,
    dest?: Float32Array
  ): Float32Array;
  static rotate(
    a: Float32Array,
    rad: number,
    axis: Float32Array,
    dest?: Float32Array
  ): Float32Array;
  static translate(
    a: Float32Array,
    vec: Float32Array,
    dest?: Float32Array
  ): Float32Array;
  static scale(
    a: Float32Array,
    vec: Float32Array,
    dest?: Float32Array
  ): Float32Array;
  static perspective(
    fovy: number,
    aspect: number,
    near: number,
    far: number,
    dest?: Float32Array
  ): Float32Array;
  static lookAt(
    eye: Float32Array,
    center: Float32Array,
    up: Float32Array,
    dest?: Float32Array
  ): Float32Array;
  static transpose(a: Float32Array, dest?: Float32Array): Float32Array;
  static inverse(a: Float32Array, dest?: Float32Array): Float32Array;
  static toVecIV(mat: Float32Array, vec: number[]): Float32Array;
  static screenPositionFromMvp(
    mat: Float32Array,
    vec: Float32Array,
    width: number,
    height: number
  ): Float32Array;
}

export class Qtn {
  static create(): Float32Array;
  static identity(dest?: Float32Array): Float32Array;
  static inverse(qtn: Float32Array, dest?: Float32Array): Float32Array;
  static normalize(qtn: Float32Array): Float32Array;
  static multiply(
    q0: Float32Array,
    q1: Float32Array,
    dest?: Float32Array
  ): Float32Array;
  static rotate(
    angle: number,
    axis: Float32Array,
    dest?: Float32Array
  ): Float32Array;
  static toVecIII(
    vec: Float32Array,
    qtn: Float32Array,
    dest?: Float32Array
  ): Float32Array;
  static toMatIV(qtn: Float32Array, dest?: Float32Array): Float32Array;
  static slerp(
    q0: Float32Array,
    q1: Float32Array,
    time: number,
    dest?: Float32Array
  ): Float32Array;
}
