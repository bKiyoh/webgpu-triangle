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

/**
 * ユニフォームバッファのサイズ（バイト単位）
 * - time: 4バイト
 * - _pad: 4バイト（アライメント調整用）
 * - screenSize: vec2f = 8バイト
 * - rotations: vec4f × 3 = 16バイト × 3 = 48バイト
 * - centers: vec4f × 3 = 48バイト
 * - colors: vec4f × 3 = 48バイト ← ★追加部分
 * 合計 = 16 + 48 + 48 + 48 = 160バイト
 */
export const uniformBufferSize =
  4 + 4 + 8 + 16 * triangleCount + 16 * triangleCount + 16 * triangleCount;

/** ユニフォームバッファのデータ */
export const uniformValues = new Float32Array(uniformBufferSize / perByteSize);
