/** 1つの値のメモリサイズ */
const perByteSize = Float32Array.BYTES_PER_ELEMENT; // 4

/** 三角形の数 */
export const triangleCount = 3;

// uniformValues 内のデータの格納先のインデックスを指定するための定数
/** uniformValues 内の time データのオフセット位置 */
export const timeUniformOffset = 0;
/** uniformValues 内の screenSize データのオフセット位置 */
export const screenSizeUniformOffset = 2;
/** uniformValues 内の rotations データのオフセット位置 */
export const rotationUniformOffset = 4;
/** uniformValues 内の centers データのオフセット位置 */
export const centerUniformOffset = rotationUniformOffset + 4 * triangleCount;
/** uniformValues 内の colors データのオフセット位置（新規追加） */
export const colorUniformOffset = centerUniformOffset + 4 * triangleCount;
/** MVP行列のオフセット位置（mat4x4 = 16個のfloat）← ★追加 */
export const mvpMatrixOffset = colorUniformOffset + 4 * triangleCount;

/**
 * ユニフォームバッファのサイズ（バイト単位）
 * - time: 4バイト
 * - _pad: 4バイト（アライメント調整用）
 * - screenSize: vec2f = 8バイト
 * - rotations: vec4f × 3 = 48バイト
 * - centers: vec4f × 3 = 48バイト
 * - colors: vec4f × 3 = 48バイト
 * - MVP行列: mat4x4 = 64バイト ← ★追加
 * 合計 = 4 + 4 + 8 + 48 + 48 + 48 + 64 = 224バイト
 */
export const uniformBufferSize =
  4 +
  4 +
  8 +
  16 * triangleCount + // rotations
  16 * triangleCount + // centers
  16 * triangleCount + // colors
  16 * 4; // mvp matrix

/** ユニフォームバッファのデータ
 * - Float32Arrayを使用して、WebGPUのユニフォームバッファに格納するデータを管理
 */
export const uniformValues = new Float32Array(uniformBufferSize / perByteSize);
