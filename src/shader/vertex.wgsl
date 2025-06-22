/**
 * 頂点シェーダ
 * 各頂点に対して実行され、位置や属性（色・法線など）を計算する処理。
 * 結果はプリミティブ（三角形など）を構成し、ラスタライズに渡される。
 * WGSLの流れ：頂点シェーダー ⇒ ラスタライズ ⇒ フラグメントシェーダー
 */

/**
 * struct は、uniform（全シェーダー共通の入力値）をまとめて管理するための型定義
 * time や screenSize、回転・中心座標・色情報などを 1 つにまとめ、シェーダー内で使いやすくする目的で使われる
 * - time: アニメーション用の経過時間
 * - _pad: アライメント調整用のダミー変数（未使用）
 * - screenSize: 画面の幅と高さ
 * - rotations: 各三角形の回転角度（vec4 だが主に x 成分を使用）
 * - centers: 各三角形の中心座標
 * - colors: 各三角形の色情報（RGBA）
  * - modelViewProjectionMatrix: モデル変換、ビュー変換、投影変換をまとめた行列
 */
struct Uniforms {
  time: f32,
  _pad: f32,
  screenSize: vec2f,
  rotations: array<vec4<f32>, 3>,
  centers: array<vec4<f32>, 3>,
  colors: array<vec4<f32>, 3>,
  modelViewProjectionMatrix: mat4x4<f32>,
};

/**
 * struct は、位置情報（position）と色情報（color）を 1 つの構造で返すための型定義
 * - position: 頂点の描画位置（画面座標系、@builtin）
 * - color: 頂点に設定された色情報（@location(0)）
 */
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
};

/**
 * var<uniform> は、CPU(ts)から渡された uniform バッファ（共通定数）を読み取るための宣言
 * struct Uniforms の形で、時間や画面サイズ、回転・中心位置・色情報などの値をまとめて受け取る
 * @group(0) @binding(0) は、WebGPU 側でこの uniform をどこに接続するかを示すバインディング位置
 */
@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

/**
 * 1. 頂点の位置を中心からの相対位置に変換
 * 2. 相対位置を回転
 * 3. 回転後の位置を中心に戻す
 * 4. カラーと一緒に返す
 */
@vertex
fn vertexMain(
  @location(0) position: vec2f,
  @location(1) color: vec4f,
  @builtin(vertex_index) vertexIndex: u32
) -> VertexOutput {
  let triangleIndex = vertexIndex / 3u;

  let angles = uniforms.rotations[triangleIndex].xyz;
  let center = uniforms.centers[triangleIndex].xyz;

  var translated = vec3f(position, 0.0) - center;

  // Z軸回転
  let cz = cos(angles.z); let sz = sin(angles.z);
  translated = vec3f(
    translated.x * cz - translated.y * sz,
    translated.x * sz + translated.y * cz,
    translated.z
  );

  // Y軸回転
  let cy = cos(angles.y); let sy = sin(angles.y);
  translated = vec3f(
    translated.x * cy + translated.z * sy,
    translated.y,
    -translated.x * sy + translated.z * cy
  );

  // X軸回転
  let cx = cos(angles.x); let sx = sin(angles.x);
  translated = vec3f(
    translated.x,
    translated.y * cx - translated.z * sx,
    translated.y * sx + translated.z * cx
  );

  let finalPosition = translated + center;

  var out: VertexOutput;
  // モデル変換、ビュー変換、投影変換の全てが1度に適用される
  out.position = uniforms.modelViewProjectionMatrix * vec4f(finalPosition, 1.0);
  out.color = color;
  return out;
}
