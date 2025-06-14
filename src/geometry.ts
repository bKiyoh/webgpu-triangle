/** 1つの値のバイトサイズ（float32 = 4） */
const perByteSize = Float32Array.BYTES_PER_ELEMENT;

/** 各頂点の属性サイズ（x, y） */
export const sharedVertexSize = perByteSize * 2;
export const sharedPositionOffset = 0;

/**
 * 頂点データ（4つ）
 * - 左の三角形: 0,1,2
 * - 右の三角形: 0,2,3
 */
// 正三角形の高さ = 辺の長さ × √3 / 2
const sideLength = 0.3;
const height = (sideLength * Math.sqrt(3)) / 2; // ≒ 0.2598

export const sharedVertexArray = new Float32Array([
  // 三角形①（上）
  0.0,
  height * 2 + 0.2, // 上頂点
  -sideLength / 2,
  height * 1 + 0.2, // 左下
  sideLength / 2,
  height * 1 + 0.2, // 右下

  // 三角形②（中央）
  0.0,
  height * 1, // 上頂点
  -sideLength / 2,
  height * 0, // 左下
  sideLength / 2,
  height * 0, // 右下

  // 三角形③（下）
  0.0,
  height * 0 - 0.2, // 上頂点
  -sideLength / 2,
  height * -1 - 0.2, // 左下
  sideLength / 2,
  height * -1 - 0.2, // 右下
]);

/**
 * インデックスデータ（6つ）
 * - 三角形①: 0,1,2
 * - 三角形②: 0,2,3
 */
export const sharedIndexArray = new Uint16Array([
  0,
  1,
  2, // 上
  3,
  4,
  5, // 中央
  6,
  7,
  8, // 下
]);
