import { WebGLGeometry } from "./lib/geometry";

/** 頂点の色情報（RGBA） */
const COLORS = {
  DARK_RED: [0.8, 0.28, 0.1, 1],
  ORANGE: [0.8, 0.4, 0, 1],
  YELLOW: [0.8, 0.5, 0, 1],
};

/** Float32 のバイトサイズ（= 4バイト） */
const perByteSize = Float32Array.BYTES_PER_ELEMENT;

/** 頂点1つあたりのサイズ（position3 + color4 + normal3）× 4バイト */
export const sharedVertexSize = perByteSize * 10;
/** 頂点データ中での各属性のバイトオフセット */
export const sharedPositionOffset = 0;
export const sharedColorOffset = perByteSize * 3;
export const sharedNormalOffset = perByteSize * 7;

/** サイズ0.8の立方体ジオメトリを1つ作成 */
const cube = WebGLGeometry.cube(0.8, COLORS.ORANGE);

/** 描画する立方体の数 */
const cubeCount = 3;
/** 各立方体をY方向にずらして配置するためのオフセット */
const yOffsets = [-1.2, 0.0, 1.2];

/** カラーパターンの配列を生成 */
const list = Object.values(COLORS);
const colorList = [...list, list[0]]; // 最後に最初の色をもう一度追加（ループ目的）

/** 単体キューブの頂点数 */
const vertexCountPerCube = cube.position.length / 3;
/** 総頂点数（3個分） */
const totalVertexCount = vertexCountPerCube * cubeCount;
/** 頂点バッファ（position3 + color4 + normal3 = 10項目/頂点） */
export const sharedVertexArray = new Float32Array(totalVertexCount * 10);

/**
 * 頂点バッファの作成
 * - 3つの立方体をY方向にずらして配置
 * - 色は順番にループしながら付与
 * - 法線はジオメトリから取得しつつY方向に配置ずれがあるので補正
 */
for (let c = 0; c < cubeCount; c++) {
  for (let i = 0; i < vertexCountPerCube; i++) {
    const posIndex = i * 3;
    const colIndex = i % colorList.length;
    const [r, g, b, a] = colorList[colIndex];

    const globalIndex = c * vertexCountPerCube + i;

    // 座標にY方向オフセットを加算
    const x = cube.position[posIndex];
    const y = cube.position[posIndex + 1] + yOffsets[c];
    const z = cube.position[posIndex + 2];

    // 法線もY方向のオフセットを考慮（※必須ではないが、元の形状維持のため）
    const nx = cube.normal[posIndex];
    const ny = cube.normal[posIndex + 1] + 1.2;
    const nz = cube.normal[posIndex + 2];

    // 頂点データ（位置 + 色 + 法線）を10個ずつ格納
    sharedVertexArray.set([x, y, z, r, g, b, a, nx, ny, nz], globalIndex * 10);
  }
}

/** インデックスバッファの作成（3つ分のキューブのインデックスをまとめる） */
export const sharedIndexArray = new Uint16Array(cube.index.length * cubeCount);

for (let c = 0; c < cubeCount; c++) {
  const indexOffset = c * vertexCountPerCube;
  for (let i = 0; i < cube.index.length; i++) {
    // インデックスを立方体ごとにずらして配置
    sharedIndexArray[c * cube.index.length + i] = cube.index[i] + indexOffset;
  }
}
