import {
  timeUniformOffset,
  screenSizeUniformOffset,
  rotationUniformOffset,
  triangleCount,
  uniformValues,
  mvpMatrixOffset,
} from "./uniform";
import { Vec3, Mat4 } from "./lib/math";
import type { WebGLOrbitCamera } from "./lib/camera";

const startTime = Date.now();

type TArgs = {
  uniformBuffer: GPUBuffer;
  GPU_DEVICE: GPUDevice;
  GPU_CANVAS_CONTEXT: GPUCanvasContext;
  camera: WebGLOrbitCamera;
};

export const writeUniformBuffer = ({
  uniformBuffer,
  GPU_DEVICE,
  GPU_CANVAS_CONTEXT,
  camera,
}: TArgs) => {
  /**
   * 現在の時間を取得し、uniformValuesにセットする
   */
  const millis = (Date.now() - startTime) / 1000;
  uniformValues.set([millis], timeUniformOffset);

  /**
   * 画面サイズを取得し、uniformValuesにセットする
   */
  const width = GPU_CANVAS_CONTEXT.canvas.width;
  const height = GPU_CANVAS_CONTEXT.canvas.height;
  uniformValues.set([width, height], screenSizeUniformOffset);

  /**
   * 回転の値を計算し、uniformValuesにセットする
   * 角度をずらしたいなら、millisに適当な値を加算する
   */
  for (let i = 0; i < triangleCount; i++) {
    const index = rotationUniformOffset + i * 4;
    uniformValues.set([millis, 0, 0, 0], index);
  }

  /**
   * 3D空間の頂点を2Dスクリーンに投影するため、
   * モデル変換行列（M）、ビュー変換行列（V）、プロジェクション変換行列（P）を組み合わせた
   * MVP行列（Model-View-Projection）を用いる。
   * - モデル行列（M）: モデルの位置や回転などを反映
   * - ビュー行列（V）: カメラの視点や向きを反映
   * - プロジェクション行列（P）: 遠近感などの投影情報を反映
   * これらを掛け合わせたmvpMatrixを頂点に適用することで、
   * 3次元空間上の位置を2次元スクリーン上の座標に変換できる。
   */
  /**
   * モデル座標変換行列(M)
   * 頂点を移動させるための行列を生成する
   */
  const rotateAxis = Vec3.create(0.5, 0.8, 0.5); // Y 軸回転を掛ける
  const m = Mat4.rotate(Mat4.identity(), millis, rotateAxis); // 時間の経過が回転量

  /**
   * ビュー座標変換行列(V)
   * カメラ（視点）の位置を考慮した変換を与える行列を生成する
   */
  // const eye = Vec3.create(0.0, 0.0, 3.0); // カメラの位置
  // const center = Vec3.create(0.0, 0.0, 0.0); // カメラの注視点
  // const upDirection = Vec3.create(0.0, 1.0, 0.0); // カメラの天面の向き
  // const v = Mat4.lookAt(eye, center, upDirection);
  const v = camera.update(); // カメラの状態を更新してビュー行列を取得
  /**
   * プロジェクション座標変換行列(P)
   * 平面（スクリーン）に頂点を投影するための変換を与える行列を生成する
   */
  const fovy = 60; // 視野角
  const aspect = window.innerWidth / window.innerHeight; // アスペクト比
  const near = 0.1; // ニア・クリップ面までの距離
  const far = 10.0; // ファー・クリップ面までの距離
  const p = Mat4.perspective(fovy, aspect, near, far);

  // 行列を乗算して MVP 行列を生成する
  // 列優先の行列計算を行うため、順番に注意
  const vp = Mat4.multiply(p, v);
  const mvp = Mat4.multiply(vp, m);

  uniformValues.set(mvp, mvpMatrixOffset);
  GPU_DEVICE.queue.writeBuffer(uniformBuffer, 0, uniformValues);
};
