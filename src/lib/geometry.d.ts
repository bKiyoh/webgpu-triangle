export type GeometryData = {
  position: number[];
  normal: number[];
  color: number[];
  texCoord: number[];
  index: number[];
};

export declare class WebGLGeometry {
  /**
   * 板ポリゴンを生成
   */
  static plane(width: number, height: number, color: number[]): GeometryData;

  /**
   * 円を生成
   */
  static circle(split: number, rad: number, color: number[]): GeometryData;

  /**
   * キューブを生成
   */
  static cube(side: number, color: number[]): GeometryData;

  /**
   * 三角錐を生成
   */
  static cone(
    split: number,
    rad: number,
    height: number,
    color: number[]
  ): GeometryData;

  /**
   * 円柱を生成
   */
  static cylinder(
    split: number,
    topRad: number,
    bottomRad: number,
    height: number,
    color: number[]
  ): GeometryData;

  /**
   * 球体を生成
   */
  static sphere(
    row: number,
    column: number,
    rad: number,
    color: number[]
  ): GeometryData;

  /**
   * トーラスを生成
   */
  static torus(
    row: number,
    column: number,
    irad: number,
    orad: number,
    color: number[]
  ): GeometryData;

  /**
   * 正二十面体を生成
   */
  static icosahedron(rad: number, color: number[]): GeometryData;
}
