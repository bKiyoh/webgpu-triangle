struct Uniforms {
  time: f32,
  _pad: f32,
  screenSize: vec2f,
  rotations: array<vec4<f32>, 3>,
  centers: array<vec4<f32>, 3>,
};

@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

/**
 * 1. 頂点の位置を中心からの相対位置に変換
 * 2. 相対位置を回転
 * 3. 回転後の位置を中心に戻す
 * 4. 最終的な位置を返す
 */
@vertex
fn vertexMain(
  @location(0) pos: vec2f,
  @builtin(vertex_index) vertexIndex: u32
) -> @builtin(position) vec4f {
  let triangleIndex = vertexIndex / 3u;

  let angle = uniforms.rotations[triangleIndex].x;
  let center = uniforms.centers[triangleIndex].xy;

  let translated = pos - center;

  let cosA = cos(angle);
  let sinA = sin(angle);
  let rotated = vec2f(
    translated.x * cosA - translated.y * sinA,
    translated.x * sinA + translated.y * cosA
  );

  let finalPos = rotated + center;

  return vec4f(finalPos, 0.0, 1.0);
}