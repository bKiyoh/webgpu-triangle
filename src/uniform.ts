/** 1つの値のメモリサイズ */
const perByteSize = Float32Array.BYTES_PER_ELEMENT; // 4

/** 三角形の数 */
export const triangleCount = 3;

// uniformValues内のデータの格納先のインデックスを指定するための定数
/** uniformValues内の time データのオフセットの位置を指定 */
export const timeUniformOffset = 0;
/** uniformValues内の screen_size データのオフセットの位置を指定 */
export const screenSizeUniformOffset = 2;
/** uniformValues内の rotation データのオフセットの位置を指定 */
export const rotationUniformOffset = 4;
/** uniformValues内の center データのオフセットの位置を指定 */
export const centerUniformOffset = rotationUniformOffset + 4 * triangleCount;

/**
 * ユニフォームバッファのサイズ（バイト単位）
 * - time: 4バイト
 * - _pad: 4バイト（アライメント調整用）
 * - screenSize: vec2f = 8バイト
 * - rotations: vec4f × 3 = 16バイト × 3 = 48バイト
 * - centers: vec4f × 3 = 16バイト × 3 = 48バイト
 * 合計 = 16 + 48 + 48 = 112バイト
 */
export const uniformBufferSize =
  4 + 4 + 8 + 16 * triangleCount + 16 * triangleCount;

/** ユニフォームバッファのデータ */
export const uniformValues = new Float32Array(uniformBufferSize / perByteSize);
