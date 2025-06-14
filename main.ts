import { sharedVertexArray, sharedIndexArray } from "./src/geometry";
import { getPipeline } from "./src/getPipeline.ts";
import { initialize } from "./src/initialize.ts";
import { render } from "./src/render.ts";
import { uniformBufferSize } from "./src/uniform.ts";

initialize()
  .then((result) => {
    const { GPU_DEVICE, GPU_CANVAS_CONTEXT, CANVAS_FORMAT } = result;

    // 頂点バッファ（VBO）の作成
    // WebGPUではcreateBuffer時にmappedAtCreation: true を使う場合、sizeは4の倍数である必要がある。
    // Float32Array（4バイト単位）でも、要素数が奇数だとbyteLengthが4の倍数にならないことがあるため、ここで4の倍数に丸める。
    const paddedSize = Math.ceil(sharedVertexArray.byteLength / 4) * 4;
    const vbo = GPU_DEVICE.createBuffer({
      label: "triangleVertexBuffer",
      size: paddedSize,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Float32Array(vbo.getMappedRange()).set(sharedVertexArray);
    vbo.unmap();

    // インデックスバッファ（IBO）の作成
    // Uint16Arrayは1要素あたり2バイトのため、9要素などの場合 byteLength = 18 となり、これも4の倍数でないとエラーになる。
    // 同様にbyteLengthを4の倍数に丸める必要がある。
    const paddedIndexSize = Math.ceil(sharedIndexArray.byteLength / 4) * 4;
    const ibo = GPU_DEVICE.createBuffer({
      size: paddedIndexSize,
      usage: GPUBufferUsage.INDEX,
      mappedAtCreation: true,
    });
    new Uint16Array(ibo.getMappedRange()).set(sharedIndexArray);
    ibo.unmap();

    /**
     * Uniform バインドグループレイアウト
     */
    const bindGroupLayout = GPU_DEVICE.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
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
        indicesBuffer: ibo,
        uniformBuffer,
        uniformBindGroup,
      });
      requestAnimationFrame(loop);
    };
    loop();
  })
  .catch((error) => {
    console.log(sharedVertexArray.byteLength); // 要素数（例: 18）
    console.log(sharedIndexArray.byteLength);
    console.error(error);
  });
