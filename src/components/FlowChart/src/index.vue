<template>
  <div class="h-full" :class="prefixCls">
    <FlowChartToolbar :prefixCls="prefixCls" v-if="toolbar" />
    <div ref="lfElRef" class="h-full"></div>
  </div>
</template>
<script lang="ts">
  import type { Definition } from '@logicflow/core';

  import { defineComponent, ref, onMounted, unref, nextTick, computed, watch } from 'vue';

  import FlowChartToolbar from './FlowChartToolbar.vue';
  import LogicFlow from '@logicflow/core';
  import { Snapshot, BpmnElement, Menu, DndPanel } from '@logicflow/extension';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { createFlowChartContext } from './useFlowContext';

  import { toLogicFlowData } from './adpterForTurbo';

  import '@logicflow/core/dist/style/index.css';
  import './index.css';
  export default defineComponent({
    name: 'FlowChart',
    components: { FlowChartToolbar },
    props: {
      flowOptions: {
        type: Object as PropType<Definition>,
        default: () => {},
      },

      data: {
        type: Object as PropType<any>,
        default: () => {},
      },

      toolbar: {
        type: Boolean,
        default: true,
      },
    },
    setup(props) {
      const lfElRef = ref<ElRef>(null);

      const lfInstance = ref<Nullable<LogicFlow>>(null);

      const { prefixCls } = useDesign('flow-chart');
      createFlowChartContext({
        logicFlow: (lfInstance as unknown) as LogicFlow,
      });

      const getFlowOptions = computed(() => {
        const { flowOptions } = props;

        const defaultOptions: Partial<Definition> = {
          grid: true,
          background: {
            color: '#f7f9ff',
          },
          keyboard: {
            enabled: true,
          },
          ...flowOptions,
        };
        return defaultOptions as Definition;
      });

      watch(
        () => props.data,
        () => {
          onRender();
        }
      );

      watch(
        () => props.flowOptions,
        (options) => {
          unref(lfInstance)?.updateEditConfig(options);
        }
      );

      // init logicFlow
      async function init() {
        await nextTick();

        const lfEl = unref(lfElRef);
        if (!lfEl) {
          return;
        }

        // Canvas configuration
        LogicFlow.use(Snapshot);
        // Use the bpmn plug-in to introduce bpmn elements, which can be used after conversion in turbo
        LogicFlow.use(BpmnElement);
        // Start the right-click menu
        LogicFlow.use(Menu);
        LogicFlow.use(DndPanel);
        lfInstance.value = new LogicFlow({
          ...unref(getFlowOptions),
          container: lfEl,
        });
        unref(lfInstance)?.setDefaultEdgeType('line');
        onRender();
      }

      async function onRender() {
        await nextTick();
        const lf = unref(lfInstance);
        if (!lf) {
          return;
        }
        const lFData = toLogicFlowData(props.data);
        lf.render(lFData);
      }

      onMounted(init);

      return {
        prefixCls,
        lfElRef,
      };
    },
  });
</script>
