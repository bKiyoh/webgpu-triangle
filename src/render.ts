import { writeUniformBuffer } from "./writeUniformBuffer";

type TRenderArgs = {
  GPU_CANVAS_CONTEXT: GPUCanvasContext;
  GPU_DEVICE: GPUDevice;
  pipeline: GPURenderPipeline;
  verticesBuffer: GPUBuffer;
  uniformBuffer: GPUBuffer;
  uniformBindGroup: GPUBindGroup;
};

export const render = ({
  GPU_CANVAS_CONTEXT,
  GPU_DEVICE,
  pipeline,
  verticesBuffer,
  uniformBuffer,
  uniformBindGroup,
}: TRenderArgs) => {
  /** Update uniform buffer */
  // GPU側にデータを送る処理を実行
  writeUniformBuffer({ uniformBuffer, GPU_DEVICE, GPU_CANVAS_CONTEXT });

  /** GPUに発行されるコマンドをエンコードするためのエンコーダーを作成 */
  // WebGPUをはじめとした低レベル３D APIでは、一般的にCommandBufferというGPUへの各種命令をパッキングするバッファが存在する
  // WebGPUではCommandEncoderという名称
  const commandEncoder = GPU_DEVICE.createCommandEncoder();

  // このCommandEncoderの使い方は、生成後にbeginRenderPassという関数を呼び出し、renderPassEncoderというオブジェクトを取得する
  // このrenderPassEncoderに対して様々な命令を積んでいくことになるが、まずbeginRenderPass関数の呼び出しにはGPURenderPassDescriptorという型の引数オブジェクトを事前に用意する必要がある
  const renderPassEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [
      // fragment.wgsl　fragmentMain関数の戻り値の @location(0) に対応
      {
        view: GPU_CANVAS_CONTEXT.getCurrentTexture().createView(),
        clearValue: { r: 0.0, g: 0.15, b: 0.25, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  // setPipeline関数で、前ページで作成したRenderPipelineを設定
  renderPassEncoder.setPipeline(pipeline);
  // fragment.wgsl に値を渡すために @group(0) に指定
  renderPassEncoder.setBindGroup(0, uniformBindGroup);
  // VBO（頂点バッファ）をスロット0にバインド
  // renderPassEncoderのsetVertexBuffer()メソッドを使って、VertexBufferをセット
  // 第一引数の数値には、RenderPipelineのvertex.buffersにおけるbufferのインデックスを指定
  renderPassEncoder.setVertexBuffer(0, verticesBuffer);

  renderPassEncoder.draw(3); // 3頂点の三角形

  renderPassEncoder.end();

  /**
   * レンダリングパスによって記録されたコマンドをコマンドバッファでラップしてGPUに送信する
   */
  GPU_DEVICE.queue.submit([commandEncoder.finish()]);
};
