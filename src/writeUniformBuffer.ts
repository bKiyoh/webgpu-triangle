import {
  timeUniformOffset,
  screenSizeUniformOffset,
  rotationUniformOffset,
  centerUniformOffset,
  triangleCount,
  uniformValues,
} from "./uniform";

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

  GPU_DEVICE.queue.writeBuffer(uniformBuffer, 0, uniformValues);
};
