<template>
  <div class="h-full" :class="prefixCls">
    <FlowChartToolbar :prefixCls="prefixCls" v-if="toolbar" @view-data="handlePreview" />
    <div ref="lfElRef" class="h-full"></div>
    <BasicModal @register="register" title="流程数据" width="50%">
      <JsonPreview :data="graphData" />
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import type { Ref } from 'vue';
  import type { Definition } from '@logicflow/core';
  import { ref, onMounted, unref, nextTick, computed, watch } from 'vue';
  import FlowChartToolbar from './FlowChartToolbar.vue';
  import LogicFlow from '@logicflow/core';
  import { Snapshot, BpmnElement, Menu, DndPanel, SelectionSelect } from '@logicflow/extension';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useAppStore } from '@/store/modules/app';
  import { createFlowChartContext } from './useFlowContext';
  import { toLogicFlowData } from './adpterForTurbo';
  import { useModal, BasicModal } from '@/components/Modal';
  import { JsonPreview } from '@/components/CodeEditor';
  import { configDefaultDndPanel } from './config';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';

  defineOptions({ name: 'FlowChart' });

  const props = defineProps({
    flowOptions: {
      type: Object as PropType<Definition>,
      default: () => ({}),
    },

    data: {
      type: Object as PropType<any>,
      default: () => ({}),
    },

    toolbar: {
      type: Boolean,
      default: true,
    },
    patternItems: {
      type: Array,
    },
  });

  const lfElRef = ref(null);
  const graphData = ref({});

  const lfInstance = ref(null) as Ref<LogicFlow | null>;

  const { prefixCls } = useDesign('flow-chart');
  const appStore = useAppStore();
  const [register, { openModal }] = useModal();
  createFlowChartContext({
    logicFlow: lfInstance as unknown as LogicFlow,
  });

  const getFlowOptions = computed(() => {
    const { flowOptions } = props;

    const defaultOptions: Partial<Definition> = {
      grid: true,
      background: {
        color: appStore.getDarkMode === 'light' ? '#f7f9ff' : '#151515',
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
    },
  );

  // TODO
  // watch(
  //   () => appStore.getDarkMode,
  //   () => {
  //     init();
  //   }
  // );

  watch(
    () => unref(getFlowOptions),
    (options) => {
      unref(lfInstance)?.updateEditConfig(options);
    },
  );

  // init logicFlow
  async function init() {
    await nextTick();

    const lfEl = unref(lfElRef);
    if (!lfEl) {
      return;
    }
    LogicFlow.use(DndPanel);

    // Canvas configuration
    LogicFlow.use(Snapshot);
    // Use the bpmn plug-in to introduce bpmn elements, which can be used after conversion in turbo
    LogicFlow.use(BpmnElement);
    // Start the right-click menu
    LogicFlow.use(Menu);
    LogicFlow.use(SelectionSelect);

    lfInstance.value = new LogicFlow({
      ...unref(getFlowOptions),
      container: lfEl,
    });
    const lf = unref(lfInstance)!;
    lf?.setDefaultEdgeType('line');
    onRender();
    lf?.setPatternItems(props.patternItems || configDefaultDndPanel(lf));
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

  function handlePreview() {
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }
    graphData.value = unref(lf).getGraphData();
    openModal();
  }

  onMounted(init);
</script>
