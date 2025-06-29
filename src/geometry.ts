import { WebGLGeometry } from "./lib/geometry";

/** 1つの値のバイトサイズ（float32 = 4） */
const perByteSize = Float32Array.BYTES_PER_ELEMENT;

/** 各頂点の属性サイズ（x, y, r, g, b, a） */
export const sharedVertexSize = perByteSize * 7;
export const sharedPositionOffset = 0;
export const sharedColorOffset = perByteSize * 3;

/** 頂点の色情報 */
const COLORS = {
  DARK_RED: [0.8, 0.28, 0.1, 1],
  ORANGE: [0.8, 0.4, 0, 1],
  YELLOW: [0.8, 0.5, 0, 1],
};

/** 色付きCubeを1つだけ作成 */

const cube = WebGLGeometry.cube(0.8, COLORS.ORANGE);

/** 頂点バッファ作成 (position + color) */
export const sharedVertexArray = new Float32Array(
  (() => {
    const vertexCount = cube.position.length / 3;
    const packed = new Float32Array(vertexCount * 7); // 3(pos) + 4(color)
    const list = Object.values(COLORS);
    const colorList = [...list, list[0]];
    for (let i = 0; i < vertexCount; i++) {
      const posIndex = i * 3;
      const colIndex = i % colorList.length;
      const [r, g, b, a] = colorList[colIndex];

      packed.set(
        [
          cube.position[posIndex],
          cube.position[posIndex + 1],
          cube.position[posIndex + 2],
          r,
          g,
          b,
          a,
        ],
        i * 7
      );
    }

    return packed;
  })()
);

/** インデックスバッファ */
export const sharedIndexArray = new Uint16Array(cube.index);
