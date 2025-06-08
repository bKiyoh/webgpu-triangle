struct Uniforms {
    time: f32,
    screen_size: vec2<f32>,
};

// group 0 の binding 0 にあるメモリ上のリソース（uniform バッファ）を、uniforms という名前で使うという宣言
// 実際のバッファのセットは、group は render.ts、binding は main.ts で行っている
@group(0) @binding(0) var<uniform> uniforms : Uniforms;

fn colorPalette(t: f32) -> vec3<f32> {
    let base = vec3(0.0, 0.2, 0.5);           // 青ベース
    let range = vec3(0.0, 0.3, 0.5);          // 水色方向への変化
    return base + range * cos(6.28318 * t);
}

struct FragmentInputs {
    @builtin(position) position : vec4<f32>, // GLSL の gl_FragCoord に相当
};

@fragment
fn fragmentMain(input: FragmentInputs) -> @location(0) vec4<f32> {

    // 座標の正規化
    var uv = input.position.xy / uniforms.screen_size.xy * 2.0 - 1.0 ;
    uv = vec2(uv.x * uniforms.screen_size.y / uniforms.screen_size.x, uv.y);

    var uv0 = uv;

    var finalColor = vec3(0.0);

    // fractで作った各タイル内の描画サイクルを増やす
    for (var i: i32 = 0; i < 20 ; i++) {

        // スクリーン座標を繰り返す（スクリーン全体をタイル状にを分割する）
        uv = fract(uv * 1.5) - 0.5;

        // タイルの真ん中を中心とする円形のグラデーションを作る、exp()で偏差をつけている
        var distance = length(uv) * exp(-length(uv0));
        
        let index = f32(i);
        // スクリーン全体のカラーをグラデーションにする
        var gradationColor = colorPalette(length(uv0) + index * 0.8 + uniforms.time * 0.5 );

        // サークルを波紋状にする
        distance = sin(distance * 8 /* 波紋の周期の数 */  + uniforms.time * 1.4 /* 波紋の速さ */ );
        distance = abs(distance);
        distance = pow(0.08 / distance, 1.2); // 波紋のラインの太さ(シャープさ)調整

        finalColor += gradationColor * distance;
    }

    return vec4<f32>(finalColor, 1.0);
}