import { WebGLOrbitCamera } from "./lib/camera";

export const initialize = async () => {
  // adapterは物理デバイス（物理的なGPU）
  const GPU_ADAPTER = await navigator.gpu.requestAdapter();
  // deviceは論理デバイス（抽象化したGPU）
  const GPU_DEVICE = await GPU_ADAPTER!.requestDevice();
  // contextの取得
  const canvas: HTMLCanvasElement | null = document.querySelector("#world");
  if (!canvas) {
    throw new Error("canvas 要素が見つかりませんでした");
  }
  const GPU_CANVAS_CONTEXT = canvas?.getContext("webgpu");

  if (!GPU_ADAPTER) {
    return Promise.reject(new Error("Could not find GPU adapter"));
  }

  if (!GPU_DEVICE) {
    return Promise.reject(new Error("Could not find GPU device"));
  }

  if (!GPU_CANVAS_CONTEXT) {
    return Promise.reject(new Error("Could not find GPU canvas context"));
  }

  /**
   * コンテキストの設定
   */

  const CANVAS_FORMAT = navigator.gpu.getPreferredCanvasFormat();

  /**| 設定項目       | 目的                           |
   * | ------------- | ---------------------------- |
   * | `device`      | 描画に使うGPUデバイスを指定              |
   * | `format`      | 色の表現形式を指定（例：RGBAなど）          |
   * | `alphaMode`   | 背景の透明処理をどう扱うかを指定             |
   * | `configure()` | 上記の情報をコンテキストに反映し、GPU描画を有効化する |
   */
  GPU_CANVAS_CONTEXT.configure({
    // deviceには先ほど取得した論理デバイスGPU_DEVICEを指定
    device: GPU_DEVICE,
    // formatには、navigator.gpu.getPreferredCanvasFormat()でcanvasのネイティブのピクセルフォーマットが取得できるのでそれを指定します。
    // この関数では通常は"rgba8unorm"または"bgra8unorm"というフォーマットが返されます。
    // 初歩的な利用では、この関数をおまじないとして呼ぶようにしましょう。
    format: CANVAS_FORMAT,
    // alphaModeには'opaque'という文字列を指定します。
    // このalphaModeはCanvasと背景となるHTML要素との合成方法を設定するものです。
    // 'opaque'の場合は、WebGPUの描画内容で完全に上書きします。
    // alphaModeには’premultiplied'という値も設定することができ、こちらの場合はWebGPUの描画の結果、Canvas側のピクセルのアルファ要素が1未満だった場合、そのピクセルはcanvas側と背景のHTML要素の色で混合されます
    alphaMode: "opaque",
  });

  /**
   * リサイズ処理
   */
  const scale = window.devicePixelRatio;
  const reportWindowSize = () => {
    GPU_CANVAS_CONTEXT.canvas.width = Math.floor(window.innerHeight * scale);
    GPU_CANVAS_CONTEXT.canvas.height = Math.floor(window.innerWidth * scale);
  };
  window.onresize = reportWindowSize;
  window.dispatchEvent(new Event("resize"));

  /**
   * カメラの設定
   * WebGLOrbitCameraを使用して、カメラの初期位置や動作を設定します。
   */
  const cameraOption = {
    distance: 3.0, // Z 軸上の初期位置までの距離
    min: 1.0, // カメラが寄れる最小距離
    max: 10.0, // カメラが離れられる最大距離
    move: 2.0, // 右ボタンで平行移動する際の速度係数
  };
  const ORBIT_CAMERA = new WebGLOrbitCamera(canvas, cameraOption);

  return {
    GPU_ADAPTER,
    GPU_DEVICE,
    GPU_CANVAS_CONTEXT,
    CANVAS_FORMAT,
    ORBIT_CAMERA,
  };
};
