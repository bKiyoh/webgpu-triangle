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

@fragment
fn fragmentMain(@location(0) color: vec4f) -> @location(0) vec4f {
    let blink = abs(sin(uniforms.time * 0.5)); // 0.0 から 1.0 の間で変化するブリンク効果
    let rgb = color.rgb * (1.0 + 0.6  * blink); // 最低1.0
    return vec4f(rgb, color.a);
}
