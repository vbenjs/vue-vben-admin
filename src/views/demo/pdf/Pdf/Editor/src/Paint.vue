<template>
  <canvas ref="CanvasRef" class="canvas" :width="width" :height="height"></canvas>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
  import { useMouseInElement, useMousePressed } from '@vueuse/core';
  const Paint = defineComponent({
    props: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      lineWidth: {
        type: Number,
        default: 3,
      },
    },
    setup(props) {
      const state = reactive({
        ctx: null as CanvasRenderingContext2D | null,
        CanvasRef: {} as HTMLCanvasElement,
      });
      const save = () => {
        return state.CanvasRef.toDataURL('image/png');
      };
      onMounted(() => {
        state.ctx = state.CanvasRef.getContext('2d');
        const { pressed } = useMousePressed();
        const { elementX, elementY } = useMouseInElement(state.CanvasRef);
        watch([elementX, elementY], (n) => {
          if (state.ctx) {
            if (pressed.value) {
              state.ctx.lineTo(n[0], n[1]);
              state.ctx.lineWidth = props.lineWidth * 2;
              state.ctx.lineCap = 'round';
              state.ctx.lineJoin = 'round';
              state.ctx.stroke();
              state.ctx.beginPath();
              state.ctx.arc(n[0], n[1], props.lineWidth, 0, 2 * Math.PI, true);
              state.ctx.fill();
              state.ctx.beginPath();
              state.ctx.moveTo(n[0], n[1]);
            } else {
              state.ctx.beginPath();
            }
          }
        });
      });
      return {
        ...toRefs(state),
        // method
        save,
      };
    },
  });
  export default Paint;
  export type PaintRefs = InstanceType<typeof Paint>;
</script>

<style scoped>
  .canvas {
    position: absolute;
  }
</style>
