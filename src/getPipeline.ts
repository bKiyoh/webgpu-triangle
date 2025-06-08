import vertexWGSL from "./shader/vertex.wgsl?raw";
import fragmentWGSL from "./shader/fragment.wgsl?raw";
import { squarePositionOffset, squareVertexSize } from "./geometry";

type TGetPipelineArgs = {
  GPU_DEVICE: GPUDevice;
  CANVAS_FORMAT: GPUTextureFormat;
  bindGroupLayout: GPUBindGroupLayout;
};

export const getPipeline = ({
  GPU_DEVICE,
  CANVAS_FORMAT,
  bindGroupLayout,
}: TGetPipelineArgs) => {
  const pipelineLayout = GPU_DEVICE.createPipelineLayout({
    label: "Pipeline Layout",
    bindGroupLayouts: [bindGroupLayout],
  });

  // https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline
  return GPU_DEVICE.createRenderPipeline({
    // layoutですが、ここにはほとんどの場合'auto'を指定します。最初はおまじないとして考えておけば結構です。
    layout: pipelineLayout,
    // vertexです。
    // 論理デバイスGPU_DEVICEのcreateShaderModule関数にシェーダー文字列を渡しています。
    // WebGPUのシェーダー言語はWGSLというWebGLのGLSLとは異なる言語なのですが、これについては後述します。
    // また、entiryPointでシェーダー内のエントリーポイントとなる関数名を指定しています。
    vertex: {
      module: GPU_DEVICE.createShaderModule({
        label: "vertex shader",
        code: vertexWGSL,
      }),
      entryPoint: "vertexMain",
      buffers: [
        {
          arrayStride: squareVertexSize,
          attributes: [
            {
              // position
              shaderLocation: 0, // vertex.wgsl vertexMain関数の @location(0) に対応
              offset: squarePositionOffset,
              format: "float32x2", // 各頂点の座標データの容量に合わせたフォーマット。ここでは4byteが２つで一つの座標なので'float32x2'を指定。
            },
          ],
        },
      ],
    },
    // 次にfragmentです。
    // moduleとentryPointに対する設定はvertexと同様ですが、他にtargetsというプロパティがあります。
    // これは描画先のレンダーターゲットのフォーマットを指定するものです。
    // ここにはcontextの設定時と同じnavigator.gpu.getPreferredCanvasFormat()で得られたフォーマットを指定しましょう。
    fragment: {
      module: GPU_DEVICE.createShaderModule({
        label: "fragment shader",
        code: fragmentWGSL,
      }),
      entryPoint: "fragmentMain",
      targets: [
        {
          format: CANVAS_FORMAT,
        },
      ],
    },
    // 描画するプリミティブ（点や三角形）の設定
    primitive: {
      topology: "triangle-list", // 描画するプリミティブの種類。ここでは三角形を指定。
    },
  });
};
