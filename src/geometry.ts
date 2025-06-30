import { WebGLGeometry } from "./lib/geometry";

/** 頂点の色情報 */
const COLORS = {
  DARK_RED: [0.8, 0.28, 0.1, 1],
  ORANGE: [0.8, 0.4, 0, 1],
  YELLOW: [0.8, 0.5, 0, 1],
};

/** 1つの値のバイトサイズ（float32 = 4） */
const perByteSize = Float32Array.BYTES_PER_ELEMENT;

export const sharedVertexSize = perByteSize * 7;
export const sharedPositionOffset = 0;
export const sharedColorOffset = perByteSize * 3;

/** 色付きCubeを1つだけ作成 */
const cube = WebGLGeometry.cube(0.8, COLORS.ORANGE);

const cubeCount = 3;
const yOffsets = [-1.2, 0.0, 1.2]; // Y方向にずらして3つ配置

const list = Object.values(COLORS);
const colorList = [...list, list[0]];

/** 各CubeのY方向のオフセット */
const vertexCountPerCube = cube.position.length / 3;
/** 各Cubeの頂点数 */
const totalVertexCount = vertexCountPerCube * cubeCount;
/** 全体の頂点数 */
export const sharedVertexArray = new Float32Array(totalVertexCount * 7);

for (let c = 0; c < cubeCount; c++) {
  for (let i = 0; i < vertexCountPerCube; i++) {
    const posIndex = i * 3;
    const colIndex = i % colorList.length;
    const [r, g, b, a] = colorList[colIndex];

    const globalIndex = c * vertexCountPerCube + i;
    const x = cube.position[posIndex];
    const y = cube.position[posIndex + 1] + yOffsets[c];
    const z = cube.position[posIndex + 2];

    sharedVertexArray.set([x, y, z, r, g, b, a], globalIndex * 7);
  }
}

/** インデックスバッファ */
export const sharedIndexArray = new Uint16Array(cube.index.length * cubeCount);

for (let c = 0; c < cubeCount; c++) {
  const indexOffset = c * vertexCountPerCube;
  for (let i = 0; i < cube.index.length; i++) {
    sharedIndexArray[c * cube.index.length + i] = cube.index[i] + indexOffset;
  }
}
