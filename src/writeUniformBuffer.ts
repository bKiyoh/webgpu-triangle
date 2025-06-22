import {
  timeUniformOffset,
  screenSizeUniformOffset,
  rotationUniformOffset,
  centerUniformOffset,
  triangleCount,
  uniformValues,
  mvpMatrixOffset,
} from "./uniform";
import { Vec3, Mat4 } from "./lib/math";

const startTime = Date.now();

type TArgs = {
  uniformBuffer: GPUBuffer;
  GPU_DEVICE: GPUDevice;
  GPU_CANVAS_CONTEXT: GPUCanvasContext;
};

export const writeUniformBuffer = ({
  uniformBuffer,
  GPU_DEVICE,
  GPU_CANVAS_CONTEXT,
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

  // 正三角形の辺の長さ
  const sideLength = 0.3;
  // 正三角形の高さを計算
  const geometryHeight = (sideLength * Math.sqrt(3)) / 2;

  /**
   * 三角形の中心座標を計算し、uniformValuesにセットする
   * 各三角形の中心は、上頂点と下頂点のy座標の平均値で計算される
   */
  const triangleCenters = [
    // 三角形①
    [
      0,
      (geometryHeight * 2 +
        0.2 +
        geometryHeight * 1 +
        0.2 +
        geometryHeight * 1 +
        0.2) /
        3,
    ],
    // 三角形②
    [0, (geometryHeight * 1 + geometryHeight * 0 + geometryHeight * 0) / 3],
    // 三角形③
    [
      0,
      (-geometryHeight * 2 -
        0.2 +
        geometryHeight * 1 -
        0.2 +
        -geometryHeight * 1 -
        0.2) /
        3,
    ],
  ];

  /**
   * 三角形の中心座標を uniformValues にセットする
   * 各三角形の中心座標は、uniformValuesの centerUniformOffset から始まる位置に格納される
   */
  for (let i = 0; i < triangleCount; i++) {
    const [cx, cy] = triangleCenters[i];
    const offset = centerUniformOffset + i * 4;
    uniformValues.set([cx, cy, 0, 0], offset);
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
  const rotateAxis = Vec3.create(0.0, 1.0, 0.0); // Y 軸回転を掛ける
  const m = Mat4.rotate(Mat4.identity(), millis, rotateAxis); // 時間の経過が回転量

  /**
   * ビュー座標変換行列(V)
   * カメラ（視点）の位置を考慮した変換を与える行列を生成する
   */
  const eye = Vec3.create(0.0, 0.0, 3.0); // カメラの位置
  const center = Vec3.create(0.0, 0.0, 0.0); // カメラの注視点
  const upDirection = Vec3.create(0.0, 1.0, 0.0); // カメラの天面の向き
  const v = Mat4.lookAt(eye, center, upDirection);

  /**
   * プロジェクション座標変換行列(P)
   * 平面（スクリーン）に頂点を投影するための変換を与える行列を生成する
   */
  const fovy = 30; // 視野角
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
