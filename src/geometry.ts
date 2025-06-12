/** 1つの値のメモリサイズ */
const perByteSize = Float32Array.BYTES_PER_ELEMENT; // 4

/** triangleVertexArray内の各頂点ごとのスキップサイズ */
export const triangleVertexSize = perByteSize * 2;

/** triangleVertexArray内の各頂点データのオフセットの位置 */
export const trianglePositionOffset = 0;

/**
 * 三角形の頂点座標データ
 * clip space（[-1, 1]）で上・左下・右下の三点を指定
 */
export const triangleVertexArray = new Float32Array([
  0.0,
  0.5, // 上
  -0.5,
  -0.5, // 左下
  0.5,
  -0.5, // 右下
]);
