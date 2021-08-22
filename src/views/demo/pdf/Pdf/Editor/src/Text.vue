<template>
  <div class="text-div" :style="{ width: `${width}px`, height: `${height}px` }">
    <TextArea
      v-for="(item, i) in textAreaList"
      :key="i"
      :x="item.x"
      :y="item.y"
      :size="item.size"
      @update-text-list="updateTextList(i, $event)"
    />
  </div>
  <canvas ref="TextRef" class="text" :width="width" :height="height"> </canvas>
</template>
<script lang="ts">
  import { useMouseInElement, useMousePressed } from '@vueuse/core';
  import { computed, defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
  import TextArea from './TextArea.vue';
  const Text = defineComponent({
    components: {
      TextArea,
    },
    props: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      fontSize: {
        type: Number,
        default: 14,
      },
    },
    setup(props) {
      const POINTER_HEIGHT = 7;
      const state = reactive({
        TextRef: {} as HTMLCanvasElement,
        ctx: null as CanvasRenderingContext2D | null,
        isSearhing: true,
        textAreaList: [] as any[],
      });
      // computed
      const textCursor = computed(() => {
        if (state.isSearhing) {
          return 'text';
        } else {
          return 'auto';
        }
      });
      // method
      const updateTextList = (i: number, obj: any) => {
        state.textAreaList[i] = obj;
      };
      const drawTextBoxAndSave = () => {
        state.textAreaList.map((m) => {
          if (state.ctx) {
            state.ctx.font = `${m.size}px system-ui`;
            // +POINTER_HEIGHT为插入中间值
            state.ctx.fillText(m.text, m.x, m.y + POINTER_HEIGHT);
          }
        });
        return state.TextRef.toDataURL('image/png');
      };
      // hooks
      onMounted(() => {
        state.ctx = state.TextRef.getContext('2d');
        const { pressed } = useMousePressed();
        const { elementX, elementY } = useMouseInElement(state.TextRef);
        watch(pressed, (n) => {
          if (n && state.isSearhing) {
            state.isSearhing = false;
            state.textAreaList.push({
              x: elementX.value,
              // -POINTER_HEIGHT为插入中间值
              y: elementY.value - POINTER_HEIGHT,
              text: '',
              size: props.fontSize,
            });
          }
        });
      });
      return {
        ...toRefs(state),
        // computed
        textCursor,
        // method
        updateTextList,
        drawTextBoxAndSave,
      };
    },
  });
  export default Text;
  export type TextRefs = InstanceType<typeof Text>;
</script>
<style scoped>
  .text,
  .text-div {
    position: absolute;
    cursor: v-bind(textcursor);
  }

  .text-div {
    z-index: 1;
  }
</style>
