import {
  timeUniformOffset,
  uniformValues,
  screenSizeUniformOffset,
} from "./uniform";

const startTime = Date.now();

type TArgs = {
  uniformBuffer: GPUBuffer;
  GPU_DEVICE: GPUDevice;
  GPU_CANVAS_CONTEXT: GPUCanvasContext;
};

export const writeUniformBuffer = ({
  uniformBuffer,
  GPU_DEVICE,
  GPU_CANVAS_CONTEXT,
}: TArgs) => {
  /**
   * 現在の時間を取得し、uniformValuesにセットする
   */
  const millis = (Date.now() - startTime) / 1000;
  uniformValues.set([millis], timeUniformOffset);

  /**
   * 画面サイズを取得し、uniformValuesにセットする
   */
  const width = GPU_CANVAS_CONTEXT.canvas.width;
  const height = GPU_CANVAS_CONTEXT.canvas.height;
  uniformValues.set([width, height], screenSizeUniformOffset);
  // uniformValues の内容を GPU上に確保されるメモリに転送
  GPU_DEVICE.queue.writeBuffer(uniformBuffer, 0, uniformValues);
};
