import { triangleVertexArray } from "./src/geometry.ts";
import { getPipeline } from "./src/getPipeline.ts";
import { initialize } from "./src/initialize.ts";
import { render } from "./src/render.ts";
import { uniformBufferSize } from "./src/uniform.ts";

initialize()
  .then((result) => {
    const { GPU_DEVICE, GPU_CANVAS_CONTEXT, CANVAS_FORMAT } = result;

    /**
     * VertexBuffer(VBO:頂点バッファ）
     * 四角形を構成するための頂点データを GPU に渡すバッファ。
     * 今回は 2D 座標（x, y）のみを使用し、float32x2（8バイト）× 4頂点分の構成。
     * このバッファは vertex shader の @location(0) に対応している。
     */
    const vbo = GPU_DEVICE.createBuffer({
      label: "triangleVertexBuffer",
      size: triangleVertexArray.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Float32Array(vbo.getMappedRange()).set(triangleVertexArray);
    vbo.unmap();

    /**
     * Uniform バインドグループレイアウト
     */
    const bindGroupLayout = GPU_DEVICE.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {},
        },
      ],
    });

    /**
     * Pipeline の作成
     */
    const pipeline = getPipeline({
      GPU_DEVICE,
      CANVAS_FORMAT,
      bindGroupLayout,
    });

    /**
     * Uniform バッファ
     * GPUのシェーダー（WGSL）から参照される読み取り専用のメモリ領域。
     * JS/TS（CPU側）から time や screen_size などの値を書き込み、
     * WGSL（GPU側）の @group(0) @binding(0) で使用される。
     */
    const uniformBuffer = GPU_DEVICE.createBuffer({
      label: "uniformBuffer",
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    /**
     * Uniform バインドグループ
     * uniformBuffer を GPU にバインドするための設定。
     * @group(0) @binding(0) の uniform 変数に対応し、
     * GPUシェーダー内から uniforms.time や uniforms.screen_size として参照可能になる。
     */
    const uniformBindGroup = GPU_DEVICE.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0, // fragment.wgslに値を渡すために@binding(0)で指定
          resource: {
            buffer: uniformBuffer,
          },
        },
      ],
    });

    /**
     * 描画ループ
     */
    const loop = () => {
      render({
        GPU_CANVAS_CONTEXT,
        GPU_DEVICE,
        pipeline,
        verticesBuffer: vbo,
        uniformBuffer,
        uniformBindGroup,
      });
      requestAnimationFrame(loop);
    };
    loop();
  })
  .catch((error) => {
    console.error(error);
  });
