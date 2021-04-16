<template>
  <div class="logic-flow-view">
    <!-- 辅助工具栏 -->
    <Control class="demo-control" v-if="lf" :lf="lf" :catTurboData="false" @catData="catData" />
    <!-- 节点面板 -->
    <NodePanel :lf="lf" :nodeList="nodeList" />
    <!-- 画布 -->
    <div id="LF-Turbo"></div>
    <!-- 数据查看面板 -->
    <BasicModal @register="register" title="数据">
      <DataDialog :graphData="graphData" />
    </BasicModal>
  </div>
</template>

<script lang="ts">
  import { ref, unref, onMounted } from 'vue';
  import LogicFlow from '@logicflow/core';
  import { Snapshot, BpmnElement, Menu } from '@logicflow/extension';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';
  import { Control, NodePanel, DataDialog } from '/@/components/FlowChart';

  import { toLogicflowData } from '/@/components/FlowChart/src/adpterForTurbo';
  import { BpmnNode } from '/@/components/FlowChart/src/config';
  import demoData from './dataTurbo.json';

  import { BasicModal, useModal } from '/@/components/Modal';
  export default {
    components: { NodePanel, Control, DataDialog, BasicModal },
    setup() {
      let lf = ref(null);
      let graphData = ref(null);
      let config = ref({
        grid: true,
        background: {
          color: '#f7f9ff',
        },
        keyboard: {
          enabled: true,
        },
      });
      let nodeList = BpmnNode;

      const [register, { openModal }] = useModal();

      function initLf() {
        // 画布配置
        LogicFlow.use(Snapshot);
        // 使用bpmn插件，引入bpmn元素，这些元素可以在turbo中转换后使用
        LogicFlow.use(BpmnElement);
        // 启动右键菜单
        LogicFlow.use(Menu);
        const domLf = new LogicFlow({
          ...unref(config),
          container: document.querySelector('#LF-Turbo'),
        });
        lf.value = domLf;
        // 设置边类型bpmn:sequenceFlow为默认类型
        unref(lf).setDefaultEdgeType('bpmn:sequenceFlow');
        onRender();
      }

      function onRender() {
        // Turbo数据转换为LogicFlow内部识别的数据结构
        const lFData = toLogicflowData(demoData);
        lf.value.render(lFData);
      }

      function catData() {
        graphData.value = unref(lf).getGraphData();
        openModal();
      }

      onMounted(() => {
        initLf();
      });

      return {
        lf,
        graphData,
        config,
        nodeList,
        catData,
        register,
        openModal,
      };
    },
  };
</script>

<style scoped>
  #LF-Turbo {
    width: 100vw;
    height: 85%;
    outline: none;
  }

  .logic-flow-view {
    position: relative;
    height: 100%;
  }

  .demo-title {
    margin: 20px;
    text-align: center;
  }

  .demo-control {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 2;
  }

  .time-plus {
    cursor: pointer;
  }

  .add-panel {
    position: absolute;
    z-index: 11;
    padding: 10px 5px;
    background-color: white;
  }

  .el-drawer__body {
    z-index: 3;
    height: 80%;
    margin-top: -30px;
    overflow: auto;
  }
</style>
