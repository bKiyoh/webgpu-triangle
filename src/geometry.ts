import { WebGLGeometry } from "./lib/geometry";

/** 1つの値のバイトサイズ（float32 = 4） */
const perByteSize = Float32Array.BYTES_PER_ELEMENT;

/** 各頂点の属性サイズ（x, y, r, g, b, a） */
export const sharedVertexSize = perByteSize * 6;
export const sharedPositionOffset = 0;
export const sharedColorOffset = perByteSize * 2;

/** 頂点の色情報 */
const RED = [1, 0.2, 0, 1]; // 赤寄りのオレンジ
const ORANGE = [1, 0.5, 0, 1]; // 中間のオレンジ
const YELLOW = [1, 0.8, 0, 1]; // 黄寄りのオレンジ
/**
 * 頂点データ（4つ）
 * - 左の三角形: 0,1,2
 * - 右の三角形: 0,2,3
 */
// 正三角形の高さ = 辺の長さ × √3 / 2
const sideLength = 0.3;
const height = (sideLength * Math.sqrt(3)) / 2; // ≒ 0.2598

/** 頂点位置の定数 */
const TRIANGLE_POSITIONS = [
  // 三角形①（上）
  [0.0, height * 2 + 0.2],
  [-sideLength / 2, height * 1 + 0.2],
  [sideLength / 2, height * 1 + 0.2],

  // 三角形②（中央）
  [0.0, height * 1],
  [-sideLength / 2, height * 0],
  [sideLength / 2, height * 0],

  // 三角形③（下）
  [0.0, height * 0 - 0.2],
  [-sideLength / 2, height * -1 - 0.2],
  [sideLength / 2, height * -1 - 0.2],
];

/** 頂点カラーの定数（三角形ごとに3頂点） */
const TRIANGLE_COLORS = [
  RED,
  ORANGE,
  YELLOW, // 三角形①（上）
  YELLOW,
  RED,
  ORANGE, // 三角形②（中央）
  ORANGE,
  YELLOW,
  RED, // 三角形③（下）
];

const offsets = [1.0, 0.0, -1.0]; // Y位置オフセット（上中下）
const color = [1.0, 0.0, 0.0, 1.0];

const cones = offsets.map((yOffset) => {
  const cone = WebGLGeometry.cube(5.0, color);
  for (let i = 0; i < cone.position.length; i += 3) {
    cone.position[i + 1] += yOffset; // Y方向に移動
  }
  return cone;
});

/** index結合：先頭からのオフセットを追加 */
let offset = 0;
export const sharedIndexArray = new Uint16Array(
  cones.flatMap((cone) => {
    const indexed = cone.index.map((i) => i + offset);
    const maxIndex = Math.max(...cone.index);
    offset += maxIndex + 1; // 実際の頂点参照の最大値に +1
    return indexed;
  })
);

// すべての頂点データ（position + color）をそのまままとめる
export const sharedVertexArray = new Float32Array(
  cones.flatMap((cone) => {
    const vertexCount = cone.position.length / 3;
    const packed = new Float32Array(vertexCount * 7);
    for (let i = 0; i < vertexCount; i++) {
      packed.set(
        [
          cone.position[i * 3],
          cone.position[i * 3 + 1],
          cone.position[i * 3 + 2],
          cone.color[i * 4],
          cone.color[i * 4 + 1],
          cone.color[i * 4 + 2],
          cone.color[i * 4 + 3],
        ],
        i * 7
      );
    }
    return [...packed];
  })
);

// /** 頂点配列の生成 */
// export const sharedVertexArray = new Float32Array(
//   TRIANGLE_POSITIONS.flatMap((position, i) => [
//     ...position,
//     ...TRIANGLE_COLORS[i],
//   ])
// );

/**
 * インデックスデータ（6つ）
 * - 三角形①: 0,1,2
 * - 三角形②: 0,2,3
 */
// export const sharedIndexArray = new Uint16Array([
//   0,
//   1,
//   2, // 上
//   3,
//   4,
//   5, // 中央
//   6,
//   7,
//   8, // 下
// ]);
