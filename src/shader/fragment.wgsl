/**
 * フラグメントシェーダー
 * プリミティブ（三角形などの基本図形）をラスタライズして生成されたピクセル1つ1つに対して並列で実行される処理
 */

// 頂点シェーダーと同じ Uniforms 構造体
struct Uniforms {
    time: f32
}

// 同じバインディングをフラグメント側にも宣言
@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
  @location(1) normal: vec3f,
};

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let lightDirection: vec3f = normalize(vec3f(1.0, 1.0, 1.0));
  let lightColor: vec3f = vec3f(1.0, 1.0, 1.0);

  let d = dot(normalize(in.normal), lightDirection);
  
  return vec4f(in.color.rgb * d * lightColor, in.color.a);
}
