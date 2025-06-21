/**
 * フラグメントシェーダー
 * プリミティブ（三角形などの基本図形）をラスタライズして生成されたピクセル1つ1つに対して並列で実行される処理
 */
@fragment
fn fragmentMain(@location(0) color: vec4f) -> @location(0) vec4f {
    return color;
}
